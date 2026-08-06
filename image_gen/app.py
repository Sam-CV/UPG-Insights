"""
UPG Profile Image Generator — local tool.

SECURITY NOTES (H6, H7, M3, M8, M10):
  * debug mode is off unless FLASK_DEBUG=1. The Werkzeug debugger exposes an
    interactive Python console on any traceback — that is code execution.
  * /api/save-image previously fetched an arbitrary attacker-supplied URL (SSRF)
    and built its output path by string-joining unvalidated `country`/`religion`
    (pathlib's `/` does NOT normalise `..`, so that was an arbitrary file write).
    Chaining the two wrote remote bytes to any path — e.g. a Startup folder.
  * CORS was open to all origins with no auth, so ANY page the developer had
    open could reach this on localhost. Now limited to local origins.
  * Exception text is no longer returned to callers.
"""

import json
import logging
import os
import re
from pathlib import Path
from urllib.parse import urlparse

import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)

# Local tool: only same-machine origins. Not a substitute for auth — see README.
CORS(app, origins=[
    "http://localhost:5000", "http://127.0.0.1:5000",
    "http://localhost:5500", "http://127.0.0.1:5500",
])

log = logging.getLogger(__name__)

# Base output directory
OUTPUT_DIR = Path(__file__).parent / "output"
PROFILE_ROOT = OUTPUT_DIR / "upg-resources" / "images" / "upg-profiles"

# --- Input validation ---------------------------------------------------------
# One path segment: letters, digits, space, underscore, hyphen. No dots, no
# separators — so "..", "../x", "C:\..." and absolute paths are all rejected.
SAFE_SEGMENT = re.compile(r"^[A-Za-z0-9 _-]{1,64}$")
ALLOWED_GENDERS = {"male", "female"}

# Hosts the image fetch may contact. Comma-separated in ALLOWED_IMAGE_HOSTS.
# Empty means the endpoint refuses every fetch — fail closed, not open.
ALLOWED_IMAGE_HOSTS = {
    h.strip().lower()
    for h in os.environ.get("ALLOWED_IMAGE_HOSTS", "").split(",")
    if h.strip()
}

MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB
IMAGE_MAGIC = (
    b"\xff\xd8\xff",          # JPEG
    b"\x89PNG\r\n\x1a\n",     # PNG
    b"GIF87a", b"GIF89a",     # GIF
    b"RIFF",                  # WebP (RIFF....WEBP)
)


def _looks_like_image(head: bytes) -> bool:
    """Trust magic bytes, not the declared Content-Type."""
    return any(head.startswith(sig) for sig in IMAGE_MAGIC)


def _fetch_image(image_url: str) -> bytes:
    """Fetch an image with SSRF guards. Raises ValueError on any policy failure."""
    parsed = urlparse(image_url)
    if parsed.scheme != "https":
        raise ValueError("image URL must be https")
    host = (parsed.hostname or "").lower()
    if not ALLOWED_IMAGE_HOSTS:
        raise ValueError("no image hosts are allow-listed (set ALLOWED_IMAGE_HOSTS)")
    if host not in ALLOWED_IMAGE_HOSTS:
        raise ValueError("image host is not allow-listed")

    # allow_redirects=False: a permitted host must not be able to bounce us to
    # 169.254.169.254 or an internal service.
    resp = requests.get(image_url, timeout=30, allow_redirects=False, stream=True)
    resp.raise_for_status()

    chunks, total = [], 0
    for chunk in resp.iter_content(8192):
        total += len(chunk)
        if total > MAX_IMAGE_BYTES:
            raise ValueError("image exceeds size limit")
        chunks.append(chunk)
    content = b"".join(chunks)

    if not _looks_like_image(content[:16]):
        raise ValueError("fetched bytes are not a recognised image")
    return content


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    # send_from_directory rejects traversal outside the directory in modern Flask.
    return send_from_directory('.', path)


@app.route('/api/save-image', methods=['POST'])
def save_image():
    data = request.get_json(silent=True) or {}
    image_url = data.get('imageUrl')
    country = data.get('country')
    religion = data.get('religion')
    gender = data.get('gender')

    if not all([image_url, country, religion, gender]):
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    if not (SAFE_SEGMENT.match(str(country)) and SAFE_SEGMENT.match(str(religion))):
        return jsonify({'success': False, 'error': 'Invalid country or religion'}), 400
    if gender not in ALLOWED_GENDERS:
        return jsonify({'success': False, 'error': 'Invalid gender'}), 400

    # Belt and braces: even with the regex above, resolve and confirm the final
    # path is still inside PROFILE_ROOT before writing anything.
    base = PROFILE_ROOT.resolve()
    folder_path = (base / country / religion).resolve()
    if not folder_path.is_relative_to(base):
        return jsonify({'success': False, 'error': 'Invalid path'}), 400

    try:
        content = _fetch_image(image_url)
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except requests.RequestException:
        log.exception("image fetch failed")
        return jsonify({'success': False, 'error': 'Could not fetch image'}), 502

    try:
        folder_path.mkdir(parents=True, exist_ok=True)
        file_path = folder_path / f"{gender}.jpg"
        with open(file_path, 'wb') as f:
            f.write(content)
        relative_path = file_path.relative_to(OUTPUT_DIR.resolve())
    except OSError:
        log.exception("failed writing image")
        return jsonify({'success': False, 'error': 'Could not save image'}), 500

    return jsonify({'success': True, 'path': str(relative_path), 'size': len(content)})


@app.route('/api/completed-items', methods=['GET'])
def get_completed_items():
    completed_file = Path(__file__).parent / 'completed-items.json'
    try:
        if completed_file.exists():
            with open(completed_file, 'r', encoding='utf-8') as f:
                return jsonify(json.load(f))
    except (OSError, ValueError):
        log.exception("failed reading completed-items.json")
    return jsonify({'completed': []})


@app.route('/api/completed-items', methods=['POST'])
def save_completed_items():
    data = request.get_json(silent=True)
    # Only accept the shape this endpoint is documented to store, and cap it —
    # this route is unauthenticated, so it must not be a general file writer.
    if not isinstance(data, dict) or not isinstance(data.get('completed'), list):
        return jsonify({'success': False, 'error': 'Expected {"completed": [...]}'}), 400
    if len(data['completed']) > 10000:
        return jsonify({'success': False, 'error': 'Too many items'}), 400

    completed_file = Path(__file__).parent / 'completed-items.json'
    try:
        with open(completed_file, 'w', encoding='utf-8') as f:
            json.dump({'completed': data['completed']}, f, indent=2)
    except OSError:
        log.exception("failed writing completed-items.json")
        return jsonify({'success': False, 'error': 'Could not save'}), 500

    return jsonify({'success': True})


if __name__ == '__main__':
    debug = os.environ.get("FLASK_DEBUG") == "1"
    port = int(os.environ.get("FLASK_PORT", "5000"))
    print("=" * 60)
    print("UPG Profile Image Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR.absolute()}")
    print(f"Server running at: http://localhost:{port}")
    if not ALLOWED_IMAGE_HOSTS:
        print("WARNING: ALLOWED_IMAGE_HOSTS is empty — /api/save-image will refuse all fetches.")
    print("=" * 60)
    # Bind loopback only. Never combine debug=True with host='0.0.0.0'.
    app.run(debug=debug, host="127.0.0.1", port=port)
