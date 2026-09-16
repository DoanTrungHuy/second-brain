import os
import re

with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace .sidebar with #sidebar everywhere except in specific cases where it doesn't matter
css = css.replace('.sidebar {', '#sidebar {')
css = css.replace('.sidebar .brand', '#sidebar .brand')

# Add comprehensive responsive layout
responsive_css = """
/* COMPREHENSIVE RESPONSIVE DESIGN */
@media (max-width: 1280px) {
    #right-sidebar { display: none; }
    #main-content { max-width: 1000px; margin: 0 auto; }
}
@media (max-width: 900px) {
    #sidebar { 
        position: fixed; 
        left: -320px; 
        top: 0; 
        bottom: 0; 
        height: 100vh;
        width: 280px; 
        z-index: 2000; 
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex !important; /* Override index.html */
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
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
        background: rgba(0,0,0,0.4);
        backdrop-filter: blur(2px);
        z-index: 1999;
    }
    
    .markdown-body h1 { font-size: 2rem; }
    .markdown-body h2 { font-size: 1.5rem; }
    .markdown-body h3 { font-size: 1.25rem; }
    
    #ai-chat-window {
        width: 100%;
        height: 80vh;
        bottom: 0;
        right: 0;
        border-radius: 20px 20px 0 0;
        transform: translateY(100%);
    }
    #ai-chat-window.show {
        transform: translateY(0);
    }
    #ai-chat-btn {
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
    }
}
@media (max-width: 480px) {
    .markdown-body { font-size: 1rem; }
    #main-content { padding: 20px 15px; }
    .markdown-body pre code { padding: 15px; font-size: 0.85rem; }
}
"""

# Replace old media queries
css = re.sub(r'@media \(max-width: 1280px\).*?padding: 30px 20px; \}', '', css, flags=re.DOTALL)
css += "\n" + responsive_css

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Update custom.js to handle sidebar-open class on body
with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

sidebar_logic = """
    // Mobile Sidebar Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        // Override original toggle
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            if (sidebar.classList.contains('open')) {
                document.body.classList.add('sidebar-open');
            } else {
                document.body.classList.remove('sidebar-open');
            }
        };
        
        // Close on click outside
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('sidebar-open') && !sidebar.contains(e.target)) {
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            }
        });
        
        // Close on link click
        sidebar.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            });
        });
    }
"""

# Insert right after DOMContentLoaded
js = js.replace("document.addEventListener('DOMContentLoaded', () => {", "document.addEventListener('DOMContentLoaded', () => {" + sidebar_logic)

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Responsive CSS and JS added!")
