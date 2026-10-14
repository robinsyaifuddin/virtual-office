with open('frontend/public/digibooster_office_engine.html', 'r', encoding='utf-8') as f:
    text = f.read()

s_start = text.index('<script type="module">') + len('<script type="module">')
s_end = text.index('</script>', s_start)

js_content = text[s_start:s_end]
with open('test_engine.mjs', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Saved test_engine.mjs, length:", len(js_content))
