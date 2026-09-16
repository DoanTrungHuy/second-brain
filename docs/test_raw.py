import urllib.request
with open('test_marked.html', 'w', encoding='utf-8') as f:
    f.write("""<!DOCTYPE html>
<html>
<head><script src="https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js"></script></head>
<body>
<div id="out1"></div>
<div id="out2"></div>
<script>
const str1 = `\\`int\\``; 
const str2 = String.raw`\\`int\\``;
document.getElementById('out1').innerHTML = marked.parse(str1);
document.getElementById('out2').innerHTML = marked.parse(str2);
</script>
</body>
</html>""")
