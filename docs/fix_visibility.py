import os
import re

with open("custom.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace the media query
css = re.sub(
    r'@media \(max-width: 1024px\)\s*\{\s*#learning-dock\s*\{\s*display: none;\s*/\* Hide on small screens to save space \*/\s*\}\s*\}', 
    r'''
@media (max-width: 768px) {
    #learning-dock {
        right: 5px;
        top: auto;
        bottom: 100px;
        transform: none;
        flex-direction: row;
        flex-wrap: wrap;
        width: 60px;
        background: rgba(255,255,255,0.85);
        backdrop-filter: blur(10px);
    }
    [data-theme="dark"] #learning-dock {
        background: rgba(30,41,59,0.85);
    }
}
''', css, flags=re.MULTILINE)

with open("custom.css", "w", encoding="utf-8") as f:
    f.write(css)

with open("custom.js", "r", encoding="utf-8") as f:
    js = f.read()

js = js.replace('if(window.innerWidth > 1024) {', 'if(true) {')

with open("custom.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Fixed visibility!")
