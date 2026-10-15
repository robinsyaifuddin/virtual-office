import { create } from 'zustand';

// Initial Mock Data sesuai dengan Dokumen Standarisasi Workspace DigiBooster

export const useWorkspaceStore = create((set, get) => ({
  // Active Module / Navigation
  activeModule: 'executivedashboard',
  setActiveModule: (moduleKey) => set({ activeModule: moduleKey }),

  // 1. Executive Summary & KPIs
  executiveSummary: {
    monthlyNetCashflow: 'Rp 68.500.000',
    cashflowGrowth: '+18.4%',
    activePipelineValue: 'Rp 245.000.000',
    pipelineDealsCount: 7,
    taskVelocityPercent: 92,
    taskVelocityStatus: 'Optimal',
    okrAverageProgress: 78,
    criticalAlerts: [
      { id: 'ALT-1', type: 'warning', title: '2 Invoice Menjelang Jatuh Tempo', detail: 'PT Sinergi Mandiri & Kopi Nusantara' },
      { id: 'ALT-2', type: 'info', title: 'Sprint Review Q4 Terjadwal', detail: 'Besok, 10:00 WIB di Ruang Rapat Virtual' }
    ]
  },

  // 2. CRM & Klien
  crmClients: [
    {
      id: 'CRM-001',
      name: 'PT Sinergi Digital Utama',
      contact: '+62 812-8899-1234',
      stage: 'Negosiasi',
      dealValue: 75000000,
      services: ['Custom AI', 'Web Dev'],
      pic: 'Kevin Pratama',
      contractDoc: 'PKS_Sinergi_Draft_v2.pdf',
      updatedAt: '15 Okt 2026'
    },
    {
      id: 'CRM-002',
      name: 'Kopi Nusantara Group',
      contact: '+62 811-2233-4455',
      stage: 'Proposal Terkirim',
      dealValue: 35000000,
      services: ['Branding', 'Social Media'],
      pic: 'Dina Safitri',
      contractDoc: 'Proposal_Branding_Kopi.pdf',
      updatedAt: '14 Okt 2026'
    },
    {
      id: 'CRM-003',
      name: 'Nusa Cipta Solusi',
      contact: '+62 813-7766-5544',
      stage: 'Deal Won 🎉',
      dealValue: 60000000,
      services: ['Custom AI', 'Digital Ads'],
      pic: 'Maya Nirmala',
      contractDoc: 'PKS_NusaCipta_Final.pdf',
      updatedAt: '12 Okt 2026'
    },
    {
      id: 'CRM-004',
      name: 'Bina Finansial Solusindo',
      contact: '+62 821-9988-7711',
      stage: 'Discovery Call',
      dealValue: 45000000,
      services: ['Custom AI'],
      pic: 'Tomi',
      contractDoc: null,
      updatedAt: '10 Okt 2026'
    },
    {
      id: 'CRM-005',
      name: 'Artha Mandiri Logistik',
      contact: '+62 818-4455-6677',
      stage: 'Lead Masuk',
      dealValue: 30000000,
      services: ['Web Dev'],
      pic: 'Kevin Pratama',
      contractDoc: null,
      updatedAt: '09 Okt 2026'
    }
  ],
  addCrmClient: (client) => set((state) => ({ crmClients: [client, ...state.crmClients] })),
  updateCrmClient: (id, updated) => set((state) => ({
    crmClients: state.crmClients.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteCrmClient: (id) => set((state) => ({
    crmClients: state.crmClients.filter((item) => item.id !== id)
  })),

  // 3. Keuangan & Profit
  financeTransactions: [
    {
      id: 'FIN-101',
      title: 'Termin 1 Implementasi Custom AI PT Nusa Cipta',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
      amount: 30000000,
      clientRef: 'Nusa Cipta Solusi',
      date: '2026-10-14',
      status: 'Lunas',
      receiptDoc: 'Faktur_INV-2026-089.pdf'
    },
    {
      id: 'FIN-102',
      title: 'Langganan Server Cloud & Groq API Enterprise',
      type: 'Pengeluaran',
      category: 'Server & Tools',
      amount: 4500000,
      clientRef: 'Internal',
      date: '2026-10-12',
      status: 'Lunas',
      receiptDoc: 'Struk_Cloud_Oct26.pdf'
    },
    {
      id: 'FIN-103',
      title: 'Invoice Retainer Digital Marketing Kopi Nusantara',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
      amount: 15000000,
      clientRef: 'Kopi Nusantara Group',
      date: '2026-10-10',
      status: 'Pending',
      receiptDoc: 'Invoice_INV-2026-092.pdf'
    },
    {
      id: 'FIN-104',
      title: 'Meta Ads & Google Campaign Optimasi Q4',
      type: 'Pengeluaran',
      category: 'Marketing Ads',
      amount: 7000000,
      clientRef: 'Internal',
      date: '2026-10-08',
      status: 'Lunas',
      receiptDoc: 'Receipt_MetaAds_Q4.pdf'
    },
    {
      id: 'FIN-105',
      title: 'Pelunasan Web Dev & Automasi PT Logistik Prima',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
      amount: 35000000,
      clientRef: 'PT Logistik Prima',
      date: '2026-10-05',
      status: 'Lunas',
      receiptDoc: 'Receipt_INV-2026-077.pdf'
    }
  ],
  addFinanceTransaction: (tx) => set((state) => ({ financeTransactions: [tx, ...state.financeTransactions] })),
  updateFinanceTransaction: (id, updated) => set((state) => ({
    financeTransactions: state.financeTransactions.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteFinanceTransaction: (id) => set((state) => ({
    financeTransactions: state.financeTransactions.filter((item) => item.id !== id)
  })),

  // 4. Branding & Marketing
  marketingCampaigns: [
    {
      id: 'MKT-001',
      title: '10 Script Video Pendek TikTok/Reels Kantor Otomatis',
      channel: ['TikTok', 'Instagram'],
      pillar: 'Edukasi',
      stage: 'Siap Tayang',
      publishDate: '2026-10-18 10:00',
      adSpend: 2500000,
      metrics: { reach: 84000, leads: 42 },
      mediaLink: 'Aset_Video_KantorAI.mp4'
    },
    {
      id: 'MKT-002',
      title: 'Studi Kasus Efisiensi 340% dengan Autonomous AI',
      channel: ['LinkedIn', 'Website'],
      pillar: 'Case Study',
      stage: 'Review',
      publishDate: '2026-10-20 14:00',
      adSpend: 1500000,
      metrics: { reach: 24000, leads: 18 },
      mediaLink: 'Whitepaper_CaseStudy.pdf'
    },
    {
      id: 'MKT-003',
      title: 'Broadcast Promo Flash Sale 10.10 Multi-Agent',
      channel: ['Email', 'Meta Ads'],
      pillar: 'Promo/Hard Sell',
      stage: 'Selesai Tayang',
      publishDate: '2026-10-10 09:00',
      adSpend: 3000000,
      metrics: { reach: 110000, leads: 95 },
      mediaLink: 'Banner_Promo_1010.png'
    },
    {
      id: 'MKT-004',
      title: 'Behind the Scenes: AI Agent Bekerja di Belakang Layar',
      channel: ['Instagram', 'YouTube'],
      pillar: 'Branding',
      stage: 'Design/Video',
      publishDate: '2026-10-22 19:00',
      adSpend: 500000,
      metrics: { reach: 0, leads: 0 },
      mediaLink: 'Raw_Footage_BTS.zip'
    }
  ],
  addMarketingCampaign: (camp) => set((state) => ({ marketingCampaigns: [camp, ...state.marketingCampaigns] })),
  updateMarketingCampaign: (id, updated) => set((state) => ({
    marketingCampaigns: state.marketingCampaigns.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteMarketingCampaign: (id) => set((state) => ({
    marketingCampaigns: state.marketingCampaigns.filter((item) => item.id !== id)
  })),

  // 5. Tugas & Kalender (Notion Database Structure)
  taskCategories: [
    'Website & Tracking',
    'Konten & Creative',
    'Social Channel Ops',
    'Campaign / Promo',
    'CRM & Omnichannel',
    'SOP & Workflow',
    'KPI & Reporting',
    'Procurement & Tools',
    'Meeting & Koordinasi'
  ],
  addCategoryOption: (newCategory) => set((state) => {
    if (!newCategory || state.taskCategories.includes(newCategory)) return state;
    return { taskCategories: [...state.taskCategories, newCategory] };
  }),
  deleteCategoryOption: (categoryToDelete) => set((state) => ({
    taskCategories: state.taskCategories.filter((c) => c !== categoryToDelete)
  })),

  tasks: [
    {
      id: 'TSK-001',
      title: 'WEEKEND WELLNESS EDIT',
      description: 'ON PROGRESS. Eksekusi revisi video reels dan publish sesuai jadwal.',
      category: 'Campaign / Promo',
      project: 'Internal Agency',
      assignee: 'Kayla',
      priority: 'P1',
      status: 'Sedang Dikerjakan',
      dueDate: '2026-10-17',
      completedDate: '2026-10-10',
      outputResult: 'Draft reel Instagram v1 selesai',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-08 14:23',
      updatedBy: 'Executive Owner',
      updatedAt: '2026-10-15 11:20',
      comments: [
        {
          id: 'C-1',
          author: 'Executive Owner',
          createdAt: '15 Okt 2026 11:22',
          text: 'Tolong pastikan format video sudah 9:16 untuk reel ya Kayla.'
        },
        {
          id: 'C-2',
          author: 'Kayla',
          createdAt: '15 Okt 2026 11:45',
          text: 'Siap, sudah disesuaikan dan tinggal menunggu approve asset grafis.'
        }
      ]
    },
    {
      id: 'TSK-002',
      title: 'Optimasi Social Channel (Instagram + TikTok)',
      description: 'Eksekusi optimasi channel sosial utama berdasarkan audit (profil, format, CTA, workflow posting).',
      category: 'Social Channel Ops',
      project: 'Kopi Nusantara Group',
      assignee: 'Budi',
      priority: 'P2',
      status: 'Backlog',
      dueDate: '2026-10-20',
      completedDate: '',
      outputResult: '',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-10 09:15',
      updatedBy: 'Budi',
      updatedAt: '2026-10-01 16:40',
      comments: []
    },
    {
      id: 'TSK-003',
      title: 'Improvement Plan (Technology)',
      description: 'Menyusun improvement plan teknologi berdasarkan evaluasi Agustus.',
      category: 'Website & Tracking',
      project: 'Nusa Cipta Solusi',
      assignee: 'Dimas',
      priority: 'P1',
      status: 'Backlog',
      dueDate: '2026-10-25',
      completedDate: '',
      outputResult: '',
      createdBy: 'Dimas',
      createdAt: '2026-09-12 11:00',
      updatedBy: 'Dimas',
      updatedAt: '2026-09-12 11:00',
      comments: []
    },
    {
      id: 'TSK-004',
      title: 'Evaluasi Hardware & Alat Kerja',
      description: 'Evaluasi hardware yang dibeli/dipakai selama Agustus untuk memastikan sesuai kebutuhan dan stabil.',
      category: 'Procurement & Tools',
      project: 'Internal Tech',
      assignee: 'Kayla',
      priority: 'P3',
      status: 'Backlog',
      dueDate: '2026-10-28',
      completedDate: '',
      outputResult: '',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-15 08:30',
      updatedBy: 'Kayla',
      updatedAt: '2026-09-18 14:10',
      comments: []
    },
    {
      id: 'TSK-005',
      title: 'Evaluasi Software dan SOP Workflow',
      description: 'Evaluasi software yang digunakan selama Agustus untuk menentukan perbaikan dan prioritas September.',
      category: 'SOP & Workflow',
      project: 'Internal Management',
      assignee: 'Dimas',
      priority: 'P2',
      status: 'Backlog',
      dueDate: '2026-10-30',
      completedDate: '',
      outputResult: '',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-15 08:32',
      updatedBy: 'Dimas',
      updatedAt: '2026-09-20 17:05',
      comments: []
    }
  ],
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updated) => set((state) => ({
    tasks: state.tasks.map((item) => item.id === id ? { 
      ...item, 
      ...updated, 
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedBy: 'Executive Owner'
    } : item)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((item) => item.id !== id)
  })),
  addTaskComment: (taskId, commentText, author = 'Executive Owner') => set((state) => ({
    tasks: state.tasks.map((item) => {
      if (item.id !== taskId) return item;
      const newComment = {
        id: `C-${Date.now()}`,
        author,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        text: commentText
      };
      return {
        ...item,
        comments: [...(item.comments || []), newComment],
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updatedBy: author
      };
    })
  })),

  // 6. Sasaran & KPI (OKR)
  okrGoals: [
    {
      id: 'OKR-001',
      objective: 'Ekspansi Pendapatan Retainer Agency ke Skala Enterprise',
      keyResult: 'Capai Monthly Recurring Revenue (MRR) Rp 100 Juta',
      division: 'Sales & Marketing',
      quarter: 'Q4',
      targetNum: 100000000,
      currentNum: 75000000,
      unit: 'IDR',
      owner: 'Kevin Pratama'
    },
    {
      id: 'OKR-002',
      objective: 'Optimalisasi Latensi Sistem Multi-Agent Realtime',
      keyResult: 'Tekan rata-rata respons inferensi LLM di bawah 2 detik',
      division: 'Operasional/Produksi',
      quarter: 'Q4',
      targetNum: 2.0,
      currentNum: 1.4,
      unit: 'Detik',
      owner: 'Maya Nirmala'
    },
    {
      id: 'OKR-003',
      objective: 'Tingkatkan Brand Authority di Media Sosial Bisnis',
      keyResult: 'Raih 50.000 Followers Organik & 500 Leads Masuk',
      division: 'Kreatif',
      quarter: 'Q4',
      targetNum: 500,
      currentNum: 380,
      unit: 'Leads',
      owner: 'Dina Safitri'
    }
  ],
  addOkrGoal: (goal) => set((state) => ({ okrGoals: [goal, ...state.okrGoals] })),
  updateOkrGoal: (id, updated) => set((state) => ({
    okrGoals: state.okrGoals.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteOkrGoal: (id) => set((state) => ({
    okrGoals: state.okrGoals.filter((item) => item.id !== id)
  })),

  // 7. Rapat & Catatan
  meetings: [
    {
      id: 'MTG-001',
      title: 'Weekly Management Sync: Evaluasi Sprint & Cashflow Q4',
      dateTime: '2026-10-15 09:00 WIB',
      type: 'Internal Weekly Sync',
      participants: ['Kevin Pratama', 'Nadira', 'Maya Nirmala', 'Dina Safitri'],
      link: 'https://meet.google.com/dgb-sync-q4',
      summaryNotes: 'Arus kas bulan ini sangat sehat surplus Rp 68,5jt. Target peluncuran modul baru siap di minggu ke-3 Oktober. Klien PT Nusa Cipta telah menyetujui PKS final.',
      actionItems: [
        { id: 'ACT-1', text: 'Kirim invoice termin 2 ke PT Nusa Cipta', done: true, assignee: 'Nadira' },
        { id: 'ACT-2', text: 'Finishing modul Dashboard Notion layout', done: false, assignee: 'Maya Nirmala' }
      ]
    },
    {
      id: 'MTG-002',
      title: 'Discovery Call & Demo Sistem Otomasi Klien Logistik',
      dateTime: '2026-10-13 14:00 WIB',
      type: 'Client Kick-off',
      participants: ['Kevin Pratama', 'Tomi'],
      link: 'https://meet.google.com/log-demo-ai',
      summaryNotes: 'Klien tertarik dengan integrasi WhatsApp ke database internal untuk status resi dan order otomatis.',
      actionItems: [
        { id: 'ACT-3', text: 'Kirim proposal estimasi biaya integrasi', done: true, assignee: 'Kevin Pratama' }
      ]
    }
  ],
  addMeeting: (m) => set((state) => ({ meetings: [m, ...state.meetings] })),
  updateMeeting: (id, updated) => set((state) => ({
    meetings: state.meetings.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteMeeting: (id) => set((state) => ({
    meetings: state.meetings.filter((item) => item.id !== id)
  })),

  // 8. Laporan & Evaluasi
  reports: [
    {
      id: 'RPT-001',
      period: 'Evaluasi Retrospektif Sprint 2 - Oktober 2026',
      category: 'Retrospektif Sprint',
      rating: 5,
      whatWentWell: 'Penerapan modul terpisah membuat bug menurun drastis dan kecepatan rendering naik 40%.',
      bottlenecks: 'Koneksi API WhatsApp pihak ketiga sempat delay 2 menit pada jam sibuk.',
      actionPlan: 'Pasang fallback redundancy ke Gemini API jika Groq mengalami rate-limit.',
      author: 'Maya Nirmala',
      attachmentDoc: 'Sprint_Retrospective_Oct26.pdf'
    },
    {
      id: 'RPT-002',
      period: 'Audit Mutu Layanan & Kepuasan Klien Q3',
      category: 'Audit Kualitas',
      rating: 4,
      whatWentWell: 'NPS Klien mencapai skor 88%, apresiasi tinggi pada kecepatan respon staf AI.',
      bottlenecks: 'Pemberitahuan invoice masih ada yang terlewat jika manual.',
      actionPlan: 'Otomatisasi trigger reminder WA 3 hari sebelum jatuh tempo.',
      author: 'Kevin Pratama',
      attachmentDoc: 'Audit_Mutu_Layanan_Q3.pdf'
    }
  ],
  addReport: (rpt) => set((state) => ({ reports: [rpt, ...state.reports] })),
  updateReport: (id, updated) => set((state) => ({
    reports: state.reports.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteReport: (id) => set((state) => ({
    reports: state.reports.filter((item) => item.id !== id)
  })),

  // 9. Data & Arsip
  archives: [
    {
      id: 'ARC-001',
      title: 'Standar Operasional Prosedur (SOP) Manajemen Proyek AI',
      category: 'SOP Perusahaan',
      fileFormat: 'PDF',
      version: 'v2.2',
      updatedAt: '2026-10-14',
      accessLevel: 'Publik Semua Tim',
      fileSize: '420 KB',
      downloadUrl: '/docs/SOP_Manajemen_Proyek_v2.2.pdf'
    },
    {
      id: 'ARC-002',
      title: 'Master Template Perjanjian Kerjasama (PKS) & NDA 2026',
      category: 'Template Kontrak & NDA',
      fileFormat: 'DOCX',
      version: 'v1.4',
      updatedAt: '2026-10-12',
      accessLevel: 'Hanya Manager',
      fileSize: '185 KB',
      downloadUrl: '/docs/Template_PKS_NDA_2026.docx'
    },
    {
      id: 'ARC-003',
      title: 'Brand Asset Kit: Logo Vektor, Font, Color Palettes SVG',
      category: 'Brand Assets/Logo/Font',
      fileFormat: 'ZIP',
      version: 'v3.0',
      updatedAt: '2026-10-08',
      accessLevel: 'Publik Semua Tim',
      fileSize: '14.2 MB',
      downloadUrl: '/assets/DigiBooster_Brand_Kit.zip'
    },
    {
      id: 'ARC-004',
      title: 'Akta Pendirian PT & Legalitas Kemenkumham RI',
      category: 'Legalitas/PT',
      fileFormat: 'PDF',
      version: 'v1.0',
      updatedAt: '2026-09-01',
      accessLevel: 'Rahasia/Direksi',
      fileSize: '1.2 MB',
      downloadUrl: '/docs/Legalitas_PT_DigiBooster.pdf'
    }
  ],
  addArchive: (arc) => set((state) => ({ archives: [arc, ...state.archives] })),
  updateArchive: (id, updated) => set((state) => ({
    archives: state.archives.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteArchive: (id) => set((state) => ({
    archives: state.archives.filter((item) => item.id !== id)
  })),

  // 10. Staff & AI Agents
  staffAgents: [
    {
      id: 'STF-001',
      name: 'Kevin Pratama',
      type: 'Staf Manusia',
      role: 'Project Manager & Legal Admin',
      department: 'Manajemen',
      status: 'Online / Bertugas',
      activeProjects: ['Nusa Cipta Solusi', 'Internal Legal'],
      contact: 'kevin@digibooster.id',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'STF-002',
      name: 'Maya Nirmala',
      type: 'Staf Manusia',
      role: 'Lead Fullstack Dev & Architect',
      department: 'Tech',
      status: 'Online / Bertugas',
      activeProjects: ['Dashboard Notion 2.0', 'Custom AI Pipeline'],
      contact: 'maya@digibooster.id',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'STF-003',
      name: 'Dina Safitri',
      type: 'Staf Manusia',
      role: 'Creative Director & Content Strategist',
      department: 'Kreatif',
      status: 'Online / Bertugas',
      activeProjects: ['Kopi Nusantara Group', 'Brand Launch'],
      contact: 'dina@digibooster.id',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'STF-004',
      name: 'Nadira',
      type: 'Staf Manusia',
      role: 'Head of Finance & Tax Compliance',
      department: 'Manajemen',
      status: 'Online / Bertugas',
      activeProjects: ['Arus Kas Q4', 'Rekapitulasi Faktur'],
      contact: 'nadira@digibooster.id',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'STF-005',
      name: 'Tomi',
      type: 'Staf Manusia',
      role: 'Market Researcher & Analyst',
      department: 'Sales & Marketing',
      status: 'Istirahat',
      activeProjects: ['Intelijen Kompetitor 2026'],
      contact: 'tomi@digibooster.id',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'STF-006',
      name: 'DigiBot Researcher',
      type: 'AI Agent DigiBooster',
      role: 'Autonomous Research & Scraping AI',
      department: 'Tech',
      status: 'Standby',
      activeProjects: ['Market Intelligence', 'Lead Profiler'],
      contact: 'bot-research@digibooster.internal',
      avatar: null
    },
    {
      id: 'STF-007',
      name: 'DigiBot Copywriter',
      type: 'AI Agent DigiBooster',
      role: 'Autonomous Content Generator (Groq Engine)',
      department: 'Kreatif',
      status: 'Online / Bertugas',
      activeProjects: ['Social Media Copy', 'Email Blast'],
      contact: 'bot-writer@digibooster.internal',
      avatar: null
    }
  ],
  addStaffAgent: (stf) => set((state) => ({ staffAgents: [stf, ...state.staffAgents] })),
  updateStaffAgent: (id, updated) => set((state) => ({
    staffAgents: state.staffAgents.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteStaffAgent: (id) => set((state) => ({
    staffAgents: state.staffAgents.filter((item) => item.id !== id)
  })),

  // 11. Pengaturan Workspace
  workspaceSettings: {
    workspaceName: 'DigiBooster Indonesia Enterprise',
    companyTagline: 'Autonomous AI Agency & Digital Acceleration Hub',
    currency: 'IDR (Rp)',
    timezone: 'Asia/Jakarta (WIB)',
    logoUrl: '/logo.webp',
    whatsappGateway: {
      status: 'Connected',
      phoneNumber: '+62 812-3456-7890',
      provider: 'Green-API / Meta Cloud API'
    },
    aiIntegrations: {
      activeEngine: 'Groq Llama 3.3 70B Versatile',
      fallbackEngine: 'Google Gemini 2.5 Flash',
      latencyAverage: '1.2s'
    },
    rolesMatrix: [
      { role: 'Owner & Executive', access: 'Semua Menu (Full Akses & Hapus)' },
      { role: 'Project Manager', access: 'Semua Menu kecuali Pengaturan Finansial Penuh' },
      { role: 'Team Member', access: 'Tugas, Kalender, Rapat, Notulensi, Arsip' },
      { role: 'AI Agent', access: 'Kirim Output, Pembaruan Tugas, Sinkronisasi Otomatis' }
    ]
  },
  updateWorkspaceSettings: (newSettings) => set((state) => ({
    workspaceSettings: { ...state.workspaceSettings, ...newSettings }
  }))
}));
