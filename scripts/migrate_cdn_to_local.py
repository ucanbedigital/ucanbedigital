import os
import re
import json
import urllib.request
import urllib.parse
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'data', 'db.json')
PUBLIC_DIR = os.path.join(BASE_DIR, 'public')

def extract_cdn_urls(data):
    urls = set()
    def _recurse(obj):
        if isinstance(obj, str):
            if 'cdn.ucanbedigital.com' in obj:
                found = re.findall(r'https?://cdn\.ucanbedigital\.com[^\s\"\'\<\>\)]+', obj)
                for u in found:
                    urls.add(u)
        elif isinstance(obj, list):
            for item in obj:
                _recurse(item)
        elif isinstance(obj, dict):
            for v in obj.values():
                _recurse(v)
    _recurse(data)
    return sorted(list(urls))

def to_safe_rel_path(url):
    path = url.replace('https://cdn.ucanbedigital.com', '')
    unq = urllib.parse.unquote(path)
    parts = unq.strip('/').split('/')
    safe_parts = parts[:-1]
    filename = parts[-1]
    
    # Turkish char translation
    tr_map = str.maketrans('çÇğĞıİöÖşŞüÜ', 'cCgGiIoOsSuU')
    fn = filename.translate(tr_map)
    # decompose any combining accents
    fn = unicodedata.normalize('NFKD', fn).encode('ASCII', 'ignore').decode('ASCII')
    # replace non-alphanumeric except dot, dash, underscore
    fn = re.sub(r'[^a-zA-Z0-9\._\-]', '_', fn)
    # collapse consecutive underscores
    fn = re.sub(r'_+', '_', fn)
    
    safe_parts.append(fn)
    return '/' + '/'.join(safe_parts)

def download_file(url, target_path):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
        return True, url, "Already exists"
    
    # Build properly encoded URL
    parts = urllib.parse.urlsplit(url)
    safe_path = urllib.parse.quote(urllib.parse.unquote(parts.path))
    safe_url = urllib.parse.urlunsplit((parts.scheme, parts.netloc, safe_path, parts.query, parts.fragment))
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
    req = urllib.request.Request(safe_url, headers=headers)
    
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status == 200:
                    content = resp.read()
                    if len(content) > 0:
                        with open(target_path, 'wb') as f:
                            f.write(content)
                        return True, url, f"Downloaded {len(content)} bytes"
        except Exception as e:
            if attempt == 2:
                return False, url, str(e)
    return False, url, "Failed after 3 attempts"

def main():
    print("Loading data/db.json...")
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        db = json.load(f)
    
    cdn_urls = extract_cdn_urls(db)
    print(f"Found {len(cdn_urls)} unique CDN URLs.")
    
    url_map = {}
    for u in cdn_urls:
        safe_rel = to_safe_rel_path(u)
        url_map[u] = safe_rel
    
    print(f"Mapped {len(url_map)} URLs to safe relative paths.")
    
    # Download concurrently
    tasks = []
    print("Starting downloads...")
    success_count = 0
    fail_count = 0
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {}
        for orig_url, safe_rel in url_map.items():
            target_file = os.path.join(PUBLIC_DIR, safe_rel.lstrip('/'))
            futures[executor.submit(download_file, orig_url, target_file)] = (orig_url, safe_rel)
            
        for future in as_completed(futures):
            orig_url, safe_rel = futures[future]
            ok, _, msg = future.result()
            if ok:
                success_count += 1
            else:
                fail_count += 1
                print(f"[FAIL] {orig_url} -> {msg}")
                
    print(f"Download completed. Success: {success_count}, Failed: {fail_count}")
    if fail_count > 0:
        print("Aborting database update due to download failures.")
        return
        
    # Check total size of downloaded files
    total_bytes = 0
    for safe_rel in url_map.values():
        target_file = os.path.join(PUBLIC_DIR, safe_rel.lstrip('/'))
        if os.path.exists(target_file):
            total_bytes += os.path.getsize(target_file)
            
    print(f"Total size of all migrated assets: {total_bytes / (1024*1024):.2f} MB")
    
    # Replace in db.json
    print("Updating data/db.json...")
    db_text = json.dumps(db, ensure_ascii=False, indent=2)
    # Sort by URL length descending to prevent substring collisions
    sorted_pairs = sorted(url_map.items(), key=lambda x: len(x[0]), reverse=True)
    for orig_url, safe_rel in sorted_pairs:
        db_text = db_text.replace(orig_url, safe_rel)
        
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        f.write(db_text)
        
    # Verify no cdn.ucanbedigital.com remains
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        reloaded_text = f.read()
    
    remaining = re.findall(r'https?://cdn\.ucanbedigital\.com[^\s\"\'\<\>\)]+', reloaded_text)
    print(f"Remaining CDN URLs in db.json: {len(remaining)}")
    if len(remaining) == 0:
        print("MIGRATION COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    main()
