import os

with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()

responsive_css = """
/* COMPREHENSIVE RESPONSIVE DESIGN */
@media (max-width: 1280px) {
    #right-sidebar { display: none !important; }
    #main-content { max-width: 1000px; margin: 0 auto; }
}
@media (max-width: 900px) {
    /* Hide the double logo in the sidebar on mobile */
    #sidebar .brand { display: none !important; }
    
    #sidebar { 
        position: fixed; 
        left: -320px; 
        top: 0; 
        bottom: 0; 
        height: 100vh;
        width: 280px; 
        z-index: 2000; 
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex !important;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        background: var(--bg-sidebar);
    }
    #sidebar.open {
        left: 0;
    }
    #main-content { padding: 30px 20px; width: 100%; max-width: 100%; margin: 0; }
    
    /* Overlay for mobile sidebar */
    body.sidebar-open::after {
        content: '';
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(2px);
        z-index: 1999;
    }
    
    .markdown-body h1 { font-size: 2rem; }
    .markdown-body h2 { font-size: 1.5rem; }
    .markdown-body h3 { font-size: 1.25rem; }
    
    /* Hide the anchor links on mobile because they overlap with the edge */
    .heading-anchor { display: none !important; }
}
@media (max-width: 480px) {
    .markdown-body { font-size: 1rem; }
    #main-content { padding: 20px 15px; }
    .markdown-body pre code { padding: 15px; font-size: 0.85rem; }
}
"""

if "COMPREHENSIVE RESPONSIVE DESIGN" not in css:
    css += "\n" + responsive_css

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Responsive CSS restored!")
