import os
import re

with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

# We need to skip headings that say "Mục lục"
# Currently:
# document.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach((h, i) => {
#     h.id = h.id || 'h-' + i;
# ...

new_logic = """
              document.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach((h, i) => {
                  if (h.innerText.trim().toLowerCase() === 'mục lục' || h.innerText.trim().toLowerCase() === 'muc luc') return;
                  h.id = h.id || 'h-' + i;
"""
js = js.replace("document.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach((h, i) => {\n                  h.id = h.id || 'h-' + i;", new_logic.strip("\n"))

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("TOC duplication fixed!")
