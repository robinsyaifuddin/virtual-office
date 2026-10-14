// Data Definisi 8 Ruang Operasional DigiBooster Virtual Office

export const ROOMS = [
  {
    id: 'ai-ops',
    name: 'AI Operations',
    shortName: 'AI Ops',
    code: 'ROOM-01',
    description: 'Pusat komando orkestrasi autonomous workflow, evaluasi model, dan penjadwalan multi-agent.',
    color: '#00B9F1',
    floorColor: '#1e293b',
    // Ruang grid & dimensi [width, depth]
    // Grid koordinat 4 kamar di utara (Z negatif), 4 kamar di selatan (Z positif)
    // Koridor pusat di Z = 0
    bounds: {
      x: -18,
      z: -11,
      width: 10,
      depth: 10,
      center: [-18, 0, -11]
    },
    door: {
      position: [-18, 0, -6],
      rotation: [0, 0, 0]
    },
    features: ['Multi-screen AI Monitor', 'Neural Sync Hub', 'Autonomous Agent Terminal']
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    shortName: 'Web Dev',
    code: 'ROOM-02',
    description: 'Pengembangan full-stack web application, arsitektur frontend/backend, dan integrasi API.',
    color: '#38bdf8',
    floorColor: '#1e293b',
    bounds: {
      x: -6,
      z: -11,
      width: 10,
      depth: 10,
      center: [-6, 0, -11]
    },
    door: {
      position: [-6, 0, -6],
      rotation: [0, 0, 0]
    },
    features: ['Dual Code Displays', 'Dev Server Stand', 'Continuous Deployment Console']
  },
  {
    id: 'marketing',
    name: 'Marketing & Content',
    shortName: 'Marketing',
    code: 'ROOM-03',
    description: 'Produksi konten multimedia, optimasi channel digital marketing, TikTok/IG viral hooks & analytics.',
    color: '#f43f5e',
    floorColor: '#1e293b',
    bounds: {
      x: 6,
      z: -11,
      width: 10,
      depth: 10,
      center: [6, 0, -11]
    },
    door: {
      position: [6, 0, -6],
      rotation: [0, 0, 0]
    },
    features: ['Campaign Analytics Board', 'Creative Tablet Station', 'Live Stream Stand']
  },
  {
    id: 'sales',
    name: 'Sales & Partnership',
    shortName: 'Sales',
    code: 'ROOM-04',
    description: 'Eksplorasi partnership B2B, negosiasi klien strategis, CRM, dan pipeline deals DigiBooster.',
    color: '#f59e0b',
    floorColor: '#1e293b',
    bounds: {
      x: 18,
      z: -11,
      width: 10,
      depth: 10,
      center: [18, 0, -11]
    },
    door: {
      position: [18, 0, -6],
      rotation: [0, 0, 0]
    },
    features: ['Deal Pipeline Dashboard', 'Meeting Corner', 'Contract Presentation Desk']
  },
  {
    id: 'client-services',
    name: 'Client Services',
    shortName: 'Client Services',
    code: 'ROOM-05',
    description: 'Dukungan klien 24/7, manajemen SLA, helpdesk omni-channel, dan customer satisfaction monitoring.',
    color: '#10b981',
    floorColor: '#1e293b',
    bounds: {
      x: -18,
      z: 11,
      width: 10,
      depth: 10,
      center: [-18, 0, 11]
    },
    door: {
      position: [-18, 0, 6],
      rotation: [0, Math.PI, 0]
    },
    features: ['Omnichannel Chat Center', 'Client Ticket Queue', 'SLA Health Indicator']
  },
  {
    id: 'finance',
    name: 'Finance & Administration',
    shortName: 'Finance',
    code: 'ROOM-06',
    description: 'Pengelolaan anggaran perusahaan, payroll, perpajakan, kepatuhan legal, dan pembukuan real-time.',
    color: '#a855f7',
    floorColor: '#1e293b',
    bounds: {
      x: -6,
      z: 11,
      width: 10,
      depth: 10,
      center: [-6, 0, 11]
    },
    door: {
      position: [-6, 0, 6],
      rotation: [0, Math.PI, 0]
    },
    features: ['Audit & Ledger Terminal', 'Vault & Filing Storage', 'Invoice Processing Station']
  },
  {
    id: 'research-qa',
    name: 'Research & QA',
    shortName: 'Research & QA',
    code: 'ROOM-07',
    description: 'Eksperimen benchmarking AI, automated testing suite, audit performa, dan validasi kualitas produk.',
    color: '#06b6d4',
    floorColor: '#1e293b',
    bounds: {
      x: 6,
      z: 11,
      width: 10,
      depth: 10,
      center: [6, 0, 11]
    },
    door: {
      position: [6, 0, 6],
      rotation: [0, Math.PI, 0]
    },
    features: ['Automated Test Runner', 'Benchmark Metrics Bench', 'Security Probe Console']
  },
  {
    id: 'it-infra',
    name: 'IT & Infrastructure',
    shortName: 'IT & Infra',
    code: 'ROOM-08',
    description: 'Server cluster, monitoring uptime 99.99%, backup redundansi, routing VPN & keamanan jaringan.',
    color: '#3b82f6',
    floorColor: '#1e293b',
    bounds: {
      x: 18,
      z: 11,
      width: 10,
      depth: 10,
      center: [18, 0, 11]
    },
    door: {
      position: [18, 0, 6],
      rotation: [0, Math.PI, 0]
    },
    features: ['High-Density Server Racks', 'Network Switch Array', 'Cooling System Vent']
  }
];
