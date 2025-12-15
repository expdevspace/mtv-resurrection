import requests
from bs4 import BeautifulSoup
import os
import subprocess
import time
from urllib.parse import quote_plus

TORRENTS_DIR = 'mtv_archive_en/torrents'
os.makedirs(TORRENTS_DIR, exist_ok=True)

def scrape_1337x_magnets(query, limit=10):
    search_url = f"https://1337x.to/search/{quote_plus(query)}/1/"
    try:
        print(f"Searching for: {query}")
        # Add more headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        resp = requests.get(search_url, headers=headers, timeout=10)
        print(f"Response status: {resp.status_code}")
        if resp.status_code == 403:
            print(f"Access forbidden for {query} - site may be blocking requests")
            return []
        if resp.status_code != 200:
            print(f"Failed to fetch search results for {query}")
            return []
        soup = BeautifulSoup(resp.text, 'html.parser')
        rows = soup.select('table.table-list tr')[1:limit+1]
        magnets = []
        for row in rows:
            name_link = row.select_one('.name a[href^="/torrent/"]')
            if name_link and ('480p' in name_link.text or 'DVD' in name_link.text):
                href = name_link.get('href', '')
                if href:
                    torrent_url = 'https://1337x.to' + str(href)
                    name = name_link.text.strip()
                    print(f"Found torrent: {name}")
                    # Get torrent details
                    detail_resp = requests.get(torrent_url, headers=headers, timeout=10)
                    if detail_resp.status_code == 403:
                        print(f"Access forbidden for torrent details - site may be blocking requests")
                        continue
                    if detail_resp.status_code != 200:
                        print(f"Failed to fetch torrent details for {name}")
                        continue
                    detail_soup = BeautifulSoup(detail_resp.text, 'html.parser')
                    magnet_a = detail_soup.select_one('a[href^="magnet:"]')
                    if magnet_a:
                        magnet = magnet_a.get('href', '')
                        if magnet:
                            magnets.append((name, str(magnet)))
                            print(f"EN Magnet: {name}")
        return magnets[:5]  # cap per query
    except requests.exceptions.RequestException as e:
        print(f"Network error while scraping: {e}")
        return []
    except Exception as e:
        print(f"Scrape fail: {e}")
        return []

def download_magnet(magnet, path=TORRENTS_DIR):
    try:
        print(f"Attempting to download magnet: {magnet[:50]}...")
        result = subprocess.run(['aria2c', '--dir=' + path, '--max-connection-per-server=16', '--split=16', '--seed-time=0', magnet], 
                              capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print("EN Torrent summoned.")
        else:
            print(f"Aria2c summon failed with error: {result.stderr}")
    except subprocess.TimeoutExpired:
        print("Aria2c timed out.")
    except FileNotFoundError:
        print("Aria2c not found. Please install aria2c.")
    except Exception as e:
        print(f"Unexpected error: {e}")

# English MTV targets: era veins
targets_en = [
    "MTV 80s full episodes 480p",
    "MTV 90s Beavis Butthead 480p",
    "MTV 90s Real World 480p",
    "MTV 2000s Punkd 480p",
    "MTV 2000s Jackass 480p",
    "MTV Cribs full seasons 480p",
    "MTV Jersey Shore 480p",
]

print("Starting English torrent search...")
for target in targets_en:
    print(f"EN Breach: {target}")
    magnets = scrape_1337x_magnets(target)
    for name, magnet in magnets:
        download_magnet(magnet)
    time.sleep(2)

print("English MTV vein: gods summoned.")