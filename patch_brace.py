with open('frontend/public/digibooster_office_engine.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'set(t){if(t===this.say)return;this.say=t;this.bub.textContent=t;this.bub.classList.toggle("zz",t==="zZ");this.bub.classList.toggle("fix",/^(bantu|reparasi|perbaiki)/.test(t))}}'
replacement = 'set(t){if(t===this.say)return;this.say=t;this.bub.textContent=t;this.bub.classList.toggle("zz",t==="zZ");this.bub.classList.toggle("fix",/^(bantu|reparasi|perbaiki)/.test(t))}}}'

if target in text:
    text = text.replace(target, replacement, 1)
    with open('frontend/public/digibooster_office_engine.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Added closing brace successfully!")
else:
    print("Target not found")
