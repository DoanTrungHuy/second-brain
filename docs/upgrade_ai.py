import os

# 1. Update CSS for Premium Chat UI
css_upgrade = """
/* === PREMIUM CHAT UI === */
#ai-chat-window {
    width: 380px;
    height: 550px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    pointer-events: none;
    z-index: 1000;
}
#ai-chat-window.show {
    transform: translateY(0) scale(1);
    opacity: 1;
    pointer-events: auto;
}
[data-theme="dark"] #ai-chat-window {
    background: rgba(30, 41, 59, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

#ai-chat-header {
    background: linear-gradient(135deg, #a855f7, #6366f1);
    padding: 15px 20px;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

#ai-chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}
#ai-chat-messages::-webkit-scrollbar { width: 6px; }
#ai-chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }

.chat-msg {
    max-width: 85%;
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 0.95rem;
    line-height: 1.5;
    animation: msg-slide-in 0.3s ease-out;
}
@keyframes msg-slide-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.chat-msg.bot {
    align-self: flex-start;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    color: var(--text-main);
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.chat-msg.user {
    align-self: flex-end;
    background: linear-gradient(135deg, #a855f7, #6366f1);
    color: white;
    border-bottom-right-radius: 4px;
    box-shadow: 0 2px 5px rgba(99, 102, 241, 0.3);
}

#ai-chat-input-area {
    padding: 15px;
    background: var(--bg-body);
    border-top: 1px solid var(--border);
    display: flex;
    gap: 10px;
}
#ai-chat-input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-main);
    outline: none;
    transition: border-color 0.2s;
}
#ai-chat-input:focus { border-color: #a855f7; }
#ai-chat-send {
    background: linear-gradient(135deg, #a855f7, #6366f1);
    color: white;
    border: none;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
    transition: transform 0.2s;
}
#ai-chat-send:hover { transform: scale(1.1); }
#ai-chat-send svg { width: 18px; height: 18px; fill: white; }

#ai-chat-btn {
    animation: glow-pulse 2s infinite;
}
@keyframes glow-pulse {
    0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(168, 85, 247, 0); }
    100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
}
"""

with open('custom.css', 'a', encoding='utf-8') as f:
    f.write(css_upgrade)


# 2. Update JS to use Pollinations API
with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# Find the start of `const callGemini` and end of it.
start_idx = js.find('const callGemini = async (prompt) => {')
end_idx = js.find('};', start_idx) + 2

new_ai_code = """        let chatHistory = [];
        
        const callGemini = async (prompt) => {
            addMsg("Đang suy nghĩ...", "bot");
            const loadingDiv = chatMessages.lastChild;

            const articleText = document.getElementById('markdown-body').innerText.substring(0, 3000); 
            const systemPrompt = "Bạn là Trợ lý AI Thông minh (tên là System Knowledge Bot), được nhúng vào một trang web về Khoa học Máy tính. Bài viết hiện tại có nội dung: " + articleText + "\\n\\nHãy trả lời câu hỏi của người dùng bằng tiếng Việt, ngắn gọn, súc tích, dễ hiểu, sử dụng ngữ cảnh bài viết nếu có thể. Format bằng Markdown (in đậm, nghiêng). Nếu người dùng hỏi ngoài lề, vẫn trả lời bình thường nhưng lịch sự.";
            
            if (chatHistory.length === 0) {
                chatHistory.push({ role: 'system', content: systemPrompt });
            }
            chatHistory.push({ role: 'user', content: prompt });

            try {
                const response = await fetch('https://text.pollinations.ai/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: chatHistory,
                        model: 'openai'
                    })
                });
                
                const text = await response.text();
                chatMessages.removeChild(loadingDiv);
                addMsg(text, "bot");
                chatHistory.push({ role: 'assistant', content: text });
                
                // Keep history short
                if(chatHistory.length > 7) {
                    chatHistory.splice(1, 2);
                }
            } catch(e) {
                chatMessages.removeChild(loadingDiv);
                addMsg("Xin lỗi, server AI đang quá tải hoặc lỗi kết nối mạng. Bạn thử lại sau nhé!", "bot");
                chatHistory.pop();
            }
        };"""

if start_idx != -1 and end_idx != -1:
    js = js[:start_idx] + new_ai_code + js[end_idx:]

# Also update the chat UI HTML to include the send icon
chat_html_start = js.find('const chatHtml = `')
chat_html_end = js.find('`;', chat_html_start)

new_chat_html = """const chatHtml = `
            <button id="ai-chat-btn" title="Hỏi AI về bài viết này">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 10h.01"></path></svg>
            </button>
            <div id="ai-chat-window">
                <div id="ai-chat-header">
                    <span>✨ AI Trợ Giảng</span>
                    <button id="ai-chat-close" style="background:none;border:none;color:white;cursor:pointer;font-size:1.5rem;line-height:1;">&times;</button>
                </div>
                <div id="ai-chat-messages">
                    <div class="chat-msg bot">Chào bạn! Mình là AI thực thụ đây. Mình đã đọc và phân tích toàn bộ bài viết này. Hãy hỏi mình bất cứ điều gì bạn thắc mắc nhé!</div>
                </div>
                <div id="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="Nhập câu hỏi tại đây...">
                    <button id="ai-chat-send" title="Gửi">
                        <svg viewBox="0 0 24 24"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/></svg>
                    </button>
                </div>
            </div>
        `"""

if chat_html_start != -1 and chat_html_end != -1:
    js = js[:chat_html_start] + new_chat_html + js[chat_html_end+2:]


# We need to make sure `marked` parses the AI response nicely
# Inside addMsg:
addMsg_start = js.find('const addMsg = (text, sender) => {')
addMsg_end = js.find('};', addMsg_start) + 2

new_addMsg = """const addMsg = (text, sender) => {
            const div = document.createElement('div');
            div.className = 'chat-msg ' + sender;
            if (sender === 'bot' && typeof marked !== 'undefined') {
                div.innerHTML = marked.parse(text);
            } else {
                div.innerHTML = text.replace(/\\n/g, '<br>');
            }
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };"""

if addMsg_start != -1 and addMsg_end != -1:
    js = js[:addMsg_start] + new_addMsg + js[addMsg_end:]


with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("AI Upgraded!")
