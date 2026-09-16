import os
js = """
// custom.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const sidebarBrand = document.querySelector('.brand');
    const mobileHeader = document.querySelector('.mobile-header');
    
    const themeBtnHtml = `
        <button class="theme-toggle" id="theme-toggle" title="Toggle Dark Mode" style="background:none;border:none;cursor:pointer;color:inherit;">
            <svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <svg id="sun-icon" style="display:none;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
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

        // Word count and reading time
        const text = mdBody.innerText;
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        const readingTime = Math.ceil(wordCount / 200);
        
        const metaDiv = document.createElement('div');
        metaDiv.className = 'reading-meta';
        metaDiv.innerText = `⏱️ ${readingTime} phút đọc - ${wordCount} từ`;
        mdBody.insertBefore(metaDiv, mdBody.firstChild);

        // Progress bar
        const progressContainer = document.createElement('div');
        progressContainer.id = 'reading-progress-container';
        progressContainer.innerHTML = '<div id="reading-progress-bar"></div>';
        document.body.appendChild(progressContainer);
        const progressBar = document.getElementById('reading-progress-bar');
        
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.addEventListener('scroll', () => {
                const scrollTop = mainContent.scrollTop;
                const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
                const scrolled = (scrollTop / scrollHeight) * 100;
                progressBar.style.width = scrolled + '%';
            });
        }

        // Copy Code Buttons
        const blocks = document.querySelectorAll('.markdown-body pre');
        blocks.forEach(pre => {
            const btn = pre.querySelector('.copy-btn-floating');
            const code = pre.querySelector('code');
            if (btn && code) {
                btn.addEventListener('click', () => {
                    navigator.clipboard.writeText(code.innerText);
                    const originalText = btn.innerText;
                    btn.innerText = 'Copied!';
                    setTimeout(() => { btn.innerText = originalText; }, 2000);
                });
                
                // Double click copy
                pre.addEventListener('dblclick', () => {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(code);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    navigator.clipboard.writeText(code.innerText);
                    btn.innerText = 'Copied!';
                    setTimeout(() => btn.innerText = 'Copy', 1500);
                });
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

        // Back to top
        const bttBtn = document.createElement('button');
        bttBtn.id = 'back-to-top';
        bttBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
        document.body.appendChild(bttBtn);
        
        if (mainContent) {
            mainContent.addEventListener('scroll', () => {
                if (mainContent.scrollTop > 300) {
                    bttBtn.classList.add('show');
                } else {
                    bttBtn.classList.remove('show');
                }
            });
        }
        bttBtn.addEventListener('click', () => {
            if(mainContent) mainContent.scrollTo({top: 0, behavior: 'smooth'});
        });

        // Focus Mode
        const headerMeta = document.querySelector('.reading-meta');
        if (headerMeta && window.innerWidth > 768) {
            const focusBtn = document.createElement('button');
            focusBtn.style.cssText = 'background:none; border:1px solid var(--border); color:var(--text-muted); border-radius:4px; padding:2px 8px; font-size:0.75rem; cursor:pointer; margin-left:auto; transition:all 0.2s; float:right;';
            focusBtn.innerText = 'Zen Mode';
            focusBtn.onclick = () => {
                document.body.classList.toggle('focus-mode');
                if(document.body.classList.contains('focus-mode')) {
                    focusBtn.innerText = 'Exit Zen Mode';
                    focusBtn.style.background = 'var(--primary)';
                    focusBtn.style.color = '#fff';
                    focusBtn.style.borderColor = 'var(--primary)';
                } else {
                    focusBtn.innerText = 'Zen Mode';
                    focusBtn.style.background = 'none';
                    focusBtn.style.color = 'var(--text-muted)';
                    focusBtn.style.borderColor = 'var(--border)';
                }
            };
            headerMeta.appendChild(focusBtn);
        }

        // Image Zoom
        const images = document.querySelectorAll('.markdown-body img');
        if (images.length > 0) {
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
            images.forEach(img => {
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

        // AI Chatbot Integration
        const chatHtml = `
            <button id="ai-chat-btn" title="Hỏi AI về bài viết này">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 10h.01"></path></svg>
            </button>
            <div id="ai-chat-window">
                <div id="ai-chat-header">
                    <span>AI Trợ Giảng</span>
                    <button id="ai-chat-close" style="background:none;border:none;color:white;cursor:pointer;font-size:1.5rem;">&times;</button>
                </div>
                <div id="ai-chat-messages">
                    <div class="chat-msg bot">Chào bạn! Mình đã đọc xong bài viết này. Mình có thể giải thích chi tiết hơn bất cứ khái niệm nào bạn thắc mắc.</div>
                </div>
                <div id="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="Hỏi gì đó...">
                    <button id="ai-chat-send">Gửi</button>
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

        chatBtn.onclick = () => chatWindow.classList.toggle('show');
        chatClose.onclick = () => chatWindow.classList.remove('show');

        const addMsg = (text, sender) => {
            const div = document.createElement('div');
            div.className = 'chat-msg ' + sender;
            div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>`$1`</b>').replace(/\n/g, '<br>');
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const callGemini = async (prompt) => {
            let apiKey = localStorage.getItem('gemini_api_key');
            if (!apiKey) {
                apiKey = window.prompt("Để dùng AI, vui lòng nhập Google Gemini API Key (Miễn phí từ Google AI Studio):");
                if(apiKey) localStorage.setItem('gemini_api_key', apiKey);
                else { addMsg("Bạn cần API Key để chat với mình nha!", "bot"); return; }
            }

            const articleText = document.getElementById('markdown-body').innerText.substring(0, 5000); 
            const systemPrompt = "You are a helpful AI assistant integrated into a technical blog about Computer Science, C++, and OS. Answer concisely in Vietnamese. Use context from the article: " + articleText;
            
            try {
                addMsg("Đang suy nghĩ...", "bot");
                const loadingDiv = chatMessages.lastChild;

                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt + "\n\nUser Question: " + prompt }] }]
                    })
                });
                
                const data = await response.json();
                chatMessages.removeChild(loadingDiv);
                
                if (data.error) {
                    if(data.error.code === 400 || data.error.message.includes("API key")) {
                        localStorage.removeItem('gemini_api_key');
                        addMsg("API Key bị lỗi hoặc hết hạn. Hãy tải lại trang và nhập lại nhé.", "bot");
                    } else {
                        addMsg("Lỗi: " + data.error.message, "bot");
                    }
                } else {
                    const text = data.candidates[0].content.parts[0].text;
                    addMsg(text, "bot");
                }
            } catch(e) {
                chatMessages.lastChild.innerText = "Lỗi kết nối mạng rồi bạn ơi!";
            }
        };

        const handleSend = () => {
            const text = chatInput.value.trim();
            if(!text) return;
            addMsg(text, 'user');
            chatInput.value = '';
            callGemini(text);
        };

        chatSend.onclick = handleSend;
        chatInput.onkeydown = (e) => { if (e.key === 'Enter') handleSend(); };
    }
});
"""
with open('docs/custom.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("JS written.")
