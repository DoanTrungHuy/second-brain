import glob, re

for f in glob.glob("*.html"):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace ONLY the very first instance of const rawMarkdown = `
    # to const rawMarkdown = String.raw`
    # Be careful not to replace anything else
    
    # Ensure we don't accidentally do String.rawString.raw
    if "const rawMarkdown = String.raw`" not in content:
        content = content.replace("const rawMarkdown = `", "const rawMarkdown = String.raw`", 1)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed {f}")
