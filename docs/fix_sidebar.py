import os

with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix appContainer reference
# Look for: const appContainer = document.querySelector('.app-container');
# Replace with: const flexContainer = document.body;
js = js.replace("const appContainer = document.querySelector('.app-container');", "")
js = js.replace("if (appContainer) {", "if (true) {")
js = js.replace("appContainer.appendChild(rightSidebar);", "document.body.appendChild(rightSidebar);")

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Right sidebar fixed!")
