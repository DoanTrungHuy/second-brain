import os

js = """
// custom.js - Minimalist & Elegant Version
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const sidebarBrand = document.querySelector('.brand');
    const mobileHeader = document.querySelector('.mobile-header');
    
    const themeBtnHtml = `
        <button class="theme-toggle" id="theme-toggle" title="Toggle Dark Mode" style="background:none;border:none;cursor:pointer;color:inherit;opacity:0.7;transition:opacity 0.2s;">
            <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg id="sun-icon" style="display:none;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        </button>
    `;
    
    if (sidebarBrand) {
        const toggleWrapper = document.createElement('div');
        toggleWrapper.style.marginLeft = 'auto';
        toggleWrapper.innerHTML = themeBtnHtml;
        sidebarBrand.appendChild(toggleWrapper);
    }
    
    if (mobileHeader) {
        const mhWrapper = document.createElement('div');
        mhWrapper.innerHTML = themeBtnHtml.replace('id="theme-toggle"', 'id="theme-toggle-mobile"').replace('id="moon-icon"', 'id="moon-icon-m"').replace('id="sun-icon"', 'id="sun-icon-m"');
        mobileHeader.insertBefore(mhWrapper, mobileHeader.querySelector('.menu-btn'));
    }

    const currentTheme = localStorage.getItem('theme') || 'light';
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const moon = document.getElementById('moon-icon');
        const sun = document.getElementById('sun-icon');
        const moonM = document.getElementById('moon-icon-m');
        const sunM = document.getElementById('sun-icon-m');
        
        if (theme === 'dark') {
            if(moon) moon.style.display = 'none';
            if(sun) sun.style.display = 'block';
            if(moonM) moonM.style.display = 'none';
            if(sunM) sunM.style.display = 'block';
            let hljsLink = document.getElementById('hljs-theme');
            if(!hljsLink) {
                hljsLink = document.createElement('link');
                hljsLink.id = 'hljs-theme';
                hljsLink.rel = 'stylesheet';
                document.head.appendChild(hljsLink);
            }
            hljsLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css';
        } else {
            if(moon) moon.style.display = 'block';
            if(sun) sun.style.display = 'none';
            if(moonM) moonM.style.display = 'block';
            if(sunM) sunM.style.display = 'none';
            let hljsLink = document.getElementById('hljs-theme');
            if(hljsLink) hljsLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css';
        }
    };
    
    setTheme(currentTheme);
    
    document.body.addEventListener('click', (e) => {
        let target = e.target;
        while(target && target.id !== 'theme-toggle' && target.id !== 'theme-toggle-mobile') {
            target = target.parentElement;
        }
        if (target) {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        }
    });

    const mdBody = document.getElementById('markdown-body');
    if (mdBody) {
        if(typeof rawMarkdown !== 'undefined' && typeof marked !== 'undefined') {
            const renderer = new marked.Renderer();
            const originalCode = renderer.code;
            renderer.code = function(code, language, isEscaped) {
                const rendered = originalCode.call(this, code, language, isEscaped);
                return rendered.replace('<pre>', '<pre><div class="mac-window-header"><div class="mac-dots"><div class="mac-dot red"></div><div class="mac-dot yellow"></div><div class="mac-dot green"></div></div><div class="code-lang-label">' + (language || 'text') + '</div><button class="copy-btn-floating">Copy</button></div>');
            };
            
            marked.setOptions({
                renderer: renderer,
                highlight: function(code, lang) {
                    if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
                    return hljs.highlightAuto(code).value;
                }
            });
            
            mdBody.innerHTML = marked.parse(rawMarkdown);
        }

        // Reading Time Meta
        const textContent = mdBody.innerText;
        const wordCount = textContent.split(/\\s+/).filter(w => w.length > 0).length;
        const readingTime = Math.ceil(wordCount / 200);
        
        const metaDiv = document.createElement('div');
        metaDiv.className = 'reading-meta';
        metaDiv.innerText = `⏱️ ${readingTime} phút đọc - ${wordCount} từ`;
        mdBody.insertBefore(metaDiv, mdBody.firstChild);

        // Zen Mode
        const focusBtn = document.createElement('button');
        focusBtn.style.cssText = 'background:none; border:1px solid var(--border); color:var(--text-muted); border-radius:15px; padding:2px 12px; font-size:0.75rem; cursor:pointer; margin-left:auto; transition:all 0.2s; float:right; display:flex; align-items:center; gap:5px;';
        focusBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg> Zen Mode';
        focusBtn.onclick = () => {
            document.body.classList.toggle('focus-mode');
            if(document.body.classList.contains('focus-mode')) {
                focusBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg> Exit Zen';
                focusBtn.style.background = 'var(--primary)';
                focusBtn.style.color = '#fff';
                focusBtn.style.borderColor = 'var(--primary)';
            } else {
                focusBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg> Zen Mode';
                focusBtn.style.background = 'none';
                focusBtn.style.color = 'var(--text-muted)';
                focusBtn.style.borderColor = 'var(--border)';
            }
        };
        metaDiv.appendChild(focusBtn);

        // Progress bar
        const progressContainer = document.createElement('div');
        progressContainer.id = 'reading-progress-container';
        progressContainer.innerHTML = '<div id="reading-progress-bar"></div>';
        document.body.appendChild(progressContainer);
        const progressBar = document.getElementById('reading-progress-bar');
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.addEventListener('scroll', () => {
                const scrolled = (mainContent.scrollTop / (mainContent.scrollHeight - mainContent.clientHeight)) * 100;
                progressBar.style.width = scrolled + '%';
            });
        }

        // Copy Code Buttons
        const blocks = document.querySelectorAll('.markdown-body pre');
        blocks.forEach(pre => {
            const btn = pre.querySelector('.copy-btn-floating');
            const code = pre.querySelector('code');
            if (btn && code) {
                const doCopy = () => {
                    navigator.clipboard.writeText(code.innerText);
                    btn.innerText = 'Copied!';
                    setTimeout(() => { btn.innerText = 'Copy'; }, 2000);
                };
                btn.addEventListener('click', doCopy);
                pre.addEventListener('dblclick', doCopy);
            }
        });

        // Sticky Table of Contents
        const headings = document.querySelectorAll('.markdown-body h2, .markdown-body h3');
        if (headings.length > 0) {
            const tocContainer = document.createElement('div');
            tocContainer.id = 'toc-container';
            const title = document.createElement('div');
            title.innerText = 'Nội dung chính';
            title.style.fontSize = '0.75rem';
            title.style.fontWeight = '700';
            title.style.color = 'var(--text-muted)';
            title.style.marginBottom = '10px';
            title.style.textTransform = 'uppercase';
            title.style.letterSpacing = '0.05em';
            tocContainer.appendChild(title);
            
            const navMenu = document.getElementById('nav-menu');
            if(navMenu) navMenu.appendChild(tocContainer);

            headings.forEach((h, index) => {
                if(!h.id) h.id = 'heading-' + index;
                const link = document.createElement('a');
                link.href = '#' + h.id;
                link.className = 'toc-item';
                link.innerText = h.innerText;
                link.style.paddingLeft = h.tagName === 'H3' ? '20px' : '12px';
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    h.scrollIntoView({ behavior: 'smooth' });
                });
                
                tocContainer.appendChild(link);
            });
        }

        // Image Zoom
        const mdImages = document.querySelectorAll('.markdown-body img');
        if (mdImages.length > 0) {
            const zoomBackdrop = document.createElement('div');
            zoomBackdrop.id = 'img-zoom-backdrop';
            document.body.appendChild(zoomBackdrop);
            let currentZoomed = null;
            const closeZoom = () => {
                if(currentZoomed) {
                    currentZoomed.classList.remove('img-zoomed');
                    zoomBackdrop.classList.remove('show');
                    currentZoomed = null;
                }
            };
            mdImages.forEach(img => {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if(currentZoomed === img) closeZoom();
                    else {
                        closeZoom();
                        img.classList.add('img-zoomed');
                        zoomBackdrop.classList.add('show');
                        currentZoomed = img;
                    }
                });
            });
            zoomBackdrop.addEventListener('click', closeZoom);
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeZoom(); });
        }

        // --- ELEGANT AI CHATBOT ---
        const chatHtml = `
            <button id="ai-chat-btn" title="Hỏi AI">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 10h.01"></path></svg>
            </button>
            <div id="ai-chat-window">
                <div id="ai-chat-header">
                    <span>✨ Trợ giảng AI</span>
                    <button id="ai-chat-close" style="background:none;border:none;color:white;cursor:pointer;font-size:1.5rem;line-height:1;">&times;</button>
                </div>
                <div id="ai-chat-messages">
                    <div class="chat-msg bot">Chào bạn! Mình có thể giải thích chi tiết hơn bất cứ khái niệm nào bạn thắc mắc.</div>
                </div>
                <div class="chat-suggestions">
                    <div class="chat-suggestion-chip">📝 Tóm tắt bài viết</div>
                    <div class="chat-suggestion-chip">🃏 Tạo Flashcard ôn tập</div>
                    <div class="chat-suggestion-chip">🧐 Giải thích False Sharing</div>
                </div>
                <div id="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="Hỏi gì đó...">
                    <button id="ai-chat-send">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHtml);

        const chatBtn = document.getElementById('ai-chat-btn');
        const chatWindow = document.getElementById('ai-chat-window');
        const chatClose = document.getElementById('ai-chat-close');
        const chatMessages = document.getElementById('ai-chat-messages');
        const chatInput = document.getElementById('ai-chat-input');
        const chatSend = document.getElementById('ai-chat-send');
        const suggestionChips = document.querySelectorAll('.chat-suggestion-chip');

        chatBtn.onclick = () => chatWindow.classList.toggle('show');
        chatClose.onclick = () => chatWindow.classList.remove('show');

        let chatHistory = [];
        
        const addMsg = (text, sender) => {
            const div = document.createElement('div');
            div.className = 'chat-msg ' + sender;
            if (sender === 'bot' && typeof marked !== 'undefined') {
                div.innerHTML = marked.parse(text);
            } else {
                div.innerHTML = text.replace(/\\n/g, '<br>');
            }
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const callAI = async (prompt) => {
            addMsg("Đang suy nghĩ...", "bot");
            const loadingDiv = chatMessages.lastChild;

            const articleText = mdBody.innerText.substring(0, 3000); 
            const systemPrompt = "Bạn là Trợ lý AI Thông minh được nhúng vào blog Khoa học Máy tính. Bài viết hiện tại: " + articleText + "\\n\\nTrả lời tiếng Việt, ngắn gọn, súc tích, dùng Markdown. Nếu người dùng hỏi Tóm tắt hoặc Flashcard, hãy dựa vào bài viết để làm.";
            
            if (chatHistory.length === 0) chatHistory.push({ role: 'system', content: systemPrompt });
            chatHistory.push({ role: 'user', content: prompt });

            try {
                const response = await fetch('https://text.pollinations.ai/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: chatHistory, model: 'openai' })
                });
                
                const text = await response.text();
                chatMessages.removeChild(loadingDiv);
                addMsg(text, "bot");
                chatHistory.push({ role: 'assistant', content: text });
                
                if(chatHistory.length > 7) chatHistory.splice(1, 2);
            } catch(e) {
                chatMessages.removeChild(loadingDiv);
                addMsg("Xin lỗi, AI đang bận hoặc lỗi mạng. Vui lòng thử lại sau!", "bot");
                chatHistory.pop();
            }
        };

        const handleSend = () => {
            const text = chatInput.value.trim();
            if(!text) return;
            addMsg(text, 'user');
            chatInput.value = '';
            callAI(text);
        };

        chatSend.onclick = handleSend;
        chatInput.onkeydown = (e) => { if (e.key === 'Enter') handleSend(); };
        
        suggestionChips.forEach(chip => {
            chip.onclick = () => {
                chatInput.value = chip.innerText.replace(/[📝🃏🧐]/g, '').trim();
                handleSend();
            };
        });

        // --- DISCREET FLOATING MENU ---
        const selMenu = document.createElement('div');
        selMenu.id = 'selection-menu';
        selMenu.innerHTML = `
            <button id="sel-highlight" style="color: #eab308;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg>
                Highlight
            </button>
            <button id="sel-copy">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copy
            </button>
            <button id="sel-ai" style="color: var(--primary);">
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
                    selMenu.style.top = (rect.top + window.scrollY - 45) + 'px';
                    selMenu.style.left = (rect.left + window.scrollX + rect.width/2) + 'px';
                } else {
                    selMenu.style.display = 'none';
                }
            }, 100);
        });
        document.addEventListener('mousedown', (e) => {
            if(!selMenu.contains(e.target)) selMenu.style.display = 'none';
        });

        document.getElementById('sel-copy').onclick = () => {
            navigator.clipboard.writeText(window.getSelection().toString());
            selMenu.style.display = 'none';
        };
        document.getElementById('sel-highlight').onclick = () => {
            const sel = window.getSelection();
            if(sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const mark = document.createElement('mark');
                try { range.surroundContents(mark); } 
                catch(e) { document.execCommand('hiliteColor', false, document.documentElement.getAttribute('data-theme') === 'dark' ? '#ca8a04' : '#fef08a'); }
                sel.removeAllRanges();
                selMenu.style.display = 'none';
            }
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

        // Smooth Nav
        document.querySelectorAll('a.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                if(!link.href.startsWith('http') || link.href.includes(window.location.host)) {
                    e.preventDefault();
                    document.body.style.transition = 'opacity 0.2s ease';
                    document.body.style.opacity = '0';
                    setTimeout(() => { window.location.href = link.href; }, 200);
                }
            });
        });

        // Scroll Reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });

        document.querySelectorAll('.markdown-body > p, .markdown-body > h2, .markdown-body > h3, .markdown-body > pre, .markdown-body > ul, .markdown-body > blockquote').forEach(el => {
            el.classList.add('reveal-item');
            observer.observe(el);
        });
    }
});
"""
with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Minimalist JS rebuilt!")
