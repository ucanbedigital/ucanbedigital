import json
import re
import urllib.parse

with open("data/db.json", "r", encoding="utf-8") as f:
    db = json.load(f)

def fix_images(html):
    if not html:
        return ""
    
    # 1. Replace Next.js image proxy /_next/image?url=...
    def replace_next_img(match):
        encoded_url = match.group(1)
        decoded_url = urllib.parse.unquote(encoded_url)
        clean_url = decoded_url.split("&")[0]
        return clean_url

    html = re.sub(r"/_next/image\?url=([^\s\"\x27]+)", replace_next_img, html)
    # also remove any remaining &w=... from src
    html = re.sub(r"srcSet=[\"\x27][^\"]*[\"\x27]", "", html)
    
    return html

# Fix all pages in db.pages
for k, v in db["pages"].items():
    if "html" in v:
        v["html"] = fix_images(v["html"])

# Fix all works
for w in db["works"]:
    if "tr" in w and "html" in w["tr"]:
        w["tr"]["html"] = fix_images(w["tr"]["html"])
    if "en" in w and "html" in w["en"]:
        w["en"]["html"] = fix_images(w["en"]["html"])

# Fix all services
for s in db["services"]:
    if "tr" in s and "html" in s["tr"]:
        s["tr"]["html"] = fix_images(s["tr"]["html"])
    if "en" in s and "html" in s["en"]:
        s["en"]["html"] = fix_images(s["en"]["html"])

# Fix all blogs
for b in db["blogs"]:
    if "tr" in b and "html" in b["tr"]:
        b["tr"]["html"] = fix_images(b["tr"]["html"])
    if "en" in b and "html" in b["en"]:
        b["en"]["html"] = fix_images(b["en"]["html"])

# Client logos for marquee_text2
client_logos = [
    {"name": "Banvit", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/banvit1.jpg"},
    {"name": "OYAK Yatırım", "img": "https://cdn.ucanbedigital.com/storage/works/August2022/thumb-oyakyatirim.jpg"},
    {"name": "Ziraat Katılım", "img": "https://cdn.ucanbedigital.com/storage/works/May2020/ziraat.jpg"},
    {"name": "Netaş", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/netas.jpg"},
    {"name": "Vestel", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/vestel1.jpg"},
    {"name": "Toshiba", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/toshiba1.jpg"},
    {"name": "Türksat", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/turksat1.jpg"},
    {"name": "Kale Kilit", "img": "https://cdn.ucanbedigital.com/storage/works/December2020/kale-kilit.jpg"},
    {"name": "Çelebi", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/celebi.jpg"},
    {"name": "Nestle", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/nestle1.jpg"},
    {"name": "Subor", "img": "https://cdn.ucanbedigital.com/storage/works/November2023/subor-thumbnail.jpg"},
    {"name": "Yapı Merkezi", "img": "https://cdn.ucanbedigital.com/storage/works/August2022/Web Görseller-14.jpg"},
    {"name": "Dinçer Lojistik", "img": "https://cdn.ucanbedigital.com/storage/works/April2023/dincer-lojistik-thumbnail.jpg"},
    {"name": "Reina Boats", "img": "https://cdn.ucanbedigital.com/storage/works/August2022/thumb-reina.jpg"},
    {"name": "Kadir Has", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/kadir-has.jpg"},
    {"name": "Birleşik Ödeme", "img": "https://cdn.ucanbedigital.com/storage/works/March2022/thumbnail1.jpg"},
    {"name": "Namet", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/namet1.jpg"},
    {"name": "Carls Jr", "img": "https://cdn.ucanbedigital.com/storage/works/April2020/carlsjr1.jpg"},
    {"name": "Kuveyt Türk", "img": "https://cdn.ucanbedigital.com/storage/works/December2020/kuveytturk1.jpg"}
]

items = []
for cl in client_logos * 2:
    items.append(f'''<div class="marquee-logo-item" style="display:inline-flex; align-items:center; justify-content:center; padding:15px 30px; margin:0 15px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; height:90px; min-width:180px;"><img src="{cl['img']}" alt="{cl['name']}" style="max-height:55px; max-width:140px; object-fit:contain; filter:grayscale(100%) brightness(1.2); opacity:0.8; transition:all 0.3s ease;" onmouseover="this.style.filter='none'; this.style.opacity='1';" onmouseout="this.style.filter='grayscale(100%) brightness(1.2)'; this.style.opacity='0.8';" /></div>''')

items_str = "".join(items)
marquee_html = f'''<div class="marquee-wrapper" style="overflow:hidden; white-space:nowrap; width:100%; position:relative; padding:20px 0;"><div class="marquee-content" style="display:inline-block; animation:marqueeScroll 35s linear infinite;">{items_str}</div></div><style>@keyframes marqueeScroll {{ 0% {{ transform: translateX(0); }} 100% {{ transform: translateX(-50%); }} }} .marquee-wrapper:hover .marquee-content {{ animation-play-state: paused; }}</style>'''

if "home_tr" in db["pages"]:
    db["pages"]["home_tr"]["html"] = db["pages"]["home_tr"]["html"].replace('<div class="marquee_text2"></div>', f'<div class="marquee_text2">{marquee_html}</div>')

if "home_en" in db["pages"]:
    db["pages"]["home_en"]["html"] = db["pages"]["home_en"]["html"].replace('<div class="marquee_text2"></div>', f'<div class="marquee_text2">{marquee_html}</div>')

with open("data/db.json", "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("SUCCESS: cleaned all image URLs and added marquee logos!")
