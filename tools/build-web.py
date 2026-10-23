"""Build the single-file web version (Claude artifact) from index.html.

Takes the <!--ART-HEAD--> and <!--ART-BODY--> blocks and inlines every
<script> in order, so the page needs no other files. Run from the repo root:
    python3 tools/build-web.py
"""
import os, re, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, 'index.html'), encoding='utf-8').read()

head = re.search(r'<!--ART-HEAD-->(.*?)<!--/ART-HEAD-->', src, re.S).group(1).strip()
body = re.search(r'<!--ART-BODY-->(.*?)<!--/ART-BODY-->', src, re.S).group(1).strip()
tail = src.split('<!--/ART-BODY-->', 1)[1]

scripts = ['<script>window.SET3_WEB=true</script>']
for m in re.finditer(r'<script(?:\s+src="([^"]+)")?\s*>(.*?)</script>', tail, re.S):
    if m.group(1):
        code = open(os.path.join(root, m.group(1)), encoding='utf-8').read()
    else:
        code = m.group(2)
    scripts.append('<script>\n' + code.replace('</script', '<\\/script') + '\n</script>')

out = head + '\n' + body + '\n' + '\n'.join(scripts) + '\n'
dest = sys.argv[1] if len(sys.argv) > 1 else os.path.join(root, 'dist', 'set3-web.html')
os.makedirs(os.path.dirname(dest), exist_ok=True)
open(dest, 'w', encoding='utf-8').write(out)
print(dest, len(out), 'bytes')
