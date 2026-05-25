import re
import os

# 1. Read index.html
with open(r'G:\Github\quan-ly-ngan-sach\index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# 2. Extract body
body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL | re.IGNORECASE)
if not body_match:
    print('Failed to find body tag')
    exit(1)

body_raw = body_match.group(1)

# 3. Extract all inline scripts
scripts = []
for script_match in re.finditer(r'<script(?:[^>]*)>(.*?)</script>', body_raw, re.DOTALL | re.IGNORECASE):
    # Ignore <script src="...">
    if 'src=' not in script_match.group(0):
        scripts.append(script_match.group(1).strip())

# 4. Remove all script tags from body HTML
body_clean = re.sub(r'<script.*?</script>', '', body_raw, flags=re.DOTALL | re.IGNORECASE)

# Escape backticks and ${} for template literal
body_html_escaped = body_clean.replace('`', '\\`').replace('${', '\\${')

# 5. Read the pristine app.js
with open(r'G:\Github\quan-ly-ngan-sach\app.js', 'r', encoding='utf-8') as f:
    app_js_pristine = f.read()

# Remove the bottom event listeners just in case
app_js_pristine = app_js_pristine.replace("window.addEventListener('DOMContentLoaded', initApp);", "")
app_js_pristine = app_js_pristine.replace("initApp();\n", "")

# 6. Combine scripts
inline_scripts_str = "\n\n// --- INLINE SCRIPTS FROM INDEX.HTML ---\n" + "\n\n".join(scripts) + "\n// --------------------------------------\n\n"

# 7. Create safe DOM injection
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
  temp.innerHTML = `{body_html_escaped}`;
  while(temp.firstChild) {{
      document.body.appendChild(temp.firstChild);
  }}
  
  if (typeof initApp === 'function') initApp();
}}
injectZaloDOM();
"""

new_app_js = inline_scripts_str + app_js_pristine + injection

# Write to the mini app directory
dest_path = r'G:\Github\quan-ly-ngan-sach\budget-zalo-miniapp\src\app.js'
with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(new_app_js)

print('Successfully reconstructed app.js with inline scripts and safe DOM injection.')
