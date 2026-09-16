import os
import re

md_file = '../Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md'
html_file = 'index.html'

with open(md_file, 'r', encoding='utf-8') as f:
    md_content = f.read()

escaped_md = md_content.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

with open(html_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Find `const rawMarkdown = `
start_marker = "const rawMarkdown = `"
start_idx = html_content.find(start_marker)

# Find the end of rawMarkdown
# It is the last ``;\n` before `// Custom renderer`
end_marker_search = html_content.find("// Custom renderer", start_idx)

# Backtrack from end_marker_search to find ``;`
end_idx = html_content.rfind('`;', start_idx, end_marker_search)

if start_idx != -1 and end_idx != -1:
    new_html = html_content[:start_idx] + "const rawMarkdown = `" + escaped_md + html_content[end_idx:]
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("SUCCESS: Updated rawMarkdown in index.html!")
else:
    print("FAILED to find markers!")

