import os
import re

with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update variables in :root
root_vars = """
:root {
    --bg-body: #ffffff;
    --bg-card: #f8fafc;
    --bg-sidebar: #f8fafc;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --primary: #2563eb;
    --primary-light: #eff6ff;
    --code-bg: #f8fafc; /* Very light slate */
    --code-text: #0f172a;
    --mac-header-bg: #e2e8f0;
    --mac-header-text: #475569;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
}
"""
css = re.sub(r':root \{.*?\n\}', root_vars.strip(), css, flags=re.DOTALL)

# 2. Update variables in [data-theme="dark"]
dark_vars = """
[data-theme="dark"] {
    --bg-body: #0f172a;
    --bg-card: #1e293b;
    --bg-sidebar: #1e293b;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: #334155;
    --primary: #3b82f6;
    --primary-light: #1e3a8a;
    --code-bg: #111827; /* Dark slate */
    --code-text: #f8fafc;
    --mac-header-bg: #0f172a;
    --mac-header-text: #94a3b8;
}
"""
css = re.sub(r'\[data-theme="dark"\] \{.*?\n\}', dark_vars.strip(), css, flags=re.DOTALL)

# 3. Update .mac-window-header and .code-lang-label
css = re.sub(r'\.mac-window-header \{\s*background: #[0-9a-fA-F]+;', '.mac-window-header {\n    background: var(--mac-header-bg);', css)
css = re.sub(r'\.code-lang-label \{\s*color: #[0-9a-fA-F]+;', '.code-lang-label {\n    color: var(--mac-header-text);', css)

# 4. Update .markdown-body pre code { color: ... }
css = re.sub(r'\.markdown-body pre code \{[\s\S]*?\}', """
.markdown-body pre code {
    display: block;
    padding: 20px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--code-text);
}
""", css, flags=re.DOTALL)

# 5. Make sure the copy button matches
css = re.sub(r'\.copy-btn-floating \{\s*color: #[0-9a-fA-F]+;', '.copy-btn-floating {\n    color: var(--mac-header-text);', css)
css = re.sub(r'\.copy-btn-floating:hover \{\s*background: #[0-9a-fA-F]+;\s*color: #[0-9a-fA-F]+;', '.copy-btn-floating:hover { background: var(--primary); color: #ffffff;', css)

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS Theme fixed!")
