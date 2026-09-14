import os
import glob

def fix_files(directory, ext):
    files = glob.glob(os.path.join(directory, ext))
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if '.md' in ext:
            content = content.replace('$\nightarrow$', '$\\rightarrow$')
            content = content.replace('$\r\nightarrow$', '$\\rightarrow$')
            content = content.replace('$\n\right', '$\\right')
            content = content.replace('$\r\n\right', '$\\right')
        else:
            # HTML files
            content = content.replace('$\n\\\\\\\\ightarrow$', '$\\\\\\\\rightarrow$')
            content = content.replace('$\r\n\\\\\\\\ightarrow$', '$\\\\\\\\rightarrow$')
            content = content.replace('$\nightarrow$', '$\\\\\\\\rightarrow$')
            content = content.replace('$\r\nightarrow$', '$\\\\\\\\rightarrow$')
            content = content.replace('$\n\\\\ightarrow$', '$\\\\\\\\rightarrow$')
            content = content.replace('$\r\n\\\\ightarrow$', '$\\\\\\\\rightarrow$')

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

fix_files(r"C:\Users\Doan Trung Huy\Desktop\second-brain", "*.md")
fix_files(r"C:\Users\Doan Trung Huy\Desktop\second-brain\docs", "*.md")
fix_files(r"C:\Users\Doan Trung Huy\Desktop\second-brain\docs", "*.html")
fix_files(r"C:\Users\Doan Trung Huy\Desktop\second-brain-web", "*.html")

print("Fixed files safely!")
