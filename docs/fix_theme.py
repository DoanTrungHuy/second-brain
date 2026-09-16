import os
import re
import glob

# 1. Update HTML files to add ID to highlight.js link
for f in glob.glob("*.html"):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'id="hljs-theme"' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">',
            '<link id="hljs-theme" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css">'
        )
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Added hljs-theme ID to {f}")

# 2. Update custom.js to toggle the hljs-theme
with open('custom.js', 'r', encoding='utf-8') as file:
    js = file.read()

if "hljsTheme.href =" not in js:
    # Find setTheme function
    theme_func_addition = """
        const hljsTheme = document.getElementById('hljs-theme');
        if (hljsTheme) {
            hljsTheme.href = theme === 'dark' 
                ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css' 
                : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css';
        }
"""
    js = js.replace("localStorage.setItem('theme', theme);", "localStorage.setItem('theme', theme);" + theme_func_addition)
    
    # Also trigger it on load to ensure correct theme is set initially
    js = js.replace("setTheme(savedTheme);", "setTheme(savedTheme);") # Wait, if setTheme is called, it will do it anyway.
    
    with open('custom.js', 'w', encoding='utf-8') as file:
        file.write(js)
    print("Updated custom.js for theme toggle")

# 3. Update custom.css for perfect dark mode sync and code block colors
with open('custom.css', 'r', encoding='utf-8') as file:
    css = file.read()

# Add new CSS variables safely by replacing the :root and [data-theme="dark"] blocks
css = re.sub(r':root \{.*?\n\}', """
:root {
    --bg-body: #ffffff;
    --bg-card: #f8fafc;
    --bg-sidebar: #f8fafc;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --primary: #2563eb;
    --primary-light: #eff6ff;
    --code-bg: #f1f5f9; /* Light mode code bg */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
}
""", css, flags=re.DOTALL)

css = re.sub(r'\[data-theme="dark"\] \{.*?\n\}', """
[data-theme="dark"] {
    --bg-body: #0f172a;
    --bg-card: #1e293b;
    --bg-sidebar: #1e293b;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: #334155;
    --primary: #3b82f6;
    --primary-light: #1e3a8a;
    --code-bg: #111827; /* Very dark blue/slate for code blocks in dark mode */
}
""", css, flags=re.DOTALL)

# Fix the hardcoded code block background
css = re.sub(r'\.markdown-body pre \{\s*background: #0d1117 !important;.*?\}', """
.markdown-body pre {
    background: var(--code-bg) !important;
    border-radius: 12px;
}
""", css, flags=re.DOTALL)

# Fix #sidebar background color explicitly in the main #sidebar block
if "background: var(--bg-card);" not in css and "background: var(--bg-sidebar);" not in css.split('/* SIDEBAR (LEFT) */')[1][:200]:
    css = css.replace('/* SIDEBAR (LEFT) */\n#sidebar {', '/* SIDEBAR (LEFT) */\n#sidebar {\n    background: var(--bg-sidebar);')

# Fix #right-sidebar background color
if "background: var(--bg-body);" not in css and "background: var(--bg-sidebar);" not in css.split('/* TOC SIDEBAR (RIGHT) */')[1][:200]:
    css = css.replace('/* TOC SIDEBAR (RIGHT) */\n#right-sidebar {', '/* TOC SIDEBAR (RIGHT) */\n#right-sidebar {\n    background: var(--bg-body);')

with open('custom.css', 'w', encoding='utf-8') as file:
    file.write(css)
print("Updated custom.css with synchronized theme variables and code block colors")

