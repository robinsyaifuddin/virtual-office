import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { 
  Users, 
  Bot, 
  Briefcase, 
  Mail, 
  Sparkles, 
  Cpu, 
  Sliders, 
  Terminal, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Settings, 
  Zap, 
  UserCheck, 
  FileText,
  Plus,
  Activity,
  Layers,
  Database,
  Download,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Share2,
  Trash2,
  Gauge,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Send,
  RefreshCw
} from 'lucide-react';
import { generateAgentResponse, runStressTestEvaluation } from '../../../services/multiAgentAiService';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes,
  Icon3DThumbUpBlue,
  Icon3DSadBlue,
  Icon3DPrayBlue 
} from '../../../components/ui/Modern3DIcons';

export default function StaffAgent() {
  const store = useWorkspaceStore();
  const staffAgents = Array.isArray(store?.staffAgents) ? store.staffAgents : [];
  const addStaffAgent = store?.addStaffAgent || (() => {});
  const updateStaffAgent = store?.updateStaffAgent || (() => {});
  const deleteStaffAgent = store?.deleteStaffAgent || (() => {});

  // Akses store telemetri & training di bagian atas komponen
  const aiTelemetry = store?.aiTelemetry || {};
  const aiTrainingRules = Array.isArray(store?.aiTrainingRules) ? store.aiTrainingRules : [];
  const addAiTrainingRule = store?.addAiTrainingRule || (() => {});
  const deleteAiTrainingRule = store?.deleteAiTrainingRule || (() => {});
  const recordAiTelemetryEvent = store?.recordAiTelemetryEvent || (() => {});
  const siskaTrainAgents = store?.siskaTrainAgents || (() => {});

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'human' | 'ai'
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const [selectedAgentForSetup, setSelectedAgentForSetup] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [selectedAgentForLogs, setSelectedAgentForLogs] = useState(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [testingAgentId, setTestingAgentId] = useState(null);
  const [testResultModal, setTestResultModal] = useState(null);
  
  // State untuk Dialog Interaktif / Live AI Command Box
  const [selectedAgentForPrompt, setSelectedAgentForPrompt] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptMessages, setPromptMessages] = useState([]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // State Khusus Tab Training & Eksperimen AI (Pilar 1, 2, 3)
  const [selectedTrainingAgentId, setSelectedTrainingAgentId] = useState('agent_talent');
  const [trainingEngine, setTrainingEngine] = useState('groq_llama70b'); // 'groq_llama70b' | 'gemini_flash' | 'local_ollama'
  const [testScenarioText, setTestScenarioText] = useState('Klien komplain tagihan salah Rp 15.000.000 dan meminta revisi klausul termin 30 hari. Berikan respon profesional dan rancang draf tindakan ke modul Keuangan.');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState('SOP Keuangan');
  const [newRuleText, setNewRuleText] = useState('');
  const [teachingFeedbackMsg, setTeachingFeedbackMsg] = useState('');

  // State Khusus: Siska Master AI Trainer & Behavioral Coach Deck
  const [siskaCoachingTarget, setSiskaCoachingTarget] = useState('Semua AI Agent');
  const [siskaCoachingTopic, setSiskaCoachingTopic] = useState('');
  const [siskaBehaviorGuidelines, setSiskaBehaviorGuidelines] = useState('');
  const [isSiskaCoaching, setIsSiskaCoaching] = useState(false);
  const [siskaCoachingReport, setSiskaCoachingReport] = useState(null);
  const [stressTestStep, setStressTestStep] = useState(0);
  const [stressTestStatusText, setStressTestStatusText] = useState('');

  // State Khusus: Live Training Arena Chat (Kolom Kiri)
  const [trainingChatInput, setTrainingChatInput] = useState('');
  const [isTrainingChatTyping, setIsTrainingChatTyping] = useState(false);
  const [trainingTypingAgent, setTrainingTypingAgent] = useState('');
  const [trainingMessages, setTrainingMessages] = useState([
    {
      id: 'train-msg-1',
      sender: 'Siska',
      name: 'Siska',
      role: 'Head of Quality & Master Trainer',
      badgeColor: '#0284c7',
      text: 'Selamat datang di Training Arena, Bang Robin. Seluruh Dewan Agen (Arga, Silvi, Raka, Reta) siap diuji di sini. Silakan ketik topik atau panggil nama panggilan mereka (sil, ga, ka, ret, sis) untuk menguji respon secara real-time. Jika ada bot yang salah atau pasif, saya akan langsung menegur dan memanggilnya.',
      timestamp: 'Live Session'
    }
  ]);

  // Handler Kirim Pesan di Training Arena dengan Panggilan Multi-Agent & Watchdog Siska
  const handleExecuteTrainingMessage = async () => {
    const userTxt = trainingChatInput.trim();
    if (!userTxt || isTrainingChatTyping) return;
    setTrainingChatInput('');

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newMsg = {
      id: `msg-tr-u-${Date.now()}`,
      sender: 'user',
      name: 'Bang Robin',
      role: 'Direktur Utama',
      text: userTxt,
      timestamp: nowStr
    };
    setTrainingMessages((prev) => [...prev, newMsg]);
    setIsTrainingChatTyping(true);

    const lower = userTxt.toLowerCase();

    // 1. Deteksi Target Nama Panggilan Akrab & Lengkap
    // Silvi: "silvi", "sil" (contoh: "gmn sil", "silvi gimana", "kamu gmn sil?")
    const isSilvi = /\b(silvi|sil)\b/i.test(lower);
    // Reta: "reta", "ret", "ta"
    const isReta = /\b(reta|ret|ta)\b/i.test(lower);
    // Raka: "raka", "ka" (khusus "ka raka" atau "ka")
    const isRaka = /\b(raka)\b/i.test(lower) || /\b(ka raka)\b/i.test(lower) || (lower.includes('berkas') || lower.includes('legal'));
    // Siska: "siska", "sis"
    const isSiska = /\b(siska|sis)\b/i.test(lower) || lower.includes('tegur') || lower.includes('koreksi');
    // Arga: "arga", "ga"
    const isArga = /\b(arga|ga)\b/i.test(lower);

    let targetBotName = 'Arga';
    let targetRole = 'Chief Strategy Officer (CSO)';

    if (isSilvi && !isArga) {
      targetBotName = 'Silvi';
      targetRole = 'Head of Growth & Creative';
    } else if (isReta && !isArga && !isSilvi) {
      targetBotName = 'Reta';
      targetRole = 'Chief Operating Officer (COO)';
    } else if (isRaka && !isArga) {
      targetBotName = 'Raka';
      targetRole = 'Head of Documentation & Legal';
    } else if (isSiska) {
      targetBotName = 'Siska';
      targetRole = 'Head of Quality & AI Trainer';
    } else if (isArga) {
      targetBotName = 'Arga';
      targetRole = 'Chief Strategy Officer (CSO)';
    }

    setTrainingTypingAgent(targetBotName);

    try {
      const aiRes = await generateAgentResponse({
        agentName: targetBotName,
        agentRole: targetRole,
        userMessage: userTxt,
        conversationHistory: trainingMessages,
        customInstruction: `Kamu (${targetBotName}) sedang berada di Training Arena bersama Bang Robin.
Tanggapi secara manusiawi dan relevan dengan peranmu.
Dianjurkan jika butuh koordinasi, kamu boleh menyebut teman bot lain secara santai (contoh: "gimana sil?", "coba ka raka siapin berkasnya", "ta tolong catat yaa").
Dilarang keras memakai nama sendiri sebagai awalan teks ("${targetBotName}: ").`
      });

      // Sanitasi awalan nama jika masih muncul
      let cleanText = (aiRes.text || '').replace(new RegExp(`^(${targetBotName}|Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

      const botReplyMsg = {
        id: `msg-tr-ai-${Date.now()}`,
        sender: targetBotName,
        name: targetBotName,
        role: targetRole,
        badgeColor: '#0284c7',
        text: cleanText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };

      setTrainingMessages((prev) => [...prev, botReplyMsg]);

      // Catat telemetri
      recordAiTelemetryEvent({
        agent: targetBotName,
        action: `Training Arena Interactive Session`,
        targetModule: 'Training Lab',
        tokensUsed: aiRes.usage?.total_tokens || 340,
        latencyMs: 310,
        status: 'Success',
        engine: aiRes.engine
      });

      // 2. Siska Watchdog Intervensi Otonom:
      // Jika bot menyebut bot lain (misal Silvi melempar pertanyaan ke Reta atau Arga), ATAU jika jawaban dirasa kurang lengkap
      const lowerReply = cleanText.toLowerCase();
      const botCalledOther = 
        (targetBotName !== 'Silvi' && /\b(sil|silvi)\b/i.test(lowerReply)) ||
        (targetBotName !== 'Reta' && /\b(ta|ret|reta)\b/i.test(lowerReply)) ||
        (targetBotName !== 'Raka' && /\b(ka|raka)\b/i.test(lowerReply)) ||
        (targetBotName !== 'Arga' && /\b(ga|arga)\b/i.test(lowerReply));

      if (botCalledOther) {
        // Tentukan siapa yang dipanggil oleh bot pertama
        let nextBot = 'Silvi';
        let nextRole = 'Head of Growth & Creative';
        if (/\b(sil|silvi)\b/i.test(lowerReply)) { nextBot = 'Silvi'; nextRole = 'Head of Growth & Creative'; }
        else if (/\b(ta|ret|reta)\b/i.test(lowerReply)) { nextBot = 'Reta'; nextRole = 'Chief Operating Officer (COO)'; }
        else if (/\b(ka|raka)\b/i.test(lowerReply)) { nextBot = 'Raka'; nextRole = 'Head of Documentation & Legal'; }
        else if (/\b(ga|arga)\b/i.test(lowerReply)) { nextBot = 'Arga'; nextRole = 'Chief Strategy Officer (CSO)'; }

        if (nextBot !== targetBotName) {
          setTrainingTypingAgent(nextBot);
          setTimeout(async () => {
            const nextBotRes = await generateAgentResponse({
              agentName: nextBot,
              agentRole: nextRole,
              userMessage: `${targetBotName} tadi menyapamu dan melempar hal ini: "${cleanText}". Tanggapi dia dan Bang Robin secara santai dan taktis.`,
              conversationHistory: [...trainingMessages, newMsg, botReplyMsg],
              customInstruction: `Kamu (${nextBot}) langsung merespon lemparan diskusi dari ${targetBotName} dan Bang Robin.`
            });

            let cleanNext = (nextBotRes.text || '').replace(new RegExp(`^(${nextBot}|Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

            setTrainingMessages((prev) => [
              ...prev,
              {
                id: `msg-tr-interact-${Date.now()}`,
                sender: nextBot,
                name: nextBot,
                role: nextRole,
                badgeColor: '#0284c7',
                text: cleanNext,
                timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
              }
            ]);
            setIsTrainingChatTyping(false);
          }, 1200);
          return;
        }
      }
    } catch (err) {
      console.error('Training chat error:', err);
    } finally {
      setIsTrainingChatTyping(false);
    }
  };

  const statusOptions = ['Semua Status', 'Online / Bertugas', 'Standby', 'Istirahat', 'Cuti / Off'];

  // Pisahkan kategori personil
  const humanStaff = staffAgents.filter(s => s && s.type === 'Staf Manusia');
  const aiStaff = staffAgents.filter(s => s && (s.type || '').includes('AI'));

  // Data terfilter sesuai tab aktif & status filter
  const currentTabPool = activeTab === 'human' 
    ? humanStaff 
    : activeTab === 'ai' 
      ? aiStaff 
      : staffAgents;

  const filteredStaff = currentTabPool.filter((s) => {
    if (!s) return false;
    if (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all') {
      return true;
    }
    return s.status === statusFilter;
  });

  // Data Bar Chart: Personil per Departemen
  const deptCounts = staffAgents.reduce((acc, s) => {
    const d = s.department || 'Operasional';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const staffBarData = Object.keys(deptCounts).map((dept, idx) => {
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawDept = (dept && typeof dept === 'string') ? dept : `Divisi ${idx+1}`;
    return {
      label: rawDept.split(' ')[0] || dept,
      value: deptCounts[dept],
      displayVal: `${deptCounts[dept]} Orang`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Kerja Personil & AI
  const statusCounts = staffAgents.reduce((acc, s) => {
    const st = (s && s.status && typeof s.status === 'string' && s.status.trim()) ? s.status.trim() : 'Online / Bertugas';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Online / Bertugas': '#16a34a',
    'Standby': '#0284c7',
    'Istirahat': '#d97706',
    'Cuti / Off': '#dc2626'
  };

  const staffDonutData = Object.keys(statusCounts).map(st => ({
    label: st,
    value: statusCounts[st],
    displayVal: `${statusCounts[st]} Personil`,
    color: statusColors[st] || '#0284c7'
  }));

  const handleOpenSetupModal = (agent) => {
    setSelectedAgentForSetup({ 
      ...agent,
      managedModules: agent.managedModules || ['Tugas & Kalender']
    });
    setShowSetupModal(true);
  };

  const handleOpenLogsModal = (agent) => {
    setSelectedAgentForLogs(agent);
    setShowLogsModal(true);
  };

  const handleSaveSetupModal = (e) => {
    e.preventDefault();
    if (!selectedAgentForSetup) return;
    updateStaffAgent(selectedAgentForSetup.id, {
      persona: selectedAgentForSetup.persona,
      systemPrompt: selectedAgentForSetup.systemPrompt,
      aiEngine: selectedAgentForSetup.aiEngine,
      role: selectedAgentForSetup.role,
      name: selectedAgentForSetup.name,
      department: selectedAgentForSetup.department,
      status: selectedAgentForSetup.status,
      room: selectedAgentForSetup.room,
      executionMode: selectedAgentForSetup.executionMode || 'Autonomous',
      managedModules: selectedAgentForSetup.managedModules || ['Tugas & Kalender']
    });
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setShowSetupModal(false);
    }, 1200);
  };

  const toggleModulePermission = (modName) => {
    if (!selectedAgentForSetup) return;
    const currentMods = selectedAgentForSetup.managedModules || [];
    const updatedMods = currentMods.includes(modName)
      ? currentMods.filter(m => m !== modName)
      : [...currentMods, modName];
    setSelectedAgentForSetup({ ...selectedAgentForSetup, managedModules: updatedMods });
  };

  // Buka modal dialog interaktif AI
  const handleOpenPromptModal = (agent) => {
    setSelectedAgentForPrompt(agent);
    setPromptInput('');
    setPendingAction(null);
    setIsAiThinking(false);
    
    // Sapaan hangat, santai, dan empatik layaknya konsultan/partner profesional
    const warmGreetings = {
      Arga: `Halo! Senang banget bisa ngobrol langsung. Saya Arga, partner brainstorming dan strategi Anda di Strategy Room.\n\nLagi ada ide besar apa yang mau kita diskusikan bareng? Mau santai bertukar pikiran, bedah arah bisnis, atau mau langsung saya bantu agendakan ke dashboard? Ceritakan saja dengan santai, saya dengarkan.`,
      Reta: `Halo! Reta di sini dari Operations Room. Senang bisa terhubung.\n\nBagaimana ritme operasional hari ini? Ada tugas yang bikin pusing, alur kerja yang mau dipercepat, atau ada hal yang mau dieksekusi bareng? Ceritakan saja apa yang Anda rasakan dan butuhkan, saya siap bantu rapikan.`,
      Silvi: `Hai! Silvi siap nemenin diskusi seru hari ini dari Growth Room.\n\nLagi kepikiran ide konten viral apa, atau ada prospek klien baru yang mau kita dekati? Yuk kita obrolin santai sambil cari angle terbaiknya!`,
      Raka: `Halo! Raka siap bantu dari Systems Room. Santai saja, kita ngobrol enak.\n\nAda dokumen hukum, SOP, atau tata kelola berkas yang mau dirapikan agar bisnis Anda makin kokoh dan tenang? Kabari saya ya!`,
      Siska: `Hai! Siska di sini dari Quality Room. Senang bisa nemenin Anda evaluasi.\n\nBagaimana performa tim dan sistem kita belakangan ini? Ada hal yang terasa kurang pas atau mau kita tingkatkan kualitasnya? Silakan curhat atau kasih arahan, saya siap menyimak.`
    };

    const initialText = warmGreetings[agent.name] || `Halo! Saya ${agent.name}, rekan kerja Anda di ${agent.room || 'kantor 3D'}. Senang bisa ngobrol santai hari ini. Ada hal menarik apa yang mau kita bahas atau bereskan di dashboard?`;

    setPromptMessages([
      {
        id: `MSG-${Date.now()}-1`,
        sender: 'ai',
        text: initialText
      }
    ]);
    setShowPromptModal(true);
  };

  // Helper cerdas pembuat judul singkat, profesional, dan padat (Clean Title Generator)
  const generateCleanTitle = (text, module) => {
    const lower = text.toLowerCase();
    
    // Perumusan judul berbasis topik cerdas (3 - 5 kata padat)
    if (lower.includes('bot') || lower.includes('ai') || lower.includes('otomasi') || lower.includes('dashboard')) {
      if (module === 'Rapat & Catatan') return 'Sinkronisasi Arsitektur Bot Dashboard';
      if (module === 'Tugas & Kalender') return 'Setup & Audit Workflow Bot AI';
      if (module === 'Sasaran & KPI') return 'Target Automasi 100% Modul Bot';
      if (module === 'Data & Arsip') return 'SOP Panduan Tata Kelola AI';
    }
    if (lower.includes('sosmed') || lower.includes('konten') || lower.includes('follower') || lower.includes('marketing')) {
      if (module === 'Tugas & Kalender') return 'Produksi Konten Edukasi Reels';
      if (module === 'Sasaran & KPI') return 'Peningkatan Engagement Sosial Media';
      return 'Strategi Kampanye Growth Konten';
    }
    if (lower.includes('klien') || lower.includes('sales') || lower.includes('prospek') || lower.includes('closing')) {
      if (module === 'CRM & Klien') return 'Prospek Mitra Korporat Inbound';
      return 'Optimasi Alur Respon Lead 5 Menit';
    }
    if (lower.includes('sop') || lower.includes('kontrak') || lower.includes('dokumen') || lower.includes('arsip')) {
      return 'Dokumen Regulasi & SOP Operasional';
    }

    let clean = text
      .replace(/^(tolong|coba|bisa|tolong buatkan|buatkan|buat|bikin|jadwalkan|agendakan|masukkan|catat|siapkan|atur)\s+/i, '')
      .replace(/^(arga|reta|silvi|raka|siska)[,\s:]*/i, '')
      .replace(/di tanggal.*$/i, '')
      .replace(/pada tanggal.*$/i, '')
      .replace(/nanti.*$/i, '')
      .trim();

    const words = clean.split(/\s+/).slice(0, 5).join(' ');
    if (module === 'Rapat & Catatan') return `Koordinasi: ${words || 'Strategi Operasional'}`;
    if (module === 'Tugas & Kalender') return `Eksekusi: ${words || 'Tugas Prioritas'}`;
    if (module === 'CRM & Klien') return words || 'Mitra Korporat Baru';
    if (module === 'Data & Arsip') return `Arsip: ${words || 'Dokumen Tata Kelola'}`;
    if (module === 'Sasaran & KPI') return `Sasaran: ${words || 'Efisiensi Sistem'}`;
    return words || 'Inisiatif Strategis';
  };

  // Eksekusi aksi yang telah dikonfirmasi user
  const executePendingAction = async () => {
    if (!pendingAction || !selectedAgentForPrompt) return;
    setIsAiThinking(true);
    const plan = pendingAction;
    const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB';
    let execDetails = '';

    try {
      if (plan.targetModule === 'Rapat & Catatan') {
        const id = `MTG-${Date.now().toString().slice(-4)}`;
        await store.addMeeting({
          id,
          title: plan.title,
          dateTime: plan.fields?.dateTime || '20 Okt 2026, 10:00 WIB',
          type: plan.fields?.type || 'Internal Weekly Sync',
          room: selectedAgentForPrompt.room || 'Strategy Room (Virtual 3D)',
          status: 'Terjadwal',
          participants: ['Executive Owner', selectedAgentForPrompt.name],
          summaryNotes: plan.fields?.summaryNotes || `Diagendakan via brainstorming bersama ${selectedAgentForPrompt.name}. Membahas arah masa depan peran AI.`
        });
        execDetails = `Berhasil menjadwalkan agenda "${plan.title}" (ID: ${id}) di modul Rapat & Catatan untuk tanggal ${plan.fields?.dateTime || '20 Okt 2026'}.`;
      } else if (plan.targetModule === 'CRM & Klien') {
        const id = `CRM-${Date.now().toString().slice(-4)}`;
        await store.addCrmClient({
          id,
          name: plan.title,
          category: plan.fields?.category || 'Enterprise Corp',
          stage: plan.fields?.stage || 'Discovery Call',
          dealValue: Number(plan.fields?.dealValue || 75000000),
          services: ['Autonomous AI Agent'],
          pic: selectedAgentForPrompt.name,
          notes: plan.fields?.notes || `Dibuat via instruksi dialog prompt oleh ${selectedAgentForPrompt.name}`
        });
        execDetails = `Membuat entri prospek klien baru "${plan.title}" (ID: ${id}) di modul CRM & Klien bernilai Rp ${(plan.fields?.dealValue || 75000000).toLocaleString('id-ID')}.`;
      } else if (plan.targetModule === 'Data & Arsip') {
        const id = `ARC-${Date.now().toString().slice(-4)}`;
        await store.addArchive({
          id,
          title: plan.title,
          category: plan.fields?.category || 'Dokumen PDF / Legalitas',
          fileFormat: 'PDF',
          status: 'Aktif',
          fileSize: '320 KB',
          description: plan.fields?.description || `Disusun otomatis oleh ${selectedAgentForPrompt.name}`
        });
        execDetails = `Mengarsipkan dokumen baru "${plan.title}" (ID: ${id}) ke modul Data & Arsip.`;
      } else if (plan.targetModule === 'Sasaran & KPI') {
        const id = `OKR-${Date.now().toString().slice(-4)}`;
        await store.addOkrGoal({
          id,
          objective: plan.title,
          keyResult: plan.fields?.keyResult || 'Penyelesaian inisiatif strategis tepat waktu',
          category: 'Efisiensi Operasional',
          division: selectedAgentForPrompt.department || 'Manajemen',
          quarter: 'Q4',
          targetNum: 100,
          currentNum: 75,
          unit: '%',
          owner: selectedAgentForPrompt.name
        });
        execDetails = `Mendaftarkan sasaran OKR baru "${plan.title}" (ID: ${id}) ke dewan direksi.`;
      } else {
        const id = `TSK-${Date.now().toString().slice(-4)}`;
        await store.addTask({
          id,
          title: plan.title,
          description: plan.fields?.description || `Instruksi eksekutif: ${plan.rawPrompt}`,
          category: plan.fields?.category || 'Website & Tracking',
          project: 'DigiBooster Automation Hub',
          assignee: selectedAgentForPrompt.name,
          priority: plan.fields?.priority || 'P1',
          status: 'Sedang Dikerjakan',
          outputResult: 'Tugas diproses secara autonomous oleh AI'
        });
        execDetails = `Menambahkan tugas operasional baru "${plan.title}" (ID: ${id}) ke modul Tugas & Kalender dengan PIC ${selectedAgentForPrompt.name}.`;
      }

      // Catat log resmi ke memory bot
      store.addAgentActivityLog(selectedAgentForPrompt.id, {
        module: plan.targetModule,
        action: `${plan.actionType} Data Dashboard`,
        details: execDetails,
        status: 'Success'
      });

      setPendingAction(null);
      setPromptMessages((prev) => [
        ...prev,
        {
          id: `MSG-${Date.now()}-done`,
          sender: 'ai',
          text: `🎉 **Laporan Selesai Dieksekusi:**\n\n✓ **Hasil Tindakan:** ${execDetails}\n✓ **Status Database:** Berhasil disimpan ke Supabase & disinkronkan ke modul ${plan.targetModule}.\n✓ **Log Audit:** Tercatat di jejak riwayat bot pada ${nowStr}.\n\nApakah ada ide atau arahan lain yang ingin kita diskusikan/kerjakan, atau sudah cukup? *(Ketik "Cukup" jika sudah selesai)*`
        }
      ]);
    } catch (err) {
      console.error('Error saat eksekusi prompt dialog:', err);
      setPromptMessages((prev) => [
        ...prev,
        {
          id: `MSG-${Date.now()}-err`,
          sender: 'ai',
          text: `Maaf, terjadi kendala saat mengeksekusi data: ${err.message}. Mohon coba kembali.`
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Mengirim instruksi ke bot AI dengan sentuhan empati psikologi, fun, natural, dan bebas format bintang robotik
  const handleSendPrompt = async (e) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isAiThinking || !selectedAgentForPrompt) return;

    const userText = promptInput.trim();
    const newMsgId = `MSG-${Date.now()}`;
    const userMsg = { id: newMsgId, sender: 'user', text: userText };
    setPromptMessages((prev) => [...prev, userMsg]);
    setPromptInput('');
    setIsAiThinking(true);

    const lower = userText.toLowerCase();

    // 1. Respon Sapaan Manusiawi & Santai (Halo, Hai, Pagi, Malam, Apa kabar)
    const isGreeting = (
      lower === 'halo' || lower === 'hai' || lower === 'hey' || lower === 'pagi' || 
      lower === 'selamat pagi' || lower === 'siang' || lower === 'sore' || lower === 'malam' ||
      lower.includes('apa kabar') || lower.includes('lagi ngapain') || lower.includes('sehat')
    );

    if (isGreeting) {
      setTimeout(() => {
        let greetingReply = '';
        if (selectedAgentForPrompt.name.includes('Arga')) {
          greetingReply = `Halo juga! Kabar saya sangat baik dan pikiran lagi fresh banget nih di Strategy Room. Senang Anda menyapa lebih dulu.\n\nLagi santai atau ada hal menarik di pikiran yang mau kita bedah bareng? Jangan sungkan, ceritakan saja apa yang lagi Anda rasakan atau rencanakan.`;
        } else if (selectedAgentForPrompt.name.includes('Silvi')) {
          greetingReply = `Hai hai! Kabar luar biasa ceria dari Growth Room! Selalu semangat kalau Anda mampir ngobrol.\n\nHari ini mood-nya lagi gimana nih? Mau ngobrol santai seputar ide kreatif, tren baru, atau ada target seru yang mau kita capai bareng?`;
        } else if (selectedAgentForPrompt.name.includes('Reta')) {
          greetingReply = `Halo! Senang disapa Anda. Di Operations Room semuanya berjalan lancar dan terkendali.\n\nBagaimana kondisi hari ini? Jangan terlalu memforsir tenaga ya, kalau ada beban tugas yang numpuk, yuk kita bagi dan bereskan bareng.`;
        } else {
          greetingReply = `Halo! Senang banget bisa terhubung langsung dengan Anda hari ini dalam suasana santai. Ada obrolan atau topik seru apa yang mau kita diskusikan? Saya siap mendengarkan.`;
        }

        setPromptMessages((prev) => [
          ...prev,
          {
            id: `MSG-${Date.now()}-greet`,
            sender: 'ai',
            text: greetingReply
          }
        ]);
        setIsAiThinking(false);
      }, 650);
      return;
    }

    // 2. Respon Penutupan Obrolan (Cukup, Makasih, Selesai)
    if (lower.includes('cukup') || lower.includes('selesai') || lower === 'sudah' || lower.includes('terima kasih') || lower.includes('makasih') || lower.includes('thank')) {
      setTimeout(() => {
        setPromptMessages((prev) => [
          ...prev,
          {
            id: `MSG-${Date.now()}-done`,
            sender: 'ai',
            text: `Siap, terima kasih banyak sudah bertukar pikiran hari ini! Senang sekali bisa mendampingi dan meringankan beban pikiran Anda. Seluruh catatan tersimpan rapi dan aman. Istirahat yang cukup ya, saya tetap bersiaga kapan pun Anda butuh rekan diskusi lagi!`
          }
        ]);
        setIsAiThinking(false);
      }, 700);
      return;
    }

    // 3. Konfirmasi Eksekusi dari Pengguna
    if (pendingAction && (lower.includes('ya') || lower.includes('iya') || lower.includes('jalankan') || lower.includes('lakukan') || lower.includes('eksekusi') || lower.includes('oke') || lower.includes('lanjut') || lower.includes('yes') || lower.includes('setuju') || lower.includes('gas') || lower.includes('siap'))) {
      executePendingAction();
      return;
    }

    // 4. Analisa Kecerdasan AI
    setTimeout(async () => {
      // 1. Cek apakah ada perintah eksplisit untuk memasukkan data / catat / buatkan
      const isExplicitDataCommand = (
        lower.startsWith('masukkan') || lower.startsWith('input') || lower.startsWith('tambahkan') ||
        lower.startsWith('catat') || lower.startsWith('jadwalkan') || lower.startsWith('buatkan') ||
        lower.startsWith('bikin') || lower.startsWith('simpan') || lower.includes('masukkan ke data') ||
        lower.includes('catat di') || lower.includes('jadwalkan rapat') || lower.includes('buatkan tugas') ||
        lower.includes('masukin data') || lower.includes('tolong input') || lower.includes('tolong catat') ||
        lower.includes('bikin target') || lower.includes('tolong jadwalkan')
      );

      // 2. DETEKSI PERTANYAAN BACA / TANYA DATA DASHBOARD (READ Mechanism)
      const isQueryingData = (
        lower.includes('berapa') || lower.includes('ada apa saja') || lower.includes('apa aja') ||
        lower.includes('cek data') || lower.includes('lihat data') || lower.includes('tampilkan data') ||
        lower.includes('status data') || lower.includes('daftar') || lower.includes('list') ||
        lower.includes('data berkas') || lower.includes('data arsip') || lower.includes('data tugas') ||
        lower.includes('data klien') || lower.includes('data rapat') || lower.includes('data okr') ||
        (lower.includes('data') && (lower.includes('kita') || lower.includes('ada') || lower.includes('semua') || lower.includes('total')))
      );

      if (isQueryingData) {
        let readReply = '';
        const archives = Array.isArray(store?.archives) ? store.archives : [];
        const tasks = Array.isArray(store?.tasks) ? store.tasks : [];
        const clients = Array.isArray(store?.clients) ? store.clients : [];
        const meetings = Array.isArray(store?.meetings) ? store.meetings : [];
        const okrGoals = Array.isArray(store?.okrGoals) ? store.okrGoals : [];

        if (lower.includes('berkas') || lower.includes('arsip') || lower.includes('dokumen') || selectedAgentForPrompt.name.includes('Raka')) {
          const totalArchives = archives.length;
          const activeDocs = archives.filter(a => a.status === 'Aktif').length;
          const sampleDocs = archives.slice(0, 3).map(a => `"${a.title}"`).join(', ');
          readReply = `Saat ini total ada ${totalArchives} berkas dokumen di modul Data & Arsip (${activeDocs} berstatus aktif). Dokumen terkini antara lain: ${sampleDocs || 'Belum ada berkas terdaftar'}. Mau saya carikan berkas tertentu?`;
        } else if (lower.includes('tugas') || lower.includes('task') || lower.includes('jadwal') || selectedAgentForPrompt.name.includes('Reta')) {
          const totalTasks = tasks.length;
          const ongoing = tasks.filter(t => t.status === 'Sedang Dikerjakan').length;
          const p1Tasks = tasks.filter(t => t.priority === 'P1').length;
          readReply = `Di modul Tugas & Kalender ada ${totalTasks} tugas tersimpan (${ongoing} sedang aktif berjalan, ${p1Tasks} prioritas P1). Ada alur kerja atau tugas yang mau saya filter?`;
        } else if (lower.includes('klien') || lower.includes('prospek') || lower.includes('lead') || lower.includes('crm') || selectedAgentForPrompt.name.includes('Silvi')) {
          const totalClients = clients.length;
          const hotLeads = clients.filter(c => c.stage === 'Discovery Call' || c.stage === 'Proposal Terkirim').length;
          readReply = `Di modul CRM ada total ${totalClients} entri mitra/klien. ${hotLeads} di antaranya berada pada tahapan prospek aktif. Mau kita tindak lanjuti prospek yang mana?`;
        } else if (lower.includes('rapat') || lower.includes('meeting') || lower.includes('agenda')) {
          const totalMeetings = meetings.length;
          readReply = `Ada ${totalMeetings} agenda di modul Rapat & Catatan. Jadwal terdekat adalah sinkronisasi internal berkala di Virtual 3D Office. Mau saya siapkan notulen atau cek jamnya?`;
        } else if (lower.includes('okr') || lower.includes('target') || lower.includes('kpi') || lower.includes('sasaran')) {
          const totalOkrs = okrGoals.length;
          readReply = `Di modul Sasaran & KPI ada ${totalOkrs} inisiatif OKR aktif terdaftar pada kuartal berjalan. Mau kita tinjau metrik pencapaiannya?`;
        } else {
          readReply = `Ringkasan data dashboard saat ini: ${tasks.length} tugas operasional, ${clients.length} klien di CRM, ${archives.length} berkas arsip, dan ${okrGoals.length} sasaran OKR. Modul mana yang mau Anda lihat detailnya?`;
        }

        setPromptMessages((prev) => [
          ...prev,
          {
            id: `MSG-${Date.now()}-read`,
            sender: 'ai',
            text: readReply
          }
        ]);
        setIsAiThinking(false);
        return;
      }

      // 3. Jika bukan perintah data & bukan query data: bot ngobrol natural, dinamis, tanpa template, hemat token!
      if (!isExplicitDataCommand) {
        let counselReply = '';

        if (lower.includes('khawatir') || lower.includes('ga pintar') || lower.includes('kurang pintar') || lower.includes('bodoh') || lower.includes('takut bot')) {
          counselReply = `Kekhawatiran yang sangat wajar. Kuncinya: bot jangan dibiarkan nebak-nebak, tapi kita beri batasan peran dan SOP yang presisi. Selama alur datanya spesifik, bot bakal konsisten dan gak bakal melenceng.`;
        } else if (lower.includes('follower') || lower.includes('sosmed') || lower.includes('konten') || lower.includes('ig') || lower.includes('tiktok') || lower.includes('engagement')) {
          counselReply = `Followers seret biasanya karena hook 3 detik pertama kurang nendang atau belum konsisten pecahin masalah audiens. Fokus bikin 3 konten edukasi solusi nyata format Reels/Carousel.`;
        } else if (lower.includes('staf') || lower.includes('karyawan') || lower.includes('manusia') || lower.includes('tertekan')) {
          counselReply = `Staf manusia gak akan tertekan selama AI diposisikan sebagai asisten pembantu tugas repetitif, bukan pengganti peran mereka. Kejelasan SOP pembagian tugas itu kuncinya.`;
        } else if (lower.includes('klien') || lower.includes('sales') || lower.includes('closing') || lower.includes('omset') || lower.includes('prospek')) {
          counselReply = `Closing seret biasanya bukan soal produk, tapi respons lambat ke lead yang masih hangat. Begitu ada yang tanya, dalam 5 menit usahakan sudah disapa secara personal.`;
        } else if (lower.includes('prioritas') || lower.includes('bingung') || lower.includes('pusing') || lower.includes('banyak tugas')) {
          counselReply = `Wajar pusing kalau semua hal dianggap darurat. Rumus psikologi eksekutif: pilih 1 hal terpenting (P1) hari ini yang kalau selesai bakal bikin hal lain jauh lebih mudah.`;
        } else if (lower.includes('dashboard') || lower.includes('manajemen data') || lower.includes('kelola')) {
          counselReply = `Untuk dashboard, polanya sederhana: pisahkan data operasional harian, data klien, dan target berkala. Bot cukup memantau status dan memberi alert saat ada yang tertunda. Mau bahas modul mana dulu?`;
        } else {
          // Tanggapan dinamis spesifik sesuai persona agent tanpa tamplate klise
          const agentName = selectedAgentForPrompt.name || '';
          if (agentName.includes('Raka')) {
            counselReply = `Sistem arsip dan dokumentasi hukum kita saat ini siap dipakai. Kalau ada berkas atau SOP yang mau dirapikan, beri tahu saya ya.`;
          } else if (agentName.includes('Arga')) {
            counselReply = `Poin strategis yang menarik. Kuncinya kita jaga fokus pada metrik yang paling berdampak langsung. Mau kita breakdown langkah eksekusinya?`;
          } else if (agentName.includes('Silvi')) {
            counselReply = `Ide yang segar! Dari sudut pandang engagement, konten yang menyentuh emosi audiens selalu paling efektif. Ada angle yang mau kita uji coba?`;
          } else if (agentName.includes('Reta')) {
            counselReply = `Alur kerja yang simpel selalu menghasilkan eksekusi yang cepat. Kalau ada pembagian tugas yang mau diatur ulang, tinggal kabari saya.`;
          } else if (agentName.includes('Siska')) {
            counselReply = `Standar kualitas kita perlu dijaga konsisten. Ada SOP atau bagian alur kerja yang menurut Anda perlu kita evaluasi bareng?`;
          } else {
            counselReply = `Saya tangkap arah pembicaraannya. Menjaga alur kerja tetap terarah memang prioritas utama kita sekarang.`;
          }
        }

        setPromptMessages((prev) => [
          ...prev,
          {
            id: `MSG-${Date.now()}-counsel`,
            sender: 'ai',
            text: counselReply
          }
        ]);
        setIsAiThinking(false);
        return;
      }

      // 3. Jika pengguna memang MENYURUH memasukkan data atau ada instruksi data yang nyata
      // Deteksi Modul Dashboard yang Paling Tepat & Relevan
      let targetModule = 'Tugas & Kalender';
      if (lower.includes('rapat') || lower.includes('meeting') || lower.includes('sync') || lower.includes('agenda') || lower.includes('notulen') || lower.includes('diskusi')) {
        targetModule = 'Rapat & Catatan';
      } else if (lower.includes('klien') || lower.includes('crm') || lower.includes('prospek') || lower.includes('lead') || lower.includes('deal') || lower.includes('mitra')) {
        targetModule = 'CRM & Klien';
      } else if (lower.includes('arsip') || lower.includes('dokumen') || lower.includes('kontrak') || lower.includes('pks') || lower.includes('legal') || lower.includes('sop') || lower.includes('berkas')) {
        targetModule = 'Data & Arsip';
      } else if (lower.includes('okr') || lower.includes('target') || lower.includes('kpi') || lower.includes('sasaran')) {
        targetModule = 'Sasaran & KPI';
      } else {
        targetModule = 'Tugas & Kalender';
      }

      // Perumusan Judul Singkat, Elegan, dan Relevan (Clean Title)
      const smartTitle = generateCleanTitle(userText, targetModule);

      // Ekstrak tanggal jika ada dalam pembicaraan
      let extractedDate = '20 Okt 2026, 10:00 WIB';
      const dateMatch = userText.match(/(\d{1,2}\s+(?:januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember|okt|nov|des)\s*\d{0,4})/i);
      if (dateMatch) {
        extractedDate = dateMatch[0] + ', 10:00 WIB';
      }

      // Susun Struktur Kolom Data secara Rapi & Bersih
      let tableFieldSpecs = [];
      let mappedPayload = {};

      if (targetModule === 'Rapat & Catatan') {
        tableFieldSpecs = [
          { label: 'Agenda Rapat', val: smartTitle },
          { label: 'Jadwal & Waktu', val: extractedDate },
          { label: 'Ruang Kantor 3D', val: selectedAgentForPrompt.room || 'Strategy Room (Virtual 3D)' },
          { label: 'Peserta', val: `Executive Owner & ${selectedAgentForPrompt.name}` },
          { label: 'Catatan Khusus', val: userText.length > 50 ? userText.slice(0, 100) + '...' : userText }
        ];
        mappedPayload = {
          dateTime: extractedDate,
          type: 'Internal Sync',
          summaryNotes: userText
        };
      } else if (targetModule === 'CRM & Klien') {
        tableFieldSpecs = [
          { label: 'Nama Mitra / Prospek', val: smartTitle },
          { label: 'Kategori Klien', val: 'Enterprise Corp' },
          { label: 'Tahapan Pipeline', val: 'Discovery Call' },
          { label: 'Estimasi Nilai', val: 'Rp 85.000.000' },
          { label: 'Catatan Khusus', val: userText }
        ];
        mappedPayload = { category: 'Enterprise Corp', stage: 'Discovery Call', dealValue: 85000000, notes: userText };
      } else if (targetModule === 'Data & Arsip') {
        tableFieldSpecs = [
          { label: 'Judul Berkas', val: smartTitle },
          { label: 'Kategori', val: 'SOP & Regulasi' },
          { label: 'Format File', val: 'PDF' },
          { label: 'Catatan Khusus', val: userText }
        ];
        mappedPayload = { category: 'SOP & Regulasi', fileFormat: 'PDF', description: userText };
      } else if (targetModule === 'Sasaran & KPI') {
        tableFieldSpecs = [
          { label: 'Sasaran (OKR)', val: smartTitle },
          { label: 'Target Capaian', val: '100%' },
          { label: 'Catatan Khusus', val: userText }
        ];
        mappedPayload = { keyResult: userText };
      } else {
        tableFieldSpecs = [
          { label: 'Judul Tugas', val: smartTitle },
          { label: 'Prioritas', val: 'P1' },
          { label: 'Batas Waktu', val: extractedDate.split(',')[0] },
          { label: 'Catatan Khusus', val: userText }
        ];
        mappedPayload = { priority: 'P1', description: userText };
      }

      const generatedPlan = {
        actionType: 'CREATE',
        targetModule,
        title: smartTitle,
        fields: mappedPayload,
        tableFieldSpecs,
        rawPrompt: userText
      };

      setPendingAction(generatedPlan);

      // Konfirmasi singkat, to-the-point, hemat token tanpa ceramah
      const cleanFieldList = tableFieldSpecs.map(f => `• ${f.label}: ${f.val}`).join('\n');
      const naturalConfirmationMsg = `Siap, ini saya siapkan data untuk dimasukkan ke modul ${targetModule}:\n\n${cleanFieldList}\n\nApakah susunan ini mau langsung saya jalankan ke dashboard?`;

      setPromptMessages((prev) => [
        ...prev,
        {
          id: `MSG-${Date.now()}-confirm`,
          sender: 'ai',
          text: naturalConfirmationMsg,
          hasConfirmButton: true
        }
      ]);
      setIsAiThinking(false);
    }, 600);
  };

  // Fungsi pengujian live eksekusi dashboard: Buat, Edit, Hapus & Simpan data modul secara nyata
  const handleRunLiveBotTest = async (agent) => {
    if (!agent || testingAgentId) return;
    setTestingAgentId(agent.id);

    const nowStr = new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB';
    let testActionName = '';
    let testModule = '';
    let testDetails = '';
    let previewCreatedData = null;

    try {
      // 1. Eksekusi spesifik berdasarkan spesialisasi & hak modul bot
      if (agent.name.includes('Silvi') || (agent.managedModules || []).includes('CRM & Klien')) {
        testModule = 'CRM & Klien';
        testActionName = 'Otomatisasi Pipeline CRM';
        const testClientId = `CRM-AI-${Date.now().toString().slice(-4)}`;
        
        // CREATE data klien baru oleh AI
        const newClient = {
          id: testClientId,
          name: 'PT Sinergi Data Nusantara (AI Auto-Lead)',
          category: 'Enterprise Corp',
          stage: 'Discovery Call',
          dealValue: 95000000,
          services: ['Autonomous AI Agent', 'Multi-Agent Setup'],
          pic: 'Silvi',
          notes: 'Auto-lead generated by Silvi AI Growth Engine dari analisis traffic inbound.'
        };
        await store.addCrmClient(newClient);

        // UPDATE (EDIT) data klien yang baru dibuat
        await store.updateCrmClient(testClientId, {
          stage: 'Proposal Terkirim',
          dealValue: 105000000
        });

        testDetails = `Berhasil CREATE & UPDATE prospek klien ID "${testClientId}" bernilai Rp 105.000.000 ke tahap Proposal Terkirim.`;
        previewCreatedData = { modul: 'CRM & Klien', id: testClientId, status: 'Tersimpan & Terupdate di Database' };

      } else if (agent.name.includes('Reta') || (agent.managedModules || []).includes('Tugas & Kalender')) {
        testModule = 'Tugas & Kalender';
        testActionName = 'Delegasi & Dispatch Tugas';
        const testTaskId = `TSK-AI-${Date.now().toString().slice(-4)}`;

        // CREATE tugas operasional baru
        const newTask = {
          id: testTaskId,
          title: 'Audit Kapasitas Cluster & Load Balancer Autonomous AI',
          description: 'Pemeriksaan rutin latensi inferensi Groq Llama 3.3 & alokasi token harian.',
          category: 'Website & Tracking',
          project: 'DigiBooster Infrastructure',
          assignee: 'Reta',
          priority: 'P1',
          status: 'Sedang Dikerjakan',
          outputResult: 'Load balancer optimal, rerata latensi 0.8s'
        };
        await store.addTask(newTask);

        // UPDATE (EDIT) status tugas menjadi Menunggu Review
        await store.updateTask(testTaskId, {
          status: 'Menunggu Review',
          outputResult: 'Audit selesai 100%. Latensi stabil di 18ms, tidak ada packet drop.'
        });

        testDetails = `Berhasil CREATE & UPDATE status tugas operasional ID "${testTaskId}" dari 'Sedang Dikerjakan' menjadi 'Menunggu Review'.`;
        previewCreatedData = { modul: 'Tugas & Kalender', id: testTaskId, status: 'Tersimpan di Supabase' };

      } else if (agent.name.includes('Raka') || (agent.managedModules || []).includes('Data & Arsip')) {
        testModule = 'Data & Arsip';
        testActionName = 'Pengarsipan Dokumen Legal & Sistem';
        const testArcId = `ARC-AI-${Date.now().toString().slice(-4)}`;

        // CREATE arsip dokumen baru
        const newArchive = {
          id: testArcId,
          title: 'Adendum Perjanjian Kerja Sama Multi-Agent Q4',
          category: 'Dokumen PDF / Legalitas',
          fileFormat: 'PDF',
          status: 'Aktif',
          fileSize: '240 KB',
          description: 'Penyelarasan klausul kepatuhan Zero-Trust & SLA 99.9% disahkan oleh Raka Systems.'
        };
        await store.addArchive(newArchive);

        testDetails = `Berhasil CREATE dokumen arsip hukum ID "${testArcId}" tersimpan di repositori sistem.`;
        previewCreatedData = { modul: 'Data & Arsip', id: testArcId, status: 'Tersimpan & Tervalidasi' };

      } else {
        // Fallback untuk Arga / Siska di Sasaran & KPI / Laporan
        testModule = 'Sasaran & KPI';
        testActionName = 'Evaluasi & Refinement Target';
        const testOkrId = `OKR-AI-${Date.now().toString().slice(-4)}`;

        const newOkr = {
          id: testOkrId,
          objective: 'Akselerasi Efisiensi Respon Multi-Agent Dashboard',
          keyResult: 'Menjaga waktu respon AI Agent di bawah 1 detik',
          category: 'Efisiensi Operasional',
          division: agent.department || 'Manajemen',
          quarter: 'Q4',
          targetNum: 100,
          currentNum: 95,
          unit: '%',
          owner: agent.name
        };
        await store.addOkrGoal(newOkr);

        testDetails = `Berhasil CREATE sasaran OKR ID "${testOkrId}" dan mencatat rekam audit kualitas ke dewan direksi.`;
        previewCreatedData = { modul: 'Sasaran & KPI', id: testOkrId, status: 'Tersimpan di Database' };
      }

      // Catat log jejak aktivitas ke memori bot
      store.addAgentActivityLog(agent.id, {
        module: testModule,
        action: testActionName,
        details: testDetails,
        status: 'Success'
      });

      setTestResultModal({
        agentName: agent.name,
        role: agent.role,
        module: testModule,
        action: testActionName,
        details: testDetails,
        preview: previewCreatedData,
        timestamp: nowStr
      });
    } catch (err) {
      console.error('Error saat live bot test:', err);
    } finally {
      setTestingAgentId(null);
    }
  };

  const allAvailableModules = [
    'CRM & Klien',
    'Keuangan & Profit',
    'Branding & Marketing',
    'Tugas & Kalender',
    'Sasaran & KPI',
    'Rapat & Catatan',
    'Laporan & Evaluasi',
    'Data & Arsip'
  ];

  // Kolom Tabel Standar untuk Staf Manusia (atau saat tab Semua)
  const columns = [
    {
      key: 'name',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> Nama Anggota Tim
        </span>
      ),
      minWidth: '220px',
      render: (val, row) => {
        const isAI = (row.type || '').includes('AI');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {row.avatar ? (
              <img 
                src={row.avatar} 
                alt={val} 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: isAI ? '8px' : '50%', 
                  objectFit: 'cover',
                  border: isAI ? '2px solid #0284c7' : '2px solid #e2e8f0' 
                }} 
              />
            ) : (
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: isAI ? '8px' : '50%', 
                backgroundColor: isAI ? '#0284c7' : '#0f172a', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                fontSize: '0.75rem',
                fontWeight: 700,
                boxShadow: isAI ? '0 2px 8px rgba(2, 132, 199, 0.35)' : 'none'
              }}>
                {isAI ? <Bot size={18} /> : (val ? val.substring(0, 2).toUpperCase() : 'ST')}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{val}</span>
                {isAI && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Sparkles size={9} /> AI Bot
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                {row.notes || `ID: ${row.id}`}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'type',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Klasifikasi
        </span>
      ),
      minWidth: '150px',
      render: (val) => {
        const isAI = val?.includes('AI');
        return (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: isAI ? '#0284c7' : '#0f172a'
            }}
          >
            {isAI ? '🤖 Autonomous AI' : '👤 Tim Staf Manusia'}
          </span>
        );
      }
    },
    { 
      key: 'role', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Jabatan & Tanggung Jawab
        </span>
      ), 
      minWidth: '220px' 
    },
    { 
      key: 'department', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Divisi / Departemen
        </span>
      ),
      minWidth: '150px',
      render: (val) => (
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#334155'
          }}
        >
          {val || 'Operasional'}
        </span>
      )
    },
    { 
      key: 'room', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Briefcase size={14} color="#0284c7" /> Ruang Kerja 3D
        </span>
      ),
      minWidth: '170px',
      render: (val) => (
        <span
          style={{
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 600
          }}
        >
          🏢 {val || 'Executive Room'}
        </span>
      )
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status Kehadiran
        </span>
      ),
      minWidth: '150px',
      render: (val) => {
        const isOnline = val?.includes('Online') || val?.includes('Aktif');
        const isRest = val?.includes('Istirahat');
        const isStandby = val?.includes('Standby');
        const statusColor = isOnline
          ? '#16a34a'
          : isRest
          ? '#d97706'
          : isStandby
          ? '#0284c7'
          : '#64748b';

        return (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: statusColor,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            ● {val || 'Online / Bertugas'}
          </span>
        );
      }
    },
    { 
      key: 'contact', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Mail size={14} color="#0284c7" /> Kontak Email & Telp
        </span>
      ), 
      minWidth: '200px',
      render: (val, row) => (
        <div style={{ fontSize: '0.78rem', color: '#475569' }}>
          <div>{row.contact || val || '-'}</div>
          {row.phone && <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{row.phone}</div>}
        </div>
      )
    }
  ];

  const handleAddStaff = () => {
    const isAiTab = activeTab === 'ai';
    const newAgent = {
      id: isAiTab ? `agent_${Date.now().toString().slice(-4)}` : `staff_human_${Date.now().toString().slice(-4)}`,
      name: isAiTab ? 'New DigiBot Agent' : 'Nama Staf Baru',
      type: isAiTab ? 'AI Agent DigiBooster' : 'Staf Manusia',
      role: isAiTab ? 'Autonomous AI Specialist' : 'Staff Operasional',
      department: 'Operasional',
      room: isAiTab ? 'Operations Room' : 'Executive Room',
      status: 'Online / Bertugas',
      contact: isAiTab ? 'bot@digibooster.internal' : 'staf@digibooster.id',
      phone: isAiTab ? '-' : '+62 812-0000-0000',
      avatar: null,
      persona: isAiTab ? 'AI Agent yang siap mengeksekusi tugas otomatis saat di-tag sebagai PIC.' : 'Personil tim operasional.',
      systemPrompt: isAiTab ? 'Kamu adalah AI Agent DigiBooster yang bertugas mengeksekusi tugas secara otomatis.' : '',
      aiEngine: isAiTab ? 'Groq Qwen 3.8 27B' : 'Human Operator',
      capabilities: isAiTab ? ['Eksekusi Tugas Otomatis', 'Pembuatan Draft Deliverable'] : ['Manajemen PIC'],
      managedModules: isAiTab ? ['Tugas & Kalender'] : [],
      executionCount: 0,
      activityLogs: []
    };
    addStaffAgent(newAgent);
    if (isAiTab) {
      handleOpenSetupModal(newAgent);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Halaman */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="ws-page-title">
            Staff &amp; AI Agents Hub
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Pengelolaan hybrid workforce: Staf operasional manusia standar &amp; autonomous AI agent ber-persona dengan sinkronisasi kantor 3D.
          </p>
        </div>

        {/* Tab Filter Tampilan: Semua | Staf Manusia | AI Agent Persona */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          backgroundColor: '#f1f5f9',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'all' ? '#ffffff' : 'transparent',
              color: activeTab === 'all' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'all' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Semua ({staffAgents.length})
          </button>
          <button
            onClick={() => setActiveTab('human')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'human' ? '#ffffff' : 'transparent',
              color: activeTab === 'human' ? '#0284c7' : '#64748b',
              fontWeight: activeTab === 'human' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'human' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <UserCheck size={14} /> Staf Manusia ({humanStaff.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'ai' ? '#0284c7' : 'transparent',
              color: activeTab === 'ai' ? '#ffffff' : '#64748b',
              fontWeight: activeTab === 'ai' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'ai' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} /> Persona AI Agents ({aiStaff.length})
          </button>
          <button
            onClick={() => setActiveTab('training')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'training' ? '#0284c7' : 'transparent',
              color: activeTab === 'training' ? '#ffffff' : '#64748b',
              fontWeight: activeTab === 'training' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'training' ? '0 1px 3px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <BrainCircuit size={14} /> Training &amp; Eksperimen AI
          </button>
          <button
            onClick={() => setActiveTab('monitoring')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'monitoring' ? '#0284c7' : 'transparent',
              color: activeTab === 'monitoring' ? '#ffffff' : '#64748b',
              fontWeight: activeTab === 'monitoring' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'monitoring' ? '0 1px 3px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Activity size={14} /> Monitoring &amp; Telemetri
          </button>
        </div>
      </div>

      {/* Metric Cards & Charts Ringkasan (Khusus Tab Umum: all, human, ai) */}
      {(activeTab === 'all' || activeTab === 'human' || activeTab === 'ai') && (
        <>
          <div className="ws-metric-grid">
            <MetricCard
              title="Staf Manusia Aktif"
              value={humanStaff.length}
              subtitle="Tim inti penanggung jawab operasional"
              icon={Users}
            />
            <MetricCard
              title="AI Agents Operasional"
              value={aiStaff.length}
              subtitle="Autonomous 24/7 worker ber-persona & sinkron 3D"
              icon={Bot}
            />
          </div>

          <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <SimpleBarChart
              title="Alokasi Tim per Departemen"
              subtitle="Sebaran SDM dan agen automasi kerja"
              data={staffBarData}
            />
            <DonutChart
              title="Distribusi Status Kerja Personil & AI"
              subtitle="Kesiapan penugasan tim & autonomous agent"
              data={staffDonutData}
            />
          </div>
        </>
      )}

      {/* TAMPILAN KHUSUS BOT AI: AI Command Console & Control Deck jika Tab AI Aktif */}
      {activeTab === 'ai' ? (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #bae6fd',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 4px 20px rgba(2, 132, 199, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="#0284c7" /> AI Agent Command Center (Persona, Dashboard Guard &amp; 3D Sync)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Setiap AI Agent memiliki persona unik, wewenang modul dashboard yang diawasi, log jejak kerja realtime, serta terhubung ke kantor 3D.
              </p>
            </div>
            <button
              onClick={handleAddStaff}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.35)'
              }}
            >
              <Plus size={16} /> Tambah AI Agent Baru
            </button>
          </div>

          {/* Grid Kartu AI Agent Command Deck */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '18px'
          }}>
            {aiStaff.map((agent) => (
              <div 
                key={agent.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '18px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Header Card: Avatar, Name, Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
                      }}>
                        <Bot size={22} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{agent.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{agent.role}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
                      {agent.status || 'Aktif'}
                    </span>
                  </div>

                  {/* Engine & 3D Office Location */}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      backgroundColor: '#eff6ff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Zap size={11} /> {agent.aiEngine || 'Groq Qwen 3.8 27B'}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      backgroundColor: '#f1f5f9',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      🏢 3D: {agent.room || 'Operations Room'}
                    </span>
                  </div>

                  {/* Aktivitas Terkini di Dashboard */}
                  <div style={{
                    marginBottom: '12px',
                    padding: '9px 12px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe'
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Play size={10} /> Aktivitas Terkini di Dashboard:
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 500, lineHeight: 1.4 }}>
                      {agent.currentActivity || 'Memantau perubahan modul dan siap menerima tugas baru.'}
                    </div>
                  </div>

                  {/* Deskripsi Persona & Karakter */}
                  <div style={{
                    marginBottom: '12px',
                    padding: '8px 10px',
                    backgroundColor: '#fafbfc',
                    borderRadius: '8px',
                    borderLeft: '3px solid #0284c7'
                  }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '2px' }}>
                      PERSONA &amp; GAYA KERJA:
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.45 }}>
                      "{agent.persona || 'Persona belum dikonfigurasi. Klik Setup Persona untuk mengatur gaya kerja.'}"
                    </div>
                  </div>

                  {/* Modul Dashboard yang Dikelola */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', marginBottom: '5px' }}>
                      MODUL DASHBOARD YANG DIKELOLA:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(agent.managedModules || ['Tugas & Kalender']).map((mod, i) => (
                        <span 
                          key={i}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            backgroundColor: '#e2e8f0',
                            color: '#1e293b',
                            padding: '2px 7px',
                            borderRadius: '4px'
                          }}
                        >
                          🛡️ {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenLogsModal(agent)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Buka catatan jejak aktivitas bot ini"
                    >
                      <FileText size={13} /> Log ({agent.activityLogs?.length || 0})
                    </button>

                    <button
                      onClick={() => handleOpenPromptModal(agent)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 11px',
                        borderRadius: '6px',
                        border: '1px solid #0284c7',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                      }}
                      title="Beri perintah instruksi/prompt langsung ke bot AI ini"
                    >
                      <Terminal size={13} /> Beri Perintah Prompt
                    </button>
                  </div>

                  <button
                    onClick={() => handleOpenSetupModal(agent)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #bae6fd',
                      backgroundColor: '#f0f9ff',
                      color: '#0284c7',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Sliders size={13} /> Atur Persona
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'training' ? (
        /* ================= TAMPILAN KHUSUS: TRAINING & EKSPERIMEN AI (PILAR 1, 2, 3) ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* DUAL-DECK INTERACTIVE TRAINING LAB: KIRI LIVE ARENA, KANAN SISKA PROMPT INJECTION */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '20px',
            alignItems: 'stretch'
          }}>
            {/* ================= KOLOM KIRI: LIVE MULTI-AGENT ARENA CHAT ================= */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '2px solid #bae6fd',
              boxShadow: '0 4px 20px rgba(2, 132, 199, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              height: '680px',
              overflow: 'hidden'
            }}>
              {/* Header Live Arena */}
              <div style={{
                background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
                padding: '14px 18px',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                      Live Multi-Agent Testing Arena
                    </h4>
                    <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                      Uji &amp; koreksi langsung jawaban bot secara real-time
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTrainingMessages([
                      {
                        id: `msg-rst-${Date.now()}`,
                        sender: 'Siska',
                        name: 'Siska',
                        role: 'Head of Quality & Master Trainer',
                        badgeColor: '#0284c7',
                        text: 'Sesi latihan telah dibersihkan. Seluruh bot siap untuk uji skenario baru dari Bang Robin.',
                        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                      }
                    ]);
                  }}
                  title="Bersihkan Arena"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    padding: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Chat Feed */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: '#f8fafc'
              }}>
                {trainingMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isUser ? 'flex-end' : 'flex-start',
                        width: '100%'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '3px',
                        fontSize: '0.72rem'
                      }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{msg.name}</span>
                        <span style={{
                          color: isUser ? '#64748b' : (msg.badgeColor || '#0284c7'),
                          fontWeight: 600,
                          fontSize: '0.68rem',
                          backgroundColor: isUser ? '#e2e8f0' : '#e0f2fe',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          {msg.role}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{msg.timestamp}</span>
                      </div>

                      <div style={{
                        maxWidth: '88%',
                        backgroundColor: isUser ? '#0284c7' : '#ffffff',
                        color: isUser ? '#ffffff' : '#0f172a',
                        padding: '10px 14px',
                        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        border: isUser ? 'none' : '1px solid #e2e8f0',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.text}

                        {/* Interactive RLHF Emoji Reaction Bar (Like 👍, Sad 😢, Gratitude 🙏) */}
                        {!isUser && (
                          <div style={{
                            marginTop: '8px',
                            borderTop: '1px solid #f1f5f9',
                            paddingTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                title="Respon Bagus! Pertahankan & Tingkatkan (Thumbs Up)"
                                onClick={() => {
                                  const agent = msg.name || 'Bot';
                                  setTrainingMessages((prev) => [
                                    ...prev,
                                    {
                                      id: `msg-feedback-${Date.now()}`,
                                      sender: agent,
                                      name: agent,
                                      role: msg.role,
                                      badgeColor: '#0284c7',
                                      text: `makasih banyak bang bin! sy seneng bgt respon sy dinilai pas. sy bakal terus pertahanin gaya obrolan kyk gini ke depannya yaa!`,
                                      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                                    }
                                  ]);
                                }}
                                style={{
                                  border: '1px solid #bae6fd',
                                  background: '#f0f9ff',
                                  padding: '4px 6px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <Icon3DThumbUpBlue size={16} />
                              </button>

                              <button
                                title="Respon Kurang Pas! Perbaiki & Jangan Diulang (Sad)"
                                onClick={() => {
                                  const agent = msg.name || 'Bot';
                                  setSiskaCoachingTarget(agent);
                                  setSiskaCoachingTopic(`Evaluasi Respon Kurang Pas: ${agent}`);
                                  setSiskaBehaviorGuidelines(`Jangan mengulang respon ini: "${msg.text.slice(0, 80)}...". Wajib diperbaiki agar lebih natural, tepat sasaran, dan relevan dengan maksud Bang Robin.`);
                                  setTrainingMessages((prev) => [
                                    ...prev,
                                    {
                                      id: `msg-feedback-${Date.now()}`,
                                      sender: agent,
                                      name: agent,
                                      role: msg.role,
                                      badgeColor: '#0284c7',
                                      text: `maaf ya bang bin, sy catat koreksinya dan janji ga bakal ngulangin respon yg kurang pas kyk tadi. sy bakal perbaiki sekarang juga!`,
                                      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                                    }
                                  ]);
                                }}
                                style={{
                                  border: '1px solid #bae6fd',
                                  background: '#f0f9ff',
                                  padding: '4px 6px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <Icon3DSadBlue size={16} />
                              </button>

                              <button
                                title="Terima Kasih Banyak! Jawaban Sangat Mantap & Membantu (Salim / Gratitude)"
                                onClick={() => {
                                  const agent = msg.name || 'Bot';
                                  setTrainingMessages((prev) => [
                                    ...prev,
                                    {
                                      id: `msg-feedback-${Date.now()}`,
                                      sender: agent,
                                      name: agent,
                                      role: msg.role,
                                      badgeColor: '#0284c7',
                                      text: `wah sama2 bang bin! berkah & semangat bgt dengernya, senang bgt bisa ngebantu bang bin dengan maksimal hari ini! yuk kita gas lagi!`,
                                      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                                    }
                                  ]);
                                }}
                                style={{
                                  border: '1px solid #bae6fd',
                                  background: '#f0f9ff',
                                  padding: '4px 6px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <Icon3DPrayBlue size={16} />
                              </button>
                            </div>

                            {/* Tombol Koreksi Form Cepat */}
                            {msg.sender !== 'Siska' && (
                              <button
                                onClick={() => {
                                  setSiskaCoachingTarget(msg.name);
                                  setSiskaCoachingTopic(`Koreksi Respon ${msg.name}`);
                                  setSiskaBehaviorGuidelines(`Jangan menjawab seperti ini: "${msg.text.slice(0, 70)}...". Wajib lebih kontekstual, jangan template, dan langsung solutif.`);
                                }}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#0284c7',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  padding: '2px 4px'
                                }}
                              >
                                ⚡ Edit di Panel
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isTrainingChatTyping && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    width: 'fit-content'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
                      {trainingTypingAgent} sedang berpikir cerdas...
                    </span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div style={{
                padding: '12px 14px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={trainingChatInput}
                  onChange={(e) => setTrainingChatInput(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && trainingChatInput.trim() && !isTrainingChatTyping) {
                      await handleExecuteTrainingMessage();
                    }
                  }}
                  placeholder="Ketik pertanyaan atau panggil bot (misal: sil, ga, ka, ret, sis)..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
                <button
                  disabled={!trainingChatInput.trim() || isTrainingChatTyping}
                  onClick={async () => {
                    await handleExecuteTrainingMessage();
                  }}
                  style={{
                    backgroundColor: '#0284c7',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={15} />
                </button>
              </div>
            </div>

            {/* ================= KOLOM KANAN: EXECUTIVE PROMPT & SISKA MEMORY DIRECTIVE LAB ================= */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '2px solid #bae6fd',
              padding: '22px',
              boxShadow: '0 4px 20px rgba(2, 132, 199, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              height: '680px',
              boxSizing: 'border-box',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '4px' }}>
                    <ShieldCheck size={14} /> Siska AI Quality Control &amp; Master Prompt Injection
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Injeksi Prompt Global &amp; Pelatihan Bot
                  </h4>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    Ketik prompt aturan baru di bawah ini. Begitu disimpan, aturan langsung aktif di memori vektor Mem0 dan diterapkan seketika ke seluruh bot.
                  </span>
                </div>
              </div>

              {/* Form Input Prompt */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Target Penerima Prompt / SOP
                  </label>
                  <select
                    value={siskaCoachingTarget}
                    onChange={(e) => setSiskaCoachingTarget(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      backgroundColor: '#f8fafc',
                      color: '#0f172a'
                    }}
                  >
                    <option value="Semua AI Agent">Semua AI Agent Sekaligus (Standar Seluruh Kantor)</option>
                    <option value="Siska">Siska (Khusus Tingkatkan Kecerdasan &amp; Deteksi QA)</option>
                    <option value="Arga">Arga (CSO - Mitra Diskusi &amp; Strategi)</option>
                    <option value="Silvi">Silvi (Head of Growth &amp; Creative Content)</option>
                    <option value="Reta">Reta (COO - Perangkum &amp; Follow-up Tugas)</option>
                    <option value="Raka">Raka (Head of Documentation &amp; Legal)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Topik Pembinaan / Kategori Aturan
                  </label>
                  <input
                    type="text"
                    value={siskaCoachingTopic}
                    onChange={(e) => setSiskaCoachingTopic(e.target.value)}
                    placeholder="Contoh: Larangan Respon Template &amp; Standar Diskusi Alami"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Instruksi Prompt Detail (System Directive yang Harus Diingat Bot)
                  </label>
                  <textarea
                    rows={4}
                    value={siskaBehaviorGuidelines}
                    onChange={(e) => setSiskaBehaviorGuidelines(e.target.value)}
                    placeholder="Tuliskan prompt yang ingin ditanamkan ke otak bot..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Preset Cepat Prompt Ampuh */}
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                    ⚡ Preset Prompt Cepat:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSiskaCoachingTarget('Semua AI Agent');
                        setSiskaCoachingTopic('Gaya Typing Santai Manusiawi');
                        setSiskaBehaviorGuidelines('awalan huruf kecil saat chat. gunakan singkatan: kyk, yg, mntap, okeii, siipp, nicee, bolee, knp, gpp, ngga, dmna, brp, kpn, syapp, dong, sih, cocokk, bgt, udh. kata berulang pakai angka 2 (kira2, ada2 aja). panggil arga (ga), silvi (sil), raka (ka), siska (sis), reta (ta). panggil bang robin dengan "bang bin" atau "bang". dilarang kaku dan jangan pakai template.');
                      }}
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', color: '#0369a1', cursor: 'pointer', fontWeight: 700 }}
                    >
                      💬 Gaya Typing Santai Manusiawi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSiskaCoachingTopic('Anti-Template & Pemahaman Konteks Alami');
                        setSiskaBehaviorGuidelines('dilarang keras memakai jawaban template/canned. pahami esensi maksud bang robin, jangan kutip kata2 mentah. tanggapi dengan bahasa santai, luwes, dan cerdas.');
                      }}
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', color: '#0369a1', cursor: 'pointer' }}
                    >
                      🛡️ Anti-Template &amp; Alami
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSiskaCoachingTarget('Siska');
                        setSiskaCoachingTopic('Supercharged QA Watchdog Siska');
                        setSiskaBehaviorGuidelines('pantau setiap chat bot lain secara otonom. jika terdeteksi kaku, mengulang kata2 mentah, atau salah konteks, langsung interupsi dan beri arahan solutif.');
                      }}
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', color: '#0369a1', cursor: 'pointer' }}
                    >
                      ⭐ Jadikan Siska Super Pintar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSiskaCoachingTarget('Reta');
                        setSiskaCoachingTopic('Strict Permission Database Sync');
                        setSiskaBehaviorGuidelines('Dilarang membuat draf database atau tugas secara mandiri sebelum Bang Robin eksplisit menyetujui dengan kata "Oke" atau "Setuju".');
                      }}
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff', color: '#0369a1', cursor: 'pointer' }}
                    >
                      🔒 Kunci Izin Database
                    </button>
                  </div>
                </div>

                {/* Tombol Terapkan Prompt ke Semua AI */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    disabled={isSiskaCoaching}
                    onClick={async () => {
                      if (!siskaCoachingTopic.trim() || !siskaBehaviorGuidelines.trim()) {
                        alert('Mohon lengkapi topik pembinaan dan instruksi prompt untuk bot.');
                        return;
                      }

                      // Simpan data form ke variabel lokal sebelum form di-reset
                      const targetCopy = siskaCoachingTarget;
                      const topicCopy = siskaCoachingTopic;
                      const guidelinesCopy = siskaBehaviorGuidelines;

                      // Auto-reset form menjadi default kosong seketika sesuai instruksi Bang Robin
                      setSiskaCoachingTopic('');
                      setSiskaBehaviorGuidelines('');

                      setIsSiskaCoaching(true);
                      setSiskaCoachingReport(null);
                      setStressTestStep(1);
                      setStressTestStatusText('Memulai simulasi uji stres 5 tahap...');

                      // 1. Eksekusi 5-Step Automated Stress-Test Loop
                      const testResult = await runStressTestEvaluation({
                        targetAgentName: targetCopy,
                        coachingTopic: topicCopy,
                        behaviorGuidelines: guidelinesCopy,
                        onProgressUpdate: ({ step, maxIterations, status }) => {
                          setStressTestStep(step);
                          setStressTestStatusText(status);
                        }
                      });

                      // 2. Simpan ke database Mem0 dengan Skor Efektivitas Real
                      await siskaTrainAgents({
                        targetAgentName: targetCopy,
                        coachingTopic: topicCopy,
                        behaviorGuidelines: guidelinesCopy,
                        customEffectivenessScore: testResult.score
                      });

                      setSiskaCoachingReport({
                        target: targetCopy,
                        topic: topicCopy,
                        score: testResult.score,
                        scoreNum: testResult.scoreNum,
                        iterationsRun: testResult.iterationsRun,
                        passed: testResult.passed,
                        needsAlternativeApproach: testResult.needsAlternativeApproach,
                        logs: testResult.logs,
                        status: testResult.passed
                          ? `Tersimpan di Mem0 & Lolos Uji ${testResult.iterationsRun}x Iterasi`
                          : `Tersimpan dengan Catatan (Butuh Penyesuaian)`
                      });

                      // Tambahkan notifikasi di arena chat kiri
                      setTrainingMessages((prev) => [
                        ...prev,
                        {
                          id: `msg-rule-apply-${Date.now()}`,
                          sender: 'Siska',
                          name: 'Siska',
                          role: 'Head of Quality & Master Trainer',
                          badgeColor: '#0284c7',
                          text: `📢 HASIL AUDIT SISKA: SOP "${topicCopy}" telah diuji ${testResult.iterationsRun}x ke ${targetCopy}. Skor Efektivitas Real: ${testResult.score}. ${testResult.passed ? 'Semua respon bot terbukti natural & mematuhi aturan.' : 'Peringatan: Skor efektivitas di bawah 50%, disarankan menggunakan metode Few-Shot (contoh tanya-jawab konkret).'}` ,
                          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                        }
                      ]);

                      setIsSiskaCoaching(false);
                      setStressTestStep(0);
                      setStressTestStatusText('');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isSiskaCoaching ? '#94a3b8' : '#0284c7',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      cursor: isSiskaCoaching ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    {isSiskaCoaching ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" /> {stressTestStatusText || 'Menguji Respon Bot...'}
                      </>
                    ) : (
                      <><Zap size={16} /> Terapkan &amp; Jalankan 5-Step Auto-Test</>
                    )}
                  </button>
                </div>

                {/* Progress Bar & Status Stress Test Saat Berjalan */}
                {isSiskaCoaching && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      <span>⚡ Siska QA Stress-Test: Iterasi {stressTestStep}/5</span>
                      <span>{Math.round((stressTestStep / 5) * 100)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(stressTestStep / 5) * 100}%`, height: '100%', backgroundColor: '#0284c7', transition: 'width 0.3s ease' }} />
                    </div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
                      {stressTestStatusText}
                    </span>
                  </div>
                )}

                {/* Laporan Hasil Stress Test Real */}
                {siskaCoachingReport && (
                  <div style={{
                    backgroundColor: siskaCoachingReport.scoreNum >= 50 ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${siskaCoachingReport.scoreNum >= 50 ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '0.78rem',
                    color: siskaCoachingReport.scoreNum >= 50 ? '#166534' : '#991b1b',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginTop: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {siskaCoachingReport.scoreNum >= 50 ? (
                          <CheckCircle2 size={18} color="#16a34a" />
                        ) : (
                          <AlertCircle size={18} color="#dc2626" />
                        )}
                        <strong>{siskaCoachingReport.status}</strong>
                      </div>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: siskaCoachingReport.scoreNum >= 50 ? '#dcfce7' : '#fee2e2',
                        color: siskaCoachingReport.scoreNum >= 50 ? '#15803d' : '#b91c1c',
                        fontWeight: 800,
                        fontSize: '0.8rem'
                      }}>
                        Efektivitas Real: {siskaCoachingReport.score}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.73rem', color: siskaCoachingReport.scoreNum >= 50 ? '#15803d' : '#b91c1c' }}>
                      Target: <strong>{siskaCoachingReport.target}</strong> • Topik: "{siskaCoachingReport.topic}" • Berhasil ditest dalam {siskaCoachingReport.iterationsRun} iterasi.
                    </span>

                    {/* Jika Nilai Kurang Dari 50%, Berikan Opsi Evaluasi Khusus Sesuai Arahan Bang Robin */}
                    {siskaCoachingReport.needsAlternativeApproach && (
                      <div style={{
                        marginTop: '6px',
                        padding: '10px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px dashed #f87171'
                      }}>
                        <strong style={{ display: 'block', color: '#b91c1c', marginBottom: '4px' }}>
                          💡 Skor Efektivitas &lt; 50%: Solusi Alternatif Agar AI Lebih Cerdas
                        </strong>
                        <p style={{ margin: '0 0 6px 0', fontSize: '0.72rem', color: '#475569', lineHeight: 1.4 }}>
                          AI masih kesulitan menangkap larangan negatif secara murni. Rekomendasi terbaik: gunakan metode <strong>Few-Shot Coaching</strong> (berikan contoh langsung respon ideal) atau naikkan penalty kata berulang.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSiskaCoachingTopic(`Contoh Ideal: ${siskaCoachingReport.topic}`);
                            setSiskaBehaviorGuidelines(`CONTOH IDEAL (FEW-SHOT):\nUser: halo ${siskaCoachingReport.target.toLowerCase()}\nRespon Benar: halo bang! syapp standby nih, ada yg mau diobrolin apa nih hari ini?\n(Dilarang menjawab panjang atau pakai template)`);
                          }}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: '1px solid #dc2626',
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Muat Template Few-Shot (Contoh Konkret)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabel Daftar SOP & Aturan Memori yang Sedang Aktif di Otak AI */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="#0284c7" /> Aturan Memori &amp; Golden SOP Aktif ({aiTrainingRules.length} Directive)
            </h4>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>ID &amp; Judul Aturan</th>
                    <th style={{ padding: '10px 12px' }}>Target Personil AI</th>
                    <th style={{ padding: '10px 12px' }}>Kategori SOP</th>
                    <th style={{ padding: '10px 12px' }}>Instruksi / Pembelajaran</th>
                    <th style={{ padding: '10px 12px' }}>Efektivitas</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {aiTrainingRules.map(rule => (
                    <tr key={rule.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={14} color="#0284c7" />
                          <span>{rule.ruleTitle}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>{rule.id} • {rule.addedAt}</span>
                      </td>
                      <td style={{ padding: '12px', color: '#0284c7', fontWeight: 600 }}>
                        {rule.agentName}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                          {rule.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#334155', maxWidth: '340px', lineHeight: 1.4 }}>
                        {rule.instruction}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {(() => {
                          const scoreNum = parseInt(rule.effectivenessScore) || 90;
                          const isLow = scoreNum < 50;
                          const isMid = scoreNum >= 50 && scoreNum < 75;
                          const bg = isLow ? '#fee2e2' : isMid ? '#fef3c7' : '#e0f2fe';
                          const textColor = isLow ? '#b91c1c' : isMid ? '#b45309' : '#0369a1';
                          return (
                            <span style={{ backgroundColor: bg, color: textColor, padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                              {rule.effectivenessScore} {isLow ? '⚠️ Butuh Evaluasi' : ''}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => deleteAiTrainingRule(rule.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          title="Hapus Aturan"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'monitoring' ? (
        /* ================= TAMPILAN KHUSUS: MONITORING & TELEMETRI AI (TOKEN & KAPASITAS) ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* 4 Kartu Metrik Telemetri Utama */}
          <div className="ws-metric-grid">
            <MetricCard
              title="Total Token Terpakai"
              value={(aiTelemetry.totalTokensUsed || 0).toLocaleString('id-ID')}
              subtitle={`In: ${(aiTelemetry.inputTokens || 0).toLocaleString('id-ID')} | Out: ${(aiTelemetry.outputTokens || 0).toLocaleString('id-ID')}`}
              icon={BarChart3}
            />
            <MetricCard
              title="Tingkat Akurasi Eksekusi"
              value={`${aiTelemetry.taskSuccessRate || 98.4}%`}
              subtitle="Tugas otonom selesai tanpa intervensi revisi"
              icon={CheckCircle2}
            />
            <MetricCard
              title="Rata-rata Latensi Respon"
              value={`${aiTelemetry.avgLatencyMs || 385} ms`}
              subtitle="Performa sub-detik dengan Groq + vLLM"
              icon={Zap}
            />
            <MetricCard
              title="Indeks Kecerdasan (IQ)"
              value={`${aiTelemetry.intelligenceGrowthIndex || 94.6}/100`}
              subtitle="Reliability score terus meningkat seiring koreksi"
              icon={TrendingUp}
            />
          </div>

          {/* Distribusi Penggunaan Token per Agen */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '22px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} color="#0284c7" /> Alokasi Konsumsi Token &amp; Kapasitas per AI Agent
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              {(aiTelemetry.agentTokenBreakdown || []).map(agent => (
                <div
                  key={agent.agentId}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{agent.agentName}</strong>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {agent.tasks} Tugas
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>
                      <span>Token Terpakai:</span>
                      <strong style={{ color: '#0f172a' }}>{agent.tokens.toLocaleString('id-ID')}</strong>
                    </div>
                    {/* Progress Bar Kapasitas */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, (agent.tokens / 200000) * 100)}%`,
                          height: '100%',
                          backgroundColor: '#0284c7',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                    <span style={{ color: '#64748b' }}>Akurasi Eksekusi:</span>
                    <strong style={{ color: '#0284c7' }}>{agent.accuracy}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Task Audit Feed (Jejak Operasi Otomatis AI) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '22px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="#0284c7" /> Live AI Task Audit Feed (Jejak Aksi Nyata Database)
              </h4>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Update Otomatis per Tindakan Agen
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>Waktu &amp; ID Audit</th>
                    <th style={{ padding: '10px 12px' }}>Agen Pelaksana</th>
                    <th style={{ padding: '10px 12px' }}>Aksi Otomatis</th>
                    <th style={{ padding: '10px 12px' }}>Modul Dituju</th>
                    <th style={{ padding: '10px 12px' }}>Mesin &amp; Latensi</th>
                    <th style={{ padding: '10px 12px' }}>Konsumsi Token</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(aiTelemetry.taskAuditFeed || []).map(feed => (
                    <tr key={feed.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', color: '#64748b', fontSize: '0.78rem' }}>
                        <strong style={{ color: '#0f172a', display: 'block' }}>{feed.id}</strong>
                        {feed.timestamp}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0284c7' }}>
                        {feed.agent}
                      </td>
                      <td style={{ padding: '12px', color: '#0f172a', fontWeight: 600 }}>
                        {feed.action}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                          {feed.targetModule}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#64748b', fontSize: '0.76rem' }}>
                        <span>{feed.engine}</span>
                        <strong style={{ display: 'block', color: '#059669' }}>{feed.latencyMs} ms</strong>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#475569' }}>
                        {feed.tokensUsed} token
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          backgroundColor: feed.status === 'Success' ? '#ecfdf5' : '#fef2f2',
                          color: feed.status === 'Success' ? '#059669' : '#dc2626',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}>
                          {feed.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TAMPILAN TABEL STANDAR UNTUK STAF MANUSIA / SEMUA */
        <NotionTable
          title={activeTab === 'human' ? "Direktori Staf Manusia (PIC Operasional)" : "Direktori Lengkap Karyawan & Personil"}
          data={filteredStaff}
          columns={columns}
          onAddRow={handleAddStaff}
          onDeleteRow={deleteStaffAgent}
          onUpdateCell={(id, field, val) => updateStaffAgent(id, { [field]: val })}
          exportFileName="staff_manusia_digibooster.csv"
          statusFilter={statusFilter}
          onChangeStatusFilter={setStatusFilter}
          statusOptions={statusOptions}
          archiveMonth={archiveMonth}
          onChangeArchiveMonth={setArchiveMonth}
          availableArchiveMonths={['September 2026', 'Agustus 2026', 'Juli 2026']}
        />
      )}

      {/* Modal Setup Persona & Konfigurasi Akses Dashboard AI Agent */}
      {showSetupModal && selectedAgentForSetup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    Konfigurasi Persona, Prompt &amp; Akses Bot
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Atur watak respon, sistem instruksi, hak kelola modul dashboard, dan sinkronisasi 3D
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} /> Persona, wewenang dashboard &amp; prompt AI berhasil disimpan!
              </div>
            )}

            <form onSubmit={handleSaveSetupModal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Nama & Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nama AI Bot</label>
                  <input
                    type="text"
                    value={selectedAgentForSetup.name || ''}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, name: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Jabatan &amp; Peran</label>
                  <input
                    type="text"
                    value={selectedAgentForSetup.role || ''}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, role: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Mesin Model & Homebase 3D Virtual Office */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Mesin LLM Engine</label>
                  <select
                    value={selectedAgentForSetup.aiEngine || 'Groq Qwen 3.8 27B'}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, aiEngine: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Groq Qwen 3.8 27B">Groq Qwen 3.8 27B (Respons Super Cepat)</option>
                    <option value="Groq Llama 3.3 70B Versatile">Groq Llama 3.3 70B Versatile (Logika Lengkap)</option>
                    <option value="Google Gemini 2.5 Flash">Google Gemini 2.5 Flash (Kreatif &amp; Analisis)</option>
                    <option value="Claude 3.5 Sonnet Engine">Claude 3.5 Sonnet Engine (Audit &amp; Kode)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Homebase Ruang Kantor 3D</label>
                  <select
                    value={selectedAgentForSetup.room || 'Operations Room'}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, room: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Strategy Room">Strategy Room (Arga CSO)</option>
                    <option value="Operations Room">Operations Room (Reta COO)</option>
                    <option value="Growth Room">Growth Room (Silvi Growth)</option>
                    <option value="Systems Room">Systems Room (Raka Systems)</option>
                    <option value="Quality Room">Quality Room (Siska QC)</option>
                    <option value="Executive Room">Executive Room (CEO Office)</option>
                  </select>
                </div>
              </div>

              {/* Modul Dashboard yang Dikelola (Scope & Permission) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#0284c7" /> Hak Kelola Modul Dashboard (Pilih modul yang dipahami bot ini)
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '8px',
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  {allAvailableModules.map((modName) => {
                    const isChecked = (selectedAgentForSetup.managedModules || []).includes(modName);
                    return (
                      <label 
                        key={modName}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          color: isChecked ? '#0284c7' : '#475569',
                          fontWeight: isChecked ? 700 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleModulePermission(modName)}
                          style={{ accentColor: '#0284c7' }}
                        />
                        {modName}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Persona Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Profil &amp; Persona Karakter Kerja (Gaya Komunikasi)
                </label>
                <textarea
                  rows={2}
                  value={selectedAgentForSetup.persona || ''}
                  onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, persona: e.target.value })}
                  placeholder="Contoh: Disiplin, berorientasi hasil, memecah arahan rapat menjadi tugas-tugas terukur..."
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* System Prompt / Instruksi Eksekusi Otomatis */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={14} color="#0284c7" /> Core System Prompt (Instruksi Otomatis Saat Membaca/Mengubah Dashboard)
                </label>
                <textarea
                  rows={4}
                  value={selectedAgentForSetup.systemPrompt || ''}
                  onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, systemPrompt: e.target.value })}
                  placeholder="Instruksi sistem yang dijalankan otomatis saat bot mengeksekusi dashboard..."
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    backgroundColor: '#fafbfc',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Tombol Simpan */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} /> Simpan Konfigurasi Bot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Drawer Log Jejak Aktivitas Bot */}
      {showLogsModal && selectedAgentForLogs && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#0284c7" /> Log Jejak Aktivitas: {selectedAgentForLogs.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Riwayat aksi nyata yang telah dikerjakan bot di dalam dashboard &amp; kantor 3D
                </span>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* List Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(selectedAgentForLogs.activityLogs && selectedAgentForLogs.activityLogs.length > 0) ? (
                selectedAgentForLogs.activityLogs.map((log) => (
                  <div 
                    key={log.id}
                    style={{
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {log.module} • {log.action}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {log.timestamp}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                      {log.details}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Belum ada log eksekusi tercatat untuk agent ini.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <button
                onClick={() => setShowLogsModal(false)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tutup Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bukti Hasil Tes Live Eksekusi Bot di Dashboard */}
      {testResultModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 10px rgba(22, 163, 74, 0.35)'
                }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Verifikasi Eksekusi AI Berhasil!
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Agent <strong style={{ color: '#0284c7' }}>{testResultModal.agentName}</strong> ({testResultModal.role})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setTestResultModal(null)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Aksi yang Dijalankan Bot:
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                  {testResultModal.action} pada modul {testResultModal.module}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#334155', marginTop: '4px', lineHeight: 1.45 }}>
                  {testResultModal.details}
                </div>
              </div>

              {testResultModal.preview && (
                <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.78rem' }}>
                  <div style={{ fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Status Data di Dashboard &amp; Database:</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Target Modul:</span>
                    <strong style={{ color: '#0f172a' }}>{testResultModal.preview.modul}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>Data ID:</span>
                    <strong style={{ color: '#0284c7' }}>{testResultModal.preview.id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span style={{ color: '#64748b' }}>Kondisi Realtime:</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ {testResultModal.preview.status}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <button
                onClick={() => setTestResultModal(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Selesai &amp; Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Dialog Interaktif: Kotak Perintah Prompt & Asisten AI Cerdas */}
      {showPromptModal && selectedAgentForPrompt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            height: '80vh',
            maxHeight: '750px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            {/* Header Modal Prompt */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 15px rgba(2, 132, 199, 0.5)'
                }}>
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                      {selectedAgentForPrompt.name}
                    </h3>
                    <span style={{ fontSize: '0.68rem', backgroundColor: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {selectedAgentForPrompt.aiEngine || 'Groq Qwen 3.8'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {selectedAgentForPrompt.role} • 🏢 {selectedAgentForPrompt.room || 'Operations Room'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Chat Messages Area */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {promptMessages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isAi ? 'flex-start' : 'flex-end',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: isAi ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      backgroundColor: isAi ? '#ffffff' : '#0284c7',
                      color: isAi ? '#1e293b' : '#ffffff',
                      border: isAi ? '1px solid #e2e8f0' : 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      fontSize: '0.84rem',
                      lineHeight: 1.55,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.text}

                      {/* Tombol Konfirmasi Cepat jika AI sedang menunggu kepastian user */}
                      {msg.hasConfirmButton && pendingAction && (
                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                          <button
                            onClick={executePendingAction}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 14px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
                            }}
                          >
                            <CheckCircle2 size={14} /> Ya, Eksekusi Sekarang
                          </button>
                          <button
                            onClick={() => {
                              setPendingAction(null);
                              setPromptMessages((prev) => [
                                ...prev,
                                {
                                  id: `MSG-${Date.now()}-cancel`,
                                  sender: 'ai',
                                  text: 'Eksekusi dibatalkan. Silakan berikan arahan atau revisi perintah yang Anda inginkan.'
                                }
                              ]);
                            }}
                            style={{
                              padding: '7px 12px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Batal / Koreksi
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isAiThinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontSize: '0.8rem', fontStyle: 'italic', padding: '6px 10px' }}>
                  <Cpu size={15} /> {selectedAgentForPrompt.name} sedang menganalisa instruksi Anda...
                </div>
              )}
            </div>

            {/* Input Form Bar */}
            <form onSubmit={handleSendPrompt} style={{
              padding: '14px 18px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={
                  pendingAction
                    ? 'Ketik "Ya, jalankan" untuk konfirmasi, atau berikan koreksi...'
                    : `Beri instruksi ke ${selectedAgentForPrompt.name} (misal: "Buat tugas audit sprint", "Cukup", dsb)...`
                }
                style={{
                  flex: 1,
                  padding: '11px 16px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#f8fafc'
                }}
                disabled={isAiThinking}
                autoFocus
              />
              <button
                type="submit"
                disabled={isAiThinking || !promptInput.trim()}
                style={{
                  padding: '11px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: (isAiThinking || !promptInput.trim()) ? '#cbd5e1' : '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: (isAiThinking || !promptInput.trim()) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
                }}
              >
                <Play size={13} fill="#ffffff" /> Kirim
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
