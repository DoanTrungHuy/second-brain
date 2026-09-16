import os
import re

# 1. READ ORIGINAL FILES
with open('custom.css', 'r', encoding='utf-8') as f:
    css = f.read()
with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 2. UPDATE CSS FOR PREMIUM READING
# Add Zen mode support & Active TOC & Anchor Links & Print styles
new_css = """
/* --- PREMIUM READING EXPERIENCE --- */
/* Focus/Zen Mode */
body.focus-mode .app-container {
    justify-content: center;
}
body.focus-mode #sidebar,
body.focus-mode #right-sidebar {
    opacity: 0;
    pointer-events: none;
    width: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    border: none;
}
body.focus-mode #sidebar { left: -300px; display: none; }
body.focus-mode #right-sidebar { display: none; }
body.focus-mode #main-content {
    max-width: 850px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
}

/* Heading Anchors */
.markdown-body h2, .markdown-body h3, .markdown-body h4 {
    position: relative;
}
.heading-anchor {
    position: absolute;
    left: -28px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    color: var(--text-muted) !important;
    text-decoration: none;
    transition: opacity 0.2s, color 0.2s;
    font-size: 0.8em;
    padding: 0 5px;
}
.heading-anchor:hover {
    color: var(--primary) !important;
}
.markdown-body h2:hover .heading-anchor, 
.markdown-body h3:hover .heading-anchor,
.markdown-body h4:hover .heading-anchor {
    opacity: 1;
}
@media (max-width: 900px) {
    .heading-anchor { display: none; } /* Hide on mobile to avoid overlap */
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}

/* Tooltip for keyboard shortcuts */
.kbd-shortcut {
    display: inline-block;
    padding: 2px 6px;
    font-size: 0.7rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    background: var(--bg-body);
    border: 1px solid var(--border);
    border-radius: 4px;
    margin-left: 8px;
    vertical-align: middle;
}

/* Reading Layout Tweaks */
.markdown-body p, .markdown-body li {
    max-width: 75ch; /* Optimal reading width for text */
}
.markdown-body pre, .markdown-body img, .markdown-body table {
    max-width: 100%; /* Let media/code expand fully */
}
.markdown-body img {
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
[data-theme="dark"] .markdown-body img {
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}

/* Active TOC items */
#toc-container .toc-item {
    border-left: 2px solid transparent;
    transition: all 0.2s ease;
    margin-bottom: 2px;
}
#toc-container .toc-item:hover {
    border-left-color: var(--border);
    background: var(--bg-body);
}
#toc-container .toc-item.active {
    border-left-color: var(--primary);
    color: var(--primary);
    background: var(--primary-light);
    font-weight: 600;
}
[data-theme="dark"] #toc-container .toc-item.active {
    background: rgba(59, 130, 246, 0.1);
}

/* Print Styles */
@media print {
    #sidebar, #right-sidebar, .mobile-header, .reading-meta, #reading-progress-container, #selection-menu, .copy-btn-floating {
        display: none !important;
    }
    #main-content { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
    body, .markdown-body { background: white !important; color: black !important; font-size: 12pt; }
    .markdown-body a { text-decoration: underline; color: black; }
    .markdown-body pre { border: 1px solid #ccc !important; page-break-inside: avoid; }
}
"""

if "/* --- PREMIUM READING EXPERIENCE --- */" not in css:
    css += "\n" + new_css

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)


# 3. UPDATE JS FOR PREMIUM READING
# Replace the Zen Mode button with Keyboard Shortcut tooltip
# Add ScrollSpy for TOC
# Add Heading Anchors
# Add Keyboard Listeners

js_reading_features = """
        // Add Keyboard Shortcuts Modal/Toast (Invisible, just listeners)
        document.addEventListener('keydown', (e) => {
            // Ignore if in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            // 'T' to toggle theme
            if (e.key.toLowerCase() === 't') {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            }
            // 'Z' to toggle Zen Mode
            if (e.key.toLowerCase() === 'z') {
                document.body.classList.toggle('focus-mode');
                updateZenBtnState();
            }
        });

        // Add Heading Anchors
        if (headings.length > 0) {
            headings.forEach((h, index) => {
                const anchor = document.createElement('a');
                anchor.href = '#' + h.id;
                anchor.className = 'heading-anchor';
                anchor.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                anchor.title = "Copy link to heading";
                
                anchor.onclick = (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + h.id);
                    const originalHTML = anchor.innerHTML;
                    anchor.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    setTimeout(() => anchor.innerHTML = originalHTML, 1500);
                    window.history.pushState(null, null, '#' + h.id);
                    h.scrollIntoView({ behavior: 'smooth' });
                };
                
                h.insertBefore(anchor, h.firstChild);
            });
        }

        // ScrollSpy for Active TOC
        const tocItems = document.querySelectorAll('.toc-item');
        const scrollSpy = () => {
            let currentId = null;
            let minDistance = Infinity;
            
            headings.forEach(h => {
                const rect = h.getBoundingClientRect();
                // Check if heading is above the middle of viewport
                if (rect.top >= -50 && rect.top < window.innerHeight / 2) {
                    if (rect.top < minDistance) {
                        minDistance = rect.top;
                        currentId = h.id;
                    }
                }
            });
            
            // Fallback if scrolling past all, pick the last one that is above viewport
            if (!currentId) {
                for (let i = headings.length - 1; i >= 0; i--) {
                    if (headings[i].getBoundingClientRect().top < 0) {
                        currentId = headings[i].id;
                        break;
                    }
                }
            }

            tocItems.forEach(item => {
                item.classList.remove('active');
                if (currentId && item.getAttribute('href') === '#' + currentId) {
                    item.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', scrollSpy, {passive: true});
        setTimeout(scrollSpy, 500); // Initial check
"""

# We need to insert this into custom.js inside the DOMContentLoaded > if(mdBody) block.
# Let's find a good insertion point: just before `// Progress Bar`
if "// ScrollSpy for Active TOC" not in js:
    js = js.replace('// Progress Bar', js_reading_features + '\n        // Progress Bar')

# Update Zen Mode button to show shortcut
js = js.replace('Zen Mode</button>', 'Zen Mode <span class="kbd-shortcut">Z</span></button>')
js = js.replace('Exit Zen</button>', 'Exit Zen <span class="kbd-shortcut">Z</span></button>')

# Create updateZenBtnState function globally accessible inside DOMContentLoaded
zen_func = """
        const updateZenBtnState = () => {
            if(document.body.classList.contains('focus-mode')) {
                focusBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg> Exit Zen <span class="kbd-shortcut" style="color:var(--text-main);background:rgba(255,255,255,0.2);border:none;">Z</span>';
                focusBtn.style.background = 'var(--primary)';
                focusBtn.style.color = '#fff';
                focusBtn.style.borderColor = 'var(--primary)';
            } else {
                focusBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg> Zen Mode <span class="kbd-shortcut">Z</span>';
                focusBtn.style.background = 'none';
                focusBtn.style.color = 'var(--text-muted)';
                focusBtn.style.borderColor = 'var(--border)';
            }
        };
        focusBtn.onclick = () => {
            document.body.classList.toggle('focus-mode');
            updateZenBtnState();
        };
"""
js = re.sub(r'focusBtn\.onclick = \(\) => \{.*?\};', zen_func.strip(), js, flags=re.DOTALL)

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Reading experience enhanced!")
