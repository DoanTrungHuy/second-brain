import os
import glob

dest_dir = r"C:\Users\Doan Trung Huy\Desktop\second-brain-web"
html_files = glob.glob(os.path.join(dest_dir, "*.html"))

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parts = content.split('const rawMarkdown = `')
    if len(parts) > 1:
        before = parts[0]
        rest = parts[1].split('`;\n', 1)
        if len(rest) > 1:
            raw_md = rest[0]
            after = rest[1]
            
            raw_md = raw_md.replace('\\\\', '\\\\\\\\')
            
            new_content = before + 'const rawMarkdown = `' + raw_md + '`;\n' + after
            
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)

print("Fixed MathJax escaping!")
