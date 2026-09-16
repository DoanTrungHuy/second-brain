import os
import re

# 1. Clean up JS
with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove the ELEGANT AI CHATBOT block
js = re.sub(r'// ELEGANT AI CHATBOT.*?(?=\s*// --- DISCREET FLOATING MENU ---)', '', js, flags=re.DOTALL)

# Remove the Ask AI button from selection menu
js = re.sub(r'<button id="sel-ai".*?</button>', '', js, flags=re.DOTALL)

# Remove the sel-ai onclick handler
js = re.sub(r'document\.getElementById\(\'sel-ai\'\)\.onclick = \(\) => \{.*?\n        \};\n', '', js, flags=re.DOTALL)

# Remove !chatInput.contains from selectionchange
js = js.replace('&& !chatInput.contains(sel.anchorNode)', '')

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)


# 2. Clean up CSS
with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove Chat UI from CSS
css = re.sub(r'/\* CHAT UI \*/.*?(?=$)', '', css, flags=re.DOTALL)

# Also remove chat ui from responsive media queries if any
css = re.sub(r'#ai-chat-window \{.*?\}', '', css, flags=re.DOTALL)
css = re.sub(r'#ai-chat-window\.show \{.*?\}', '', css, flags=re.DOTALL)
css = re.sub(r'#ai-chat-btn \{.*?\}', '', css, flags=re.DOTALL)

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Chatbot removed completely!")
