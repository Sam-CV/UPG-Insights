import requests
from bs4 import BeautifulSoup
import csv
import time
from urllib.parse import urljoin
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# List of language codes
language_codes = [
    'jpn', 'mya', 'tha', 'khm', 'shn', 'lao', 'vie', 'mon', 'rki', 'sin', 
    'awa', 'ban', 'ben', 'bho', 'dhi', 'guj', 'gvr', 'hin', 'hyo', 'lmn', 
    'lif', 'mgp', 'mai', 'mal', 'mar', 'nep', 'new', 'ori', 'pan', 'rai', 
    'rjs', 'sat', 'snd', 'tdg', 'tam', 'tel', 'thr', 'thu', 'ace', 'aiq', 
    'ara', 'arq', 'shu', 'afb', 'bhm', 'acx', 'apc', 'acm', 'ary', 'acx', 
    'afb', 'acm', 'xaa', 'shu', 'aeb', 'asm', 'azj', 'azb', 'bam', 'bjn', 
    'bal', 'brh', 'bug', 'prs', 'ful', 'hau', 'glk', 'haz', 'hno', 'ind', 
    'kab', 'knc', 'kas', 'kaz', 'kur', 'lki', 'lrc', 'mad', 'mak', 'msa', 
    'min', 'mnk', 'mzn', 'mui', 'orm', 'pbt', 'pbu', 'fas', 'fuf', 'roh', 
    'skr', 'sas', 'scl', 'som', 'sun', 'sus', 'syl', 'tgk', 'tzm', 'tur', 
    'tuk', 'urd', 'uig', 'uzb', 'wol', 'yao', 'dje'
]

def scrape_language_resources(language_code, session):
    """
    Scrape resources for a single language code from Joshua Project
    
    Args:
        language_code (str): Three-letter language code
        session (requests.Session): Requests session object
    
    Returns:
        list: List of dictionaries containing resource data
    """
    url = f"https://joshuaproject.net/languages/{language_code}"
    resources = []
    
    try:
        logging.info(f"Scraping {language_code}: {url}")
        
        # Make request with headers to appear more like a regular browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        
        response = session.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the resources table (it has class 'table-resources')
        media_table = soup.find('table', class_='table-resources')
        if not media_table:
            logging.warning(f"Resources table not found for {language_code}")
            return resources
        
        # Find tbody within the table
        tbody = media_table.find('tbody')
        if not tbody:
            logging.warning(f"tbody not found in MediaTable-2 for {language_code}")
            return resources
        
        # Extract rows from tbody
        rows = tbody.find_all('tr')
        if not rows:
            logging.warning(f"No rows found in tbody for {language_code}")
            return resources
        
        # Process each row
        for row in rows:
            cells = row.find_all(['td', 'th'])
            if len(cells) < 2:  # Skip rows with insufficient data
                continue
            
            # Initialize resource data
            resource_data = {
                'language': language_code,
                'format': '',
                'resource_link': '',
                'source_link': ''
            }
            
            # Extract format from first cell (headers="MediaTable-2-mediaTableCol-0")
            format_cell = cells[0] if len(cells) > 0 else None
            if format_cell:
                resource_data['format'] = format_cell.get_text(strip=True)
            
            # Extract resource link from second cell (headers="MediaTable-2-mediaTableCol-1") 
            resource_cell = cells[1] if len(cells) > 1 else None
            if resource_cell:
                resource_link = resource_cell.find('a', href=True)
                if resource_link:
                    href = resource_link.get('href')
                    if href:
                        resource_data['resource_link'] = urljoin(url, href)
            
            # Extract source link from third cell (headers="MediaTable-2-mediaTableCol-2") if it exists
            source_cell = cells[2] if len(cells) > 2 else None
            if source_cell:
                source_link = source_cell.find('a', href=True)
                if source_link:
                    href = source_link.get('href')
                    if href:
                        resource_data['source_link'] = urljoin(url, href)
            
            # Add resource if we have meaningful data
            if resource_data['format'] or resource_data['resource_link']:
                resources.append(resource_data)
        
        logging.info(f"Found {len(resources)} resources for {language_code}")
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Request failed for {language_code}: {e}")
    except Exception as e:
        logging.error(f"Error processing {language_code}: {e}")
    
    return resources

def main():
    """
    Main function to scrape all languages and save to CSV
    """
    all_resources = []
    
    # Create a session for connection pooling
    session = requests.Session()
    
    try:
        # Process each language code
        for i, language_code in enumerate(language_codes):
            resources = scrape_language_resources(language_code, session)
            all_resources.extend(resources)
            
            # Add delay between requests to be respectful to the server
            if i < len(language_codes) - 1:  # Don't sleep after the last request
                time.sleep(2)  # 2 seconds between requests
        
        # Write results to CSV
        if all_resources:
            csv_filename = 'joshua_project_resources.csv'
            with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
                fieldnames = ['language', 'format', 'resource_link', 'source_link']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                # Write header
                writer.writeheader()
                
                # Write data
                for resource in all_resources:
                    writer.writerow(resource)
            
            logging.info(f"Successfully saved {len(all_resources)} resources to {csv_filename}")
        else:
            logging.warning("No resources found to save")
    
    except KeyboardInterrupt:
        logging.info("Script interrupted by user")
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    main()