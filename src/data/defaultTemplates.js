// src/data/defaultTemplates.js
// Preset template siap pakai per kategori untuk seluruh modul Workspace DigiBooster

export const DEFAULT_PRESET_TEMPLATES = {
  // 1. Modul Tugas & Kalender
  'Tugas & Kalender': {
    'Website & Tracking': [
      {
        id: 'TPL-TSK-WEB-1',
        title: 'Audit Core Web Vitals & Meta Pixel Tracking',
        category: 'Website & Tracking',
        priority: 'P1',
        status: 'Backlog',
        assignee: 'DigiBot Researcher',
        description: 'Pemeriksaan performa LCP/INP < 2.5s, konfigurasi Google Tag Manager, dan verifikasi event Purchase Meta Pixel.'
      },
      {
        id: 'TPL-TSK-WEB-2',
        title: 'Setup Integrasi Payment Gateway Midtrans & Webhook',
        category: 'Website & Tracking',
        priority: 'P1',
        status: 'Backlog',
        assignee: 'Kevin Pratama',
        description: 'Implementasi payment gateway otomatis, testing notifikasi webhook transaksi sukses, dan rekonsiliasi mutasi kas.'
      },
      {
        id: 'TPL-TSK-WEB-3',
        title: 'Optimasi SEO On-Page & Schema Markup Rich Snippets',
        category: 'Website & Tracking',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot Copywriter',
        description: 'Peningkatan ranking kata kunci Google, penambahan JSON-LD Organization & FAQ, serta perbaikan broken link.'
      }
    ],
    'Sosial Media & Ads': [
      {
        id: 'TPL-TSK-ADS-1',
        title: 'Optimasi Meta Ads Scale Budget & A/B Testing Creative',
        category: 'Sosial Media & Ads',
        priority: 'P1',
        status: 'Sedang Dikerjakan',
        assignee: 'Dina Safitri',
        description: 'Scale kampanye iklan dengan ROAS > 3.5x, pengujian 3 hook video reels baru, dan eliminasi ad set jenuh.'
      },
      {
        id: 'TPL-TSK-ADS-2',
        title: 'Produksi 5 Konten Carousel Edukasi Instagram',
        category: 'Sosial Media & Ads',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot Copywriter',
        description: 'Pembuatan slide edukasi problem-agitate-solve untuk founder bisnis dan automasi direct message leads.'
      }
    ],
    'Operasional & Riset': [
      {
        id: 'TPL-TSK-OPS-1',
        title: 'Penyusunan SOP Standar Penanganan Klien Baru',
        category: 'Operasional & Riset',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot TaskOps Specialist',
        description: 'Pembuatan alur onboarding klien otomatis via WhatsApp, template formulir brief, dan SLA koordinasi tim.'
      },
      {
        id: 'TPL-TSK-OPS-2',
        title: 'Benchmarking AI Agent Automation Kompetitor 2026',
        category: 'Operasional & Riset',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot Researcher',
        description: 'Riset tren tools multi-agent workflow terkini dan peluang diferensiasi penawaran DigiBooster.'
      }
    ],
    'Klien & Project': [
      {
        id: 'TPL-TSK-KLN-1',
        title: 'Sprint Kick-Off & Timeline Delivery Project Klien',
        category: 'Klien & Project',
        priority: 'P1',
        status: 'Sedang Dikerjakan',
        assignee: 'Kevin Pratama',
        description: 'Penyelarasan target milestone 30 hari bersama stakeholders dan pembagian deliverable mingguan tim.'
      }
    ]
  },

  // 2. Modul Branding & Marketing
  'Kalender & Kampanye Pemasaran': {
    'Edukasi': [
      {
        id: 'TPL-MKT-EDU-1',
        title: '5 Alasan Bisnis Modern Beralih ke AI Multi-Agent',
        pillar: 'Edukasi',
        stage: 'Ide',
        channel: ['Instagram', 'LinkedIn'],
        adSpend: 0,
        metrics: { reach: 1500, leads: 12 }
      },
      {
        id: 'TPL-MKT-EDU-2',
        title: 'Tutorial Step-by-Step Setup Tracking Omnichannel 2026',
        pillar: 'Edukasi',
        stage: 'Design/Video',
        channel: ['YouTube', 'Instagram'],
        adSpend: 150000,
        metrics: { reach: 2800, leads: 25 }
      }
    ],
    'Case Study': [
      {
        id: 'TPL-MKT-CS-1',
        title: 'Studi Kasus: Bagaimana Klien B2B Memangkas Biaya CS 60%',
        pillar: 'Case Study',
        stage: 'Review',
        channel: ['LinkedIn', 'Website'],
        adSpend: 0,
        metrics: { reach: 3500, leads: 40 }
      }
    ],
    'Promo/Hard Sell': [
      {
        id: 'TPL-MKT-PRM-1',
        title: 'Promo Spesial Kuartal: Paket Transformasi AI DigiBooster',
        pillar: 'Promo/Hard Sell',
        stage: 'Siap Tayang',
        channel: ['Instagram', 'Meta Ads'],
        adSpend: 500000,
        metrics: { reach: 12000, leads: 85 }
      }
    ],
    'Behind The Scenes': [
      {
        id: 'TPL-MKT-BTS-1',
        title: 'Di Balik Layar: Cara Tim Kami Melatih Autonomous AI Agent',
        pillar: 'Behind The Scenes',
        stage: 'Ide',
        channel: ['Instagram', 'TikTok'],
        adSpend: 0,
        metrics: { reach: 2000, leads: 8 }
      }
    ],
    'Tips & Trick': [
      {
        id: 'TPL-MKT-TIP-1',
        title: '3 Formula Prompt Groq Llama 3.3 untuk Automasi Email Cepat',
        pillar: 'Tips & Trick',
        stage: 'Ide',
        channel: ['Instagram', 'Twitter/X'],
        adSpend: 0,
        metrics: { reach: 2400, leads: 15 }
      }
    ]
  },

  // 3. Modul CRM & Klien
  'Pipeline Klien & Prospek': {
    'Enterprise Corp': [
      {
        id: 'TPL-CRM-ENT-1',
        name: 'PT Mitra Solusi Nusantara (Enterprise)',
        category: 'Enterprise Corp',
        stage: 'Discovery Call',
        dealValue: 85000000,
        services: ['Custom AI', 'Web Dev'],
        pic: 'Kevin Pratama',
        contact: '+62 812-9988-7766'
      }
    ],
    'UKM / Ritel': [
      {
        id: 'TPL-CRM-UKM-1',
        name: 'Brand Fashion & Lifestyle Lokal',
        category: 'UKM / Ritel',
        stage: 'Lead Masuk',
        dealValue: 25000000,
        services: ['Social Media', 'Meta Ads'],
        pic: 'Dina Safitri',
        contact: '+62 813-2233-4455'
      }
    ],
    'Startup & Tech': [
      {
        id: 'TPL-CRM-STP-1',
        name: 'Fintech / SaaS Platform Indonesia',
        category: 'Startup & Tech',
        stage: 'Proposal Terkirim',
        dealValue: 65000000,
        services: ['Custom AI', 'Automation'],
        pic: 'Kevin Pratama',
        contact: '+62 811-5544-3322'
      }
    ],
    'Pemerintahan / BUMN': [
      {
        id: 'TPL-CRM-BUMN-1',
        name: 'BUMN Klaster Logistik Digital',
        category: 'Pemerintahan / BUMN',
        stage: 'Discovery Call',
        dealValue: 120000000,
        services: ['Custom AI', 'Dashboard Enterprise'],
        pic: 'Kevin Pratama',
        contact: '+62 812-7788-9900'
      }
    ]
  },

  // 4. Modul Keuangan & Transaksi
  'Buku Kas & Transaksi': {
    'Pembayaran Klien': [
      {
        id: 'TPL-FIN-INC-1',
        title: 'Pelunasan Retainer Jasa Automasi AI Bulanan',
        type: 'Pemasukan',
        category: 'Pembayaran Klien',
        amount: 25000000,
        clientRef: 'Klien Retainer Q4',
        status: 'Lunas',
        receiptDoc: 'INV-2026-OCT-01.pdf'
      }
    ],
    'Server & Tools': [
      {
        id: 'TPL-FIN-EXP-1',
        title: 'Langganan Cloud Infrastructure Vercel Pro & Groq API',
        type: 'Pengeluaran',
        category: 'Server & Tools',
        amount: 1850000,
        clientRef: 'Internal Infra',
        status: 'Lunas',
        receiptDoc: 'RECEIPT-CLOUD-OCT.pdf'
      }
    ],
    'Marketing Ads': [
      {
        id: 'TPL-FIN-ADS-1',
        title: 'Top-Up Saldo Meta Ads Manager & Google Ads',
        type: 'Pengeluaran',
        category: 'Marketing Ads',
        amount: 5000000,
        clientRef: 'Kampanye Branding Q4',
        status: 'Lunas',
        receiptDoc: 'INVOICE-META-ADS.pdf'
      }
    ],
    'Operasional Kantor': [
      {
        id: 'TPL-FIN-OPS-1',
        title: 'Pengadaan Perlengkapan Operasional & Internet Kantor',
        type: 'Pengeluaran',
        category: 'Operasional Kantor',
        amount: 2200000,
        clientRef: 'Operasional Kantor',
        status: 'Lunas',
        receiptDoc: 'KWITANSI-OPS.pdf'
      }
    ]
  },

  // 5. Modul Data Arsip
  'Repositori Berkas & Arsip Dokumen': {
    'Dokumen PDF / Legalitas': [
      {
        id: 'TPL-ARC-LEG-1',
        title: 'Draft Standar Perjanjian Kerjasama (PKS) Retainer 2026',
        category: 'Dokumen PDF / Legalitas',
        fileFormat: 'PDF',
        version: 'v2.1',
        status: 'Aktif',
        accessLevel: 'Publik Semua Tim',
        fileSize: '240 KB'
      }
    ],
    'Spreadsheet & Finansial': [
      {
        id: 'TPL-ARC-FIN-1',
        title: 'Template Financial Projection & P&L Statement Tahunan',
        category: 'Spreadsheet & Finansial',
        fileFormat: 'XLSX',
        version: 'v1.4',
        status: 'Aktif',
        accessLevel: 'Hanya Manager',
        fileSize: '512 KB'
      }
    ],
    'Presentasi & Pitch Deck': [
      {
        id: 'TPL-ARC-DECK-1',
        title: 'Master Company Profile & Pitch Deck DigiBooster 2026',
        category: 'Presentasi & Pitch Deck',
        fileFormat: 'PDF',
        version: 'v3.0',
        status: 'Aktif',
        accessLevel: 'Publik Semua Tim',
        fileSize: '4.8 MB'
      }
    ]
  },

  // 6. Modul Rapat & Catatan
  'Daftar Rapat & Notulensi': {
    'Internal Weekly Sync': [
      {
        id: 'TPL-MTG-WKL-1',
        title: 'Weekly All-Hands Sync & Evaluasi Sasaran Sprint',
        type: 'Internal Weekly Sync',
        status: 'Terjadwal',
        room: 'Ruang Rapat Virtual 3D',
        participants: ['Kevin Pratama', 'Dina Safitri', 'Tomi', 'DigiBot Researcher'],
        notes: 'Review pencapaian mingguan, hambatan (blockers), dan alokasi prioritas AI Agent.'
      }
    ],
    'Client Kick-off': [
      {
        id: 'TPL-MTG-CLN-1',
        title: 'Kick-off Meeting Proyek Baru & Penyelarasan Deliverable Klien',
        type: 'Client Kick-off',
        status: 'Terjadwal',
        room: 'Google Meet / Virtual Office',
        participants: ['Kevin Pratama', 'Stakeholders Klien'],
        notes: 'Penyampaian roadmap 60 hari kerja, alur komunikasi WhatsApp, serta serah terima akses.'
      }
    ]
  },

  // 7. Modul Sasaran & KPI
  'Matriks OKR Kuartal 4': {
    'Revenue & Pertumbuhan': [
      {
        id: 'TPL-OKR-REV-1',
        title: 'Ekspansi Pendapatan Retainer Agency ke Skala Enterprise',
        objective: 'Ekspansi Pendapatan Retainer Agency ke Skala Enterprise',
        keyResult: 'Capai Monthly Recurring Revenue (MRR) Rp 100 Juta',
        category: 'Revenue & Pertumbuhan',
        division: 'Bisnis & Sales',
        quarter: 'Q4',
        targetNum: 100000000,
        currentNum: 75000000,
        unit: 'IDR',
        owner: 'Kevin Pratama',
        status: 'On Track'
      },
      {
        id: 'TPL-OKR-REV-2',
        title: 'Penetrasi Pasar B2B dengan Penawaran Autonomous Agency',
        objective: 'Penetrasi Pasar B2B dengan Penawaran Autonomous Agency',
        keyResult: 'Closing 5 Klien Retainer Baru Nilai Min. Rp 25 Jt',
        category: 'Revenue & Pertumbuhan',
        division: 'Bisnis & Sales',
        quarter: 'Q4',
        targetNum: 5,
        currentNum: 3,
        unit: '%',
        owner: 'Kevin Pratama',
        status: 'On Track'
      }
    ],
    'Teknologi & Infrastruktur': [
      {
        id: 'TPL-OKR-TECH-1',
        title: 'Optimalisasi Latensi Sistem Multi-Agent Realtime',
        objective: 'Optimalisasi Latensi Sistem Multi-Agent Realtime',
        keyResult: 'Tekan rata-rata respons inferensi LLM di bawah 2 detik',
        category: 'Teknologi & Infrastruktur',
        division: 'Tech & AI',
        quarter: 'Q4',
        targetNum: 1.5,
        currentNum: 1.8,
        unit: 'Detik',
        owner: 'Tomi (Engineer)',
        status: 'On Track'
      },
      {
        id: 'TPL-OKR-TECH-2',
        title: 'Keandalan Uptime Server & Integrasi Webhook WhatsApp',
        objective: 'Keandalan Uptime Server & Integrasi Webhook WhatsApp',
        keyResult: 'Mempertahankan Service Level Agreement (SLA) 99.9%',
        category: 'Teknologi & Infrastruktur',
        division: 'Tech & AI',
        quarter: 'Q4',
        targetNum: 99.9,
        currentNum: 99.5,
        unit: '%',
        owner: 'Tomi (Engineer)',
        status: 'On Track'
      }
    ],
    'Brand & Komunitas': [
      {
        id: 'TPL-OKR-BRD-1',
        title: 'Tingkatkan Brand Authority di Media Sosial Bisnis',
        objective: 'Tingkatkan Brand Authority di Media Sosial Bisnis',
        keyResult: 'Raih 50.000 Followers Organik & 500 Leads Masuk',
        category: 'Brand & Komunitas',
        division: 'Kreatif & Branding',
        quarter: 'Q4',
        targetNum: 500,
        currentNum: 380,
        unit: 'Leads',
        owner: 'Dina Safitri',
        status: 'On Track'
      },
      {
        id: 'TPL-OKR-BRD-2',
        title: 'Penyelenggaraan Webinar Eksklusif AI Transformasi 2026',
        objective: 'Penyelenggaraan Webinar Eksklusif AI Transformasi 2026',
        keyResult: 'Menjaring 1.000 Peserta Founder & Eksekutif Bisnis',
        category: 'Brand & Komunitas',
        division: 'Kreatif & Branding',
        quarter: 'Q4',
        targetNum: 1000,
        currentNum: 750,
        unit: 'Peserta',
        owner: 'Dina Safitri',
        status: 'On Track'
      }
    ],
    'Efisiensi Operasional': [
      {
        id: 'TPL-OKR-OPS-1',
        title: 'Otomatisasi 80% Tiket Layanan Rutin Tim',
        objective: 'Otomatisasi 80% Tiket Layanan Rutin Tim',
        keyResult: 'Pemangkasan durasi manual task dari 4 jam menjadi < 30 menit',
        category: 'Efisiensi Operasional',
        division: 'Operasional',
        quarter: 'Q4',
        targetNum: 80,
        currentNum: 65,
        unit: '%',
        owner: 'DigiBot TaskOps Specialist',
        status: 'On Track'
      }
    ],
    'Kepuasan Klien': [
      {
        id: 'TPL-OKR-CS-1',
        title: 'Tingkatkan Net Promoter Score (NPS) Klien Retainer',
        objective: 'Tingkatkan Net Promoter Score (NPS) Klien Retainer',
        keyResult: 'Mencapai skor kepuasan minimal 4.8 dari skala 5.0',
        category: 'Kepuasan Klien',
        division: 'Account Management',
        quarter: 'Q4',
        targetNum: 5,
        currentNum: 4.8,
        unit: 'Skor',
        owner: 'Kevin Pratama',
        status: 'Tercapai'
      }
    ]
  },
  'Sasaran Strategis & Key Results': {
    'Revenue & Pertumbuhan': [
      {
        id: 'TPL-OKR-REV-1',
        title: 'Ekspansi Pendapatan Retainer Agency ke Skala Enterprise',
        objective: 'Ekspansi Pendapatan Retainer Agency ke Skala Enterprise',
        keyResult: 'Capai Monthly Recurring Revenue (MRR) Rp 100 Juta',
        category: 'Revenue & Pertumbuhan',
        division: 'Bisnis & Sales',
        quarter: 'Q4',
        targetNum: 100000000,
        currentNum: 75000000,
        unit: 'IDR',
        owner: 'Kevin Pratama',
        status: 'On Track'
      }
    ],
    'Teknologi & Infrastruktur': [
      {
        id: 'TPL-OKR-TECH-1',
        title: 'Optimalisasi Latensi Sistem Multi-Agent Realtime',
        objective: 'Optimalisasi Latensi Sistem Multi-Agent Realtime',
        keyResult: 'Tekan rata-rata respons inferensi LLM di bawah 2 detik',
        category: 'Teknologi & Infrastruktur',
        division: 'Tech & AI',
        quarter: 'Q4',
        targetNum: 1.5,
        currentNum: 1.8,
        unit: 'Detik',
        owner: 'Tomi (Engineer)',
        status: 'On Track'
      }
    ],
    'Brand & Komunitas': [
      {
        id: 'TPL-OKR-BRD-1',
        title: 'Tingkatkan Brand Authority di Media Sosial Bisnis',
        objective: 'Tingkatkan Brand Authority di Media Sosial Bisnis',
        keyResult: 'Raih 50.000 Followers Organik & 500 Leads Masuk',
        category: 'Brand & Komunitas',
        division: 'Kreatif & Branding',
        quarter: 'Q4',
        targetNum: 500,
        currentNum: 380,
        unit: 'Leads',
        owner: 'Dina Safitri',
        status: 'On Track'
      }
    ],
    'Efisiensi Operasional': [
      {
        id: 'TPL-OKR-OPS-1',
        title: 'Otomatisasi 80% Tiket Layanan Rutin Tim',
        objective: 'Otomatisasi 80% Tiket Layanan Rutin Tim',
        keyResult: 'Pemangkasan durasi manual task dari 4 jam menjadi < 30 menit',
        category: 'Efisiensi Operasional',
        division: 'Operasional',
        quarter: 'Q4',
        targetNum: 80,
        currentNum: 65,
        unit: '%',
        owner: 'DigiBot TaskOps Specialist',
        status: 'On Track'
      }
    ],
    'Kepuasan Klien': [
      {
        id: 'TPL-OKR-CS-1',
        title: 'Tingkatkan Net Promoter Score (NPS) Klien Retainer',
        objective: 'Tingkatkan Net Promoter Score (NPS) Klien Retainer',
        keyResult: 'Mencapai skor kepuasan minimal 4.8 dari skala 5.0',
        category: 'Kepuasan Klien',
        division: 'Account Management',
        quarter: 'Q4',
        targetNum: 5,
        currentNum: 4.8,
        unit: 'Skor',
        owner: 'Kevin Pratama',
        status: 'Tercapai'
      }
    ]
  },

  // 8. Modul Laporan Evaluasi
  'Daftar Dokumen Audit & Evaluasi': {
    'Audit Kualitas': [
      {
        id: 'TPL-RPT-AUD-1',
        title: 'Laporan Audit Mutu Kode & Keamanan Infrastruktur Q4',
        period: 'Q4 2026 Audit Mutu',
        category: 'Audit Kualitas',
        rating: 5,
        status: 'Final',
        author: 'Kevin Pratama',
        whatWentWell: 'Sanitasi input terisolasi rapi dan tidak ada secret hardcoded.',
        bottlenecks: 'Latensi pihak ketiga sesekali naik di jam sibuk.',
        actionPlan: 'Pasang fallback cache model di edge network.'
      }
    ],
    'Review Kinerja': [
      {
        id: 'TPL-RPT-REV-1',
        title: 'Evaluasi Efisiensi Eksekusi Autonomous AI Agent DigiBooster',
        period: 'Oktober 2026 Review AI',
        category: 'Review Kinerja',
        rating: 5,
        status: 'Final',
        author: 'Executive Owner',
        whatWentWell: 'Efisiensi waktu kerja meningkat 4.2x dibanding penanganan manual.',
        bottlenecks: 'Kebutuhan token meningkat di akhir bulan.',
        actionPlan: 'Optimalkan token budget dan prompt compression.'
      }
    ],
    'Evaluasi Sprint': [
      {
        id: 'TPL-RPT-SPR-1',
        title: 'Retro & Evaluasi Sprint Velocity Tim Digital Q4',
        period: 'Sprint 14 Retro',
        category: 'Evaluasi Sprint',
        rating: 4,
        status: 'Final',
        author: 'Kevin Pratama',
        whatWentWell: 'Deliverable 100% selesai tepat waktu sebelum batas sprint.',
        bottlenecks: 'Feedback revisi dari stakeholders terlambat 1 hari.',
        actionPlan: 'Gunakan notifikasi otomatis WhatsApp bot pengingat review.'
      }
    ],
    'Kepuasan Klien': [
      {
        id: 'TPL-RPT-CLN-1',
        title: 'Survei Kepuasan Klien Korporat & UKM Kuartal 4',
        period: 'Q4 2026 CSAT Survey',
        category: 'Kepuasan Klien',
        rating: 5,
        status: 'Final',
        author: 'Dina Safitri',
        whatWentWell: '95% responden menyatakan sangat puas dengan respon cepat bot agen.',
        bottlenecks: 'Ekspektasi fitur custom yang beragam.',
        actionPlan: 'Sediakan modul preset siap pakai yang lebih variatif.'
      }
    ]
  },
  'Daftar Laporan Evaluasi & Audit': {
    'Audit Kualitas': [
      {
        id: 'TPL-RPT-AUD-1',
        title: 'Laporan Audit Mutu Kode & Keamanan Infrastruktur Q4',
        category: 'Audit Kualitas',
        rating: 5,
        status: 'Final',
        author: 'Kevin Pratama'
      }
    ]
  },

  // 9. Modul Data Arsip (Alias nama title)
  'Lemari Arsip Berkas': {
    'Dokumen PDF / Legalitas': [
      {
        id: 'TPL-ARC-LEG-1',
        title: 'Draft Standar Perjanjian Kerjasama (PKS) Retainer 2026',
        category: 'Dokumen PDF / Legalitas',
        fileFormat: 'PDF',
        version: 'v2.1',
        status: 'Aktif',
        accessLevel: 'Publik Semua Tim',
        fileSize: '240 KB'
      }
    ],
    'Spreadsheet & Finansial': [
      {
        id: 'TPL-ARC-FIN-1',
        title: 'Template Financial Projection & P&L Statement Tahunan',
        category: 'Spreadsheet & Finansial',
        fileFormat: 'XLSX',
        version: 'v1.4',
        status: 'Aktif',
        accessLevel: 'Hanya Manager',
        fileSize: '512 KB'
      }
    ],
    'Presentasi & Pitch Deck': [
      {
        id: 'TPL-ARC-DECK-1',
        title: 'Master Company Profile & Pitch Deck DigiBooster 2026',
        category: 'Presentasi & Pitch Deck',
        fileFormat: 'PDF',
        version: 'v3.0',
        status: 'Aktif',
        accessLevel: 'Publik Semua Tim',
        fileSize: '4.8 MB'
      }
    ]
  },

  // 10. Modul CRM & Klien (Alias nama title)
  'Daftar Klien & Prospek': {
    'Enterprise Corp': [
      {
        id: 'TPL-CRM-ENT-1',
        name: 'PT Mitra Solusi Nusantara (Enterprise)',
        category: 'Enterprise Corp',
        stage: 'Discovery Call',
        dealValue: 85000000,
        services: ['Custom AI', 'Web Dev'],
        pic: 'Kevin Pratama',
        contact: '+62 812-9988-7766'
      }
    ],
    'UKM / Ritel': [
      {
        id: 'TPL-CRM-UKM-1',
        name: 'Brand Fashion & Lifestyle Lokal',
        category: 'UKM / Ritel',
        stage: 'Lead Masuk',
        dealValue: 25000000,
        services: ['Social Media', 'Meta Ads'],
        pic: 'Dina Safitri',
        contact: '+62 813-2233-4455'
      }
    ],
    'Startup & Tech': [
      {
        id: 'TPL-CRM-STP-1',
        name: 'Fintech / SaaS Platform Indonesia',
        category: 'Startup & Tech',
        stage: 'Proposal Terkirim',
        dealValue: 65000000,
        services: ['Custom AI', 'Automation'],
        pic: 'Kevin Pratama',
        contact: '+62 811-5544-3322'
      }
    ],
    'Pemerintahan / BUMN': [
      {
        id: 'TPL-CRM-BUMN-1',
        name: 'BUMN Klaster Logistik Digital',
        category: 'Pemerintahan / BUMN',
        stage: 'Discovery Call',
        dealValue: 120000000,
        services: ['Custom AI', 'Dashboard Enterprise'],
        pic: 'Kevin Pratama',
        contact: '+62 812-7788-9900'
      }
    ],
    'Agensi Mitra': [
      {
        id: 'TPL-CRM-AGN-1',
        name: 'Agensi Media Kreatif Sinergi',
        category: 'Agensi Mitra',
        stage: 'Negosiasi',
        dealValue: 40000000,
        services: ['White-label AI', 'Automation'],
        pic: 'Kevin Pratama',
        contact: '+62 812-3344-5566'
      }
    ]
  },

  // 11. Modul Rapat & Catatan (Alias nama title)
  'Daftar Rapat & Catatan': {
    'Internal Weekly Sync': [
      {
        id: 'TPL-MTG-WKL-1',
        title: 'Weekly All-Hands Sync & Evaluasi Sasaran Sprint',
        type: 'Internal Weekly Sync',
        status: 'Terjadwal',
        room: 'Ruang Rapat Virtual 3D',
        participants: ['Kevin Pratama', 'Dina Safitri', 'Tomi', 'DigiBot Researcher'],
        summaryNotes: 'Review pencapaian mingguan, hambatan (blockers), dan alokasi prioritas AI Agent.'
      }
    ],
    'Client Kick-off': [
      {
        id: 'TPL-MTG-CLN-1',
        title: 'Kick-off Meeting Proyek Baru & Penyelarasan Deliverable Klien',
        type: 'Client Kick-off',
        status: 'Terjadwal',
        room: 'Google Meet / Virtual Office',
        participants: ['Kevin Pratama', 'Stakeholders Klien'],
        summaryNotes: 'Penyampaian roadmap 60 hari kerja, alur komunikasi WhatsApp, serta serah terima akses.'
      }
    ],
    'Review Sprint': [
      {
        id: 'TPL-MTG-SPR-1',
        title: 'Sprint Review & Demo Deliverable Q4',
        type: 'Review Sprint',
        status: 'Terjadwal',
        room: 'Ruang Rapat Virtual 3D',
        participants: ['Tim Engineering', 'Tim Kreatif', 'Management'],
        summaryNotes: 'Validasi deliverable sprint berjalan dan persetujuan deployment ke production.'
      }
    ],
    'Evaluasi Klien': [
      {
        id: 'TPL-MTG-EVL-1',
        title: 'Monthly Review & Evaluasi KPI Bersama Klien',
        type: 'Evaluasi Klien',
        status: 'Terjadwal',
        room: 'Google Meet',
        participants: ['Kevin Pratama', 'PIC Klien'],
        summaryNotes: 'Presentasi hasil capaian kampanye dan mendengarkan masukan perbaikan layanan.'
      }
    ],
    'Strategi Bisnis': [
      {
        id: 'TPL-MTG-STR-1',
        title: 'Sesi Diskusi Strategi Monetisasi & Ekspansi Produk Baru',
        type: 'Strategi Bisnis',
        status: 'Terjadwal',
        room: 'Ruang Rapat Virtual 3D',
        participants: ['Executive Owner', 'Kevin Pratama'],
        summaryNotes: 'Penyusunan penawaran solusi baru untuk kuartal mendatang.'
      }
    ]
  },

  // 12. Modul Tugas & Kalender (Alias nama title)
  'Daftar Tugas Operasional': {
    'Website & Tracking': [
      {
        id: 'TPL-TSK-WEB-1',
        title: 'Audit Core Web Vitals & Meta Pixel Tracking',
        category: 'Website & Tracking',
        priority: 'P1',
        status: 'Backlog',
        assignee: 'DigiBot Researcher',
        description: 'Pemeriksaan performa LCP/INP < 2.5s, konfigurasi Google Tag Manager, dan verifikasi event Purchase Meta Pixel.'
      },
      {
        id: 'TPL-TSK-WEB-2',
        title: 'Setup Integrasi Payment Gateway Midtrans & Webhook',
        category: 'Website & Tracking',
        priority: 'P1',
        status: 'Backlog',
        assignee: 'Kevin Pratama',
        description: 'Implementasi payment gateway otomatis, testing notifikasi webhook transaksi sukses, dan rekonsiliasi mutasi kas.'
      },
      {
        id: 'TPL-TSK-WEB-3',
        title: 'Optimasi SEO On-Page & Schema Markup Rich Snippets',
        category: 'Website & Tracking',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot Copywriter',
        description: 'Peningkatan ranking kata kunci Google, penambahan JSON-LD Organization & FAQ, serta perbaikan broken link.'
      }
    ],
    'Sosial Media & Ads': [
      {
        id: 'TPL-TSK-ADS-1',
        title: 'Optimasi Meta Ads Scale Budget & A/B Testing Creative',
        category: 'Sosial Media & Ads',
        priority: 'P1',
        status: 'Sedang Dikerjakan',
        assignee: 'Dina Safitri',
        description: 'Scale kampanye iklan dengan ROAS > 3.5x, pengujian 3 hook video reels baru, dan eliminasi ad set jenuh.'
      },
      {
        id: 'TPL-TSK-ADS-2',
        title: 'Produksi 5 Konten Carousel Edukasi Instagram',
        category: 'Sosial Media & Ads',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot Copywriter',
        description: 'Pembuatan slide edukasi problem-agitate-solve untuk founder bisnis dan automasi direct message leads.'
      }
    ],
    'Operasional & Riset': [
      {
        id: 'TPL-TSK-OPS-1',
        title: 'Penyusunan SOP Standar Penanganan Klien Baru',
        category: 'Operasional & Riset',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot TaskOps Specialist',
        description: 'Pembuatan alur onboarding klien otomatis via WhatsApp, template formulir brief, dan SLA koordinasi tim.'
      },
      {
        id: 'TPL-TSK-OPS-2',
        title: 'Benchmarking AI Agent Automation Kompetitor 2026',
        category: 'Operasional & Riset',
        priority: 'P2',
        status: 'Backlog',
        assignee: 'DigiBot Researcher',
        description: 'Riset tren tools multi-agent workflow terkini dan peluang diferensiasi penawaran DigiBooster.'
      }
    ],
    'Klien & Project': [
      {
        id: 'TPL-TSK-KLN-1',
        title: 'Sprint Kick-Off & Timeline Delivery Project Klien',
        category: 'Klien & Project',
        priority: 'P1',
        status: 'Sedang Dikerjakan',
        assignee: 'Kevin Pratama',
        description: 'Penyelarasan target milestone 30 hari bersama stakeholders dan pembagian deliverable mingguan tim.'
      }
    ]
  }
};

