// Data 8 AI Agent DigiBooster Virtual Office
// Setiap karakter unik dengan seragam Navy + aksen Cyan DigiBooster

export const AGENTS = [
  {
    id: 'agent-kevin',
    name: 'Kevin Pratama',
    role: 'Lead AI Operations Architect',
    roomId: 'ai-ops',
    avatar: 'KP',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Working', // 'Working' | 'Idle' | 'Awaiting Approval' | 'Offline'
    gender: 'male',
    hairColor: '#1e293b',
    skinColor: '#ffd7ba',
    task: 'Mengoordinasikan model ensemble autonomous pipeline & load-balancer query.',
    holding: 'Neural Core Controller',
    stats: {
      tasksDone: 142,
      efficiency: '99.4%',
      uptime: '168h',
      latency: '24ms'
    },
    position: [-18, 0, -11],
    rotation: [0, 0, 0],
    deskPosition: [-18, 0, -12],
    computerColor: '#00B9F1'
  },
  {
    id: 'agent-maya',
    name: 'Maya Nirmala',
    role: 'Senior Fullstack Engineer',
    roomId: 'web-dev',
    avatar: 'MN',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Working',
    gender: 'female',
    hairColor: '#451a03',
    skinColor: '#fcd34d',
    task: 'Refaktorisasi arsitektur React Three Fiber & real-time WebSocket state synchronizer.',
    holding: 'Mechanical Keyboard (Voxel Custom)',
    stats: {
      tasksDone: 98,
      efficiency: '98.1%',
      uptime: '142h',
      latency: '18ms'
    },
    position: [-6, 0, -11],
    rotation: [0, 0, 0],
    deskPosition: [-6, 0, -12],
    computerColor: '#38bdf8'
  },
  {
    id: 'agent-dina',
    name: 'Dina Safitri',
    role: 'Head of Content & Growth',
    roomId: 'marketing',
    avatar: 'DS',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Working',
    gender: 'female',
    hairColor: '#78350f',
    skinColor: '#fed7aa',
    task: 'Menyusun formula 5 hooks video viral TikTok & analitik sentimen DigiBooster.',
    holding: 'Studio Tablet & Stylus',
    stats: {
      tasksDone: 84,
      efficiency: '96.8%',
      uptime: '120h',
      latency: '35ms'
    },
    position: [6, 0, -11],
    rotation: [0, 0, 0],
    deskPosition: [6, 0, -12],
    computerColor: '#f43f5e'
  },
  {
    id: 'agent-reza',
    name: 'Reza Mahendra',
    role: 'Partnership & Enterprise Lead',
    roomId: 'sales',
    avatar: 'RM',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Awaiting Approval',
    gender: 'male',
    hairColor: '#0f172a',
    skinColor: '#ffedd5',
    task: 'Menunggu tanda tangan MoU kemitraan strategis cloud provider & agency enterprise.',
    holding: 'Executive Digital Binder',
    stats: {
      tasksDone: 65,
      efficiency: '94.5%',
      uptime: '96h',
      latency: '40ms'
    },
    position: [18, 0, -11],
    rotation: [0, 0, 0],
    deskPosition: [18, 0, -12],
    computerColor: '#f59e0b'
  },
  {
    id: 'agent-sarah',
    name: 'Sarah Wijaya',
    role: 'Client Success & SLA Director',
    roomId: 'client-services',
    avatar: 'SW',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Working',
    gender: 'female',
    hairColor: '#172554',
    skinColor: '#ffe4e6',
    task: 'Memantau tiket klien prioritas, SLA compliance rate 99.8%, & resolusi instan.',
    holding: 'Omni-channel Headset',
    stats: {
      tasksDone: 215,
      efficiency: '99.8%',
      uptime: '210h',
      latency: '15ms'
    },
    position: [-18, 0, 11],
    rotation: [0, Math.PI, 0],
    deskPosition: [-18, 0, 12],
    computerColor: '#10b981'
  },
  {
    id: 'agent-budi',
    name: 'Budi Santoso',
    role: 'Chief Financial Officer & Compliance',
    roomId: 'finance',
    avatar: 'BS',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Idle',
    gender: 'male',
    hairColor: '#334155',
    skinColor: '#fef3c7',
    task: 'Laporan pembukuan kuartal berjalan siap — sistem menunggu input transaksi baru.',
    holding: 'Cryptographic Ledger Token',
    stats: {
      tasksDone: 52,
      efficiency: '100%',
      uptime: '88h',
      latency: '12ms'
    },
    position: [-6, 0, 11],
    rotation: [0, Math.PI, 0],
    deskPosition: [-6, 0, 12],
    computerColor: '#a855f7'
  },
  {
    id: 'agent-tiara',
    name: 'Tiara Anindya',
    role: 'Lead QA & AI Benchmark Specialist',
    roomId: 'research-qa',
    avatar: 'TA',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Working',
    gender: 'female',
    hairColor: '#374151',
    skinColor: '#fde047',
    task: 'Menjalankan 420 skenario fuzz-testing, evaluasi bias LLM, dan regression test.',
    holding: 'Spectrogram Diagnostic Pad',
    stats: {
      tasksDone: 178,
      efficiency: '99.1%',
      uptime: '155h',
      latency: '20ms'
    },
    position: [6, 0, 11],
    rotation: [0, Math.PI, 0],
    deskPosition: [6, 0, 12],
    computerColor: '#06b6d4'
  },
  {
    id: 'agent-hendra',
    name: 'Hendra Gunawan',
    role: 'Infrastructure & SecOps Specialist',
    roomId: 'it-infra',
    avatar: 'HG',
    portrait: '/assets/agents/kevin.jpg',
    status: 'Working',
    gender: 'male',
    hairColor: '#1e293b',
    skinColor: '#fbcfe8',
    task: 'Audit konfigurasi firewall Zero-Trust, balancing cluster node & auto-scaling.',
    holding: 'Fiber Optic Fiber Tracer',
    stats: {
      tasksDone: 130,
      efficiency: '99.9%',
      uptime: '720h',
      latency: '8ms'
    },
    position: [18, 0, 11],
    rotation: [0, Math.PI, 0],
    deskPosition: [18, 0, 12],
    computerColor: '#3b82f6'
  }
];

export const STATUS_COLORS = {
  Working: '#10b981',
  Idle: '#f59e0b',
  'Awaiting Approval': '#3b82f6',
  Offline: '#94a3b8'
};
