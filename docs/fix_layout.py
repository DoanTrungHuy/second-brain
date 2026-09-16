import os

with open('custom.css', 'a', encoding='utf-8') as f:
    css = """
/* FIX LAYOUT TO USE GLOBAL WINDOW SCROLL (like Stripe/Vercel) */
body {
    height: auto !important;
    min-height: 100vh;
}

#main-content {
    overflow-y: visible !important; /* Let it stretch the body */
    height: auto !important;
}

#sidebar {
    position: sticky !important;
    top: 0 !important;
    height: 100vh !important;
    overflow-y: auto !important;
    align-self: flex-start; /* CRITICAL for sticky to work inside flex container */
}

#right-sidebar {
    position: sticky !important;
    top: 0 !important;
    height: 100vh !important;
    overflow-y: auto !important;
    align-self: flex-start; /* CRITICAL for sticky */
}
"""
    f.write(css)

print("Layout CSS fixed!")
