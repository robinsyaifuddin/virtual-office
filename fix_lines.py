with open(r'frontend\public\digibooster_office_engine.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'set(t){if(t===this.say)return;' in l:
        print(f"Fixing line {i+1}: {repr(l)}")
        lines[i] = '    set(t){if(t===this.say)return;this.say=t;this.bub.textContent=t;this.bub.classList.toggle("zz",t==="zZ");this.bub.classList.toggle("fix",/^(bantu|reparasi|perbaiki)/.test(t))}}\n'
    if 'setBubble(t){if(t===this.bubble)return;' in l:
        print(f"Fixing line {i+1}: {repr(l)}")
        lines[i] = '  setBubble(t){if(t===this.bubble)return;this.bubble=t;this.bubEl.textContent=t;this.bubEl.classList.toggle("zz",t==="zZ");this.bubEl.classList.toggle("fix",/^(bantu|reparasi|perbaiki)/.test(t))}\n'

with open(r'frontend\public\digibooster_office_engine.html', 'w', encoding='utf-8') as f:
    lines = f.writelines(lines)

print("Repair completed!")
