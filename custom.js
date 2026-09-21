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

    const toggleThemeWithTransition = (e) => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTheme(nextTheme, true);
            return;
        }

        const rect = themeBtn.getBoundingClientRect();
        const x = e && e.clientX ? e.clientX : (rect.left + rect.width / 2);
        const y = e && e.clientY ? e.clientY : (rect.top + rect.height / 2);
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            setTheme(nextTheme, false);
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`
                    ]
                },
                {
                    duration: 480,
                    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
            themeBtn.classList.remove('theme-animating');
            void themeBtn.offsetWidth;
            themeBtn.classList.add('theme-animating');
            showToast(nextTheme === 'dark' ? '🌙 Đã chuyển sang giao diện Tối' : '☀️ Đã chuyển sang giao diện Sáng');
        });
    };

    themeBtn.onclick = toggleThemeWithTransition;

    
    // ==========================================================================
    // 3. GLOBAL ARTICLES REGISTRY & ULTRA-SMOOTH SPA NAVIGATION
    // ==========================================================================
    const articlesList = [
        { url: "index.html", title: "Cấu trúc Cache, Virtual Memory & Malloc" },
        { url: "mmu-tlb-page-table.html", title: "Phần cứng MMU, TLB & Page Table" },
        { url: "mesi-protocol.html", title: "Giao thức Đồng bộ MESI" },
        { url: "spinlock-vs-mutex.html", title: "Tối ưu Đồng bộ: SpinLock vs Mutex" },
        { url: "string-vs-string-view.html", title: "Quản lý Bộ nhớ: std::string_view" }
    ];

    // In-memory cache for ultra-fast instant page switching (0ms latency)
    const pageCache = new Map();

    // Top Loading Progress Bar (YouTube / Linear style)
    let topProgressBar = document.getElementById('top-loading-bar');
    if (!topProgressBar) {
        topProgressBar = document.createElement('div');
        topProgressBar.id = 'top-loading-bar';
        document.body.appendChild(topProgressBar);
    }

    const startLoadingBar = () => {
        topProgressBar.style.transition = 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
        topProgressBar.style.opacity = '1';
        topProgressBar.style.width = '35%';
        setTimeout(() => {
            if (topProgressBar.style.opacity === '1') topProgressBar.style.width = '75%';
        }, 120);
    };

    const finishLoadingBar = () => {
        topProgressBar.style.width = '100%';
        setTimeout(() => {
            topProgressBar.style.opacity = '0';
            setTimeout(() => {
                topProgressBar.style.transition = 'none';
                topProgressBar.style.width = '0%';
            }, 250);
        }, 200);
    };

    // Dedicated Fullscreen Code Modal Portal (Persistent across navigation)
    let codeModal = document.getElementById('code-expand-modal');
    if (!codeModal) {
        codeModal = document.createElement('div');
        codeModal.id = 'code-expand-modal';
        codeModal.innerHTML = `
            <div class="code-modal-card">
                <div class="mac-window-header">
                    <div class="mac-dots">
                        <div class="mac-dot red code-modal-close" title="Đóng (Esc)"></div>
                        <div class="mac-dot yellow code-modal-close" title="Thu nhỏ (Esc)"></div>
                        <div class="mac-dot green" title="Đang ở chế độ toàn màn hình"></div>
                    </div>
                    <div class="code-lang-label" id="modal-lang-label">CODE</div>
                    <div style="display:flex;align-items:center;gap:6px;">
                        <button class="code-wrap-toggle" id="modal-wrap-btn" title="Tự động xuống dòng">Wrap</button>
                        <button class="copy-btn-floating" id="modal-copy-btn">Copy</button>
                        <button class="code-modal-close-btn" id="modal-close-btn" title="Đóng">✕ Đóng (Esc)</button>
                    </div>
                </div>
                <div class="code-modal-body">
                    <pre><code id="modal-code-content"></code></pre>
                </div>
            </div>
        `;
        document.body.appendChild(codeModal);
    }

    const modalCodeContent = codeModal.querySelector('#modal-code-content');
    const modalLangLabel = codeModal.querySelector('#modal-lang-label');
    const modalWrapBtn = codeModal.querySelector('#modal-wrap-btn');
    const modalCopyBtn = codeModal.querySelector('#modal-copy-btn');
    const modalCloseBtn = codeModal.querySelector('#modal-close-btn');
    const modalCard = codeModal.querySelector('.code-modal-card');

    const closeCodeModal = () => {
        codeModal.classList.remove('show');
        document.body.classList.remove('code-modal-open');
    };

    modalCloseBtn.onclick = closeCodeModal;
    codeModal.querySelectorAll('.code-modal-close').forEach(dot => dot.onclick = closeCodeModal);
    codeModal.onclick = (e) => {
        if (e.target === codeModal) closeCodeModal();
    };

    if (modalWrapBtn) {
        modalWrapBtn.onclick = (e) => {
            e.stopPropagation();
            modalCard.classList.toggle('code-wrapped');
            modalWrapBtn.classList.toggle('active');
        };
    }

    if (modalCopyBtn) {
        modalCopyBtn.onclick = (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(modalCodeContent.innerText);
            const orig = modalCopyBtn.innerHTML;
            modalCopyBtn.innerHTML = '<span style="color:#10b981;font-weight:600;">✓ Copied</span>';
            showToast('✓ Đã sao chép mã nguồn vào bộ nhớ tạm!');
            setTimeout(() => modalCopyBtn.innerHTML = orig, 1800);
        };
    }

    // ==========================================================================
    // 4. ARTICLE RENDERER & INTERACTIVE ENHANCER
    // ==========================================================================
    const renderArticle = (markdownText, targetPath = null) => {
        const mdBody = document.getElementById('markdown-body');
        if (!mdBody || !markdownText || typeof marked === 'undefined') return;

        const currentPath = targetPath || window.location.pathname.split('/').pop() || 'index.html';

        const renderer = new marked.Renderer();
        const originalCode = renderer.code;
        renderer.code = function(code, language, isEscaped) {
            const rendered = originalCode.call(this, code, language, isEscaped);
            const langClean = (language || 'text').toLowerCase();
            return rendered.replace(
                '<pre>', 
                '<pre><div class="mac-window-header"><div class="mac-dots"><div class="mac-dot red" title="Đóng"></div><div class="mac-dot yellow" title="Thu nhỏ"></div><div class="mac-dot green" title="Phóng to đoạn mã"></div></div><div class="code-lang-label" data-lang="' + langClean + '">' + (language || 'text') + '</div><div style="display:flex;align-items:center;"><button class="code-wrap-toggle" title="Tự động xuống dòng">Wrap</button><button class="code-expand-toggle" title="Phóng to đoạn mã"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg> Expand</button><button class="copy-btn-floating">Copy</button></div></div>'
            );
        };
        
        marked.setOptions({
            renderer: renderer,
            highlight: function(code, lang) {
                if (typeof hljs !== 'undefined') {
                    if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
                    return hljs.highlightAuto(code).value;
                }
                return code;
            },
            breaks: true
        });

        mdBody.innerHTML = marked.parse(markdownText);

        // Interactive Click-to-Copy for Inline Code
        mdBody.querySelectorAll('p code, li code').forEach(codeEl => {
            if (codeEl.closest('pre')) return;
            codeEl.classList.add('interactive-inline-code');
            codeEl.setAttribute('title', 'Nhấn để chép mã');
            
            codeEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = codeEl.innerText.trim();
                navigator.clipboard.writeText(text);
                codeEl.classList.add('code-copied');
                showToast(`✓ Đã sao chép: <code>${text.length > 25 ? text.substring(0, 22) + '...' : text}</code>`, 1600);
                setTimeout(() => codeEl.classList.remove('code-copied'), 1200);
            });
        });

        // Table Responsive Scroll Wrapper
        mdBody.querySelectorAll('table').forEach(table => {
            if (table.parentElement.classList.contains('table-inner')) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'table-scroll-wrapper';
            const inner = document.createElement('div');
            inner.className = 'table-inner';
            table.parentNode.insertBefore(wrapper, table);
            inner.appendChild(table);
            wrapper.appendChild(inner);
        });

        // MathJax Typeset Trigger
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetPromise([mdBody]).catch(err => console.error('MathJax error:', err.message));
        }

        // Code Block Actions (Copy, Word Wrap & Fullscreen Expand)
        mdBody.querySelectorAll('pre').forEach(pre => {
            const copyBtn = pre.querySelector('.copy-btn-floating');
            const wrapBtn = pre.querySelector('.code-wrap-toggle');
            const expandBtn = pre.querySelector('.code-expand-toggle');
            const greenDot = pre.querySelector('.mac-dot.green');
            const langLabel = pre.querySelector('.code-lang-label');
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

            const openExpand = (e) => {
                if (e) e.stopPropagation();
                if (!codeEl) return;
                
                modalCodeContent.innerHTML = codeEl.innerHTML;
                modalCodeContent.className = codeEl.className;
                if (langLabel) {
                    modalLangLabel.innerText = langLabel.innerText;
                    modalLangLabel.setAttribute('data-lang', langLabel.getAttribute('data-lang') || '');
                }
                
                if (pre.classList.contains('code-wrapped')) {
                    modalCard.classList.add('code-wrapped');
                    if (modalWrapBtn) modalWrapBtn.classList.add('active');
                } else {
                    modalCard.classList.remove('code-wrapped');
                    if (modalWrapBtn) modalWrapBtn.classList.remove('active');
                }

                codeModal.classList.add('show');
                document.body.classList.add('code-modal-open');
                showToast('Đã mở toàn màn hình. Nhấn Esc để đóng.');
            };

            if (expandBtn) expandBtn.onclick = openExpand;
            if (greenDot) {
                greenDot.style.cursor = 'pointer';
                greenDot.title = 'Phóng to toàn màn hình (Expand)';
                greenDot.onclick = openExpand;
            }
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
                    tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path><circle cx="12" cy="4"></circle></svg>',
                    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
                    important: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
                    caution: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
                };
                const callout = document.createElement('div');
                callout.className = `callout callout-${type}`;
                callout.innerHTML = `
                    <div class="callout-title">${icons[type] || icons.note} <span>${titles[type] || type.toUpperCase()}</span></div>
                    <div class="callout-content"><p>${rest}</div>
                `;
                bq.parentNode.replaceChild(callout, bq);
            }
        });

        // Mouse-Tracking Spotlight Radial Glow
        const applySpotlight = (el) => {
            el.classList.add('spotlight-glow-card');
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                el.style.setProperty('--spotlight-x', `${x}px`);
                el.style.setProperty('--spotlight-y', `${y}px`);
            });
        };
        mdBody.querySelectorAll('pre, .callout').forEach(applySpotlight);

        // Reading Time Pill & Share Button
        const articleText = mdBody.innerText || '';
        const words = articleText.trim().split(/\s+/).filter(w => w.length > 0).length;
        const readingMinutes = Math.max(1, Math.ceil(words / 220));

        let metaBar = mdBody.querySelector('.article-meta-bar');
        if (!metaBar) {
            metaBar = document.createElement('div');
            metaBar.className = 'article-meta-bar';
            const firstH1 = mdBody.querySelector('h1');
            if (firstH1 && firstH1.nextSibling) {
                firstH1.parentNode.insertBefore(metaBar, firstH1.nextSibling);
            } else {
                mdBody.prepend(metaBar);
            }
        }
        metaBar.innerHTML = `
            <div class="reading-time-pill" title="Ước tính thời gian đọc dựa trên ${words.toLocaleString()} từ">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>Khoảng <strong>${readingMinutes} phút đọc</strong> (${words.toLocaleString()} từ)</span>
            </div>
            <div class="meta-actions">
                <button class="share-article-btn meta-btn" title="Sao chép liên kết bài viết">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span>Chia sẻ</span>
                </button>
            </div>
        `;

        const shareBtn = metaBar.querySelector('.share-article-btn');
        if (shareBtn) {
            shareBtn.onclick = () => {
                navigator.clipboard.writeText(window.location.href);
                shareBtn.classList.add('copied');
                shareBtn.innerHTML = `
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Đã chép link!</span>
                `;
                showToast('✓ Đã sao chép liên kết bài viết!');
                setTimeout(() => {
                    shareBtn.classList.remove('copied');
                    shareBtn.innerHTML = `
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        <span>Chia sẻ</span>
                    `;
                }, 2000);
            };
        }

        // Heading Anchor Links & Pulse Highlight
        const triggerTargetPulse = (targetEl) => {
            if (!targetEl) return;
            targetEl.classList.remove('heading-target-pulse');
            void targetEl.offsetWidth;
            targetEl.classList.add('heading-target-pulse');
            setTimeout(() => targetEl.classList.remove('heading-target-pulse'), 1900);
        };

        const headings = mdBody.querySelectorAll('h2, h3');
        
        // Clean up previous right sidebar
        const existingRightSidebar = document.getElementById('right-sidebar');
        if (existingRightSidebar) existingRightSidebar.remove();

        if (headings.length > 0) {
            const rightSidebar = document.createElement('div');
            rightSidebar.id = 'right-sidebar';
            
            const tocContainer = document.createElement('div');
            tocContainer.id = 'toc-container';
            
            const tocTitleWrapper = document.createElement('div');
            tocTitleWrapper.className = 'toc-title-wrapper';

            const tocTitle = document.createElement('div');
            tocTitle.className = 'toc-title';
            tocTitle.innerText = 'MỤC LỤC';

            const tocProgressPill = document.createElement('span');
            tocProgressPill.className = 'toc-progress-pill';
            tocProgressPill.innerText = '0%';

            tocTitleWrapper.appendChild(tocTitle);
            tocTitleWrapper.appendChild(tocProgressPill);
            tocContainer.appendChild(tocTitleWrapper);

            const tocGlider = document.createElement('div');
            tocGlider.className = 'toc-glider';
            tocContainer.appendChild(tocGlider);

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
                    triggerTargetPulse(h);
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
                    history.pushState(null, null, '#' + h.id);
                    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + h.id);
                    h.scrollIntoView({ behavior: 'smooth' });
                    triggerTargetPulse(h);
                    showToast(`✓ Đã chép link mục: <strong>${h.innerText.replace(/^#+\s*/, '').trim()}</strong>`);
                };

                h.appendChild(anchor);
            });

            // ScrollSpy for TOC & Reading Progress
            const tocItems = tocContainer.querySelectorAll('.toc-item');
            const scrollSpy = () => {
                const scrollPos = window.scrollY || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const rawPercent = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollPos / docHeight) * 100))) : 0;
                
                if (tocProgressPill) {
                    tocProgressPill.innerText = `${rawPercent}%`;
                }

                let currentId = '';
                for (let i = 0; i < headings.length; i++) {
                    const rect = headings[i].getBoundingClientRect();
                    if (rect.top <= 140) {
                        currentId = headings[i].id;
                    } else {
                        break;
                    }
                }

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

                const activeItem = tocContainer.querySelector('.toc-item.active');
                if (activeItem && tocGlider) {
                    tocGlider.classList.add('visible');
                    tocGlider.style.transform = `translateY(${activeItem.offsetTop}px)`;
                    tocGlider.style.height = `${activeItem.offsetHeight}px`;
                } else if (tocGlider) {
                    tocGlider.classList.remove('visible');
                }

                const stickySection = document.getElementById('sticky-active-section');
                if (stickySection && currentId) {
                    const targetH = document.getElementById(currentId);
                    if (targetH) {
                        stickySection.innerText = targetH.innerText.replace(/^#+\s*/, '').trim();
                    }
                }
            };
            
            if (window._articleScrollSpy) window.removeEventListener('scroll', window._articleScrollSpy);
            window._articleScrollSpy = scrollSpy;
            window.addEventListener('scroll', scrollSpy, { passive: true });
            setTimeout(scrollSpy, 250);
        }

        // Sticky Floating Topbar & Font Size Controls
        const existingTopbar = document.querySelector('.sticky-topbar');
        if (existingTopbar) existingTopbar.remove();

        const activeNav = document.querySelector(`.nav-item[href="${currentPath}"]`);
        let categoryName = 'Tài liệu';
        if (activeNav) {
            let prev = activeNav.previousElementSibling;
            while (prev) {
                if (prev.classList.contains('category-title')) {
                    categoryName = prev.innerText;
                    break;
                }
                prev = prev.previousElementSibling;
            }
        }
        const articleTitle = mdBody.querySelector('h1')?.innerText || document.title.split('|')[0].trim();

        const stickyTopbar = document.createElement('div');
        stickyTopbar.className = 'sticky-topbar';
        stickyTopbar.innerHTML = `
            <div class="sticky-breadcrumb">
                <span>${categoryName}</span>
                <span class="crumb-sep">/</span>
                <span class="crumb-title" id="sticky-active-section">${articleTitle}</span>
            </div>
            <div class="sticky-actions">
                <div class="font-size-group" title="Chỉnh cỡ chữ đọc bài (A- / A / A+)">
                    <button class="font-size-btn" data-size="sm">A-</button>
                    <button class="font-size-btn" data-size="md">A</button>
                    <button class="font-size-btn" data-size="lg">A+</button>
                </div>
            </div>
        `;
        document.body.appendChild(stickyTopbar);

        const savedFontSize = localStorage.getItem('doc-font-size') || 'md';
        const setFontSize = (size) => {
            document.body.setAttribute('data-font-size', size);
            localStorage.setItem('doc-font-size', size);
            stickyTopbar.querySelectorAll('.font-size-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-size') === size);
            });
        };
        setFontSize(savedFontSize);

        stickyTopbar.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.onclick = () => setFontSize(btn.getAttribute('data-size'));
        });

        const updateTopbarVisibility = () => {
            const scrollPos = window.scrollY || document.documentElement.scrollTop;
            if (scrollPos > 180) {
                stickyTopbar.classList.add('visible');
            } else {
                stickyTopbar.classList.remove('visible');
            }
        };
        if (window._topbarScrollSpy) window.removeEventListener('scroll', window._topbarScrollSpy);
        window._topbarScrollSpy = updateTopbarVisibility;
        window.addEventListener('scroll', updateTopbarVisibility, { passive: true });
        updateTopbarVisibility();

        // Post Navigation (Previous / Next Article Cards)
        const existingPostNav = document.querySelector('.post-navigation');
        if (existingPostNav) existingPostNav.remove();

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
                prevCard.onclick = (e) => {
                    e.preventDefault();
                    navigateSmoothly(prevArticle.url);
                };
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
                nextCard.onclick = (e) => {
                    e.preventDefault();
                    navigateSmoothly(nextArticle.url);
                };
                navContainer.appendChild(nextCard);
            }

            const articleContainer = document.querySelector('.article-container');
            if (articleContainer) {
                articleContainer.appendChild(navContainer);
            }
        }

        // Intercept internal article links in markdown body
        mdBody.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && href.endsWith('.html')) {
                a.onclick = (e) => {
                    e.preventDefault();
                    navigateSmoothly(href);
                };
            }
        });
    };

    // ==========================================================================
    // 5. SEAMLESS SPA NAVIGATION ENGINE WITH VIEW TRANSITIONS
    // ==========================================================================
    const updateActiveSidebar = (cleanUrl) => {
        document.querySelectorAll('#sidebar .nav-item').forEach(item => {
            const href = item.getAttribute('href');
            const isActive = href === cleanUrl;
            item.classList.toggle('active', isActive);
        });
    };

    const navigateSmoothly = async (url, push = true) => {
        if (!url) return;
        const cleanUrl = url.split('#')[0];
        const hash = url.includes('#') ? url.split('#')[1] : null;
        const currentClean = window.location.pathname.split('/').pop() || 'index.html';

        if (cleanUrl === currentClean || cleanUrl === '') {
            if (hash) {
                const el = document.getElementById(hash);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    const targetPulse = mdBody?.querySelector('#' + hash);
                    if (targetPulse) {
                        targetPulse.classList.remove('heading-target-pulse');
                        void targetPulse.offsetWidth;
                        targetPulse.classList.add('heading-target-pulse');
                        setTimeout(() => targetPulse.classList.remove('heading-target-pulse'), 1900);
                    }
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        startLoadingBar();

        try {
            let html = pageCache.get(cleanUrl);
            if (!html) {
                const resp = await fetch(cleanUrl);
                if (!resp.ok) throw new Error('Failed to load page');
                html = await resp.text();
                pageCache.set(cleanUrl, html);
            }

            const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
            const newTitle = titleMatch ? titleMatch[1] : document.title;

            const mdMatch = html.match(/const rawMarkdown = `([\s\S]*?)`;/);
            const newRawMarkdown = mdMatch ? mdMatch[1] : '';

            const articleContainer = document.querySelector('.article-container');

            const applyPageUpdate = () => {
                document.title = newTitle;
                window.rawMarkdown = newRawMarkdown;
                renderArticle(newRawMarkdown, cleanUrl);
                updateActiveSidebar(cleanUrl);

                if (hash) {
                    setTimeout(() => {
                        const el = document.getElementById(hash);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            };

            if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                const transition = document.startViewTransition(() => {
                    applyPageUpdate();
                });
                await transition.finished;
            } else {
                if (articleContainer) articleContainer.classList.add('page-transition-exit');
                await new Promise(r => setTimeout(r, 180));
                applyPageUpdate();
                if (articleContainer) {
                    articleContainer.classList.remove('page-transition-exit');
                    articleContainer.classList.add('page-transition-enter');
                    setTimeout(() => articleContainer.classList.remove('page-transition-enter'), 350);
                }
            }

            if (push) {
                window.history.pushState({ path: cleanUrl }, '', url);
            }

            finishLoadingBar();
        } catch (err) {
            console.error('SPA navigation error, falling back:', err);
            finishLoadingBar();
            window.location.href = url;
        }
    };

    // Initial render of article content
    if (typeof rawMarkdown !== 'undefined') {
        renderArticle(rawMarkdown);
    }

    // Intercept sidebar links for seamless transition
    document.querySelectorAll('#sidebar .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                e.preventDefault();
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
                navigateSmoothly(href);
            }
        });
    });

    // Browser Back / Forward History Navigation
    window.addEventListener('popstate', () => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        navigateSmoothly(path, false);
    });


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
        <div class="back-to-top-percent">0%</div>
    `;
    document.body.appendChild(backToTopBtn);

    const circleProgress = backToTopBtn.querySelector('.progress-ring__circle');
    const backToTopPercent = backToTopBtn.querySelector('.back-to-top-percent');

    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop' in h ? h.scrollTop : b.scrollTop;
        const sh = 'scrollHeight' in h ? h.scrollHeight : b.scrollHeight;
        const scrollMax = sh - h.clientHeight;
        const percent = scrollMax > 0 ? (st / scrollMax) * 100 : 0;
        const roundPercent = Math.round(percent) + '%';

        progBar.style.width = Math.min(100, Math.max(0, percent)) + '%';

        if (circleProgress) {
            const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;
            circleProgress.style.strokeDashoffset = offset;
        }

        if (backToTopPercent) {
            backToTopPercent.innerText = roundPercent;
        }

        if (tocProgressPill) {
            tocProgressPill.innerText = roundPercent;
        }

        const stickyTop = document.querySelector('.sticky-topbar');
        if (stickyTop) {
            if (window.scrollY > 240) {
                stickyTop.classList.add('visible');
            } else {
                stickyTop.classList.remove('visible');
            }
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
            <div class="spotlight-quick-tags">
                <span class="spotlight-tag-label">Gợi ý:</span>
                <button class="spotlight-tag-pill" data-query="Cache Line">Cache Line</button>
                <button class="spotlight-tag-pill" data-query="Virtual Memory">Virtual Memory</button>
                <button class="spotlight-tag-pill" data-query="Page Table">Page Table</button>
                <button class="spotlight-tag-pill" data-query="TLB">TLB</button>
                <button class="spotlight-tag-pill" data-query="SpinLock">SpinLock</button>
                <button class="spotlight-tag-pill" data-query="Mutex">Mutex</button>
                <button class="spotlight-tag-pill" data-query="MESI">MESI</button>
                <button class="spotlight-tag-pill" data-query="string_view">string_view</button>
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

    searchModal.querySelectorAll('.spotlight-tag-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            const query = pill.getAttribute('data-query');
            const spotInput = searchModal.querySelector('.spotlight-input');
            if (spotInput) {
                spotInput.value = query;
                spotInput.dispatchEvent(new Event('input'));
                spotInput.focus();
            }
        });
    });

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

    document.querySelectorAll('.meta-btn, .post-nav-card, .theme-toggle, #back-to-top, #kbd-shortcuts-btn, .copy-btn-floating, .sticky-btn, .font-size-btn').forEach(btn => {
        btn.classList.add('has-ripple');
        btn.addEventListener('pointerdown', createRipple);
    });

    // Mouse-Tracking Spotlight Glow on Cards and Containers
    const attachSpotlightGlow = () => {
        document.querySelectorAll('.markdown-body pre, .post-nav-card, .callout, .spotlight-card').forEach(el => {
            el.classList.add('spotlight-card-hover');
            el.addEventListener('pointermove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                el.style.setProperty('--mouse-x', `${x}px`);
                el.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    };
    attachSpotlightGlow();

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
                    closeSpotlight(); navigateSmoothly(items[selectedIndex].getAttribute('href'));
                }
            }
            return;
        }

        // Escape closes any open modal
        if (e.key === 'Escape') {
            closeSpotlight();
            closeKbdModal();
            lightbox.classList.remove('show');
            const codeModal = document.getElementById('code-expand-modal');
            if (codeModal && codeModal.classList.contains('show')) {
                codeModal.classList.remove('show');
                document.body.classList.remove('code-modal-open');
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
        
        // 'T' to toggle theme with Circular View Transition
        if (e.key.toLowerCase() === 't') {
            toggleThemeWithTransition();
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