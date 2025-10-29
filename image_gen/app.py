from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Base output directory
OUTPUT_DIR = Path(__file__).parent / "output"

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/save-image', methods=['POST'])
def save_image():
    try:
        data = request.json
        image_url = data.get('imageUrl')
        country = data.get('country')
        religion = data.get('religion')
        gender = data.get('gender')

        if not all([image_url, country, religion, gender]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        # Create folder structure
        folder_path = OUTPUT_DIR / "upg-resources" / "images" / "upg-profiles" / country / religion
        folder_path.mkdir(parents=True, exist_ok=True)

        # Download image
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()

        # Save image
        file_path = folder_path / f"{gender}.jpg"
        with open(file_path, 'wb') as f:
            f.write(response.content)

        relative_path = file_path.relative_to(OUTPUT_DIR)

        return jsonify({
            'success': True,
            'path': str(relative_path),
            'size': len(response.content)
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/completed-items', methods=['GET'])
def get_completed_items():
    try:
        completed_file = Path(__file__).parent / 'completed-items.json'
        if completed_file.exists():
            import json
            with open(completed_file, 'r') as f:
                return jsonify(json.load(f))
        return jsonify({'completed': []})
    except Exception as e:
        return jsonify({'completed': []})

@app.route('/api/completed-items', methods=['POST'])
def save_completed_items():
    try:
        data = request.json
        completed_file = Path(__file__).parent / 'completed-items.json'
        import json
        with open(completed_file, 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("UPG Profile Image Generator")
    print("=" * 60)
    print(f"Output directory: {OUTPUT_DIR.absolute()}")
    print(f"Server running at: http://localhost:5000")
    print("=" * 60)
    app.run(debug=True, port=5000)
