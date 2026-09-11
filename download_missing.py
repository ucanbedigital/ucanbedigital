import urllib.request
import re
import os
import glob

headers = {'User-Agent': 'Mozilla/5.0'}

for html_file in glob.glob('extracted_raw/*.html'):
    with open(html_file, 'r', encoding='utf-8') as f:
        c = f.read()
    
    found = re.findall(r'(/assets/img/[^\s"\'\)>]+)', c)
    for a in set(found):
        clean = a.split('?')[0].replace('\\', '')
        target = 'public' + clean
        if not os.path.exists(target):
            try:
                req = urllib.request.Request('https://ucanbedigital.com' + clean, headers=headers)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    data = resp.read()
                    os.makedirs(os.path.dirname(target), exist_ok=True)
                    with open(target, 'wb') as out_f:
                        out_f.write(data)
                    print('Downloaded asset:', clean)
            except Exception as e:
                print(f'Failed {clean}: {e}')
