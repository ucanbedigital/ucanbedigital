import re

def html_to_jsx(html_str):
    # convert class to className
    jsx = re.sub(r'\bclass=', 'className=', html_str)
    # convert for to htmlFor
    jsx = re.sub(r'\bfor=', 'htmlFor=', jsx)
    # convert inline styles like style="cursor:pointer" to style={{ cursor: 'pointer' }}
    def style_repl(match):
        style_val = match.group(1)
        pairs = [p.strip() for p in style_val.split(';') if p.strip()]
        react_styles = []
        for pair in pairs:
            if ':' in pair:
                k, v = pair.split(':', 1)
                k = k.strip()
                v = v.strip()
                # camelCase key
                k_camel = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
                react_styles.append(f'"{k_camel}": "{v}"')
        return 'style={{ ' + ', '.join(react_styles) + ' }}'
    jsx = re.sub(r'style="([^"]*)"', style_repl, jsx)
    # self-close unclosed tags
    tags = ['img', 'input', 'br', 'hr', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon']
    for t in tags:
        jsx = re.sub(rf'<({t}[^>/]*?)(?<!/)>', r'<\1 />', jsx)
    # convert SVG attributes to camelCase
    svg_attrs = {
        'fill-rule': 'fillRule',
        'clip-rule': 'clipRule',
        'stroke-width': 'strokeWidth',
        'stroke-linecap': 'strokeLinecap',
        'stroke-linejoin': 'strokeLinejoin',
        'stroke-miterlimit': 'strokeMiterlimit',
        'viewbox': 'viewBox',
        'fill-opacity': 'fillOpacity',
        'stroke-opacity': 'strokeOpacity'
    }
    for old_a, new_a in svg_attrs.items():
        jsx = re.sub(rf'\b{old_a}=', f'{new_a}=', jsx, flags=re.IGNORECASE)
    # replace comments <!-- ... --> with {/* ... */}
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx)
    return jsx

# Process home page
with open('extracted_raw/tr_home_body.html', 'r', encoding='utf-8') as f:
    tr_home = f.read()

jsx_tr = html_to_jsx(tr_home)
with open('extracted_raw/tr_home_body.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx_tr)

print('Transformed tr_home_body to JSX!')
