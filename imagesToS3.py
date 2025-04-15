import os
import re
import requests
import boto3
from bs4 import BeautifulSoup
from tqdm import tqdm
import concurrent.futures

# AWS S3 Configuration
S3_BUCKET = "upg-resources"
S3_PREFIX = "images/upg-profiles/Nepal/"

# Create folders for temporary local storage
male_folder = "male_profile_photos"
female_folder = "female_profile_photos"

os.makedirs(male_folder, exist_ok=True)
os.makedirs(female_folder, exist_ok=True)

# Initialize S3 client using AWS configuration file
print("Using AWS credentials from AWS configuration file...")
s3_client = boto3.client('s3')
print("Successfully connected to AWS")

def clean_filename(name):
    """Clean a string to make it suitable as a filename."""
    # Remove invalid filename characters and trim
    cleaned = re.sub(r'[\\/*?:"<>|]', "", name).strip()
    # Replace spaces with underscores
    cleaned = cleaned.replace(' ', '_')
    # Remove parentheses
    cleaned = cleaned.replace('(', '').replace(')', '')
    return cleaned

def download_image(url, folder, title, type_name):
    """Download an image with a progress bar and upload to S3."""
    # Modify URL to use w4000-h600 for higher quality images
    modified_url = re.sub(r'w\d+-h\d+', 'w4000-h600', url)
    
    # Create a clean filename from the title
    clean_title = clean_filename(title)
    local_file_path = os.path.join(folder, f"{clean_title}.jpg")
    s3_key = f"{S3_PREFIX}{type_name}/{clean_title}.jpg"
    
    try:
        # Download the image
        response = requests.get(modified_url, stream=True)
        if response.status_code == 200:
            total_size = int(response.headers.get('content-length', 0))
            
            # Save locally first
            with open(local_file_path, 'wb') as file, tqdm(
                desc=f"Downloading {os.path.basename(local_file_path)}",
                total=total_size,
                unit='B',
                unit_scale=True,
                unit_divisor=1024,
            ) as bar:
                for data in response.iter_content(chunk_size=1024):
                    size = file.write(data)
                    bar.update(size)
            
            # Upload to S3 without ACL parameter
            print(f"Uploading {os.path.basename(local_file_path)} to S3...")
            try:
                s3_client.upload_file(
                    local_file_path, 
                    S3_BUCKET, 
                    s3_key,
                    ExtraArgs={
                        'ContentType': 'image/jpeg',
                        # ACL parameter removed as it's not supported
                    }
                )
                
                # Get the S3 URL
                s3_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{s3_key}"
                print(f"Uploaded to: {s3_url}")
                
                return True, s3_url
            except Exception as e:
                print(f"Error uploading to S3: {str(e)}")
                return False, None
        else:
            print(f"Failed to download {local_file_path}: Status code {response.status_code}")
            return False, None
    except Exception as e:
        print(f"Error processing {local_file_path}: {str(e)}")
        return False, None

# Read the HTML file
with open('data.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

# Parse the HTML
soup = BeautifulSoup(html_content, 'html.parser')

# Find all rows
rows = soup.find_all('tr')

# Extract ALL titles from row 1, including empty ones
title_row = rows[1]
titles = []
for i, td in enumerate(title_row.find_all('td')):
    title_text = td.get_text().strip()
    if title_text:  # Add actual title if present
        titles.append(title_text)
    else:
        titles.append(f"Column_{i}")  # Generate placeholder for empty titles

# Ensure we have enough titles, especially for columns AL and AM
# AL is column 38 (0-indexed: 37), AM is column 39 (0-indexed: 38)
while len(titles) < 40:  # Ensure we have enough titles
    titles.append(f"Column_{len(titles)}")

# Prepare download tasks
download_tasks = []

# Process male row (row 3)
male_row = rows[3]
male_tds = male_row.find_all('td')

# Process female row (row 4)
female_row = rows[4]
female_tds = female_row.find_all('td')

# Debug info
print(f"Found {len(male_tds)} columns in male row")
print(f"Found {len(female_tds)} columns in female row")
print(f"Number of titles prepared: {len(titles)}")

# Process each column (td) for male row
for i, td in enumerate(male_tds):
    # Find all images recursively (including nested ones)
    imgs = td.find_all('img', recursive=True)
    
    # Debug info for columns AL and AM (if we reach that far)
    if i == 37 or i == 38:  # AL is index 37, AM is index 38
        print(f"Column {'AL' if i == 37 else 'AM'} has {len(imgs)} images in male row")
    
    for img in imgs:
        src = img.get('src')
        if src and 'googleusercontent.com' in src:
            title = titles[i] if i < len(titles) else f"Column_{i}"
            download_tasks.append((src, male_folder, title, 'male'))

# Process each column (td) for female row
for i, td in enumerate(female_tds):
    # Find all images recursively (including nested ones)
    imgs = td.find_all('img', recursive=True)
    
    # Debug info for columns AL and AM (if we reach that far)
    if i == 37 or i == 38:  # AL is index 37, AM is index 38
        print(f"Column {'AL' if i == 37 else 'AM'} has {len(imgs)} images in female row")
    
    for img in imgs:
        src = img.get('src')
        if src and 'googleusercontent.com' in src:
            title = titles[i] if i < len(titles) else f"Column_{i}"
            download_tasks.append((src, female_folder, title, 'female'))

print(f"Found {len(download_tasks)} images to download and upload to S3")

# Download and upload images
successful_uploads = []
failed_operations = []

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(download_image, *task): task for task in download_tasks}
    
    for future in concurrent.futures.as_completed(futures):
        success, result = future.result()
        if success:
            successful_uploads.append(result)
        else:
            failed_operations.append(futures[future])

print(f"\nSuccessfully processed {len(successful_uploads)} of {len(download_tasks)} images")

if failed_operations:
    print("\nFailed operations:")
    for task in failed_operations:
        print(f"  - {task[2]} ({task[3]})")

# Cleanup local files (optional)
print("\nCleaning up local files...")
for folder in [male_folder, female_folder]:
    for file in os.listdir(folder):
        os.remove(os.path.join(folder, file))
    os.rmdir(folder)
print("Cleanup complete!")

# Generate a summary with all S3 URLs
if successful_uploads:
    print("\nS3 URLs for uploaded images:")
    for url in successful_uploads:
        print(url)