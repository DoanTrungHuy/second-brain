document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. MOBILE SIDEBAR TOGGLE
    // ==========================================================================
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

    // ==========================================================================
    // 2. THEME TOGGLE WITH SMOOTH ROTATING ANIMATION
    // ==========================================================================
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
            void themeBtn.offsetWidth;
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

    // ==========================================================================
    // 3. RENDER MARKDOWN, SYNTAX HIGHLIGHTING & TERMINAL ACTIONS
    // ==========================================================================
    const mdBody = document.getElementById('markdown-body');
    if (mdBody && typeof rawMarkdown !== 'undefined' && typeof marked !== 'undefined') {
        const renderer = new marked.Renderer();
        const originalCode = renderer.code;
        renderer.code = function(code, language, isEscaped) {
            const rendered = originalCode.call(this, code, language, isEscaped);
            return rendered.replace(
                '<pre>', 
                '<pre><div class="mac-window-header"><div class="mac-dots"><div class="mac-dot red"></div><div class="mac-dot yellow"></div><div class="mac-dot green"></div></div><div class="code-lang-label">' + (language || 'text') + '</div><div style="display:flex;align-items:center;"><button class="code-wrap-toggle" title="Tự động xuống dòng">Wrap</button><button class="copy-btn-floating">Copy</button></div></div>'
            );
        };
        
        marked.setOptions({ renderer: renderer });
        mdBody.innerHTML = marked.parse(rawMarkdown);

        // MathJax Typeset Trigger
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetPromise([mdBody]).catch(err => console.error('MathJax error:', err.message));
        }

        // Code Block Actions (Copy & Word Wrap)
        document.querySelectorAll('.markdown-body pre').forEach(pre => {
            const copyBtn = pre.querySelector('.copy-btn-floating');
            const wrapBtn = pre.querySelector('.code-wrap-toggle');
            const codeEl = pre.querySelector('code');
            
            if (copyBtn && codeEl) {
                copyBtn.onclick = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(codeEl.innerText);
                    const origText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<span style="color:#10b981;font-weight:600;">✓ Copied</span>';
                    copyBtn.style.borderColor = '#10b981';
                    setTimeout(() => {
                        copyBtn.innerHTML = origText;
                        copyBtn.style.borderColor = '';
                    }, 1800);
                };
            }

            if (wrapBtn) {
                wrapBtn.onclick = (e) => {
                    e.stopPropagation();
                    pre.classList.toggle('code-wrapped');
                    wrapBtn.classList.toggle('active');
                };
            }
        });

        // ======================================================================
        // 4. TABLE OF CONTENTS IN RIGHT SIDEBAR
        // ======================================================================
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

        // ======================================================================
        // 5. NEXT / PREVIOUS ARTICLE BOTTOM NAVIGATION
        // ======================================================================
        const articlesList = [
            { url: "index.html", title: "Kiến trúc Cache & Virtual Memory" },
            { url: "mmu-tlb-page-table.html", title: "Cơ chế MMU, TLB & Page Table" },
            { url: "mesi-protocol.html", title: "Giao thức Đồng bộ MESI" },
            { url: "spinlock-vs-mutex.html", title: "Tối ưu Đồng bộ: SpinLock vs Mutex" },
            { url: "string-vs-string-view.html", title: "Quản lý Bộ nhớ: std::string_view" }
        ];

        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentIndex = articlesList.findIndex(a => a.url === currentPath);

        if (currentIndex !== -1) {
            const navContainer = document.createElement('div');
            navContainer.className = 'post-navigation';

            const prevArticle = currentIndex > 0 ? articlesList[currentIndex - 1] : null;
            const nextArticle = currentIndex < articlesList.length - 1 ? articlesList[currentIndex + 1] : null;

            if (prevArticle) {
                const prevCard = document.createElement('a');
                prevCard.className = 'post-nav-card prev';
                prevCard.href = prevArticle.url;
                prevCard.innerHTML = `
                    <div class="post-nav-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Bài trước
                    </div>
                    <div class="post-nav-title">${prevArticle.title}</div>
                `;
                navContainer.appendChild(prevCard);
            } else {
                const spacer = document.createElement('div');
                spacer.style.flex = '1';
                navContainer.appendChild(spacer);
            }

            if (nextArticle) {
                const nextCard = document.createElement('a');
                nextCard.className = 'post-nav-card next';
                nextCard.href = nextArticle.url;
                nextCard.innerHTML = `
                    <div class="post-nav-label">
                        Bài tiếp theo
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="post-nav-title">${nextArticle.title}</div>
                `;
                navContainer.appendChild(nextCard);
            }

            const articleContainer = document.querySelector('.article-container');
            if (articleContainer) {
                articleContainer.appendChild(navContainer);
            }
        }
    }

    // ==========================================================================
    // 6. READING PROGRESS BAR
    // ==========================================================================
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

    // ==========================================================================
    // 7. SMOOTH FLOATING BACK TO TOP BUTTON
    // ==========================================================================
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.title = 'Cuộn lên đầu trang';
    backToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ==========================================================================
    // 8. SPOTLIGHT SEARCH MODAL (Ctrl + K)
    // ==========================================================================
    const searchModal = document.createElement('div');
    searchModal.id = 'spotlight-modal';
    searchModal.innerHTML = `
        <div class="spotlight-card">
            <div class="spotlight-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="spotlight-input" placeholder="Tìm kiếm kiến thức, thuật ngữ (VIPT, SpinLock, Malloc...)" autofocus>
                <div class="spotlight-esc">ESC</div>
            </div>
            <div class="spotlight-results">
                <div class="spotlight-empty">Gõ từ khóa bất kỳ để tìm kiếm toàn bộ tài liệu...</div>
            </div>
            <div class="spotlight-footer">
                <div>Dùng <span class="kbd-shortcut">↑</span> <span class="kbd-shortcut">↓</span> để chọn, <span class="kbd-shortcut">Enter</span> để mở</div>
                <div class="spotlight-footer-keys">
                    <span><span class="kbd-shortcut">Esc</span> đóng</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(searchModal);

    // Add Shortcut Badge in Sidebar Search Box
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        const badge = document.createElement('span');
        badge.className = 'search-badge';
        badge.innerText = 'Ctrl K';
        searchBox.appendChild(badge);
        
        const sideInput = searchBox.querySelector('input');
        if (sideInput) {
            sideInput.onclick = (e) => {
                e.preventDefault();
                openSpotlight();
            };
            sideInput.onfocus = (e) => {
                e.preventDefault();
                openSpotlight();
            };
        }
    }

    const spotlightInput = searchModal.querySelector('.spotlight-input');
    const spotlightResults = searchModal.querySelector('.spotlight-results');

    const openSpotlight = () => {
        searchModal.classList.add('show');
        setTimeout(() => spotlightInput.focus(), 50);
    };

    const closeSpotlight = () => {
        searchModal.classList.remove('show');
        spotlightInput.value = '';
    };

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSpotlight();
    });

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    let selectedIndex = 0;

    const renderResults = () => {
        const query = spotlightInput.value.trim().toLowerCase();
        if (!query) {
            spotlightResults.innerHTML = '<div class="spotlight-empty">Gõ từ khóa bất kỳ để tìm kiếm toàn bộ tài liệu...</div>';
            return;
        }

        if (typeof windowSearchIndex === 'undefined') {
            spotlightResults.innerHTML = '<div class="spotlight-empty">Đang nạp cơ sở dữ liệu tìm kiếm...</div>';
            return;
        }

        const matches = windowSearchIndex.filter(item => {
            return item.article.toLowerCase().includes(query) ||
                   item.section.toLowerCase().includes(query) ||
                   item.text.toLowerCase().includes(query);
        }).slice(0, 8);

        if (matches.length === 0) {
            spotlightResults.innerHTML = `<div class="spotlight-empty">Không tìm thấy kết quả nào cho "<strong>${spotlightInput.value}</strong>"</div>`;
            return;
        }

        selectedIndex = 0;
        spotlightResults.innerHTML = matches.map((m, idx) => `
            <a href="${m.url}" class="spotlight-item ${idx === 0 ? 'selected' : ''}">
                <div class="spotlight-item-badge">${m.category} • ${m.article}</div>
                <div class="spotlight-item-title">${highlightMatch(m.section, query)}</div>
                <div class="spotlight-item-snippet">${highlightMatch(m.text, query)}</div>
            </a>
        `).join('');

        const items = spotlightResults.querySelectorAll('.spotlight-item');
        items.forEach((item, idx) => {
            item.onmouseenter = () => {
                items.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                selectedIndex = idx;
            };
        });
    };

    spotlightInput.addEventListener('input', renderResults);

    // ==========================================================================
    // 9. GLOBAL KEYBOARD SHORTCUTS
    // ==========================================================================
    document.addEventListener('keydown', (e) => {
        // Ctrl+K / Cmd+K to open search
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            if (searchModal.classList.contains('show')) {
                closeSpotlight();
            } else {
                openSpotlight();
            }
            return;
        }

        // Spotlight Navigation
        if (searchModal.classList.contains('show')) {
            const items = spotlightResults.querySelectorAll('.spotlight-item');
            if (e.key === 'Escape') {
                e.preventDefault();
                closeSpotlight();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (items.length > 0) {
                    items[selectedIndex].classList.remove('selected');
                    selectedIndex = (selectedIndex + 1) % items.length;
                    items[selectedIndex].classList.add('selected');
                    items[selectedIndex].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (items.length > 0) {
                    items[selectedIndex].classList.remove('selected');
                    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                    items[selectedIndex].classList.add('selected');
                    items[selectedIndex].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'Enter') {
                if (items.length > 0 && items[selectedIndex]) {
                    e.preventDefault();
                    window.location.href = items[selectedIndex].getAttribute('href');
                }
            }
            return;
        }

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
});

// Remove preload to enable smooth transitions after initial paint
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.documentElement.classList.remove('preload');
    }, 50);
});