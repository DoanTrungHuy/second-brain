import os

with open('custom.js', 'r', encoding='utf-8') as f:
    js = f.read()

mathjax_call = """
        // Trigger MathJax after parsing markdown
        if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
            MathJax.typesetPromise([mdBody]).catch(function (err) { console.error('MathJax error:', err.message); });
        }
"""

# Insert right after mdBody.innerHTML = marked.parse(rawMarkdown);
if "MathJax.typesetPromise" not in js:
    js = js.replace('mdBody.innerHTML = marked.parse(rawMarkdown);', 'mdBody.innerHTML = marked.parse(rawMarkdown);' + mathjax_call)

with open('custom.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("MathJax trigger added to custom.js")
