// Mock database & initial state untuk modul manajemen kantor virtual
export const INITIAL_ARCHIVES = [
  {
    id: 'DOC-LEG-001',
    drawer: 'legal',
    title: 'Perjanjian Kerja Sama (PKS) Klien Strategis Q4',
    category: 'Kontrak Hukum',
    author: 'Kevin Pratama (@Admin)',
    date: '14 Okt 2026',
    status: 'Aktif',
    size: '184 KB',
    description: 'Format klausul hukum standar kerjasama retainer DigiBooster dengan klausul SLA 99.9% dan proteksi hak cipta AI.',
    content: `PERJANJIAN KERJA SAMA OPERASIONAL DIGITAL (PKS)
Nomor: 014/PKS-DGB/X/2026

Pada hari ini, disepakati kerja sama implementasi Autonomous Agentic Intelligence:
1. Ruang Lingkup: Pengadaan sistem automasi 4 divisi (Admin, Kreatif, Riset, Operasional).
2. Standar Layanan (SLA): Respon grup WhatsApp < 5 detik bertenaga Groq Llama 3.3.
3. Kerahasiaan Data: Seluruh data arsip disimpan dalam repositori terenkripsi.`
  },
  {
    id: 'DOC-FIN-002',
    drawer: 'finance',
    title: 'Rekap Arus Kas & Laporan Tagihan Klien Oktober 2026',
    category: 'Faktur & Keuangan',
    author: 'Nadira (@Finance)',
    date: '13 Okt 2026',
    status: 'Lunas',
    size: '92 KB',
    description: 'Rekapitulasi tagihan aktif, pembayaran langganan server API, dan proyeksi laba bersih operasional bulan ini.',
    content: `REKAPITULASI KEUANGAN OPERASIONAL DIGIBOOSTER
Periode: Oktober 2026

- Total Tagihan Klien Terbayar: Rp 45.000.000 (3 Invoice)
- Biaya Operasional Server (Vercel, Green-API, Groq): Rp 0 (Free Tier Optimization)
- Saldo Kas Operasional: Rp 45.000.000
- Status Audit: Seimbang (Verified by @Finance Agent)`
  },
  {
    id: 'DOC-CRE-003',
    drawer: 'creative',
    title: 'Bank Konten: 10 Script Video Pendek TikTok/Reels Viral',
    category: 'Aset Kreatif',
    author: 'Dina Safitri (@Creative)',
    date: '12 Okt 2026',
    status: 'Siap Tayang',
    size: '340 KB',
    description: 'Kumpulan naskah video format hook 3 detik dengan formula Problem-Agitate-Solve untuk audiens UMKM dan Founder.',
    content: `SERI KONTEN VIRAL: KANTOR DIGITAL MASA DEPAN

[Script #1: Hook Masalah Kantor Fisik]
- 00:00-00:03 (Hook): "Bayar sewa kantor puluhan juta cuma buat koordinasi yang sebenernya bisa selesai di WhatsApp?"
- 00:03-00:15 (Story): Tampilkan cuplikan agen AI bekerja otomatis membalas tugas di grup WA kantor.
- 00:15-00:30 (CTA): "Mulai migrasi operasional bisnis kamu ke sistem agentic sekarang. Link di bio!"`
  },
  {
    id: 'DOC-RES-004',
    drawer: 'research',
    title: 'Laporan Intelijen: Tren AI Agentic Workflow di Asia Tenggara',
    category: 'Riset Pasar',
    author: 'Tomi (@Research)',
    date: '11 Okt 2026',
    status: 'Terdokumentasi',
    size: '512 KB',
    description: 'Analisis perbandingan adopsi multi-agent berbasis WhatsApp di Indonesia vs Singapura & tren model LLM open weights.',
    content: `RINGKASAN RISET PASAR AGENTIC AUTOMATION 2026

- Pertumbuhan Permintaan: Peningkatan 340% bisnis UMKM mencari solusi otomasi WhatsApp tanpa langganan mahal.
- Keunggulan Llama 3.3 70B: Inferensi kencang di Groq memberikan kepuasan interaksi tertinggi bagi pengguna bisnis lokal.`
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'SUB-9801',
    agentName: 'Dina Safitri',
    agentRole: '@Creative Agent',
    taskTitle: 'Draft Copywriting Broadcast WhatsApp Promo Diskon 10.10',
    timestamp: 'Baru Saja (07:15 WIB)',
    priority: 'Tinggi',
    status: 'Menunggu Persetujuan',
    engineUsed: 'Groq Llama 3.3',
    summary: 'Copywriting format AIDA untuk promosi flash sale khusus di blast grup WhatsApp VIP.',
    fullOutput: `🔥 *PENAWARAN SPESIAL 10.10 UNTUK PARTNER BISNIS KAMI!*

Halo Rekan Pebisnis,
Apakah Anda masih kerepotan mengurus rekap operasional dan konten harian manual?

Kini kantor Anda bisa beroperasi otomatis dengan asisten AI 24/7 di WhatsApp:
✅ Tidak butuh sewa server mahal
✅ Respon kilat dalam 1 detik
✅ Koordinasi tim lebih rapi & terarsip

*Klaim Konsultasi Gratis Hari Ini:*
Balas pesan ini dengan ketik: *KANTOR OTOMATIS* sekarang juga!`
  },
  {
    id: 'SUB-9802',
    agentName: 'Kevin Pratama',
    agentRole: '@Admin Agent',
    taskTitle: 'Draft Invoice Klien: PT Nusa Cipta Solusi (Invoice #INV-2026-089)',
    timestamp: '15 Menit Lalu',
    priority: 'Sedang',
    status: 'Menunggu Persetujuan',
    engineUsed: 'Groq Llama 3.3',
    summary: 'Pembuatan faktur termin ke-2 untuk paket implementasi multi-agent kantor virtual.',
    fullOutput: `FAKTUR PENAGIHAN RESMI (INVOICE)
No: INV/DGB/2026/089
Kepada: PT Nusa Cipta Solusi
Tanggal Jatuh Tempo: 20 Oktober 2026

Uraian:
1. Setup Webhook & Multi-Agent WhatsApp Gateway: Rp 7.500.000
2. Integrasi Groq Dual-Engine & Dashboard Manajemen: Rp 5.000.000

Total Tagihan: Rp 12.500.000
Bank Mandiri: 123-00-9876543-1 a.n. PT DigiBooster Indonesia`
  },
  {
    id: 'SUB-9803',
    agentName: 'Tomi',
    agentRole: '@Research Agent',
    taskTitle: 'Rangkuman Perbandingan Fitur Kompetitor CRM WhatsApp',
    timestamp: '1 Jam Lalu',
    priority: 'Rendah',
    status: 'Disetujui',
    engineUsed: 'Gemini 2.5 Flash',
    summary: 'Matriks perbandingan kelebihan fitur chatbot biasa vs multi-agent cerdas.',
    fullOutput: `MATRIKS KOMPARASI PRODUK:
- Chatbot Konvensional: Hanya merespon kata kunci kaku (Button/Menu 1, 2, 3).
- DigiBooster Multi-Agent: Memahami konteks instruksi bebas di grup WhatsApp, membagi tugas internal, dan menyusun laporan terstruktur.`
  }
];

