import re

file_path = r"frontend\public\digibooster_office_engine.html"

with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
    c = f.read()

# Replace any lingering mentions of Bang Jilly, Soros, Jilly, Tambang Emas XAUUSD
replacements = [
    (r"RUMAH BANG JILLY", "EXECUTIVE LOUNGE"),
    (r"KEBUN SOROS", "LAHAN LEADS DIGIBOOSTER"),
    (r"LAHAN PnL SOROS", "LAHAN LEADS DIGIBOOSTER"),
    (r"Lahan PnL Soros", "Lahan Leads DigiBooster"),
    (r"lahan PnL Soros", "lahan Leads DigiBooster"),
    (r"TAMBANG EMAS XAUUSD", "LUMBUNG PROYEK & CLOSING"),
    (r"Tambang Emas XAUUSD", "Lumbung Proyek & Closing"),
    (r"tambang emas XAUUSD", "lumbung proyek & closing"),
    (r"by SOROS", "by DIGIBOOSTER"),
    (r"Pertanian Crypto Futures by Soros", "Otomasi Leads & Growth DigiBooster"),
    (r"demand XAUUSD", "prospek client baru"),
    (r"Pemilik tambang", "Project Manager"),
    (r'name:"Jilly"', 'name:"Fandi"'),
    (r'id:"jilly"', 'id:"fandi"'),
    (r'"Jilly"', '"Fandi"'),
    (r'JillyWosy', 'DigiBooster Indonesia'),
    (r'Jillywosy', 'DigiBooster Indonesia'),
    (r'jillywosy', 'digibooster'),
    (r'JILLYWOSY', 'DIGIBOOSTER'),
    (r'Bang Jilly', 'Direktur'),
]

for pat, repl in replacements:
    c = re.sub(pat, repl, c)

# Bersihkan karakter simbol aneh yang masih muncul tanda tanya dobel / mojibake
c = c.replace("?? RUMAH", "🛋️ EXECUTIVE")
c = c.replace("?? TAMBANG", "⛏️ LUMBUNG")
c = c.replace("?? ", "⚡ ")
c = c.replace("", "·")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(c)

print("Replacement step 2 completed cleanly!")
