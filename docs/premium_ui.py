import os
import re

# --- 1. PERFECT PREMIUM CSS ---
css = """
:root {
    --bg-body: #ffffff;
    --bg-card: #f8fafc;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border: #e2e8f0;
    --primary: #2563eb;
    --primary-light: #eff6ff;
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --font-mono: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
}

[data-theme="dark"] {
    --bg-body: #0f172a;
    --bg-card: #1e293b;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: #334155;
    --primary: #3b82f6;
    --primary-light: #1e3a8a;
}

* { box-sizing: border-box; }

body {
    background-color: var(--bg-body);
    color: var(--text-main);
    font-family: var(--font-sans);
    line-height: 1.7;
    margin: 0;
    overflow-x: hidden;
    transition: background-color 0.3s ease;
}

/* LAYOUT: Left Nav, Center Content, Right TOC */
.app-container {
    display: flex;
    max-width: 1600px;
    margin: 0 auto;
    position: relative;
}

/* SIDEBAR (LEFT) */
.sidebar {
    width: 280px;
    height: 100vh;
    position: sticky;
    top: 0;
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    padding: 24px 20px;
    overflow-y: auto;
    flex-shrink: 0;
}
.sidebar .brand {
    font-size: 1.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
}
.nav-group-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    font-weight: 700;
    margin: 24px 0 10px 0;
}
.nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    color: var(--text-main);
    text-decoration: none;
    border-radius: 8px;
    font-size: 0.9rem;
    margin-bottom: 4px;
    transition: all 0.2s;
}
.nav-item:hover {
    background: var(--primary-light);
    color: var(--primary);
}
.nav-item.active {
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 600;
}

/* MAIN CONTENT (CENTER) */
#main-content {
    flex: 1;
    min-width: 0;
    padding: 40px 60px;
    max-width: 900px;
}

/* TOC SIDEBAR (RIGHT) */
#right-sidebar {
    width: 260px;
    height: 100vh;
    position: sticky;
    top: 0;
    padding: 40px 20px;
    flex-shrink: 0;
    border-left: 1px solid transparent;
}
@media (max-width: 1280px) {
    #right-sidebar { display: none; }
    #main-content { max-width: 1000px; margin: 0 auto; }
}
@media (max-width: 900px) {
    .sidebar { display: none; }
    #main-content { padding: 30px 20px; }
}

/* TYPOGRAPHY & MARKDOWN */
.markdown-body {
    font-size: 1.125rem;
    color: var(--text-main);
}
.markdown-body h1 {
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 30px;
    letter-spacing: -0.02em;
    text-transform: none !important;
}
.markdown-body h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 50px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
    letter-spacing: -0.01em;
    text-transform: none !important;
}
.markdown-body h3 {
    font-size: 1.35rem;
    font-weight: 600;
    margin-top: 35px;
    margin-bottom: 15px;
    text-transform: none !important;
}
.markdown-body p, .markdown-body li {
    margin-bottom: 16px;
    line-height: 1.8;
}
.markdown-body a {
    color: var(--primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
}
.markdown-body a:hover {
    border-bottom-color: var(--primary);
}
.markdown-body strong {
    font-weight: 600;
    color: var(--text-main);
}
.markdown-body blockquote {
    margin: 24px 0;
    padding: 16px 24px;
    background: var(--bg-card);
    border-left: 4px solid var(--primary);
    border-radius: 0 8px 8px 0;
    color: var(--text-muted);
    font-style: italic;
}

/* INLINE CODE */
.markdown-body p code, .markdown-body li code {
    background: var(--bg-card);
    color: #db2777;
    font-family: var(--font-mono);
    font-size: 0.85em;
    padding: 3px 6px;
    border-radius: 4px;
    border: 1px solid var(--border);
}
[data-theme="dark"] .markdown-body p code, [data-theme="dark"] .markdown-body li code {
    color: #f472b6;
}

/* CODE BLOCKS */
.markdown-body pre {
    background: #0d1117 !important; /* GitHub dark bg */
    border-radius: 12px;
    margin: 24px 0;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.mac-window-header {
    background: #161b22;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #30363d;
}
.mac-dots { display: flex; gap: 6px; }
.mac-dot { width: 12px; height: 12px; border-radius: 50%; }
.mac-dot.red { background: #ff5f56; }
.mac-dot.yellow { background: #ffbd2e; }
.mac-dot.green { background: #27c93f; }
.code-lang-label {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #8b949e;
    text-transform: uppercase;
}
.copy-btn-floating {
    margin-left: 15px;
    background: #21262d;
    border: 1px solid #30363d;
    color: #c9d1d9;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}
.copy-btn-floating:hover { background: #30363d; color: #ffffff; }
.markdown-body pre code {
    display: block;
    padding: 20px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 1.6;
    color: #c9d1d9;
}

/* READING META */
.reading-meta {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 40px;
    font-size: 0.85rem;
    color: var(--text-muted);
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
}

/* PROGRESS BAR */
#reading-progress-container {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 3px;
    background: transparent;
    z-index: 1000;
}
#reading-progress-bar {
    height: 100%; width: 0%;
    background: var(--primary);
    transition: width 0.1s;
}

/* TABLE OF CONTENTS (RIGHT SIDEBAR) */
#toc-container {
    font-size: 0.85rem;
}
#toc-container .toc-title {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 16px;
}
.toc-item {
    display: block;
    color: var(--text-muted);
    text-decoration: none;
    padding: 6px 0;
    line-height: 1.4;
    transition: color 0.2s;
}
.toc-item:hover { color: var(--text-main); }
.toc-item.active { color: var(--primary); font-weight: 600; }

/* SELECTION MENU */
#selection-menu {
    position: absolute;
    display: none;
    background: var(--bg-body);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 1000;
    transform: translateX(-50%);
}
[data-theme="dark"] #selection-menu { box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
#selection-menu button {
    background: none; border: none; cursor: pointer;
    padding: 6px 12px; font-size: 0.8rem; font-weight: 500;
    color: var(--text-main);
    display: flex; align-items: center; gap: 6px;
    border-radius: 4px; transition: background 0.2s;
}
#selection-menu button:hover { background: var(--bg-card); }

/* CHAT UI */
#ai-chat-btn {
    position: fixed; bottom: 30px; right: 30px;
    width: 56px; height: 56px;
    border-radius: 50%;
    background: var(--primary);
    color: white; border: none;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
    cursor: pointer; display: flex; justify-content: center; align-items: center;
    z-index: 999; transition: transform 0.2s;
}
#ai-chat-btn:hover { transform: scale(1.1); }

#ai-chat-window {
    position: fixed; bottom: 100px; right: 30px;
    width: 400px; height: 600px;
    border-radius: 16px;
    background: var(--bg-body);
    border: 1px solid var(--border);
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    display: flex; flex-direction: column;
    overflow: hidden;
    transform: translateY(20px); opacity: 0; pointer-events: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
}
[data-theme="dark"] #ai-chat-window { box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
#ai-chat-window.show { transform: translateY(0); opacity: 1; pointer-events: auto; }

#ai-chat-header {
    background: var(--bg-card);
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    font-weight: 700; color: var(--text-main);
    display: flex; justify-content: space-between; align-items: center;
}
#ai-chat-messages {
    flex: 1; padding: 20px; overflow-y: auto;
    display: flex; flex-direction: column; gap: 16px;
}
.chat-msg {
    max-width: 85%; padding: 12px 16px; border-radius: 16px;
    font-size: 0.9rem; line-height: 1.5;
}
.chat-msg.bot {
    align-self: flex-start;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text-main);
}
.chat-msg.user {
    align-self: flex-end;
    background: var(--primary);
    color: white;
    border-bottom-right-radius: 4px;
}
.chat-suggestions {
    display: flex; gap: 8px; padding: 0 20px 10px 20px; overflow-x: auto;
}
.chat-suggestions::-webkit-scrollbar { display: none; }
.chat-suggestion-chip {
    background: var(--bg-card); border: 1px solid var(--border);
    color: var(--text-main); padding: 6px 12px; border-radius: 15px;
    font-size: 0.8rem; cursor: pointer; white-space: nowrap;
    transition: all 0.2s;
}
.chat-suggestion-chip:hover { border-color: var(--primary); color: var(--primary); }
#ai-chat-input-area {
    padding: 16px; border-top: 1px solid var(--border);
    display: flex; gap: 10px; background: var(--bg-body);
}
#ai-chat-input {
    flex: 1; padding: 10px 16px; border-radius: 20px;
    border: 1px solid var(--border); background: var(--bg-card);
    color: var(--text-main); outline: none;
}
#ai-chat-input:focus { border-color: var(--primary); }
#ai-chat-send {
    background: var(--primary); color: white; border: none;
    border-radius: 50%; width: 40px; height: 40px;
    display: flex; justify-content: center; align-items: center; cursor: pointer;
}
"""

