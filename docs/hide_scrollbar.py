import os

with open('custom.css', 'a', encoding='utf-8') as f:
    f.write("\n/* Hide ugly scrollbars in sidebar nav */\n")
    f.write("#nav-menu::-webkit-scrollbar { display: none; }\n")
    f.write("#nav-menu { -ms-overflow-style: none; scrollbar-width: none; }\n")

print("CSS updated!")
