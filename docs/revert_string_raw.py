import glob, re

for f in glob.glob("*.html"):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if "const rawMarkdown = String.raw`" in content:
        content = content.replace("const rawMarkdown = String.raw`", "const rawMarkdown = `", 1)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Reverted {f}")
