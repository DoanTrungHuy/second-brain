import os

with open('docs/custom.js', 'r', encoding='utf-8', errors='replace') as f:
    js = f.read()

# Fix TOC title
js = js.replace('Ná»˜I DUNG CHÃ NH', 'Nội dung chính')
js = js.replace('N\xef\xbf\xbdI DUNG CH\xef\xbf\xbd NH', 'Nội dung chính')
js = js.replace('NÃ”I DUNG CHÃ\x8dNH', 'Nội dung chính')

# We can just replace the entire AI block because everything in it might be corrupted.
# Let's find the start of the AI block
start_idx = js.find('// 10. AI Chatbot Integration')
if start_idx != -1:
    js = js[:start_idx] + """// 10. AI Chatbot Integration
        const chatHtml = `
            <button id="ai-chat-btn" title="Hỏi AI về bài viết này">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 10h.01"></path></svg>
            </button>
            <div id="ai-chat-window">
                <div id="ai-chat-header">
                    <span>AI Trợ Giảng</span>
                    <button id="ai-chat-close">&times;</button>
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
            div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>`$1`</b>').replace(/\\n/g, '<br>');
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
            
            const systemPrompt = "You are a helpful AI assistant integrated into a technical blog about Computer Science, C++, and OS. You help the reader understand the concepts. Answer concisely in Vietnamese. Use context from the article: " + articleText;
            
            try {
                addMsg("Đang suy nghĩ...", "bot");
                const loadingDiv = chatMessages.lastChild;

                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt + "\\n\\nUser Question: " + prompt }] }]
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
