// Data Definisi Ruang Operasional DigiBooster Virtual Office (Homebase 5 AI Agent)

export const ROOMS = [
  {
    id: 'strategy',
    name: 'Strategy Room',
    shortName: 'Strategy',
    code: 'ROOM-01',
    description: 'Pusat brainstorming eksekutif, perumusan target sasaran OKR, dan notulen rapat direksi (Homebase: Arga CSO).',
    color: '#00B9F1',
    floorColor: '#1e293b',
    bounds: {
      x: -20.5,
      z: -4.45,
      width: 6.7,
      depth: 7.0,
      center: [-20.5, 0, -4.45]
    },
    door: {
      position: [-20.5, 0, -0.8],
      rotation: [0, 0, 0]
    },
    features: ['OKR Radar Board', 'Brainstorming Table', 'Strategy Presentation Display']
  },
  {
    id: 'operations',
    name: 'Operations Room',
    shortName: 'Operations',
    code: 'ROOM-02',
    description: 'Pusat komando eksekusi tugas, delegasi PIC, pemantauan deadline kalender, dan monitoring SLA (Homebase: Reta COO).',
    color: '#38bdf8',
    floorColor: '#1e293b',
    bounds: {
      x: -13.25,
      z: -4.45,
      width: 7.3,
      depth: 7.0,
      center: [-13.25, 0, -4.45]
    },
    door: {
      position: [-13.25, 0, -0.8],
      rotation: [0, 0, 0]
    },
    features: ['Executive Command Desk', 'Multi-Task Kanban Display', 'Live Operations Radar']
  },
  {
    id: 'quality',
    name: 'Quality Room',
    shortName: 'Quality',
    code: 'ROOM-03',
    description: 'Laboratorium audit mutu respon AI, verifikasi deliverable data, benchmarking model, dan evaluasi performa bot (Homebase: Siska QC).',
    color: '#10b981',
    floorColor: '#1e293b',
    bounds: {
      x: 8.0,
      z: -4.45,
      width: 6.8,
      depth: 7.0,
      center: [8.0, 0, -4.45]
    },
    door: {
      position: [8.0, 0, -0.8],
      rotation: [0, 0, 0]
    },
    features: ['AI Model Benchmark Station', 'Audit Log Quality Radar', 'CSAT & Accuracy Telemetry']
  },
  {
    id: 'growth',
    name: 'Growth Room',
    shortName: 'Growth',
    code: 'ROOM-04',
    description: 'Studio pembuatan konten viral, copywriting kampanye marketing, desain konsep visual AI, dan manajemen pipeline CRM (Homebase: Silvi Growth).',
    color: '#f43f5e',
    floorColor: '#1e293b',
    bounds: {
      x: 15.0,
      z: -4.45,
      width: 6.8,
      depth: 7.0,
      center: [15.0, 0, -4.45]
    },
    door: {
      position: [15.0, 0, -0.8],
      rotation: [0, 0, 0]
    },
    features: ['Viral Content Board', 'Pollinations AI Generator Display', 'CRM Deals Pipeline Screen']
  },
  {
    id: 'systems',
    name: 'Systems Room',
    shortName: 'Systems',
    code: 'ROOM-05',
    description: 'Tata kelola naskah hukum & PKS, standarisasi modul SOP kerja, sistem data digital, dan otomasi ekspor laporan Excel/PDF (Homebase: Raka Systems).',
    color: '#06b6d4',
    floorColor: '#1e293b',
    bounds: {
      x: 21.25,
      z: -4.45,
      width: 5.3,
      depth: 7.0,
      center: [21.25, 0, -4.45]
    },
    door: {
      position: [21.25, 0, -0.8],
      rotation: [0, 0, 0]
    },
    features: ['Digital Legal Archive Terminal', 'SOP Standardization Desk', 'High-Speed Export Node']
  },
  {
    id: 'executive',
    name: 'Executive Room',
    shortName: 'Executive',
    code: 'ROOM-00',
    description: 'Ruang kerja & kantor utama Owner/CEO DigiBooster Indonesia dengan pemandangan langsung ke seluruh operasi.',
    color: '#f59e0b',
    floorColor: '#1e293b',
    bounds: {
      x: -13.2,
      z: -16.0,
      width: 10,
      depth: 8,
      center: [-13.2, 0, -16.0]
    },
    door: {
      position: [-13.2, 0, -11.0],
      rotation: [0, 0, 0]
    },
    features: ['Presidential Oak Desk', 'Private Lounge Sofa', 'En-Suite Spa & Restroom Access']
  }
];
