import os
import re

def to_title_case(s):
    # Just capitalize first letter, lower the rest (or preserve some)
    # Actually, a simple title() might mess up "C++", so let's just use string.title() for simple ones
    # But string.title() makes "c++" into "C++"? No, "c++".title() -> "C++"
    # Actually, since it's Vietnamese, capitalize() just lowercases everything else.
    # We want "Hardware & Memory Systems" instead of "HARDWARE & MEMORY SYSTEMS"
    # Let's just use title() and fix "C++" specifically
    t = s.title()
    t = t.replace('C++', 'C++')
    return t

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
    
    # Fix ALL CAPS in H1 (e.g. `# KIẾN TRÚC MÁY TÍNH`)
    # We'll just change `# SOMETHING ALL CAPS` to `# Something all caps`
    def repl_h1(m):
        # Only lowercase it, but keep first letter capital
        text = m.group(1)
        if text.isupper():
            text = text.capitalize()
        return '# ' + text
    md_content = re.sub(r'^#\s+(.*)$', repl_h1, md_content, flags=re.MULTILINE)
    
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
        html_content = html_content.replace('</head>', '<link rel="stylesheet" href="custom.css?v=9">\n</head>')
    else:
        html_content = re.sub(r'custom\.css(\?v=\d+)?', 'custom.css?v=9', html_content)
        
    if 'custom.js' not in html_content:
        html_content = html_content.replace('</body>', '<script src="custom.js?v=9"></script>\n</body>')
    else:
        html_content = re.sub(r'custom\.js(\?v=\d+)?', 'custom.js?v=9', html_content)
        
    # Fix ALL CAPS in category-title
    def repl_cat(m):
        text = m.group(1)
        if text.isupper():
            text = text.title()
        return '<div class="category-title">' + text + '</div>'
    html_content = re.sub(r'<div class="category-title">(.*?)</div>', repl_cat, html_content)
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

print("Updated HTML successfully.")
