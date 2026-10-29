import urllib.request
import json

with open('.env', 'r', encoding='utf-8') as f:
    text = f.read()

gemini_key = ''
for line in text.splitlines():
    if 'VITE_GEMINI_API_KEY=' in line:
        gemini_key = line.split('=', 1)[1].strip()

prompt = "Create a single descriptive visual prompt in English for FLUX image generator: website design promotion banner, modern sleek aesthetic, high resolution 8k, photorealistic. Return ONLY the prompt text, no quotes, no markdown."

# Coba gemini-2.0-flash atau gemini-1.5-flash
for model in ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-flash-latest']:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={gemini_key}"
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}]
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            cand = res['candidates'][0]['content']['parts'][0]['text']
            print(f'SUCCESS with {model}:\n', cand.strip()[:100])
            break
    except Exception as e:
        print(f'Failed {model}:', e)
