import os

# Append CSS
css_add = """
/* === PREMIUM UX UPGRADES === */
/* 1. Scroll Reveal Animation */
.reveal-item {
    opacity: 0;
    transform: translateY(25px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-item.revealed {
    opacity: 1;
    transform: translateY(0);
}

/* 2. Floating Selection Menu */
#selection-menu {
    position: absolute;
    background: #111827;
    color: white;
    border-radius: 8px;
    padding: 4px;
    display: none;
    z-index: 9999;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    gap: 4px;
    transform: translate(-50%, -10px);
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
#selection-menu::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px 6px 0;
    border-style: solid;
    border-color: #111827 transparent transparent transparent;
}
#selection-menu button {
    background: none;
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 6px;
}
#selection-menu button:hover {
    background: #374151;
}

/* 3. Page Fade In */
body {
    opacity: 0;
    animation: fadeInPage 0.5s ease forwards;
}
@keyframes fadeInPage {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Smooth Sidebar Hovers */
.nav-item {
    transition: all 0.2s ease, transform 0.2s ease !important;
}
.nav-item:hover {
    transform: translateX(4px);
}
"""

with open('docs/custom.css', 'a', encoding='utf-8') as f:
    f.write(css_add)

# Append JS
js_add = """
        // --- PREMIUM UX UPGRADES ---

        // 1. Scroll Reveal Animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.markdown-body > p, .markdown-body > h2, .markdown-body > h3, .markdown-body > pre, .markdown-body > ul, .markdown-body > blockquote').forEach(el => {
            el.classList.add('reveal-item');
            observer.observe(el);
        });

        // 2. Floating Selection Menu (Copy / Ask AI)
        const selMenu = document.createElement('div');
        selMenu.id = 'selection-menu';
        selMenu.innerHTML = `
            <button id="sel-copy">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copy
            </button>
            <button id="sel-ai" style="color: #c084fc;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Ask AI ✨
            </button>
        `;
        document.body.appendChild(selMenu);

        let selTimeout;
        document.addEventListener('selectionchange', () => {
            clearTimeout(selTimeout);
            selTimeout = setTimeout(() => {
                const sel = window.getSelection();
                if(sel.rangeCount > 0 && sel.toString().trim().length > 0 && !chatInput.contains(sel.anchorNode)) {
                    const range = sel.getRangeAt(0);
                    const rect = range.getBoundingClientRect();
                    selMenu.style.display = 'flex';
                    selMenu.style.top = (rect.top + window.scrollY - 50) + 'px';
                    selMenu.style.left = (rect.left + window.scrollX + rect.width/2) + 'px';
                } else {
                    selMenu.style.display = 'none';
                }
            }, 150);
        });
        document.addEventListener('mousedown', (e) => {
            if(!selMenu.contains(e.target)) selMenu.style.display = 'none';
        });

        document.getElementById('sel-copy').onclick = () => {
            navigator.clipboard.writeText(window.getSelection().toString());
            selMenu.style.display = 'none';
        };
        document.getElementById('sel-ai').onclick = () => {
            const text = window.getSelection().toString();
            if(text) {
                chatWindow.classList.add('show');
                chatInput.value = "Giải thích chi tiết đoạn này giúp tôi: " + text;
                handleSend();
                selMenu.style.display = 'none';
            }
        };

        // 3. Smooth Page Navigation Transitions
        document.querySelectorAll('a.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                if(!link.href.startsWith('http') || link.href.includes(window.location.host)) {
                    e.preventDefault();
                    document.body.style.transition = 'opacity 0.25s ease';
                    document.body.style.opacity = '0';
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 250);
                }
            });
        });
"""

# We need to inject js_add BEFORE the closing "});" of custom.js
with open('docs/custom.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace the end
js_content = js_content.replace('    }\n});', js_add + '\n    }\n});')

with open('docs/custom.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Features appended successfully.")
