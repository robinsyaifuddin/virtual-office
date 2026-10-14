import re

file_path = r"frontend\public\digibooster_office_engine.html"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# 1. Branding replacements
replacements = {
    "JILLYWOSY": "DIGIBOOSTER",
    "jillywosy": "digibooster",
    "JillyWosy": "DigiBooster",
    "Jillywosy": "DigiBooster",
    "Bang Jilly": "Direktur",
    "ke Rumah Bang Jilly": "ke Executive Lounge",
    "Lahan PnL Soros": "Lahan Pertumbuhan Leads",
    "PnL Soros": "Leads DigiBooster",
    "Tambang Emas XAUUSD": "Lumbung Proyek Client",
    "Tambang XAU": "Lumbung Proyek",
    "EA V3.01": "Agent Engine v2.0",
    "lahan PnL Soros": "lahan Pertumbuhan Leads",
    "khusus tamu & staf Jillywosy": "khusus tamu & tim DigiBooster",
    "/jillywosy_api_state.json": "/digibooster_state.json",
    # 2. Mojibake cleanup
    "ΓÇô": "–",
    "ΓÇö": "—",
    "ΓÇª": "…",
    "┬╖": "·",
    "Γ£ô": "✓",
    "Γ£ò": "✕",
    "ΓÿÉ": "◻",
    "ΓÜá∩╕Å": "⚠️",
    "ΓùÅ": "●",
    "Γåæ": "↑",
    "Γåô": "↓",
    "ΓåÆ": "→",
    "Γ¢Å∩╕Å": "⛏️",
    "≡ƒî╛": "🌾",
    "≡ƒÄ¼": "🎬",
    "≡ƒÅó": "🏢",
    "≡ƒÅá": "🏠",
    "≡ƒÜ¬": "🚪",
    "≡ƒñû": "🤖",
    "≡ƒÆ¼": "💬",
    "≡ƒà┐∩╕Å": "🅿️",
    "≡ƒ¬Ö": "🪙",
    "≡ƒôî": "📌",
    "≡ƒº╛": "🧾",
    "?? Server": "⚠️ Server",
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Clean any remaining stray mojibake patterns like ≡ƒ...
content = re.sub(r'≡ƒ[^\s<"]+', '', content)
content = re.sub(r'Γ[^\s<"]+', '', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("HTML successfully cleaned and updated!")
