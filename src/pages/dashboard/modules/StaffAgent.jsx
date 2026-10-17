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
  Plus
} from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';

export default function StaffAgent() {
  const store = useWorkspaceStore();
  const staffAgents = Array.isArray(store?.staffAgents) ? store.staffAgents : [];
  const addStaffAgent = store?.addStaffAgent || (() => {});
  const updateStaffAgent = store?.updateStaffAgent || (() => {});
  const deleteStaffAgent = store?.deleteStaffAgent || (() => {});

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
    let clean = text
      .replace(/^(tolong|coba|bisa|tolong buatkan|buatkan|buat|bikin|jadwalkan|agendakan|masukkan|catat|siapkan|atur)\s+/i, '')
      .replace(/^(arga|reta|silvi|raka|siska)[,\s:]*/i, '')
      .replace(/di tanggal.*$/i, '')
      .replace(/pada tanggal.*$/i, '')
      .replace(/nanti.*$/i, '')
      .trim();

    if (module === 'Rapat & Catatan') {
      if (clean.toLowerCase().includes('mingguan') || clean.toLowerCase().includes('weekly')) {
        return 'Weekly Sync: ' + (clean.replace(/rapat\s*mingguan\s*(dengan|tentang)?/i, '').trim() || 'Strategi Operasional AI');
      }
      return 'Rapat: ' + (clean.replace(/^rapat\s*(dengan|tentang)?/i, '').trim() || 'Koordinasi Multi-Agent');
    }
    if (module === 'Tugas & Kalender') {
      return 'Eksekusi: ' + (clean.replace(/^tugas\s*(untuk|tentang)?/i, '').trim() || 'Implementasi Operasional');
    }
    if (module === 'CRM & Klien') {
      return clean.replace(/^klien\s*(baru)?/i, '').trim() || 'Prospek Mitra Korporat';
    }
    if (module === 'Data & Arsip') {
      return 'Dokumen: ' + (clean.replace(/^arsip|dokumen|pks|kontrak\s*/i, '').trim() || 'SOP Tata Kelola');
    }
    if (module === 'Sasaran & KPI') {
      return 'Target OKR: ' + (clean.replace(/^target|sasaran|okr\s*/i, '').trim() || 'Optimalisasi Metrik');
    }
    return clean.slice(0, 50) || 'Inisiatif Strategis DigiBooster';
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

    // 4. Analisa Kecerdasan: Empati Psikologis, Konsultasi, & Deteksi Niat Data
    setTimeout(async () => {
      // Deteksi apakah pengguna sedang curhat, bimbang, butuh sudut pandang, atau brainstorming bebas
      const isBrainstormOrCounseling = (
        lower.startsWith('menurut') || lower.startsWith('bagaimana') || lower.startsWith('gimana') || 
        lower.startsWith('apa pendapat') || lower.startsWith('kenapa') || lower.startsWith('saya bingung') ||
        lower.startsWith('saya ragu') || lower.startsWith('saya mau curhat') || lower.startsWith('menurutmu') ||
        lower.includes('gimana ya') || lower.includes('menurut kamu') || lower.includes('bagus gak') ||
        (lower.includes('?') && !lower.includes('catat') && !lower.includes('jadwalkan') && !lower.includes('bikin') && !lower.includes('buat'))
      );

      if (isBrainstormOrCounseling) {
        let counselReply = '';

        // Deteksi konteks topik pertanyaan agar jawaban tepat sasaran dan hemat token
        if (lower.includes('follower') || lower.includes('sosmed') || lower.includes('konten') || lower.includes('ig') || lower.includes('tiktok') || lower.includes('engagement')) {
          counselReply = `Followers dikit biasanya karena 2 hal: hook 3 detik pertama kurang nendang atau belum konsisten memecahkan masalah audiens.\n\nSolusi ringkasnya: kita bikin 3 konten edukasi solusi nyata dengan format Carousel/Reels yang memancing share. Mau saya buatkan draf kontennya di modul Branding & Marketing sekarang?`;
        } else if (lower.includes('staf') || lower.includes('karyawan') || lower.includes('manusia') || lower.includes('takut') || lower.includes('tertekan')) {
          counselReply = `Staf manusia gak akan tertekan selama AI diposisikan sebagai asisten pembantu tugas monoton, bukan pengganti peran mereka. Mereka justru lega waktu kerjanya gak habis untuk urusan repetitif.\n\nKuncinya ada di kejelasan SOP. Mau kita rumuskan pembagian tugasnya di Tugas & Kalender?`;
        } else if (lower.includes('klien') || lower.includes('sales') || lower.includes('closing') || lower.includes('omset')) {
          counselReply = `Closing seret biasanya bukan soal produk, tapi respons lambat ke lead yang masih hangat. Begitu ada yang tanya, dalam 5 menit harus sudah disapa personal.\n\nMau saya bantu setup notifikasi follow-up otomatis di modul CRM & Klien?`;
        } else if (lower.includes('prioritas') || lower.includes('bingung') || lower.includes('pusing') || lower.includes('banyak tugas')) {
          counselReply = `Wajar banget pusing kalau semua hal dianggap darurat. Rumus psikologi eksekutif: pilih 1 hal terpenting (P1) hari ini yang kalau beres bikin hal lain lebih gampang.\n\nKira-kira apa 1 target utama hari ini yang mau kita selesaikan dulu di dashboard?`;
        } else {
          // Jawaban default ringkas, padat & powerful
          if (selectedAgentForPrompt.name.includes('Arga')) {
            counselReply = `Kuncinya di validasi fokus: jangan serang semua target sekaligus. Tetapkan 1 metrik utama kuartal ini lalu arahkan seluruh automasi ke sana.\n\nMau kita masukkan sebagai target prioritas di Sasaran & KPI?`;
          } else if (selectedAgentForPrompt.name.includes('Silvi')) {
            counselReply = `Prinsip growth simpel: sentuh masalah emosional audiens lalu tawarkan solusi praktisnya. Konten yang memvalidasi keresahan audiens selalu lebih cepat viral.\n\nMau kita siapkan draft campaign-nya di Branding & Marketing?`;
          } else if (selectedAgentForPrompt.name.includes('Reta')) {
            counselReply = `Operasional yang sehat itu bukan yang serba terburu-buru, tapi yang alurnya konsisten dan jelas PIC-nya.\n\nAda tugas yang mau saya bantu rapikan jadwalnya di Tugas & Kalender?`;
          } else {
            counselReply = `Intinya: selaraskan antara prioritas tujuan dengan kesiapan eksekusi tim agar hasilnya terukur tanpa bikin burn-out.\n\nBagian mana yang mau kita langsung eksekusi ke dashboard?`;
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

      // Deteksi Modul Dashboard yang Paling Tepat & Relevan
      let targetModule = 'Tugas & Kalender';
      if (lower.includes('rapat') || lower.includes('meeting') || lower.includes('sync') || lower.includes('agenda') || lower.includes('notulen') || lower.includes('diskusi') || selectedAgentForPrompt.name.includes('Arga')) {
        targetModule = 'Rapat & Catatan';
      } else if (lower.includes('klien') || lower.includes('crm') || lower.includes('prospek') || lower.includes('lead') || lower.includes('deal') || selectedAgentForPrompt.name.includes('Silvi')) {
        targetModule = 'CRM & Klien';
      } else if (lower.includes('arsip') || lower.includes('dokumen') || lower.includes('kontrak') || lower.includes('pks') || lower.includes('legal') || lower.includes('sop') || selectedAgentForPrompt.name.includes('Raka')) {
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
          { label: 'Nama / Agenda Rapat', val: smartTitle },
          { label: 'Jadwal & Waktu', val: extractedDate },
          { label: 'Tipe Rapat', val: 'Internal Weekly Sync' },
          { label: 'Ruang Kantor 3D', val: selectedAgentForPrompt.room || 'Strategy Room (Virtual 3D)' },
          { label: 'Peserta', val: `Executive Owner & ${selectedAgentForPrompt.name}` },
          { label: 'Agenda Utama', val: `Membahas peran strategis AI dan roadmap automasi masa depan.` }
        ];
        mappedPayload = {
          dateTime: extractedDate,
          type: 'Internal Weekly Sync',
          summaryNotes: `Membahas peran strategis AI dan roadmap automasi masa depan.`
        };
      } else if (targetModule === 'CRM & Klien') {
        tableFieldSpecs = [
          { label: 'Nama Mitra / Prospek', val: smartTitle },
          { label: 'Kategori Klien', val: 'Enterprise Corp' },
          { label: 'Tahapan Pipeline', val: 'Discovery Call' },
          { label: 'Estimasi Nilai Deal', val: 'Rp 85.000.000' },
          { label: 'PIC Penanggung Jawab', val: selectedAgentForPrompt.name }
        ];
        mappedPayload = { category: 'Enterprise Corp', stage: 'Discovery Call', dealValue: 85000000 };
      } else if (targetModule === 'Data & Arsip') {
        tableFieldSpecs = [
          { label: 'Judul Naskah Dokumen', val: smartTitle },
          { label: 'Kategori Berkas', val: 'Dokumen PDF / Legalitas' },
          { label: 'Format File', val: 'PDF' },
          { label: 'Akses Keamanan', val: 'Publik Semua Tim' },
          { label: 'Penanggung Jawab', val: selectedAgentForPrompt.name }
        ];
        mappedPayload = { category: 'Dokumen PDF / Legalitas', fileFormat: 'PDF' };
      } else if (targetModule === 'Sasaran & KPI') {
        tableFieldSpecs = [
          { label: 'Sasaran Utama (Objective)', val: smartTitle },
          { label: 'Tolok Ukur (Key Result)', val: 'Implementasi 100% tepat waktu pada kuartal berjalan' },
          { label: 'Kategori Inisiatif', val: 'Efisiensi Operasional' },
          { label: 'Target Capaian', val: '100% (Baseline 75%)' },
          { label: 'Penanggung Jawab', val: selectedAgentForPrompt.name }
        ];
        mappedPayload = { keyResult: 'Implementasi 100% tepat waktu pada kuartal berjalan' };
      } else {
        tableFieldSpecs = [
          { label: 'Judul Tugas', val: smartTitle },
          { label: 'Kategori Pekerjaan', val: 'Website & Tracking' },
          { label: 'Tingkat Prioritas', val: 'P1 (Prioritas Utama)' },
          { label: 'Batas Waktu (Due Date)', val: extractedDate.split(',')[0] },
          { label: 'PIC Pelaksana', val: selectedAgentForPrompt.name }
        ];
        mappedPayload = { priority: 'P1', category: 'Website & Tracking' };
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

      // Bahasa pengantar yang santai, cerdas, solutif, dan tanpa bintang-bintang robotik yang kaku
      const cleanFieldList = tableFieldSpecs.map(f => `• ${f.label}: ${f.val}`).join('\n');

      const naturalConfirmationMsg = `Saya menangkap arah yang Anda inginkan dengan sangat jelas. Agar rapi dan terukur, langkah paling pas adalah memasukkannya ke menu ${targetModule}.\n\nSaya buatkan judul yang ringkas dan pas:\n"${smartTitle}"\n\nBerikut rincian kolom data yang siap saya isikan ke dashboard:\n\n${cleanFieldList}\n\nApakah susunan data ini sudah sesuai dengan yang Anda harapkan di kepala Anda? Jika sudah pas, klik tombol di bawah atau ketik "Ya, jalankan" agar langsung saya proses.`;

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
    }, 800);
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
        </div>
      </div>

      {/* Metric Cards Ringkasan */}
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

      {/* 2 Charts: Bar Chart & Donut Chart */}
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
