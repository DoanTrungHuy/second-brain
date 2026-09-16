import os

with open('custom.css', 'a', encoding='utf-8') as f:
    css = """
/* Fix brand logo wrapping and balance */
#sidebar .brand {
    padding: 20px 16px;
    font-size: 1rem !important;
    white-space: nowrap;
    gap: 8px !important;
}
#sidebar .brand svg {
    width: 20px !important;
    height: 20px !important;
    flex-shrink: 0;
}
.theme-toggle {
    margin-left: auto !important;
    display: flex;
    align-items: center;
    justify-content: center;
}
"""
    f.write(css)

print("Brand CSS fixed!")
