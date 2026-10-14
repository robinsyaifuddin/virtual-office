with open('frontend/public/digibooster_office_engine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Disable pylon
pylon_target = 'const sg=new THREE.Group();sg.position.set(-.4,-.15,PZ);sg.rotation.y=.62;g.add(sg);'
pylon_repl = 'const sg=new THREE.Group();sg.position.set(-.4,-.15,PZ);sg.rotation.y=.62;sg.visible=false;'

if pylon_target in text:
    text = text.replace(pylon_target, pylon_repl, 1)
    print("Pylon disabled")
else:
    print("Pylon target not found")

# 2. Disable buildBillboards
start_bb = text.find('function buildBillboards(g,M,GX){')
if start_bb != -1:
    end_bb = text.find('return{pr,pa,t:-1,n:0}}', start_bb) + len('return{pr,pa,t:-1,n:0}}')
    text = text[:start_bb] + 'function buildBillboards(g,M,GX){return null}' + text[end_bb:]
    print("buildBillboards replaced")

# 3. Disable buildFarmBillboard
start_fb = text.find('function buildFarmBillboard(g,F){')
if start_fb != -1:
    end_fb = text.find('return{pr,t:-1,n:0}}', start_fb) + len('return{pr,t:-1,n:0}}')
    text = text[:start_fb] + 'function buildFarmBillboard(g,F){return null}' + text[end_fb:]
    print("buildFarmBillboard replaced")

# 4. Safe tickBillboards
tick_bb = 'function tickBillboards(bb,t){if(!bb||bb.n>=2||(bb.n===1&&t-bb.t<3))return;'
tick_bb_repl = 'function tickBillboards(bb,t){if(!bb||!bb.pr||bb.n>=2||(bb.n===1&&t-bb.t<3))return;'
text = text.replace(tick_bb, tick_bb_repl)

tick_fb = 'function tickFarmBillboard(fb,t){if(!fb||fb.n>=2||(fb.n===1&&t-fb.t<3))return;'
tick_fb_repl = 'function tickFarmBillboard(fb,t){if(!fb||!fb.pr||fb.n>=2||(fb.n===1&&t-fb.t<3))return;'
text = text.replace(tick_fb, tick_fb_repl)

with open('frontend/public/digibooster_office_engine.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Saved updated engine!")
