import os
css = """
/* === CUSTOM STYLES === */
:root {
    --progress-color: #3b82f6; /* Blue-500 */
}

/* 1. Dark Mode Adjustments */
[data-theme="dark"] {
    --bg-body: #0f172a;
    --bg-sidebar: #1e293b;
    --bg-content: #1e293b;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border: #334155;
}

/* Transparent background for code inline in dark mode to avoid highlighting conflicts */
[data-theme="dark"] .markdown-body p code, 
[data-theme="dark"] .markdown-body li code {
    background-color: transparent !important;
}

/* 2. Reading Progress Bar */
#reading-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: transparent;
    z-index: 101 !important;
}
#reading-progress-bar {
    height: 100%;
    width: 0%;
    background: var(--progress-color);
    transition: width 0.1s;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

/* 3. Mac-style Code Headers */
.markdown-body pre {
    position: relative;
    padding-top: 3rem !important; /* Make room for header */
}
.mac-window-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2.5rem;
    background: #e2e8f0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    border-bottom: 1px solid #cbd5e1;
}
[data-theme="dark"] .mac-window-header {
    background: #0f172a;
    border-bottom: 1px solid #334155;
}
.mac-dots {
    display: flex;
    gap: 6px;
}
.mac-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}
.mac-dot.red { background: #ef4444; }
.mac-dot.yellow { background: #f59e0b; }
.mac-dot.green { background: #10b981; }

.code-lang-label {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
}

.copy-btn-floating {
    position: absolute;
    right: 0.5rem;
    top: 0.4rem;
    background: transparent;
    border: 1px solid #cbd5e1;
    color: #475569;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
}
.copy-btn-floating:hover {
    background: #f1f5f9;
    color: #0f172a;
}
[data-theme="dark"] .copy-btn-floating {
    border-color: #334155;
    color: #94a3b8;
}
[data-theme="dark"] .copy-btn-floating:hover {
    background: #1e293b;
    color: #f8fafc;
}

/* 4. Table of Contents */
#toc-container {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid var(--border);
    max-height: 40vh;
    overflow-y: auto;
}
.toc-item {
    display: block;
    padding: 6px 12px;
    font-size: 0.85rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.2s;
    border-left: 2px solid transparent;
}
.toc-item:hover, .toc-item.active {
    color: var(--primary);
    background: var(--primary-light);
    border-left-color: var(--primary);
}

/* 5. Back to Top Button */
#back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    z-index: 50;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
    border: none;
}
#back-to-top.show {
    opacity: 1;
    pointer-events: auto;
}

/* === MESMERIZING MODERN REDESIGN === */

/* Typography Overhaul */
.markdown-body {
    font-size: 1.125rem !important;
    line-height: 1.8 !important;
    color: #1f2937 !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    font-weight: 400 !important;
}
[data-theme="dark"] .markdown-body {
    color: #e5e7eb !important;
}
.markdown-body p, .markdown-body li {
    color: inherit !important;
}

/* Headings Upgrade */
.markdown-body h1 {
    font-size: 2.75rem !important;
    line-height: 1.2 !important;
    font-weight: 800 !important;
    letter-spacing: -0.03em !important;
    margin-bottom: 25px !important;
    border-bottom: none !important;
    background: linear-gradient(135deg, #111827 0%, #4b5563 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: none !important;
}
[data-theme="dark"] .markdown-body h1 {
    background: linear-gradient(135deg, #ffffff 0%, #9ca3af 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.markdown-body h2 {
    font-size: 1.75rem !important;
    margin-top: 2.5em !important;
    margin-bottom: 1em !important;
    border-bottom: 1px solid var(--border);
    padding-bottom: 10px;
    font-weight: 700 !important;
    letter-spacing: -0.02em !important;
}
.markdown-body h3 {
    font-size: 1.35rem !important;
    margin-top: 2em !important;
    font-weight: 600 !important;
}

/* Article Layout: Clean Column */
#main-content {
    background-color: var(--bg-body) !important;
    padding: 0 !important;
}
.article-container {
    max-width: 720px !important;
    margin: 60px auto 120px !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 20px !important;
}

/* Glassmorphism Mobile Header & Desktop Hide */
.mobile-header {
    display: none !important;
}
@media (max-width: 768px) {
    .mobile-header {
        display: flex !important;
        position: sticky !important;
        top: 0;
        z-index: 100 !important;
        background: rgba(255, 255, 255, 0.75) !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        border-bottom: 1px solid rgba(0,0,0,0.05) !important;
        padding: 12px 20px !important;
    }
    [data-theme="dark"] .mobile-header {
        background: rgba(17, 24, 39, 0.75) !important;
        border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    }
}

/* Remove original sidebar display:none on desktop that might conflict */
/* Actually, leave it to body flex row */

/* Enhanced Links */
.markdown-body a {
    color: var(--primary) !important;
    text-decoration: none !important;
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.2s ease, opacity 0.2s ease;
}
.markdown-body a:hover {
    border-bottom: 1px solid var(--primary);
    opacity: 0.8;
}

/* Mesmerizing Blockquotes */
.markdown-body blockquote {
    background: linear-gradient(to right, var(--primary-light), transparent) !important;
    border-left: 4px solid var(--primary) !important;
    border-radius: 4px !important;
    padding: 1.25em 1.5em !important;
    font-style: italic;
    margin: 2em 0 !important;
}
[data-theme="dark"] .markdown-body blockquote {
    background: linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent) !important;
}

/* Reading Time Meta Upgrade */
.reading-meta {
    font-size: 0.95rem !important;
    color: var(--text-muted) !important;
    margin-bottom: 40px !important;
    padding-bottom: 20px !important;
    border-bottom: 1px solid var(--border);
    margin-top: 0 !important;
}

/* Sidebar Styling */
#sidebar {
    background: var(--bg-body) !important;
}
.search-box input {
    background: #ffffff !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
    border: 1px solid #e5e7eb !important;
}
[data-theme="dark"] .search-box input {
    background: #1f2937 !important;
    border: 1px solid #374151 !important;
    box-shadow: none !important;
}

.category-title {
    text-transform: none !important; /* Allow normal case */
}

/* Focus Mode */
body.focus-mode #sidebar { transform: translateX(-100%); }
body.focus-mode #toc-container { display: none !important; }
@media (min-width: 769px) {
    body.focus-mode .article-container {
        margin-left: auto !important;
        margin-right: auto !important;
        transform: none !important;
    }
    .article-container { transition: margin 0.3s ease, transform 0.3s ease; }
    #sidebar { transition: transform 0.3s ease; }
}

/* Image Zoom */
.markdown-body img { cursor: zoom-in; border-radius: 6px; max-width: 100%; }
#img-zoom-backdrop {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
    z-index: 999; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
#img-zoom-backdrop.show { opacity: 1; pointer-events: auto; cursor: zoom-out; }
.img-zoomed {
    position: fixed !important; top: 50% !important; left: 50% !important;
    transform: translate(-50%, -50%) !important; z-index: 1000 !important;
    max-width: 90vw !important; max-height: 90vh !important; object-fit: contain;
    cursor: zoom-out !important; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

/* Floating AI Button */
#ai-chat-btn {
    position: fixed; bottom: 30px; left: 30px; width: 50px; height: 50px;
    border-radius: 50%; background: linear-gradient(135deg, #6366f1, #a855f7);
    color: white; display: flex; justify-content: center; align-items: center;
    cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    z-index: 50; transition: all 0.3s ease; border: none;
}
#ai-chat-btn:hover { transform: scale(1.1); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6); }

/* AI Chat Window */
#ai-chat-window {
    position: fixed; bottom: 90px; left: 30px; width: 350px; height: 500px;
    max-height: 80vh; max-width: calc(100vw - 60px); background: var(--bg-body);
    border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    z-index: 50; display: flex; flex-direction: column; overflow: hidden;
    transform: translateY(20px); opacity: 0; pointer-events: none; transition: all 0.3s ease;
}
[data-theme="dark"] #ai-chat-window { background: var(--bg-sidebar); box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
#ai-chat-window.show { transform: translateY(0); opacity: 1; pointer-events: auto; }
#ai-chat-header { padding: 15px; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
#ai-chat-close { background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; }
#ai-chat-messages { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
.chat-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; line-height: 1.5; }
.chat-msg.bot { background: #f3f4f6; color: #1f2937; align-self: flex-start; border-bottom-left-radius: 4px; }
[data-theme="dark"] .chat-msg.bot { background: #374151; color: #f9fafb; }
.chat-msg.user { background: var(--primary); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
#ai-chat-input-area { padding: 15px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
#ai-chat-input { flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; background: transparent; color: var(--text-main); outline: none; }
#ai-chat-input:focus { border-color: var(--primary); }
#ai-chat-send { background: var(--primary); color: white; border: none; border-radius: 8px; padding: 0 15px; cursor: pointer; font-weight: 600; }
"""
with open('docs/custom.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("CSS written.")
