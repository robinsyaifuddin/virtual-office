# Blueprint Arsitektur: 3D Office Interactive Group LiveChat & Autonomous Multi-Agent Discussion Room

Rencana ini merinci penambahan tombol ikon **Floating Chat (Live Group HQ Chat)** di halaman **Kantor 3D (`Office3D.jsx`)** yang membuka modal LiveChat full-experience.

---

## 1. Konsep & Perilaku Multi-Agent Live Group Chat (Persis WhatsApp Group)

Di dalam modal LiveChat ini, Anda bertindak sebagai **Executive Owner**, sedangkan seluruh AI Agent berkumpul dalam satu grup:
* **Arga (CSO):** Fokus strategi, sasaran bisnis, KPI, dan fasilitator debat ide.
* **Reta (COO):** Fokus tugas, timeline eksekusi, kalender kerja, dan operasional harian.
* **Silvi (CFO / Content):** Fokus keuangan, draf postingan marketing, anggaran, dan closing klien.
* **Raka (CTO / Legal):** Fokus regulasi, arsip dokumen, keamanan sistem, dan integritas data.
* **Siska (Head QA & Master Trainer):** Pengawas mutu percakapan. Jika ada bot yang melenceng atau jika Owner menegur sikap bot, Siska langsung mengintervensi dengan bijak, menegur bot yang bersangkutan, dan mengajarkan SOP yang benar.

---

## 2. Alur Dinamis Percakapan & Interaksi Nyata

```mermaid
flowchart TD
    User["Owner (Anda) Input Pesan"] --> InputRouter{"Deteksi Konteks Pesan"}

    InputRouter -->|1. Sapaan Ramah (Halo / Pagi / Sore)| AllGreet["Semua Bot Membalas Menyapa Singkat & Kompak"]
    InputRouter -->|2. Diskusi / Tanya Opini / Ide Bisnis| DebateGroup["Multi-Agent Debate: Arga, Reta, Silvi, Raka Saling Memberi Masukan & Saran Terbaik"]
    InputRouter -->|3. Perintah Eksekusi Data (Misal: Silvi buat postingan)| ToolExec["Agen Terkait Buat Draft Nyata & Simpan ke Tabel Database"]
    InputRouter -->|4. Teguran Owner atas Sikap Bot| SiskaIntervene["Siska Intervensi: Tegur Agen & Terapkan Perilaku Sopan"]

    ToolExec --> NotifyGroup["Agen Lapor ke Chat: 'Draft Telah Saya Buat di Tabel'"]
    SiskaIntervene --> InjectMemory["Siska Update SOP ke Memori Vektor"]
```

### Rincian 4 Mode Percakapan:
1. **Mode Sapaan Kompak (*General Greeting*):**
   * Contoh: *"Halo semuanya, selamat pagi!"*
   * **Respon:** Seluruh agen merespons bergantian dengan persona masing-masing (Arga menyapa fokus strategi, Reta siap tugas harian, Silvi siap kas/konten, Raka siap sistem). Tidak bertele-tele.
2. **Mode Diskusi & Debat Kualitas (*Smart Brainstorming & Trade-off*):**
   * Contoh: *"Bagaimana strategi kita untuk menaikkan closing klien bulan ini?"*
   * **Respon:** 
     * Arga mengusulkan penetrasi pasar B2B enterprise.
     * Reta mengoreksi kapasitas tim operasional.
     * Silvi menawarkan diskon pembayaran 14 hari kerja.
     * Mereka berdebat konstruktif untuk menghasilkan 1 rekomendasi terbaik yang ringkas dan padat.
3. **Mode Perintah Nyata ke Tabel (*Real Tool Calling & CRUD*):**
   * Contoh: *"@Silvi tolong buatkan draft rancangan postingan promo diskon 20% retainer."*
   * **Respon:** Silvi merespons ramah, merumuskan postingan, dan **secara nyata menyimpan data ke modul *Branding & Marketing* / *Tugas*** di database Supabase/Store. Tombol *"Lihat di Tabel Data"* muncul langsung di bubble chat!
4. **Mode Teguran Owner & Intervensi Siska (*Quality Control Live Coaching*):**
   * Contoh: *"Reta, bahasamu terlalu santai dan kurang profesional ke klien."*
   * **Respon:** **Siska** langsung muncul dengan badge emas: *"Mohon maaf Pak Robin. Saya catat evaluasi ini. Reta, perhatikan SOP komunikasi resmi DigiBooster: gunakan bahasa formal, santun, dan solutif. Aturan ini saya tanamkan sekarang juga ke memori kerja."* Reta kemudian merespons meminta maaf dan memperbaiki gaya bahasanya.

---

## 3. Desain Antarmuka Floating LiveChat (Konsisten Biru DigiBooster)

* **Tombol Pemicu di Kantor 3D:**
  * Tombol mengambang (*Floating Action Button*) elegan di kanan bawah layar kantor 3D dengan icon pesan bercahaya biru (`#0284c7`), badge counter agen online (5 Agen Aktif), dan tooltip: *"Group HQ LiveChat DigiBooster"*.
* **Modal Dialog Full LiveChat:**
  * **Header:** Judul "HQ Executive Lounge Chat", status 5 AI Agents Online, tombol Bersihkan Chat & tombol Tutup.
  * **Area Pesan:** Bubble chat dengan avatar, badge jabatan agen (*CSO, COO, CFO, CTO, Head QA*), timestamp, dan kartu pratinjau data jika ada draf yang dibuat ke database.
  * **Input Bar:** Kotak ketik cerdas dengan tombol `@Mention` cepat (Arga, Reta, Silvi, Raka, Siska), saran topik diskusi instan, dan tombol kirim responsif.

---

## 4. Tahapan Implementasi
1. Buat komponen baru: `src/components/chat/OfficeGroupLiveChat.jsx`.
2. Pasang tombol pemicu dan modal LiveChat di `src/Office3D.jsx`.
3. Hubungkan interaksi eksekusi tool calling Silvi dan pembinaan Siska ke `workspaceStore.js`.
4. Uji dan validasi seluruh alur chat hingga siap digunakan.
