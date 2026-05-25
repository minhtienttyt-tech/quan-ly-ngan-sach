import re

with open(r'G:\Github\quan-ly-ngan-sach\budget-zalo-miniapp\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
if not body_match:
    print('Failed to find body tag')
    exit(1)

body_html = body_match.group(1).replace('`', '\\`').replace('${', '\\${')

with open(r'G:\Github\quan-ly-ngan-sach\budget-zalo-miniapp\src\app.js', 'r', encoding='utf-8') as f2:
    app_js = f2.read()

# Remove the old naive injection
if app_js.startswith('document.body.innerHTML = `'):
    end_idx = app_js.find('`;', app_js.find('`') + 1)
    if end_idx != -1:
        app_js = app_js[end_idx + 2:].strip()

injection = f"""
// Safe DOM Injection for Zalo Mini App
function injectZaloDOM() {{
  if (!document.body) {{
    setTimeout(injectZaloDOM, 20);
    return;
  }}
  if (document.getElementById('main-app')) {{
     if (typeof initApp === 'function') initApp();
     return;
  }}
  
  const temp = document.createElement('div');
  temp.innerHTML = `{body_html}`;
  while(temp.firstChild) {{
      document.body.appendChild(temp.firstChild);
  }}
  
  if (typeof initApp === 'function') initApp();
}}
injectZaloDOM();

"""

new_app_js = injection + app_js

with open(r'G:\Github\quan-ly-ngan-sach\budget-zalo-miniapp\src\app.js', 'w', encoding='utf-8') as f3:
    f3.write(new_app_js)

print('Successfully injected safe DOM logic into app.js')
