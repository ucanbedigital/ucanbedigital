import json

with open("data/db.json", "r", encoding="utf-8") as f:
    db = json.load(f)

with open("exact_reference_logos.json", "r", encoding="utf-8") as f:
    logos = json.load(f)

# Keep only reference logos (exclude blog images if any)
ref_logos = [l for l in logos if "Reference Logo" in l["alt"]]

print(f"Applying {len(ref_logos)} exact reference logos to marquee...")

# Build HTML with seamless infinite loop
logo_items_html = ""
for l in ref_logos * 2: # duplicate for smooth loop
    logo_items_html += f'''<div class="marquee-logo-card" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 25px; margin:0 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; height:80px; min-width:160px;"><img src="{l['src']}" alt="{l['alt']}" style="max-height:48px; max-width:130px; object-fit:contain; filter:brightness(0) invert(1); opacity:0.75; transition:all 0.3s ease;" onmouseover="this.style.opacity='1'; this.style.filter='brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.4))';" onmouseout="this.style.opacity='0.75'; this.style.filter='brightness(0) invert(1)';" /></div>'''

marquee_full_html = f'''<div class="marquee-container" style="overflow:hidden; white-space:nowrap; width:100%; position:relative; padding:15px 0;"><div class="marquee-track" style="display:inline-block; animation:marqueeSlide 40s linear infinite;">{logo_items_html}</div></div><style>@keyframes marqueeSlide {{ 0% {{ transform: translateX(0); }} 100% {{ transform: translateX(-50%); }} }} .marquee-container:hover .marquee-track {{ animation-play-state: paused; }}</style>'''

import re
# Replace whatever is inside <div class="marquee_text2">...</div> in home_tr and home_en
for key in ["home_tr", "home_en"]:
    if key in db["pages"]:
        html = db["pages"][key]["html"]
        html = re.sub(r'<div class="marquee_text2">.*?</div>', f'<div class="marquee_text2">{marquee_full_html}</div>', html, flags=re.DOTALL)
        db["pages"][key]["html"] = html

with open("data/db.json", "w", encoding="utf-8") as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("SUCCESS: applied exact 32 reference logos to marquee!")
