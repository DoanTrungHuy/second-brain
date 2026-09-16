with open('test.html', 'w', encoding='utf-8') as f:
    f.write("<script src='https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js'></script>")
    f.write("<script>console.log(marked.parse('Offset ($0 \\\\rightarrow 5$)'));</script>")
