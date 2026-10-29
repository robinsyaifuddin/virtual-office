with open('src/components/chat/OfficeGroupLiveChat.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r"agentName:\s*'Arga'", text)]
print('Arga calls at:', matches)
for p in matches:
    print('--- AT', p, '---')
    print(text[p-50:p+250].encode('ascii', 'backslashreplace').decode('ascii'))
