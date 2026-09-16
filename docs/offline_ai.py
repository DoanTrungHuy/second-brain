import os

with open('custom.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the callGemini function
old_func = """        const callGemini = async (prompt) => {
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
        };"""

new_func = """        const callGemini = async (prompt) => {
            addMsg("Đang xử lý...", "bot");
            const loadingDiv = chatMessages.lastChild;

            setTimeout(() => {
                chatMessages.removeChild(loadingDiv);
                const pLower = prompt.toLowerCase();
                let response = "";

                if (pLower.includes("tóm tắt")) {
                    response = "Dưới đây là 5 ý chính của bài viết:\\n" +
                    "1. **CPU Cache không hiểu cấu trúc dữ liệu:** Cache chỉ hoạt động với các Cache Line (64 Bytes). Mảng (Array) hay Struct khi đưa vào Cache đều bị xé nhỏ thành các byte vô tri.\\n" +
                    "2. **Phân rã địa chỉ:** Địa chỉ vật lý được chia làm TAG (định danh), INDEX (chọn rãnh) và OFFSET (chọn byte).\\n" +
                    "3. **Lỗi False Sharing:** Xảy ra khi 2 luồng (threads) ghi dữ liệu vào 2 biến khác nhau nhưng nằm cùng trên 1 Cache Line, khiến CPU liên tục phải đồng bộ hóa, làm giảm hiệu suất.\\n" +
                    "4. **Memory Padding (Căn chỉnh bộ nhớ):** Kỹ thuật chèn thêm các byte rỗng (padding) bằng `alignas(64)` để ép các biến quan trọng nằm ở các Cache Line khác nhau, giải quyết False Sharing.\\n" +
                    "5. **Heap & Malloc Metadata:** Khi xin cấp phát Heap (ví dụ `malloc(1024)`), hệ thống luôn tự động chèn thêm 16 bytes Metadata ẩn ngay phía trước con trỏ để quản lý kích thước và trạng thái dọn dẹp.";
                } 
                else if (pLower.includes("flashcard") || pLower.includes("câu hỏi")) {
                    response = "Dưới đây là 5 Flashcard để bạn ôn tập:\\n\\n" +
                    "**Q1: Kích thước tiêu chuẩn của một Cache Line hiện nay là bao nhiêu?**\\n" +
                    "-> *Đáp án: 64 Bytes.*\\n\\n" +
                    "**Q2: CPU chia địa chỉ vật lý thành 3 phần nào để tra cứu Cache?**\\n" +
                    "-> *Đáp án: TAG (Bit Cao), INDEX (Bit Giữa), OFFSET (Bit Thấp).*\\n\\n" +
                    "**Q3: False Sharing là hiện tượng gì?**\\n" +
                    "-> *Đáp án: Khi nhiều luồng độc lập vô tình cập nhật các biến nằm trên cùng một Cache Line, gây ra hiện tượng Ping-Pong vô hiệu hóa Cache liên tục.*\\n\\n" +
                    "**Q4: Từ khóa nào trong C++ dùng để căn chỉnh bộ nhớ (Memory Padding) nhằm tránh False Sharing?**\\n" +
                    "-> *Đáp án: `alignas(64)`.*\\n\\n" +
                    "**Q5: Khi gọi `malloc`, thông tin về kích thước khối nhớ (Chunk Size) được giấu ở đâu?**\\n" +
                    "-> *Đáp án: Nằm ở 8 bytes hoặc 16 bytes ngay trước vị trí con trỏ mà `malloc` trả về (Chunk Metadata).*";
                }
                else {
                    // Simple local search
                    const articleNodes = document.querySelectorAll('.markdown-body p, .markdown-body li');
                    const keywords = pLower.replace(/[?.!]/g, '').split(' ').filter(w => w.length > 2 && !['làm', 'sao', 'là', 'gì', 'thế', 'nào', 'giải', 'thích', 'đoạn', 'này'].includes(w));
                    
                    let bestMatch = "";
                    let maxScore = 0;

                    articleNodes.forEach(node => {
                        const text = node.innerText;
                        const tLower = text.toLowerCase();
                        let score = 0;
                        keywords.forEach(kw => {
                            if (tLower.includes(kw)) score++;
                        });
                        if (score > maxScore) {
                            maxScore = score;
                            bestMatch = text;
                        }
                    });

                    if (maxScore > 0) {
                        response = "Theo nội dung trong bài:\\n\\n*" + bestMatch + "*";
                    } else {
                        response = "Xin lỗi, mình là Trợ lý AI Offline (Local Search). Mình không tìm thấy thông tin phù hợp với câu hỏi của bạn trong bài viết này. Hãy hỏi những câu liên quan trực tiếp đến nội dung văn bản nhé!";
                    }
                }
                
                addMsg(response, "bot");
            }, 600);
        };"""

text = text.replace(old_func, new_func)

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Offline AI integrated.")
