import os

css_add = """
/* === ULTRA LEARNING UPGRADES === */
body.dyslexia-mode .markdown-body {
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif !important;
    letter-spacing: 0.05em !important;
    word-spacing: 0.1em !important;
    line-height: 2 !important;
}
.markdown-body mark {
    background-color: #fef08a;
    color: #1f2937;
    padding: 2px 4px;
    border-radius: 4px;
}
[data-theme="dark"] .markdown-body mark {
    background-color: #ca8a04;
    color: #fefce8;
}
.bionic-b {
    font-weight: 800 !important;
}
"""

with open('custom.css', 'a', encoding='utf-8') as f:
    f.write(css_add)

js_add = """
        // --- ULTRA LEARNING UPGRADES ---
        
        // 1. Add new buttons to Learning Dock
        const dock = document.getElementById('learning-dock');
        if (dock) {
            dock.insertAdjacentHTML('afterbegin', `
                <button id="btn-bionic" title="Đọc siêu tốc (Bionic Reading)">👁️</button>
                <button id="btn-dyslexia" title="Chế độ dễ đọc (Chống loạn chữ)">🔤</button>
                <hr style="border-color: var(--border); margin: 5px 0; width: 100%;">
                <button id="btn-ai-summary" title="AI Tóm tắt bài viết">📝</button>
                <button id="btn-ai-flashcard" title="AI Tạo thẻ ghi nhớ (Flashcards)">🃏</button>
                <hr style="border-color: var(--border); margin: 5px 0; width: 100%;">
            `);

            // Bionic Reading
            let isBionic = false;
            let originalMdHtml = document.getElementById('markdown-body').innerHTML;
            
            function applyBionicReading(node) {
                if (node.nodeType === 3) { // Text
                    const words = node.nodeValue.split(/(\\s+)/);
                    if (words.length <= 1 && words[0].trim() === '') return;
                    const fragment = document.createDocumentFragment();
                    words.forEach(word => {
                        if (word.trim().length > 0 && word.length > 1) {
                            const half = Math.ceil(word.length / 2);
                            const b = document.createElement('b');
                            b.className = 'bionic-b';
                            b.textContent = word.substring(0, half);
                            fragment.appendChild(b);
                            fragment.appendChild(document.createTextNode(word.substring(half)));
                        } else {
                            fragment.appendChild(document.createTextNode(word));
                        }
                    });
                    node.parentNode.replaceChild(fragment, node);
                } else if (node.nodeType === 1 && !['B','STRONG','CODE','PRE','A','H1','H2','H3','MARK'].includes(node.tagName)) {
                    Array.from(node.childNodes).forEach(applyBionicReading);
                }
            }

            document.getElementById('btn-bionic').onclick = function() {
                const mdBody = document.getElementById('markdown-body');
                if(!isBionic) {
                    originalMdHtml = mdBody.innerHTML; // Update just in case highlights were added
                    applyBionicReading(mdBody);
                    isBionic = true;
                    this.classList.add('dock-active');
                } else {
                    mdBody.innerHTML = originalMdHtml;
                    isBionic = false;
                    this.classList.remove('dock-active');
                    // re-attach events for image zoom and copy since innerHTML was replaced
                    attachMarkdownEvents();
                }
            };

            // Dyslexia Mode
            document.getElementById('btn-dyslexia').onclick = function() {
                document.body.classList.toggle('dyslexia-mode');
                this.classList.toggle('dock-active');
            };

            // AI Summary
            document.getElementById('btn-ai-summary').onclick = function() {
                chatWindow.classList.add('show');
                chatInput.value = "Hãy tóm tắt bài viết này thành 5 ý chính ngắn gọn dễ hiểu nhất.";
                handleSend();
            };

            // AI Flashcard
            document.getElementById('btn-ai-flashcard').onclick = function() {
                chatWindow.classList.add('show');
                chatInput.value = "Hãy tạo 5 câu hỏi trắc nghiệm hoặc Flashcard (Hỏi - Đáp) từ bài viết này để tôi ôn tập.";
                handleSend();
            };
        }

        // 2. Add Highlight button to Selection Menu
        const selMenuUI = document.getElementById('selection-menu');
        if (selMenuUI) {
            selMenuUI.insertAdjacentHTML('afterbegin', `
                <button id="sel-highlight" style="color: #eab308;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
                    Highlight
                </button>
            `);
            
            document.getElementById('sel-highlight').onclick = () => {
                const sel = window.getSelection();
                if(sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    const mark = document.createElement('mark');
                    try {
                        range.surroundContents(mark);
                    } catch(e) {
                        // Fallback if crossing node boundaries
                        document.execCommand('hiliteColor', false, document.documentElement.getAttribute('data-theme') === 'dark' ? '#ca8a04' : '#fef08a');
                    }
                    sel.removeAllRanges();
                    selMenuUI.style.display = 'none';
                }
            };
        }

        // Helper to reattach events after Bionic mode toggles innerHTML
        function attachMarkdownEvents() {
            const blocks = document.querySelectorAll('.markdown-body pre');
            blocks.forEach(pre => {
                const btn = pre.querySelector('.copy-btn-floating');
                const code = pre.querySelector('code');
                if (btn && code) {
                    const cb = () => {
                        navigator.clipboard.writeText(code.innerText);
                        btn.innerText = 'Copied!';
                        setTimeout(() => { btn.innerText = 'Copy'; }, 2000);
                    };
                    btn.onclick = cb;
                    pre.ondblclick = cb;
                }
            });
            const images = document.querySelectorAll('.markdown-body img');
            const zoomBackdrop = document.getElementById('img-zoom-backdrop');
            images.forEach(img => {
                img.onclick = (e) => {
                    e.stopPropagation();
                    img.classList.add('img-zoomed');
                    zoomBackdrop.classList.add('show');
                };
            });
        }
"""

with open('custom.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

js_content = js_content.replace('    }\n});', js_add + '\n    }\n});')

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Ultra learning tools appended successfully.")
