import os

css_add = """
/* === LEARNING TOOLS DOCK === */
#learning-dock {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bg-body);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 100;
}
[data-theme="dark"] #learning-dock {
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
}
#learning-dock button, #pomodoro-widget {
    background: none;
    border: none;
    color: var(--text-main);
    font-size: 1.2rem;
    cursor: pointer;
    border-radius: 8px;
    padding: 8px;
    transition: all 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
}
#learning-dock button:hover, #pomodoro-widget:hover {
    background: var(--primary-light);
    color: var(--primary);
}
#pomodoro-widget {
    font-size: 0.8rem;
    font-weight: 700;
    flex-direction: column;
    gap: 4px;
    font-family: 'Fira Code', monospace;
}
.dock-active {
    background: var(--primary) !important;
    color: white !important;
}

/* Focus Reader Mode */
body.focus-reader-active .markdown-body p, 
body.focus-reader-active .markdown-body li, 
body.focus-reader-active .markdown-body pre,
body.focus-reader-active .markdown-body img {
    opacity: 0.25;
    transition: opacity 0.3s;
}
body.focus-reader-active .markdown-body p:hover, 
body.focus-reader-active .markdown-body li:hover, 
body.focus-reader-active .markdown-body pre:hover,
body.focus-reader-active .markdown-body img:hover {
    opacity: 1;
}

@media (max-width: 1024px) {
    #learning-dock {
        display: none; /* Hide on small screens to save space */
    }
}
"""

with open('docs/custom.css', 'a', encoding='utf-8') as f:
    f.write(css_add)

js_add = """
        // --- LEARNING TOOLS ---
        if(window.innerWidth > 1024) {
            const dockHtml = `
                <div id="learning-dock">
                    <button id="btn-tts" title="Đọc bài viết (Text-to-Speech)">🔊</button>
                    <button id="btn-autoscroll" title="Tự động cuộn (Rảnh tay)">⏬</button>
                    <button id="btn-focus-reader" title="Đọc tập trung (Hover để làm sáng)">🔦</button>
                    <button id="btn-font-up" title="Tăng cỡ chữ">A+</button>
                    <button id="btn-font-down" title="Giảm cỡ chữ">A-</button>
                    <div id="pomodoro-widget" title="Bắt đầu Pomodoro 25 phút">🍅<br><span id="pomo-time">25:00</span></div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', dockHtml);

            // 1. Text to Speech
            let synth = window.speechSynthesis;
            let utterance = null;
            document.getElementById('btn-tts').onclick = function() {
                if(synth.speaking) {
                    synth.cancel();
                    this.classList.remove('dock-active');
                } else {
                    utterance = new SpeechSynthesisUtterance(document.getElementById('markdown-body').innerText);
                    utterance.lang = 'vi-VN';
                    utterance.rate = 1.0;
                    synth.speak(utterance);
                    this.classList.add('dock-active');
                    utterance.onend = () => this.classList.remove('dock-active');
                }
            };

            // 2. Auto Scroll
            let scrollInterval = null;
            document.getElementById('btn-autoscroll').onclick = function() {
                const mc = document.getElementById('main-content') || window;
                if(scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                    this.classList.remove('dock-active');
                } else {
                    scrollInterval = setInterval(() => mc.scrollBy({top: 1, behavior: 'auto'}), 50);
                    this.classList.add('dock-active');
                }
            };

            // 3. Focus Reader
            document.getElementById('btn-focus-reader').onclick = function() {
                document.body.classList.toggle('focus-reader-active');
                this.classList.toggle('dock-active');
            };

            // 4. Font Size Adjuster
            let currentFontSize = 1.125; // rem
            const mdBody = document.querySelector('.markdown-body');
            document.getElementById('btn-font-up').onclick = () => {
                if(currentFontSize < 2) currentFontSize += 0.1;
                mdBody.style.fontSize = currentFontSize + 'rem';
            };
            document.getElementById('btn-font-down').onclick = () => {
                if(currentFontSize > 0.8) currentFontSize -= 0.1;
                mdBody.style.fontSize = currentFontSize + 'rem';
            };

            // 5. Pomodoro Timer
            let pomoInt = null;
            let pomoTime = 25 * 60;
            const pomoDisplay = document.getElementById('pomo-time');
            document.getElementById('pomodoro-widget').onclick = function() {
                if(pomoInt) {
                    clearInterval(pomoInt);
                    pomoInt = null;
                    pomoTime = 25 * 60;
                    pomoDisplay.innerText = "25:00";
                    this.style.background = 'none';
                    this.style.color = 'var(--text-main)';
                } else {
                    this.style.background = '#ef4444';
                    this.style.color = 'white';
                    pomoInt = setInterval(() => {
                        pomoTime--;
                        const m = Math.floor(pomoTime / 60).toString().padStart(2, '0');
                        const s = (pomoTime % 60).toString().padStart(2, '0');
                        pomoDisplay.innerText = `${m}:${s}`;
                        if(pomoTime <= 0) {
                            clearInterval(pomoInt);
                            pomoInt = null;
                            alert("🍅 Hết giờ Pomodoro! Nghỉ ngơi 5 phút nhé!");
                            this.style.background = 'none';
                            this.style.color = 'var(--text-main)';
                            pomoTime = 25 * 60;
                            pomoDisplay.innerText = "25:00";
                        }
                    }, 1000);
                }
            };
        }
"""

with open('docs/custom.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = js_content.replace('    }\n});', js_add + '\n    }\n});')

with open('docs/custom.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Learning tools appended successfully.")
