import os
import re

# 1. Clean up JS
with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the Reading Meta block
js = re.sub(r'// Reading Meta\s*const words = mdBody\.innerText.*?mdBody\.insertBefore\(metaDiv, mdBody\.firstChild\);', '', js, flags=re.DOTALL)

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

# 2. Clean up CSS
with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove Reading Meta CSS
css = re.sub(r'/\* READING META \*/.*?/\* PROGRESS BAR \*/', '/* PROGRESS BAR */', css, flags=re.DOTALL)

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Reading Meta removed completely!")
