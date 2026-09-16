import os
import re
import json

def to_title_case(s):
    # Capitalize first letter of string
    if not s: return s
    # For Vietnamese, we usually only capitalize the first word and proper nouns.
    # We will just capitalize the first character and leave the rest alone if we don't know,
    # OR we can use string.title() but fix some things.
    # Since it's a category title like "HARDWARE & MEMORY SYSTEMS", we want "Hardware & Memory Systems"
    if s.isupper():
        return s.title().replace('C++', 'C++')
    return s

def fix_h1_case(m):
    text = m.group(1)
    if text.isupper():
        # Only capitalize first letter
        text = text[0].upper() + text[1:].lower()
    return '# ' + text

def fix_c_code_newlines(text):
    # Fix the weird physical newlines inside printf statements
    # Example: printf("=====\n"); broken into physical newlines
    # We look for printf("... \n"); that are broken
    text = re.sub(r'printf\("(.*?)\r?\n"\);', r'printf("\1\\n");', text)
    # Wait, the markdown actually looks like:
    # printf("=======================================================\n");
    # But it was parsed weirdly. 
    # Let's just fix `printf("...\r\n");` replacing physical newline with \n
    text = re.sub(r'printf\("([^"]*?)\r?\n"\);', r'printf("\1\\n");', text)
    return text

# 1. Fix Markdown files
md_files = {
    'index.html': 'Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md',
    'mmu-tlb-page-table.html': 'MMU_TLB_PageTable_Cache_Summary.md',
    'mesi-protocol.html': 'MESI_Cache_Coherence_Protocol.md',
    'spinlock-vs-mutex.html': 'SpinLock_TradeOff.md',
    'string-vs-string-view.html': 'string_vs_string_view.md'
}

for html_file, md_file in md_files.items():
    html_path = os.path.join('docs', html_file)
    if not os.path.exists(html_path) or not os.path.exists(md_file):
        continue
        
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Fix H1 Caps
    md_content = re.sub(r'^#\s+(.*)$', fix_h1_case, md_content, flags=re.MULTILINE)
    
    # Fix C code newlines specifically in the deep dive file
    if md_file == 'Computer_Architecture_Cache_VirtualMemory_Malloc_DeepDive.md':
        md_content = fix_c_code_newlines(md_content)
        # Write back the fixed markdown
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
    
    # Escape for JS literal
    escaped_md = md_content.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
    
    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Replace rawMarkdown
    parts = html_content.split('const rawMarkdown = `')
    if len(parts) == 2:
        restParts = parts[1].split('`;\n        // Custom renderer', 1)
        if len(restParts) == 2:
            html_content = parts[0] + 'const rawMarkdown = `' + escaped_md + '`;\n        // Custom renderer' + restParts[1]
    
    # Inject CSS & JS
    if 'custom.css' not in html_content:
        html_content = html_content.replace('</head>', '<link rel="stylesheet" href="custom.css?v=10">\n</head>')
    else:
        html_content = re.sub(r'custom\.css(\?v=\d+)?', 'custom.css?v=10', html_content)
        
    if 'custom.js' not in html_content:
        html_content = html_content.replace('</body>', '<script src="custom.js?v=10"></script>\n</body>')
    else:
        html_content = re.sub(r'custom\.js(\?v=\d+)?', 'custom.js?v=10', html_content)
        
    # Fix ALL CAPS in category-title
    html_content = re.sub(r'<div class="category-title">(.*?)</div>', lambda m: '<div class="category-title">' + to_title_case(m.group(1)) + '</div>', html_content)
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

print("Updated HTML & Markdown successfully.")
