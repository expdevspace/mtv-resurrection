import requests
from bs4 import BeautifulSoup
import os
import subprocess
import time
import random
from urllib.parse import quote_plus
import json

TORRENTS_DIR = 'mtv_archive/torrents'
MAGNETS_JSON_EN = 'magnets/en.json'
MAGNETS_JSON_FR = 'magnets/fr.json'
os.makedirs(TORRENTS_DIR, exist_ok=True)
os.makedirs('magnets', exist_ok=True)

# Load proxies from file if it exists
PROXIES = []
if os.path.exists('proxies.txt'):
    with open('proxies.txt', 'r') as f:
        PROXIES = [line.strip() for line in f if line.strip()]

UA_LIST = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
]

HEADERS = lambda: {
    'User-Agent': random.choice(UA_LIST), 
    'Referer': 'https://www.google.com/', 
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

def get_random_proxy():
    """Get a random proxy from the list, or return None if no proxies"""
    if PROXIES:
        return {'http': random.choice(PROXIES), 'https': random.choice(PROXIES)}
    return None

def scrape_tpb(query, limit=5):
    magnets = []
    try:
        url = f"https://thepiratebay.org/search.php?q={quote_plus(query)}"
        print(f"Scraping TPB: {url}")
        proxy = get_random_proxy()
        resp = requests.get(url, headers=HEADERS(), timeout=15, proxies=proxy)
        print(f"TPB Response status: {resp.status_code}")
        if resp.status_code == 403:
            print("Blocked by TPB - trying with proxy")
            raise Exception("Blocked")
        soup = BeautifulSoup(resp.text, 'html.parser')
        for row in soup.select('table#searchResult tr')[:limit]:
            mag_a = row.select_one('a[href^="magnet:"]')
            name = row.select_one('.detLink')
            if mag_a and name and ('480p' in name.text or 'SD' in name.text or 'DVD' in name.text):
                magnets.append((name.text.strip(), mag_a['href']))
                print(f"Found TPB magnet: {name.text.strip()}")
    except Exception as e:
        print(f"TPB scrape error: {e}")
        pass
    return magnets

def scrape_tgx(query, limit=5):
    magnets = []
    try:
        url = f"https://torrentgalaxy.to/torrents.php?search={quote_plus(query)}"
        print(f"Scraping TGX: {url}")
        proxy = get_random_proxy()
        resp = requests.get(url, headers=HEADERS(), timeout=15, proxies=proxy)
        print(f"TGX Response status: {resp.status_code}")
        if resp.status_code == 403:
            print("Blocked by TGX - trying with proxy")
            raise Exception("Blocked")
        soup = BeautifulSoup(resp.text, 'html.parser')
        for div in soup.select('.tgxtablerow')[:limit]:
            mag_a = div.select_one('a[href^="magnet:"]')
            name = div.select_one('.click a')
            if mag_a and name and ('480p' in name.text or 'DVD' in name.text or 'SD' in name.text):
                magnets.append((name.text.strip(), mag_a['href']))
                print(f"Found TGX magnet: {name.text.strip()}")
    except Exception as e:
        print(f"TGX scrape error: {e}")
        pass
    return magnets

def summon_magnets(targets, lang='en'):
    all_mags = []
    for target in targets:
        print(f"Breaching {lang.upper()}: {target}")
        tpb_mags = scrape_tpb(target)
        tgx_mags = scrape_tgx(target)
        all_mags.extend(tpb_mags)
        all_mags.extend(tgx_mags)
        time.sleep(random.uniform(5, 10))  # Veil breath
    
    # Save to JSON
    json_path = MAGNETS_JSON_EN if lang=='en' else MAGNETS_JSON_FR
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(all_mags, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(all_mags)} magnets to {json_path}")
    
    # Summon top 10 magnets
    for i, (name, mag) in enumerate(all_mags[:10]):
        print(f"Summoning magnet {i+1}/{min(10, len(all_mags))}: {name[:50]}...")
        try:
            result = subprocess.run([
                'aria2c', 
                '--dir=' + TORRENTS_DIR, 
                '--seed-time=0', 
                '--max-connection-per-server=16',
                '--split=16',
                mag
            ], capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                print("Torrent summoned successfully.")
            else:
                print(f"Aria2c error: {result.stderr}")
        except subprocess.TimeoutExpired:
            print("Aria2c timed out.")
        except Exception as e:
            print(f"Error summoning torrent: {e}")
    
    print(f"{lang.upper()} vein hoarded + JSON etched.")

# English gods
print("Summoning English magnets...")
summon_magnets([
    "MTV 90s full episodes 480p",
    "Beavis and Butthead complete 480p",
    "MTV Jackass seasons 480p",
    "MTV Cribs 480p",
    "MTV Real World 480p",
    "80s MTV VHS archive.org",
], 'en')

# French ghosts (Ygg proxy if direct block)
print("Summoning French magnets...")
summon_magnets([
    "MusiquePlus emissions VF 480p",
    "MusiquePlus Top 10 2000s",
    "Anne-Marie Losique MusiquePlus",
], 'fr')

print("All magnets processed!")