export const INITIAL_KANBAN = {
  backlog: [
    { id: 'KB-1', title: 'Penyusunan SOP Penanganan Klien VIP', division: 'Admin', owner: 'Kevin Pratama', tag: 'Legal' },
    { id: 'KB-2', title: 'Riset Template Konten Infografis LinkedIn', division: 'Creative', owner: 'Dina Safitri', tag: 'Branding' }
  ],
  in_progress: [
    { id: 'KB-3', title: 'Audit Performa Laten API Groq vs Gemini', division: 'Tech', owner: 'Maya Nirmala', tag: 'Sistem' },
    { id: 'KB-4', title: 'Penyusunan Arsip Pajak Badan Triwulan 3', division: 'Finance', owner: 'Nadira', tag: 'Keuangan' }
  ],
  in_review: [
    { id: 'KB-5', title: 'Draft Copywriting Broadcast WhatsApp 10.10', division: 'Creative', owner: 'Dina Safitri', tag: 'Konten' },
    { id: 'KB-6', title: 'Invoice #INV-2026-089 PT Nusa Cipta', division: 'Admin', owner: 'Kevin Pratama', tag: 'Faktur' }
  ],
  done: [
    { id: 'KB-7', title: 'Pembaruan Dokumen PKS Retainer 2026', division: 'Admin', owner: 'Kevin Pratama', tag: 'Legal' },
    { id: 'KB-8', title: 'Konfigurasi Webhook Green-API WhatsApp', division: 'Tech', owner: 'Maya Nirmala', tag: 'Integrasi' }
  ]
};

export const INITIAL_TIMELINE = [
  { id: 'TL-1', time: '08:00 WIB', title: 'Morning Standup & Briefing Otomatis', desc: 'Manager Agent merangkum antrean tugas harian di grup WhatsApp.', badge: 'Rutin' },
  { id: 'TL-2', time: '11:30 WIB', title: 'Rilis Konten Media Sosial Batch 1', desc: 'Creative Agent menayangkan postingan edukasi Instagram Carousel.', badge: 'Publikasi' },
  { id: 'TL-3', time: '14:00 WIB', title: 'Evaluasi Pembayaran & Rekap Kas', desc: 'Finance Agent mencocokkan status mutasi invoice masuk.', badge: 'Keuangan' },
  { id: 'TL-4', time: '17:00 WIB', title: 'Daily Report & Arsip Berkas ke Lemari', desc: 'Seluruh output yang disetujui dipindahkan ke Lemari Arsip Digital.', badge: 'Sistem' }
];
