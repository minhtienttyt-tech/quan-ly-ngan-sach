import re

with open(r'G:\Github\quan-ly-ngan-sach\budget-zalo-miniapp\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
if body_match:
    body_html = body_match.group(1).replace('`', '\\`')
    
    with open(r'G:\Github\quan-ly-ngan-sach\budget-zalo-miniapp\src\app.js', 'r', encoding='utf-8') as f2:
        app_js = f2.read()
    
    # Prepend the DOM injection before anything else
    injection = f'document.body.innerHTML = `{body_html}`;\n'
    
    # We should put it at the very top of app.js
    new_app_js = injection + app_js
    
    with open(r'G:\Github\quan-ly-ngan-sach\budget-zalo-miniapp\src\app.js', 'w', encoding='utf-8') as f3:
        f3.write(new_app_js)
    print('Successfully injected HTML body into app.js')
else:
    print('Failed to find body tag')