with open('custom.css', 'w', encoding='utf-8') as f:
    f.write(css)


# --- 2. PERFECT PREMIUM JS ---
js = """
document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Toggle
    const sidebarBrand = document.querySelector('.brand');
    const themeBtn = document.createElement('button');
    themeBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:inherit;opacity:0.7;margin-left:auto;';
    themeBtn.innerHTML = `<svg id="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    
    if (sidebarBrand) sidebarBrand.appendChild(themeBtn);

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = document.getElementById('theme-icon');
        if(icon) {
            if (theme === 'dark') {
                icon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
            } else {
                icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
            }
        }
    };
    
    setTheme(localStorage.getItem('theme') || 'light');
    themeBtn.onclick = () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

    // 2. Render Markdown & Meta
    const mdBody = document.getElementById('markdown-body');
    if (mdBody && typeof rawMarkdown !== 'undefined' && typeof marked !== 'undefined') {
        const renderer = new marked.Renderer();
        const originalCode = renderer.code;
        renderer.code = function(code, language, isEscaped) {
            const rendered = originalCode.call(this, code, language, isEscaped);
            return rendered.replace('<pre>', '<pre><div class="mac-window-header"><div class="mac-dots"><div class="mac-dot red"></div><div class="mac-dot yellow"></div><div class="mac-dot green"></div></div><div class="code-lang-label">' + (language || 'text') + '</div><button class="copy-btn-floating">Copy</button></div>');
        };
        
        marked.setOptions({ renderer: renderer });
        mdBody.innerHTML = marked.parse(rawMarkdown);

        // Reading Meta
        const words = mdBody.innerText.split(/\\s+/).filter(w => w.length > 0).length;
        const metaDiv = document.createElement('div');
        metaDiv.className = 'reading-meta';
        metaDiv.innerText = `⏱️ ${Math.ceil(words / 200)} phút đọc — ${words} từ`;
        mdBody.insertBefore(metaDiv, mdBody.firstChild);

        // Code Copy
        document.querySelectorAll('.markdown-body pre').forEach(pre => {
            const btn = pre.querySelector('.copy-btn-floating');
            const code = pre.querySelector('code');
            if (btn && code) {
                btn.onclick = () => {
                    navigator.clipboard.writeText(code.innerText);
                    btn.innerText = 'Copied!';
                    setTimeout(() => btn.innerText = 'Copy', 2000);
                };
            }
        });

        // TOC in Right Sidebar
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            const rightSidebar = document.createElement('div');
            rightSidebar.id = 'right-sidebar';
            
            const tocContainer = document.createElement('div');
            tocContainer.id = 'toc-container';
            tocContainer.innerHTML = '<div class="toc-title">Mục lục</div>';
            
            document.querySelectorAll('.markdown-body h2, .markdown-body h3').forEach((h, i) => {
                h.id = h.id || 'h-' + i;
                const link = document.createElement('a');
                link.href = '#' + h.id;
                link.className = 'toc-item';
                link.innerText = h.innerText;
                link.style.paddingLeft = h.tagName === 'H3' ? '15px' : '0';
                link.onclick = (e) => { e.preventDefault(); h.scrollIntoView({behavior: 'smooth'}); };
                tocContainer.appendChild(link);
            });
            
            rightSidebar.appendChild(tocContainer);
            appContainer.appendChild(rightSidebar);
        }

        // Selection Menu
        const selMenu = document.createElement('div');
        selMenu.id = 'selection-menu';
        selMenu.innerHTML = `
            <button id="sel-highlight"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg> Highlight</button>
            <button id="sel-copy"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy</button>
            <button id="sel-ai" style="color: var(--primary);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> Ask AI</button>
        `;
        document.body.appendChild(selMenu);

        let selTimeout;
        document.addEventListener('selectionchange', () => {
            clearTimeout(selTimeout);
            selTimeout = setTimeout(() => {
                const sel = window.getSelection();
                if(sel.rangeCount > 0 && sel.toString().trim().length > 0) {
                    const rect = sel.getRangeAt(0).getBoundingClientRect();
                    selMenu.style.display = 'flex';
                    selMenu.style.top = (rect.top + window.scrollY - 45) + 'px';
                    selMenu.style.left = (rect.left + window.scrollX + rect.width/2) + 'px';
                } else {
                    selMenu.style.display = 'none';
                }
            }, 100);
        });
        
        document.getElementById('sel-copy').onclick = () => { navigator.clipboard.writeText(window.getSelection().toString()); selMenu.style.display = 'none'; };
        document.getElementById('sel-highlight').onclick = () => {
            try { window.getSelection().getRangeAt(0).surroundContents(document.createElement('mark')); } 
            catch(e) { document.execCommand('hiliteColor', false, document.documentElement.getAttribute('data-theme') === 'dark' ? '#ca8a04' : '#fef08a'); }
            window.getSelection().removeAllRanges();
            selMenu.style.display = 'none';
        };

        // Progress Bar
        const progressContainer = document.createElement('div');
        progressContainer.id = 'reading-progress-container';
        progressContainer.innerHTML = '<div id="reading-progress-bar"></div>';
        document.body.appendChild(progressContainer);
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            document.getElementById('reading-progress-bar').style.width = scrolled + '%';
        });

        // ELEGANT AI CHATBOT
        const chatHtml = `
            <button id="ai-chat-btn" title="Hỏi AI"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></button>
            <div id="ai-chat-window">
                <div id="ai-chat-header">
                    <span>✨ Trợ giảng AI</span>
                    <button id="ai-chat-close" style="background:none;border:none;color:var(--text-main);cursor:pointer;font-size:1.5rem;line-height:1;">&times;</button>
                </div>
                <div id="ai-chat-messages">
                    <div class="chat-msg bot">Chào bạn! Mình có thể giải thích chi tiết hơn bất cứ khái niệm nào bạn thắc mắc.</div>
                </div>
                <div class="chat-suggestions">
                    <div class="chat-suggestion-chip">📝 Tóm tắt bài viết</div>
                    <div class="chat-suggestion-chip">🃏 Tạo Flashcard</div>
                    <div class="chat-suggestion-chip">🧐 Giải thích False Sharing</div>
                </div>
                <div id="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="Hỏi gì đó...">
                    <button id="ai-chat-send"><svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/></svg></button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHtml);

        const chatBtn = document.getElementById('ai-chat-btn');
        const chatWindow = document.getElementById('ai-chat-window');
        const chatInput = document.getElementById('ai-chat-input');
        const chatMessages = document.getElementById('ai-chat-messages');
        let chatHistory = [];

        chatBtn.onclick = () => chatWindow.classList.add('show');
        document.getElementById('ai-chat-close').onclick = () => chatWindow.classList.remove('show');

        const addMsg = (text, sender) => {
            const div = document.createElement('div');
            div.className = 'chat-msg ' + sender;
            if(sender === 'bot') div.innerHTML = marked.parse(text);
            else div.innerText = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        const callAI = async (prompt) => {
            addMsg("Đang suy nghĩ...", "bot");
            const loadingDiv = chatMessages.lastChild;
            const systemPrompt = "Bạn là Trợ lý AI. Trả lời bằng tiếng Việt, ngắn gọn, dùng Markdown. Bài viết: " + mdBody.innerText.substring(0, 3000);
            if(chatHistory.length === 0) chatHistory.push({role: 'system', content: systemPrompt});
            chatHistory.push({role: 'user', content: prompt});
            
            try {
                const res = await fetch('https://text.pollinations.ai/', {
                    method: 'POST', headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({messages: chatHistory, model: 'openai'})
                });
                const text = await res.text();
                chatMessages.removeChild(loadingDiv);
                addMsg(text, 'bot');
                chatHistory.push({role: 'assistant', content: text});
                if(chatHistory.length > 7) chatHistory.splice(1, 2);
            } catch(e) {
                chatMessages.removeChild(loadingDiv);
                addMsg("Lỗi kết nối mạng.", 'bot');
            }
        };

        const send = () => {
            const val = chatInput.value.trim();
            if(val) { addMsg(val, 'user'); chatInput.value = ''; callAI(val); }
        };
        document.getElementById('ai-chat-send').onclick = send;
        chatInput.onkeydown = (e) => { if(e.key === 'Enter') send(); };
        
        document.querySelectorAll('.chat-suggestion-chip').forEach(chip => {
            chip.onclick = () => { chatInput.value = chip.innerText.replace(/[📝🃏🧐]/g, '').trim(); send(); };
        });

        document.getElementById('sel-ai').onclick = () => {
            const text = window.getSelection().toString();
            if(text) {
                chatWindow.classList.add('show');
                chatInput.value = "Giải thích chi tiết đoạn này giúp tôi: " + text;
                send();
                selMenu.style.display = 'none';
            }
        };
    }
});
"""

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Premium UI successfully rebuilt.")
