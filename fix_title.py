import os
import re

md_file = 'Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md'

with open(md_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace whatever H1 is there with the perfect one
content = re.sub(r'^#\s+.*$', '# Kiến trúc máy tính & Bộ nhớ: Từ CPU Cache đến Heap Allocation', content, flags=re.MULTILINE)

with open(md_file, 'w', encoding='utf-8') as f:
    f.write(content)

html_file = 'docs/index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

escaped_md = content.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
parts = html_content.split('const rawMarkdown = `')
if len(parts) == 2:
    restParts = parts[1].split('`;\n        // Custom renderer', 1)
    if len(restParts) == 2:
        html_content = parts[0] + 'const rawMarkdown = `' + escaped_md + '`;\n        // Custom renderer' + restParts[1]

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html_content)
print("Title perfected.")
