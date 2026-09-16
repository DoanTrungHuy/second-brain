import os
import re

with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()

# We need to replace the bad block I appended in fix_layout.py
bad_block = r'/\* FIX LAYOUT TO USE GLOBAL WINDOW SCROLL \(like Stripe/Vercel\) \*/.*?#right-sidebar \{.*?\}'

new_block = """
/* FIX LAYOUT TO USE GLOBAL WINDOW SCROLL (like Stripe/Vercel) */
body {
    height: auto !important;
    min-height: 100vh;
}

#main-content {
    overflow-y: visible !important;
    height: auto !important;
}

@media (min-width: 901px) {
    #sidebar {
        position: sticky !important;
        top: 0 !important;
        height: 100vh !important;
        overflow-y: auto !important;
        align-self: flex-start;
    }
    
    #right-sidebar {
        position: sticky !important;
        top: 0 !important;
        height: 100vh !important;
        overflow-y: auto !important;
        align-self: flex-start;
    }
}
"""

css = re.sub(bad_block, new_block.strip(), css, flags=re.DOTALL)

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Layout CSS fixed for mobile!")
