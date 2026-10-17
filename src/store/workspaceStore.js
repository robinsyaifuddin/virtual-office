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

  crmCategories: [
    'Enterprise Corp',
    'UKM / Ritel',
    'Startup & Tech',
    'Pemerintahan / BUMN',
    'Agensi Mitra'
  ],
  addCrmCategory: (newCategory) => set((state) => {
    if (!newCategory || state.crmCategories.includes(newCategory)) return state;
    return { crmCategories: [...state.crmCategories, newCategory] };
  }),
  deleteCrmCategory: (categoryToDelete) => set((state) => ({
    crmCategories: state.crmCategories.filter((c) => c !== categoryToDelete)
  })),

  // 2. CRM & Klien
  crmClients: [
    {
      id: 'CRM-001',
      name: 'PT Sinergi Digital Utama',
      category: 'Enterprise Corp',
      contact: '+62 812-8899-1234',
      stage: 'Negosiasi',
      dealValue: 75000000,
      services: ['Custom AI', 'Web Dev'],
      pic: 'Kevin Pratama',
      contractDoc: 'PKS_Sinergi_Draft_v2.pdf',
      updatedAt: '2026-10-15'
    },
    {
      id: 'CRM-002',
      name: 'Kopi Nusantara Group',
      category: 'UKM / Ritel',
      contact: '+62 811-2233-4455',
      stage: 'Proposal Terkirim',
      dealValue: 35000000,
      services: ['Branding', 'Social Media'],
      pic: 'Dina Safitri',
      contractDoc: 'Proposal_Branding_Kopi.pdf',
      updatedAt: '2026-10-14'
    },
    {
      id: 'CRM-003',
      name: 'Nusa Cipta Solusi',
      category: 'Startup & Tech',
      contact: '+62 813-7766-5544',
      stage: 'Deal Won',
      dealValue: 60000000,
      services: ['Custom AI', 'Digital Ads'],
      pic: 'Maya Nirmala',
      contractDoc: 'PKS_NusaCipta_Final.pdf',
      updatedAt: '2026-10-12'
    },
    {
      id: 'CRM-004',
      name: 'Bina Finansial Solusindo',
      category: 'Enterprise Corp',
      contact: '+62 821-9988-7711',
      stage: 'Discovery Call',
      dealValue: 45000000,
      services: ['Custom AI'],
      pic: 'Tomi',
      contractDoc: null,
      updatedAt: '2026-10-10'
    },
    {
      id: 'CRM-005',
      name: 'Artha Mandiri Logistik',
      category: 'UKM / Ritel',
      contact: '+62 818-4455-6677',
      stage: 'Lead Masuk',
      dealValue: 30000000,
      services: ['Web Dev'],
      pic: 'Kevin Pratama',
      contractDoc: null,
      updatedAt: '2026-10-09'
    },
    {
      id: 'CRM-006',
      name: 'PT Mitra Retail Mandiri (Arsip Sept)',
      category: 'Enterprise Corp',
      contact: '+62 811-9922-3344',
      stage: 'Deal Won',
      dealValue: 85000000,
      services: ['Custom AI', 'Omnichannel CRM'],
      pic: 'Kevin Pratama',
      contractDoc: 'PKS_MitraRetail_Sept26.pdf',
      updatedAt: '2026-09-24'
    },
    {
      id: 'CRM-007',
      name: 'CV Samudera Cargo (Arsip Agt)',
      category: 'UKM / Ritel',
      contact: '+62 817-3344-5566',
      stage: 'Deal Won',
      dealValue: 40000000,
      services: ['Web Dev', 'Tracking'],
      pic: 'Maya Nirmala',
      contractDoc: 'PKS_Samudera_Aug26.pdf',
      updatedAt: '2026-08-19'
    },
    {
      id: 'CRM-008',
      name: 'Resto Rasa Nusantara (Arsip Juli)',
      category: 'UKM / Ritel',
      contact: '+62 819-5566-7788',
      stage: 'Deal Won',
      dealValue: 28000000,
      services: ['Branding', 'Social Media'],
      pic: 'Dina Safitri',
      contractDoc: 'PKS_RasaNusantara_Jul26.pdf',
      updatedAt: '2026-07-28'
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
    },
    // Transaksi Arsip Historis
    {
      id: 'FIN-106',
      title: 'Pelunasan Kontrak Q3 PT Mitra Retail (Sept)',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
      amount: 85000000,
      clientRef: 'PT Mitra Retail Mandiri',
      date: '2026-09-26',
      status: 'Lunas',
      receiptDoc: 'Receipt_INV-2026-068.pdf'
    },
    {
      id: 'FIN-107',
      title: 'Pembayaran Gaji & Bonus Tim Tech Q3 (Sept)',
      type: 'Pengeluaran',
      category: 'Operasional',
      amount: 32000000,
      clientRef: 'Internal HR',
      date: '2026-09-25',
      status: 'Lunas',
      receiptDoc: 'Slip_Payroll_Sept26.pdf'
    },
    {
      id: 'FIN-108',
      title: 'Termin Akhir CV Samudera Cargo (Agustus)',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
      amount: 40000000,
      clientRef: 'CV Samudera Cargo',
      date: '2026-08-20',
      status: 'Lunas',
      receiptDoc: 'Receipt_INV-2026-052.pdf'
    },
    {
      id: 'FIN-109',
      title: 'Pembayaran Jasa Retainer Resto Rasa (Juli)',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
      amount: 28000000,
      clientRef: 'Resto Rasa Nusantara',
      date: '2026-07-30',
      status: 'Lunas',
      receiptDoc: 'Receipt_INV-2026-039.pdf'
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
      channel: 'TikTok',
      pillar: 'Edukasi',
      stage: 'Siap Tayang',
      publishDate: '2026-10-18',
      adSpend: 2500000,
      metrics: { reach: 84000, leads: 42 },
      mediaLink: 'Aset_Video_KantorAI.mp4'
    },
    {
      id: 'MKT-002',
      title: 'Studi Kasus Efisiensi 340% dengan Autonomous AI',
      channel: 'LinkedIn',
      pillar: 'Case Study',
      stage: 'Review',
      publishDate: '2026-10-20',
      adSpend: 1500000,
      metrics: { reach: 24000, leads: 18 },
      mediaLink: 'Whitepaper_CaseStudy.pdf'
    },
    {
      id: 'MKT-003',
      title: 'Broadcast Promo Flash Sale 10.10 Multi-Agent',
      channel: 'Email',
      pillar: 'Promo/Hard Sell',
      stage: 'Selesai Tayang',
      publishDate: '2026-10-10',
      adSpend: 3000000,
      metrics: { reach: 110000, leads: 95 },
      mediaLink: 'Banner_Promo_1010.png'
    },
    {
      id: 'MKT-004',
      title: 'Behind the Scenes: AI Agent Bekerja di Belakang Layar',
      channel: 'Instagram',
      pillar: 'Branding',
      stage: 'Design/Video',
      publishDate: '2026-10-22',
      adSpend: 500000,
      metrics: { reach: 0, leads: 0 },
      mediaLink: 'Raw_Footage_BTS.zip'
    },
    // Kampanye Arsip Historis
    {
      id: 'MKT-005',
      title: 'Peluncuran Podcast Bisnis AI Episode 1 (September)',
      channel: 'YouTube',
      pillar: 'Edukasi',
      stage: 'Selesai Tayang',
      publishDate: '2026-09-18',
      adSpend: 4000000,
      metrics: { reach: 98000, leads: 64 },
      mediaLink: 'Video_Podcast_Ep1.mp4'
    },
    {
      id: 'MKT-006',
      title: 'Webinar Kolaborasi Efisiensi Operasional (Agustus)',
      channel: 'LinkedIn',
      pillar: 'Edukasi',
      stage: 'Selesai Tayang',
      publishDate: '2026-08-22',
      adSpend: 2000000,
      metrics: { reach: 45000, leads: 82 },
      mediaLink: 'Recording_Webinar_Aug.mp4'
    },
    {
      id: 'MKT-007',
      title: 'Kampanye Branding Mid-Year Review 2026 (Juli)',
      channel: 'Instagram',
      pillar: 'Branding',
      stage: 'Selesai Tayang',
      publishDate: '2026-07-25',
      adSpend: 3500000,
      metrics: { reach: 125000, leads: 110 },
      mediaLink: 'Carousel_MidYear.zip'
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
      status: 'Menunggu Review',
      dueDate: '2026-10-28',
      completedDate: '',
      outputResult: 'Draft checklist evaluasi siap ditinjau',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-15 08:30',
      updatedBy: 'Kayla',
      updatedAt: '2026-10-14 14:10',
      comments: []
    },
    {
      id: 'TSK-005',
      title: 'Evaluasi Software dan SOP Workflow',
      description: 'Evaluasi software yang digunakan untuk menentukan perbaikan dan prioritas tim.',
      category: 'SOP & Workflow',
      project: 'Internal Management',
      assignee: 'Dimas',
      priority: 'P2',
      status: 'Selesai',
      dueDate: '2026-10-12',
      completedDate: '2026-10-12',
      outputResult: 'Dokumen SOP Workflow Oct2026 disahkan',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-15 08:32',
      updatedBy: 'Dimas',
      updatedAt: '2026-10-12 17:05',
      comments: []
    },
    // Data Arsip Historis (Bulan Lampau)
    {
      id: 'TSK-006',
      title: 'Finalisasi Laporan Keuangan Q3 (September)',
      description: 'Rekonsiliasi rekening koran dan pembukuan kuartal 3 selesai disetujui auditor internal.',
      category: 'KPI & Reporting',
      project: 'Internal Agency',
      assignee: 'Kayla',
      priority: 'P1',
      status: 'Selesai',
      dueDate: '2026-09-28',
      completedDate: '2026-09-28',
      outputResult: 'Laporan Q3_Signed.pdf',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-01 10:00',
      updatedBy: 'Kayla',
      updatedAt: '2026-09-28 17:00',
      comments: []
    },
    {
      id: 'TSK-007',
      title: 'Peluncuran Website V2 PT Sinergi Digital',
      description: 'Deployment landing page dan integrasi tracking pixel selesai tepat waktu.',
      category: 'Website & Tracking',
      project: 'PT Sinergi Digital Utama',
      assignee: 'Dimas',
      priority: 'P1',
      status: 'Selesai',
      dueDate: '2026-09-15',
      completedDate: '2026-09-15',
      outputResult: 'Live di production domain',
      createdBy: 'Executive Owner',
      createdAt: '2026-09-01 09:00',
      updatedBy: 'Dimas',
      updatedAt: '2026-09-15 18:30',
      comments: []
    },
    {
      id: 'TSK-008',
      title: 'Audit Infrastruktur Server & Cloud (Agustus)',
      description: 'Pembersihan database staging dan peningkatan kapasitas server AI inference.',
      category: 'Procurement & Tools',
      project: 'Internal Tech',
      assignee: 'Budi',
      priority: 'P2',
      status: 'Selesai',
      dueDate: '2026-08-25',
      completedDate: '2026-08-25',
      outputResult: 'Dokumen arsitektur cloud v2',
      createdBy: 'Executive Owner',
      createdAt: '2026-08-05 11:20',
      updatedBy: 'Budi',
      updatedAt: '2026-08-25 16:00',
      comments: []
    },
    {
      id: 'TSK-009',
      title: 'Workshop Orientasi Tim AI Baru (Juli)',
      description: 'Sesi pelatihan onboarding 4 agent engineer dan transfer knowledge framework prompt.',
      category: 'SOP & Workflow',
      project: 'Internal Management',
      assignee: 'Dimas',
      priority: 'P2',
      status: 'Selesai',
      dueDate: '2026-07-20',
      completedDate: '2026-07-20',
      outputResult: 'Modul pelatihan internal & video rekaman',
      createdBy: 'Executive Owner',
      createdAt: '2026-07-01 09:00',
      updatedBy: 'Dimas',
      updatedAt: '2026-07-20 15:45',
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
  okrCategories: [
    'Revenue & Pertumbuhan',
    'Teknologi & Infrastruktur',
    'Brand & Komunitas',
    'Efisiensi Operasional',
    'Kepuasan Klien'
  ],
  addOkrCategory: (newCategory) => set((state) => {
    if (!newCategory || state.okrCategories.includes(newCategory)) return state;
    return { okrCategories: [...state.okrCategories, newCategory] };
  }),
  deleteOkrCategory: (categoryToDelete) => set((state) => ({
    okrCategories: state.okrCategories.filter((c) => c !== categoryToDelete)
  })),

  okrGoals: [
    {
      id: 'OKR-001',
      objective: 'Ekspansi Pendapatan Retainer Agency ke Skala Enterprise',
      keyResult: 'Capai Monthly Recurring Revenue (MRR) Rp 100 Juta',
      category: 'Revenue & Pertumbuhan',
      division: 'Sales & Marketing',
      quarter: 'Q4',
      targetNum: 100000000,
      currentNum: 75000000,
      unit: 'IDR',
      status: 'On Track',
      owner: 'Kevin Pratama',
      targetDeadline: '2026-12-31'
    },
    {
      id: 'OKR-002',
      objective: 'Optimalisasi Latensi Sistem Multi-Agent Realtime',
      keyResult: 'Tekan rata-rata respons inferensi LLM di bawah 2 detik',
      category: 'Teknologi & Infrastruktur',
      division: 'Operasional/Produksi',
      quarter: 'Q4',
      targetNum: 2.0,
      currentNum: 1.4,
      unit: 'Detik',
      status: 'Tercapai',
      owner: 'Maya Nirmala',
      targetDeadline: '2026-11-30'
    },
    {
      id: 'OKR-003',
      objective: 'Tingkatkan Brand Authority di Media Sosial Bisnis',
      keyResult: 'Raih 50.000 Followers Organik & 500 Leads Masuk',
      category: 'Brand & Komunitas',
      division: 'Kreatif',
      quarter: 'Q4',
      targetNum: 500,
      currentNum: 380,
      unit: 'Leads',
      status: 'On Track',
      owner: 'Dina Safitri',
      targetDeadline: '2026-12-15'
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
      dateTime: '2026-10-15',
      type: 'Internal Weekly Sync',
      status: 'Selesai',
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
      dateTime: '2026-10-13',
      type: 'Client Kick-off',
      status: 'Terjadwal',
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
      date: '2026-10-14',
      rating: 5,
      status: 'Final',
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
      date: '2026-10-01',
      rating: 4,
      status: 'Disahkan',
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
      status: 'Aktif',
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
      status: 'Disetujui',
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
      status: 'Publik',
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
      status: 'Arsip',
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      persona: 'Lead Operasional yang memastikan kepatuhan jadwal, alokasi PIC tim, dan kelengkapan dokumen legal klien.',
      systemPrompt: '',
      aiEngine: 'Human Operator',
      capabilities: ['Manajemen PIC', 'Review Legalitas', 'Persetujuan Sprint'],
      executionCount: 0
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
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      persona: 'Technical Architect yang mengawal pipeline data, integritas sistem, dan review arsitektur aplikasi.',
      systemPrompt: '',
      aiEngine: 'Human Operator',
      capabilities: ['Code Review', 'System Architecture', 'API Management'],
      executionCount: 0
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
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      persona: 'Creative Director perancang narasi branding, persona campaign, dan estetika visual agency.',
      systemPrompt: '',
      aiEngine: 'Human Operator',
      capabilities: ['Campaign Strategy', 'Copywriting Review', 'Visual Direction'],
      executionCount: 0
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
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      persona: 'Financial Officer pengendali arus kas, validasi termin faktur, dan pajak korporasi.',
      systemPrompt: '',
      aiEngine: 'Human Operator',
      capabilities: ['Audit Arus Kas', 'Verifikasi Invoice', 'Pajak & Pembukuan'],
      executionCount: 0
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
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      persona: 'Riset tren pasar, profiling calon klien strategis, dan pengolahan data persaingan bisnis.',
      systemPrompt: '',
      aiEngine: 'Human Operator',
      capabilities: ['Market Survey', 'Competitor Analysis', 'Lead Scouting'],
      executionCount: 0
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
      avatar: null,
      persona: 'AI Spesialis Riset Cepat & Intelijen Data yang menganalisis tren pasar, kompetitor, referensi arsitektur, dan ringkasan insight otomatis.',
      systemPrompt: 'Kamu adalah DigiBot Researcher, AI Agent dari DigiBooster. Tugasmu adalah menganalisis topik tugas yang diberikan oleh Executive/PIC, mengumpulkan data rujukan esensial, menganalisis kompetitor, dan menghasilkan ringkasan eksekutif actionable.',
      aiEngine: 'Groq Llama 3.3 70B Versatile',
      capabilities: ['Web Scraping Insight', 'Analisis Data Riset', 'Ekstraksi Ringkasan Eksekutif'],
      executionCount: 14
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
      avatar: null,
      persona: 'AI Spesialis Penulis Salinan & Kampanye Kreatif dengan hook viral tinggi, struktur AIDA, dan CTA tajam berkonversi tinggi.',
      systemPrompt: 'Kamu adalah DigiBot Copywriter, AI Agent DigiBooster. Tugasmu adalah menyusun draf copy konten, script reels/TikTok, email broadcast, atau proposal naratif berdasar nama tugas dan keterangan yang diberikan PIC.',
      aiEngine: 'Google Gemini 2.5 Flash',
      capabilities: ['Script Video & Reels', 'Copywriting AIDA & PAS', 'Email Campaign Draft'],
      executionCount: 28
    },
    {
      id: 'STF-008',
      name: 'DigiBot TaskOps Specialist',
      type: 'AI Agent DigiBooster',
      role: 'Autonomous Task Executor & QA Validator',
      department: 'Manajemen',
      status: 'Online / Bertugas',
      activeProjects: ['SOP Verification', 'Sprint Automation'],
      contact: 'bot-taskops@digibooster.internal',
      avatar: null,
      persona: 'AI Spesialis Eksekusi Proyek & Penjadwalan Operasional yang otomatis menguraikan tugas, membuat checklist kerja terukur, serta memvalidasi deliverable.',
      systemPrompt: 'Kamu adalah DigiBot TaskOps Specialist. Tugasmu adalah membaca tugas yang di-assign ke kamu, membedah langkah implementasi, checklist eksekusi, serta menghasilkan laporan deliverable yang siap di-review PIC Manajemen.',
      aiEngine: 'Groq Llama 3.3 70B Versatile',
      capabilities: ['Breakdown Task Checklist', 'Validasi Output', 'Notulen & Status Update'],
      executionCount: 9
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
  })),

  // 12. Kustom Template User (Disimpan di localStorage)
  customTemplates: (() => {
    try {
      const stored = localStorage.getItem('digibooster_custom_templates');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })(),

  addCustomTemplate: (moduleName, category, templateData) => set((state) => {
    const prev = state.customTemplates || {};
    const modKey = moduleName || 'General';
    const catKey = category || 'General';
    const modTemplates = prev[modKey] || {};
    const catList = modTemplates[catKey] || [];
    
    const newTemplate = {
      ...templateData,
      id: `CUST-TPL-${Date.now()}`,
      isCustom: true,
      savedAt: new Date().toISOString()
    };

    const next = {
      ...prev,
      [modKey]: {
        ...modTemplates,
        [catKey]: [newTemplate, ...catList]
      }
    };

    try {
      localStorage.setItem('digibooster_custom_templates', JSON.stringify(next));
    } catch (err) {
      console.warn('Gagal menyimpan custom template ke localStorage', err);
    }

    return { customTemplates: next };
  }),

  deleteCustomTemplate: (moduleName, category, templateId) => set((state) => {
    const prev = state.customTemplates || {};
    const modKey = moduleName || 'General';
    const catKey = category || 'General';
    const modTemplates = prev[modKey] || {};
    const catList = modTemplates[catKey] || [];

    const next = {
      ...prev,
      [modKey]: {
        ...modTemplates,
        [catKey]: catList.filter(t => t.id !== templateId)
      }
    };

    try {
      localStorage.setItem('digibooster_custom_templates', JSON.stringify(next));
    } catch (err) {
      console.warn('Gagal menghapus custom template dari localStorage', err);
    }

    return { customTemplates: next };
  })
}));

