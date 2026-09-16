import os
import re

# 1. Clean up CSS
with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove learning dock CSS
css = re.sub(r'/\* === LEARNING TOOLS DOCK === \*/.*?/\* Focus Reader Mode \*/', '', css, flags=re.DOTALL)
css = re.sub(r'body\.focus-reader-active.*?(?=\n\n|\Z)', '', css, flags=re.DOTALL)
css = re.sub(r'@media \(max-width: 768px\) \{.*?#learning-dock.*?\}', '', css, flags=re.DOTALL)

# Refine Chat UI to be cleaner
css = css.replace('background: linear-gradient(135deg, #a855f7, #6366f1);', 'background: var(--primary);')
css = css.replace('box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);', '')
css = css.replace('animation: glow-pulse 2s infinite;', '')

css_suggestions = """
.chat-suggestions {
    display: flex;
    gap: 8px;
    padding: 0 20px 10px 20px;
    overflow-x: auto;
}
.chat-suggestions::-webkit-scrollbar { display: none; }
.chat-suggestion-chip {
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-main);
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
}
.chat-suggestion-chip:hover {
    background: var(--primary-light);
    color: var(--primary);
    border-color: var(--primary);
}
"""
css += "\n" + css_suggestions

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)


# 2. Clean up JS
with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the learning dock HTML and logic
js = re.sub(r'// --- LEARNING TOOLS ---.*?// Bionic Reading', '// Bionic Reading', js, flags=re.DOTALL)
js = re.sub(r'// Bionic Reading.*?// Dyslexia Mode', '// Dyslexia Mode', js, flags=re.DOTALL)
js = re.sub(r'// Dyslexia Mode.*?// AI Summary', '// AI Summary', js, flags=re.DOTALL)
js = re.sub(r'// AI Summary.*?// AI Flashcard', '// AI Flashcard', js, flags=re.DOTALL)
js = re.sub(r'// AI Flashcard.*?}\n}\);\n', '}\n});\n', js, flags=re.DOTALL)

# Let's completely rebuild custom.js from scratch to ensure no leftover junk and absolute cleanliness.
