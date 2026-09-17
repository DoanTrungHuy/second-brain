document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Sidebar Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            if (sidebar.classList.contains('open')) {
                document.body.classList.add('sidebar-open');
            } else {
                document.body.classList.remove('sidebar-open');
            }
        };
        
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('sidebar-open') && !sidebar.contains(e.target)) {
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            }
        });
        
        sidebar.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
            });
        });
    }

    // 2. Theme Toggle with Smooth Animation
    const sidebarBrand = document.querySelector('#sidebar .brand');
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-toggle';
    themeBtn.id = 'theme-icon';
    themeBtn.title = 'Chuyển giao diện (Phím tắt: T)';
    
    if (sidebarBrand) {
        sidebarBrand.appendChild(themeBtn);
    }

    const setTheme = (theme, animate = false) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (animate) {
            themeBtn.classList.remove('theme-animating');
            void themeBtn.offsetWidth; // trigger reflow
            themeBtn.classList.add('theme-animating');
        }

        if (theme === 'dark') {
            themeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        } else {
            themeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        }
    };
    
    setTheme(localStorage.getItem('theme') || 'light', false);

    themeBtn.onclick = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme, true);
    };

    // 3. Render Markdown & Syntax Highlighting
    const mdBody = document.getElementById('markdown-body');
    if (mdBody && typeof rawMarkdown !== 'undefined' && typeof marked !== 'undefined') {
        const renderer = new marked.Renderer();
        const originalCode = renderer.code;
        renderer.code = function(code, language, isEscaped) {
            const rendered = originalCode.call(this, code, language, isEscaped);
            return rendered.replace(
                '<pre>', 
                '<pre><div class="mac-window-header"><div class="mac-dots"><div class="mac-dot red"></div><div class="mac-dot yellow"></div><div class="mac-dot green"></div></div><div class="code-lang-label">' + (language || 'text') + '</div><button class="copy-btn-floating">Copy</button></div>'
            );
        };
        
        marked.setOptions({ renderer: renderer });
        mdBody.innerHTML = marked.parse(rawMarkdown);

        // MathJax Trigger
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetPromise([mdBody]).catch(err => console.error('MathJax error:', err.message));
        }

        // Code Copy Interaction
        document.querySelectorAll('.markdown-body pre').forEach(pre => {
            const btn = pre.querySelector('.copy-btn-floating');
            const codeEl = pre.querySelector('code');
            if (btn && codeEl) {
                btn.onclick = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(codeEl.innerText);
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<span style="color:#10b981;font-weight:600;">✓ Copied</span>';
                    btn.style.borderColor = '#10b981';
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.borderColor = '';
                    }, 1800);
                };
            }
        });

        // 4. Table of Contents in Right Sidebar
        const headings = mdBody.querySelectorAll('h2, h3');
        if (headings.length > 0) {
            const rightSidebar = document.createElement('div');
            rightSidebar.id = 'right-sidebar';
            
            const tocContainer = document.createElement('div');
            tocContainer.id = 'toc-container';
            
            const tocTitle = document.createElement('div');
            tocTitle.className = 'toc-title';
            tocTitle.innerText = 'MỤC LỤC';
            tocContainer.appendChild(tocTitle);

            headings.forEach((h, index) => {
                const text = h.innerText.replace(/^#+\s*/, '').trim();
                // Skip duplicate "MỤC LỤC" heading if any
                if (text.toUpperCase() === 'MỤC LỤC') return;

                if (!h.id) {
                    h.id = 'heading-' + index;
                }
                
                const item = document.createElement('a');
                item.className = 'toc-item' + (h.tagName === 'H3' ? ' indent' : '');
                item.href = '#' + h.id;
                item.innerText = text;
                
                item.onclick = (e) => {
                    e.preventDefault();
                    history.pushState(null, null, '#' + h.id);
                    h.scrollIntoView({ behavior: 'smooth' });
                };
                
                tocContainer.appendChild(item);
            });

            rightSidebar.appendChild(tocContainer);
            document.body.appendChild(rightSidebar);

            // Heading Anchors (#)
            headings.forEach(h => {
                if (h.innerText.trim().toUpperCase() === 'MỤC LỤC') return;

                const anchor = document.createElement('a');
                anchor.href = '#' + h.id;
                anchor.className = 'heading-anchor';
                anchor.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                anchor.title = 'Copy link đến mục này';
                
                anchor.onclick = (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + h.id);
                    const orig = anchor.innerHTML;
                    anchor.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    setTimeout(() => anchor.innerHTML = orig, 1500);
                    window.history.pushState(null, null, '#' + h.id);
                    h.scrollIntoView({ behavior: 'smooth' });
                };
                
                h.insertBefore(anchor, h.firstChild);
            });

            // ScrollSpy for Active TOC Item
            const tocItems = document.querySelectorAll('.toc-item');
            const scrollSpy = () => {
                let currentId = null;
                let minDistance = Infinity;
                
                headings.forEach(h => {
                    const rect = h.getBoundingClientRect();
                    if (rect.top >= -60 && rect.top < window.innerHeight / 2.5) {
                        if (rect.top < minDistance) {
                            minDistance = rect.top;
                            currentId = h.id;
                        }
                    }
                });
                
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
            
            window.addEventListener('scroll', scrollSpy, { passive: true });
            setTimeout(scrollSpy, 300);
        }

        // 5. Reading Progress Bar
        const progContainer = document.createElement('div');
        progContainer.id = 'reading-progress-container';
        const progBar = document.createElement('div');
        progBar.id = 'reading-progress';
        progContainer.appendChild(progBar);
        document.body.appendChild(progContainer);

        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const b = document.body;
            const st = 'scrollTop' in h ? h.scrollTop : b.scrollTop;
            const sh = 'scrollHeight' in h ? h.scrollHeight : b.scrollHeight;
            const percent = (st / (sh - h.clientHeight)) * 100;
            progBar.style.width = Math.min(100, Math.max(0, percent)) + '%';
        }, { passive: true });

        // 6. Keyboard Shortcuts Listener
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            // 'T' to toggle theme
            if (e.key.toLowerCase() === 't') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme, true);
            }
            // 'Z' to toggle Zen Mode
            if (e.key.toLowerCase() === 'z') {
                document.body.classList.toggle('focus-mode');
            }
        });
    }
});