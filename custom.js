document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 0. GLOBAL TOAST NOTIFICATION SYSTEM
    // ==========================================================================
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    const showToast = (message, duration = 2600) => {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };

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
            showToast(theme === 'dark' ? '🌙 Đã chuyển sang giao diện Tối' : '☀️ Đã chuyển sang giao diện Sáng');
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
                '<pre><div class="mac-window-header"><div class="mac-dots"><div class="mac-dot red" title="Đóng"></div><div class="mac-dot yellow" title="Thu nhỏ"></div><div class="mac-dot green" title="Phóng to đoạn mã"></div></div><div class="code-lang-label">' + (language || 'text') + '</div><div style="display:flex;align-items:center;"><button class="code-wrap-toggle" title="Tự động xuống dòng">Wrap</button><button class="code-expand-toggle" title="Phóng to đoạn mã"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg> Expand</button><button class="copy-btn-floating">Copy</button></div></div>'
            );
        };
        
        marked.setOptions({ renderer: renderer });
        mdBody.innerHTML = marked.parse(rawMarkdown);

        // MathJax Typeset Trigger
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetPromise([mdBody]).catch(err => console.error('MathJax error:', err.message));
        }

        // Code Block Fullscreen Backdrop
        const codeBackdrop = document.createElement('div');
        codeBackdrop.className = 'code-expand-backdrop';
        codeBackdrop.style.display = 'none';
        document.body.appendChild(codeBackdrop);

        const closeExpandedCode = () => {
            document.querySelectorAll('.markdown-body pre.code-expanded').forEach(p => {
                p.classList.remove('code-expanded');
                const btn = p.querySelector('.code-expand-toggle');
                if (btn) btn.classList.remove('active');
            });
            codeBackdrop.style.display = 'none';
        };

        codeBackdrop.onclick = closeExpandedCode;

        // Code Block Actions (Copy, Word Wrap & Fullscreen Expand)
        document.querySelectorAll('.markdown-body pre').forEach(pre => {
            const copyBtn = pre.querySelector('.copy-btn-floating');
            const wrapBtn = pre.querySelector('.code-wrap-toggle');
            const expandBtn = pre.querySelector('.code-expand-toggle');
            const greenDot = pre.querySelector('.mac-dot.green');
            const codeEl = pre.querySelector('code');
            
            if (copyBtn && codeEl) {
                copyBtn.onclick = (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(codeEl.innerText);
                    const origText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<span style="color:#10b981;font-weight:600;">✓ Copied</span>';
                    copyBtn.style.borderColor = '#10b981';
                    showToast('✓ Đã sao chép mã nguồn vào bộ nhớ tạm!');
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

            const toggleExpand = (e) => {
                if (e) e.stopPropagation();
                const isExp = pre.classList.toggle('code-expanded');
                if (expandBtn) expandBtn.classList.toggle('active', isExp);
                if (isExp) {
                    codeBackdrop.style.display = 'block';
                    showToast('Đã phóng to đoạn mã. Nhấn Esc để đóng.');
                } else {
                    codeBackdrop.style.display = 'none';
                }
            };

            if (expandBtn) expandBtn.onclick = toggleExpand;
            if (greenDot) greenDot.onclick = toggleExpand;
        });

        // Callouts / Admonitions Transformation
        mdBody.querySelectorAll('blockquote').forEach(bq => {
            const html = bq.innerHTML.trim();
            const match = html.match(/^\s*<p>\s*\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*(?:<br\s*\/?>)?([\s\S]*)/i);
            if (match) {
                const type = match[1].toLowerCase();
                const rest = match[2];
                const titles = {
                    note: 'Ghi chú (Note)',
                    tip: 'Mẹo hữu ích (Tip)',
                    warning: 'Cảnh báo (Warning)',
                    important: 'Quan trọng (Important)',
                    caution: 'Lưu ý (Caution)'
                };
                const icons = {
                    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
                    tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path><circle cx="12" cy="12" r="4"></circle></svg>',
                    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
                    important: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
                    caution: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
                };
                const callout = document.createElement('div');
                callout.className = `callout callout-${type}`;
                callout.innerHTML = `
                    <div class="callout-title">${icons[type] || icons.note} <span>${titles[type] || type.toUpperCase()}</span></div>
                    <p>${rest}
                `;
                bq.replaceWith(callout);
            }
        });

        // Article Meta Bar (Reading time, words, share, print, zen)
        const mainH1 = mdBody.querySelector('h1');
        if (mainH1) {
            const rawText = mdBody.innerText || '';
            const words = rawText.trim().split(/\s+/).filter(Boolean).length;
            const readingTime = Math.max(1, Math.ceil(words / 220));

            const metaBar = document.createElement('div');
            metaBar.className = 'article-meta-bar';
            metaBar.innerHTML = `
                <div class="meta-badge" title="Thời gian đọc dự kiến">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>~${readingTime} phút đọc</span>
                </div>
                <div class="meta-divider"></div>
                <div class="meta-badge" title="Độ dài bài viết">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>${words.toLocaleString()} từ</span>
                </div>
                <div class="meta-actions">
                    <button class="meta-btn" id="btn-share-article" title="Sao chép liên kết chia sẻ">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        <span>Chia sẻ</span>
                    </button>
                    <button class="meta-btn" id="btn-print-article" title="In hoặc lưu PDF">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        <span>In / PDF</span>
                    </button>
                    <button class="meta-btn" id="btn-zen-mode" title="Chế độ đọc tập trung (Phím: Z)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                        <span>Zen Mode</span>
                    </button>
                </div>
            `;
            mainH1.insertAdjacentElement('afterend', metaBar);

            metaBar.querySelector('#btn-share-article')?.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href);
                showToast('✓ Đã sao chép liên kết bài viết vào clipboard!');
            });

            metaBar.querySelector('#btn-print-article')?.addEventListener('click', () => {
                window.print();
            });

            metaBar.querySelector('#btn-zen-mode')?.addEventListener('click', () => {
                document.body.classList.toggle('focus-mode');
                if (document.body.classList.contains('focus-mode')) {
                    showToast('Chế độ tập trung (Zen Mode) đã kích hoạt! Nhấn Z để thoát.');
                } else {
                    showToast('Đã thoát chế độ tập trung.');
                }
            });
        }

        // Image Lightbox Modal
        const lightbox = document.createElement('div');
        lightbox.id = 'image-lightbox';
        lightbox.innerHTML = '<img src="" alt="Phóng to hình ảnh">';
        document.body.appendChild(lightbox);
        const lightboxImg = lightbox.querySelector('img');

        mdBody.querySelectorAll('img').forEach(img => {
            img.title = img.title || 'Nhấn để phóng to hình ảnh';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Hình ảnh';
                lightbox.classList.add('show');
            });
        });

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('show');
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
    // 6. READING PROGRESS BAR & CIRCULAR BACK TO TOP
    // ==========================================================================
    const progContainer = document.createElement('div');
    progContainer.id = 'reading-progress-container';
    const progBar = document.createElement('div');
    progBar.id = 'reading-progress';
    progContainer.appendChild(progBar);
    document.body.appendChild(progContainer);

    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.title = 'Cuộn lên đầu trang (Phím tắt: Alt+↑)';
    const radius = 20;
    const circumference = 2 * Math.PI * radius; // ~125.66

    backToTopBtn.innerHTML = `
        <svg class="progress-ring" width="48" height="48">
            <circle class="progress-ring__circle-bg" cx="24" cy="24" r="${radius}"></circle>
            <circle class="progress-ring__circle" cx="24" cy="24" r="${radius}" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"></circle>
        </svg>
        <div class="back-to-top-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </div>
    `;
    document.body.appendChild(backToTopBtn);

    const circleProgress = backToTopBtn.querySelector('.progress-ring__circle');

    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop' in h ? h.scrollTop : b.scrollTop;
        const sh = 'scrollHeight' in h ? h.scrollHeight : b.scrollHeight;
        const scrollMax = sh - h.clientHeight;
        const percent = scrollMax > 0 ? (st / scrollMax) * 100 : 0;

        progBar.style.width = Math.min(100, Math.max(0, percent)) + '%';

        if (circleProgress) {
            const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;
            circleProgress.style.strokeDashoffset = offset;
        }

        if (window.scrollY > 350) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ==========================================================================
    // 7. SPOTLIGHT SEARCH MODAL (Ctrl + K)
    // ==========================================================================
    const searchModal = document.createElement('div');
    searchModal.id = 'spotlight-modal';
    searchModal.innerHTML = `
        <div class="spotlight-card">
            <div class="spotlight-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" class="spotlight-input" placeholder="Tìm kiếm kiến thức, thuật ngữ (VIPT, SpinLock, Malloc...)" autofocus>
                <div class="spotlight-esc" id="spotlight-close-btn" style="cursor:pointer;">ESC</div>
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

    searchModal.querySelector('#spotlight-close-btn')?.addEventListener('click', closeSpotlight);

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
    // 8. KEYBOARD SHORTCUTS CHEATSHEET MODAL & HELPER BUTTON
    // ==========================================================================
    const kbdBtn = document.createElement('button');
    kbdBtn.id = 'kbd-shortcuts-btn';
    kbdBtn.title = 'Phím tắt tra cứu (Phím: ?)';
    kbdBtn.innerHTML = '?';
    document.body.appendChild(kbdBtn);

    const kbdModal = document.createElement('div');
    kbdModal.id = 'kbd-modal';
    kbdModal.innerHTML = `
        <div class="kbd-modal-card">
            <div class="kbd-modal-header">
                <div style="display:flex;align-items:center;gap:8px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="8" y1="12" x2="8.01" y2="12"></line><line x1="12" y1="12" x2="12.01" y2="12"></line><line x1="16" y1="12" x2="16.01" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>
                    Phím tắt thao tác nhanh
                </div>
                <div class="spotlight-esc" style="cursor:pointer;" id="kbd-close-btn">ESC</div>
            </div>
            <div class="kbd-grid">
                <div class="kbd-row">
                    <span>Tìm kiếm Spotlight toàn trang</span>
                    <div class="kbd-key-group"><kbd>Ctrl</kbd><kbd>K</kbd></div>
                </div>
                <div class="kbd-row">
                    <span>Chuyển đổi giao diện Sáng / Tối</span>
                    <div class="kbd-key-group"><kbd>T</kbd></div>
                </div>
                <div class="kbd-row">
                    <span>Bật / Tắt chế độ đọc tập trung (Zen Mode)</span>
                    <div class="kbd-key-group"><kbd>Z</kbd></div>
                </div>
                <div class="kbd-row">
                    <span>Mở bảng danh sách phím tắt</span>
                    <div class="kbd-key-group"><kbd>?</kbd></div>
                </div>
                <div class="kbd-row">
                    <span>Cuộn lên đầu trang tức thì</span>
                    <div class="kbd-key-group"><kbd>Alt</kbd><kbd>↑</kbd></div>
                </div>
                <div class="kbd-row">
                    <span>Đóng mọi popup / modal đang mở</span>
                    <div class="kbd-key-group"><kbd>Esc</kbd></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(kbdModal);

    const openKbdModal = () => kbdModal.classList.add('show');
    const closeKbdModal = () => kbdModal.classList.remove('show');

    kbdBtn.onclick = openKbdModal;
    kbdModal.querySelector('#kbd-close-btn')?.addEventListener('click', closeKbdModal);
    kbdModal.onclick = (e) => {
        if (e.target === kbdModal) closeKbdModal();
    };

    // ==========================================================================
    // 9. INTERACTIVE RIPPLES & SCROLL REVEAL
    // ==========================================================================
    function createRipple(e) {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-wave';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    document.querySelectorAll('.meta-btn, .post-nav-card, .theme-toggle, #back-to-top, #kbd-shortcuts-btn, .copy-btn-floating').forEach(btn => {
        btn.classList.add('has-ripple');
        btn.addEventListener('pointerdown', createRipple);
    });

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -30px 0px', threshold: 0.08 });

        document.querySelectorAll('.markdown-body h2, .markdown-body h3, .markdown-body pre, .markdown-body table, .callout, .post-navigation').forEach(el => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });
    }

    // ==========================================================================
    // 10. GLOBAL KEYBOARD SHORTCUTS
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

        // Escape closes any open modal
        if (e.key === 'Escape') {
            closeSpotlight();
            closeKbdModal();
            lightbox.classList.remove('show');
            const codeBackdrop = document.querySelector('.code-expand-backdrop');
            if (codeBackdrop && codeBackdrop.style.display !== 'none') {
                document.querySelectorAll('.markdown-body pre.code-expanded').forEach(p => p.classList.remove('code-expanded'));
                codeBackdrop.style.display = 'none';
            }
            return;
        }

        // Alt + ArrowUp to scroll to top
        if (e.altKey && e.key === 'ArrowUp') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // '?' to toggle Shortcuts Modal
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            e.preventDefault();
            if (kbdModal.classList.contains('show')) {
                closeKbdModal();
            } else {
                openKbdModal();
            }
            return;
        }
        
        // 'T' to toggle theme
        if (e.key.toLowerCase() === 't') {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme, true);
        }

        // 'Z' to toggle Zen Mode
        if (e.key.toLowerCase() === 'z') {
            document.body.classList.toggle('focus-mode');
            if (document.body.classList.contains('focus-mode')) {
                showToast('Chế độ tập trung (Zen Mode) đã kích hoạt! Nhấn Z để thoát.');
            } else {
                showToast('Đã thoát chế độ tập trung.');
            }
        }
    });
});

// Remove preload to enable smooth transitions after initial paint
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.documentElement.classList.remove('preload');
    }, 50);
});