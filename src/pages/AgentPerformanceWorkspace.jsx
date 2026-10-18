import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  CheckCircle, 
  Download, 
  Copy, 
  Play, 
  Clock, 
  Bot, 
  Check, 
  ChevronRight,
  Database,
  Lightbulb,
  FileCheck,
  RefreshCw,
  ExternalLink,
  Sliders,
  Layers,
  Wand2
} from 'lucide-react';
import { generateAgentReply } from '../services/multiAgentAiService';

export default function AgentPerformanceWorkspace({ showToast, onAddSubmission, onAddArchive }) {
  // Agent roles definition sesuai request pengguna
  const AGENT_PROFILES = [
    {
      id: 'raka',
      name: 'Raka',
      fullName: 'Raka Adiputra',
      role: 'Legal, Dokumen & Berkas Spesialis',
      focusBadge: 'Fokus: Berkas & Dokumen',
      badgeColor: '#0284c7',
      avatar: 'RA',
      description: 'Menyusun berkas SOP, PKS/MoU, surat resmi, laporan format dokumen, dan ekspor instan (.doc / .pdf).',
      capabilities: ['Buat Berkas Resmi', 'Template SOP / PKS', 'Ekspor File Instan'],
      samplePrompts: [
        'Raka, buatkan berkas Perjanjian Kerja Sama (MoU) kemitraan sponsorship',
        'Raka, buatkan draf berkas SOP Onboarding Karyawan baru lengkap',
        'Raka, tolong susun surat penawaran jasa digital marketing resmi'
      ],
      systemDirective: 'Fokus utamamu adalah MEMBUAT DRAF BERKAS & DOKUMEN RESMI (SOP, PKS, Kontrak, Surat Resmi, Format Berkas). Berikan format berkas rapi dengan heading, nomor klausul/pasal, dan siap diunduh menjadi file dokumen.'
    },
    {
      id: 'silvi',
      name: 'Silvi',
      fullName: 'Silvi Maharani',
      role: 'Creative Content & Desain Prompter',
      focusBadge: 'Fokus: Konten & Desain Visual',
      badgeColor: '#ec4899',
      avatar: 'SM',
      description: 'Menyusun draf konten media sosial, copywriting viral, dan men-generate visual gambar / poster otomatis.',
      capabilities: ['Draf Konten & Copywriting', 'Visual Image Generator', 'Carousel & Storyboard'],
      samplePrompts: [
        'Silvi, buatkan draf 5 ide konten Instagram Carousel & konsep visual gambarnya',
        'Silvi, tolong buatkan poster promo diskon 50% layanan DigiBooster',
        'Silvi, bikin copywriting caption TikTok untuk peluncuran fitur baru'
      ],
      systemDirective: 'Fokus utamamu adalah MEMBUAT DRAFT KONTEN & DESAIN VISUAL. Susun ide konten kreatif, hook, caption, hashtag, serta deskripsi visual/prompt gambar yang siap digenerate menjadi visual grafis.'
    },
    {
      id: 'reta',
      name: 'Reta',
      fullName: 'Reta Kirana',
      role: 'Operations & Data Integrity Watcher',
      focusBadge: 'Fokus: Validasi Data Dashboard',
      badgeColor: '#10b981',
      avatar: 'RK',
      description: 'Memastikan integritas seluruh data dashboard: metrik KPI, status submission, log antrean, dan sinkronisasi tugas.',
      capabilities: ['Audit Data Dashboard', 'Verifikasi Metrik KPI', 'Sinkronisasi Status'],
      samplePrompts: [
        'Reta, tolong cek status data di dashboard kita, apakah semua submission aman?',
        'Reta, pastikan metrik followers dan engagement di tab Reports valid',
        'Reta, audit daftar tugas yang pending dan laporkan data yang belum selesai'
      ],
      systemDirective: 'Fokus utamamu adalah MEMASTIKAN DATA DI DASHBOARD SEMUANYA VALID & SINKRON. Laporkan status angka metrik, status submission, log antrean, dan berikan evaluasi kepatuhan operasional.'
    },
    {
      id: 'arga',
      name: 'Arga',
      fullName: 'Arga Pratama',
      role: 'Chief Strategy & Brainstorming Architect',
      focusBadge: 'Fokus: Brainstorming & Susun Berkas',
      badgeColor: '#8b5cf6',
      avatar: 'AP',
      description: 'Rekan diskusi strategis Bang Robin untuk mematangkan ide, memetakan roadmap, lalu menyusunnya jadi berkas rencana kerja.',
      capabilities: ['Brainstorming Strategis', 'Penyusunan Rencana Kerja', 'Sintesis Ide ke Berkas'],
      samplePrompts: [
        'Arga, mari brainstorming strategi monetisasi AI Agent untuk kuartal depan',
        'Arga, bantu susun kerangka berkas proposal ekspansi bisnis baru',
        'Arga, menurutmu peluang pasar virtual office saat ini gimana? Susun analisisnya'
      ],
      systemDirective: 'Fokus utamamu adalah BRAINSTORMING & MENYUSUN BERKAS STRATEGIS. Bahas ide secara analitis, kritis, dan komunikatif dengan Bang Robin, kemudian susun kerangka ide tersebut menjadi berkas rencana kerja yang terstruktur.'
    }
  ];

  const [selectedAgentId, setSelectedAgentId] = useState('raka');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'agent',
      agentId: 'raka',
      text: 'halo bang bin! raka siap bantu buat berkas, SOP, atau surat resmi kapan aja. silvi siap bantu konten & gambar, reta mantau data dashboard, dan arga siap brainstorming ide. mau buat berkas apa hari ini bang?',
      timestamp: 'Baru saja',
      fileAttached: null,
      imageAttached: null,
      automationAttached: null
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorkMode, setActiveWorkMode] = useState('auto'); // 'auto' | 'document' | 'image' | 'automation'
  const chatBottomRef = useRef(null);

  const currentAgent = AGENT_PROFILES.find(a => a.id === selectedAgentId) || AGENT_PROFILES[0];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Eksekutor download berkas sederhana langsung dari browser (.doc / .txt format)
  const handleDownloadFile = (fileName, content, fileType = 'doc') => {
    try {
      const mime = fileType === 'doc' ? 'application/msword' : 'text/plain';
      const blob = new Blob([content], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.endsWith(`.${fileType}`) ? fileName : `${fileName}.${fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Berkas ${fileName} berhasil diunduh!`);
    } catch (err) {
      showToast('Gagal mengunduh berkas');
    }
  };

  const handleSendMessage = async (textToSend) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isLoading) return;

    const userMsgObj = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Instruksi spesifik peran
      const fullInstruction = `
${currentAgent.systemDirective}
PENTING:
- Jawablah dengan gaya ketikan manusia asli yang santai, gunakan singkatan wajar (sy, km, bgt, udh, yg, dsb).
- Jika diminta membuat berkas, tuliskan isi berkas yang lengkap, terstruktur, dan formal di bagian bawah setelah pesan santaimu.
- Jika diminta desain/gambar (terutama Silvi), sertakan saran visual prompt atau komposisi warna.
- Jika diminta cek data (Reta), laporkan ringkasan status operasional dashboard secara terverifikasi.
      `.trim();

      const aiResponse = await generateAgentReply({
        agentName: currentAgent.name,
        agentRole: currentAgent.role,
        userMessage: promptText,
        conversationHistory: messages.map(m => ({
          sender: m.sender,
          name: m.sender === 'user' ? 'Bang Robin' : currentAgent.name,
          text: m.text
        })),
        customInstruction: fullInstruction
      });

      const replyText = aiResponse?.text || 'siap bang, sudah diproses yaa.';

      // Deteksi otomatis pembuatan berkas
      let detectedFile = null;
      let detectedImage = null;
      let detectedAutomation = null;

      const lowerPrompt = promptText.toLowerCase();

      // 1. Logika Berkas (Raka & Arga atau keyword berkas/dokumen/sop/pks)
      if (
        activeWorkMode === 'document' ||
        currentAgent.id === 'raka' ||
        (currentAgent.id === 'arga' && (lowerPrompt.includes('berkas') || lowerPrompt.includes('susun') || lowerPrompt.includes('proposal'))) ||
        lowerPrompt.includes('berkas') ||
        lowerPrompt.includes('dokumen') ||
        lowerPrompt.includes('sop') ||
        lowerPrompt.includes('pks') ||
        lowerPrompt.includes('surat')
      ) {
        const docTitle = lowerPrompt.includes('sop') 
          ? 'SOP_Standard_Operational_Procedure' 
          : lowerPrompt.includes('pks') || lowerPrompt.includes('mou')
          ? 'PKS_Perjanjian_Kerjasama_DigiBooster'
          : lowerPrompt.includes('proposal')
          ? 'Proposal_Strategi_Bisnis_DigiBooster'
          : 'Dokumen_Resmi_DigiBooster';

        detectedFile = {
          name: `${docTitle}.doc`,
          title: docTitle.replace(/_/g, ' '),
          category: currentAgent.id === 'raka' ? 'Legal & SOP' : 'Strategy & Docs',
          content: replyText,
          size: `${Math.max(12, Math.floor(replyText.length / 50))} KB`
        };

        // Otomatis masukkan ke archives jika diminta
        if (onAddArchive) {
          onAddArchive({
            id: `doc-${Date.now()}`,
            title: detectedFile.title,
            category: detectedFile.category,
            author: currentAgent.fullName,
            date: 'Hari ini',
            size: detectedFile.size,
            status: 'Valid',
            content: replyText
          });
        }
      }

      // 2. Logika Desain Gambar (Silvi atau keyword gambar/poster/banner)
      if (
        activeWorkMode === 'image' ||
        currentAgent.id === 'silvi' ||
        lowerPrompt.includes('gambar') ||
        lowerPrompt.includes('poster') ||
        lowerPrompt.includes('desain') ||
        lowerPrompt.includes('banner')
      ) {
        const imageSeed = encodeURIComponent(promptText.slice(0, 40));
        detectedImage = {
          title: `Visual Asset: ${promptText.slice(0, 30)}...`,
          url: `https://image.pollinations.ai/prompt/${imageSeed}%20modern%20clean%20professional%20design%20corporate%20blue?width=800&height=500&nologo=true`,
          promptUsed: promptText
        };
      }

      // 3. Logika Otomasi (Keyword outomation / jadwal / setiap)
      if (
        activeWorkMode === 'automation' ||
        lowerPrompt.includes('outomation') ||
        lowerPrompt.includes('otomasi') ||
        lowerPrompt.includes('jadwal') ||
        lowerPrompt.includes('kirim tiap') ||
        lowerPrompt.includes('rutin')
      ) {
        detectedAutomation = {
          workflowName: `Otomasi: ${promptText.slice(0, 35)}`,
          trigger: 'Jadwal Otomatis / Event-Driven',
          status: 'Aktif di Background',
          agentInCharge: currentAgent.name,
          nextRun: 'Besok, 09:00 WIB'
        };
      }

      const agentReplyObj = {
        id: `ai-${Date.now()}`,
        sender: 'agent',
        agentId: currentAgent.id,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        engine: aiResponse?.engine || 'Multi-Agent Router',
        fileAttached: detectedFile,
        imageAttached: detectedImage,
        automationAttached: detectedAutomation
      };

      setMessages(prev => [...prev, agentReplyObj]);

      // Catat sebagai submission jika ada output berkas / konten
      if (onAddSubmission && (detectedFile || detectedImage)) {
        onAddSubmission({
          id: `sub-${Date.now()}`,
          taskTitle: detectedFile ? `Penyusunan ${detectedFile.title}` : `Generasi Asset Visual Silvi`,
          agentName: currentAgent.fullName,
          agentRole: currentAgent.role,
          timestamp: 'Baru saja',
          status: 'Selesai',
          fullOutput: replyText
        });
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          agentId: currentAgent.id,
          text: `aduh maaf bang bin, sistem ai lagi ada kendala jaringan nih: ${err.message}. coba ulang sebentar lagi yaa.`,
          timestamp: 'Baru saja'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <main className="fl-canvas" style={{ padding: '24px 32px' }}>
      {/* Header Studio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: '#e0f2fe', 
              color: '#0284c7', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Wand2 size={12} /> Digibooster Agent Studio
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>• Autonomous ChatGPT-like Copilot</span>
          </div>
          <h1 style={{ margin: '6px 0 0', fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>
            Kinerja Agent AI
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Kelola kerja otomatis: buat berkas dokumen, visual gambar, validasi data, dan picu jadwal otomasi.
          </p>
        </div>

        {/* Quick Mode Filters */}
        <div style={{ display: 'flex', gap: '8px', background: '#ffffff', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {[
            { id: 'auto', label: 'Semua Mode' },
            { id: 'document', label: 'Mode Berkas (.doc)' },
            { id: 'image', label: 'Mode Desain/Gambar' },
            { id: 'automation', label: 'Mode Otomasi' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setActiveWorkMode(m.id)}
              style={{
                background: activeWorkMode === m.id ? '#0284c7' : 'transparent',
                color: activeWorkMode === m.id ? '#ffffff' : '#64748b',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Agent Selector Strip (Raka, Silvi, Reta, Arga) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        {AGENT_PROFILES.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '16px',
                border: isSelected ? `2px solid ${agent.badgeColor}` : '1px solid #edf2f7',
                boxShadow: isSelected ? `0 8px 24px ${agent.badgeColor}22` : '0 2px 8px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: `${agent.badgeColor}15`,
                    color: agent.badgeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem'
                  }}>
                    {agent.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{agent.fullName}</div>
                  </div>
                </div>
                {isSelected && (
                  <span style={{
                    background: agent.badgeColor,
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}>
                    Aktif
                  </span>
                )}
              </div>

              <span style={{
                display: 'inline-block',
                background: `${agent.badgeColor}12`,
                color: agent.badgeColor,
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                marginBottom: '8px'
              }}>
                {agent.focusBadge}
              </span>

              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Studio Interactive Box (Chat Canvas + Live Workspace Artifact) */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '18px', 
        border: '1px solid #edf2f7',
        display: 'flex',
        flexDirection: 'column',
        height: '620px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        overflow: 'hidden'
      }}>
        {/* Studio Topbar */}
        <div style={{ 
          padding: '14px 20px', 
          borderBottom: '1px solid #edf2f7', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#fafbfc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }}></div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                Ruang Eksekusi {currentAgent.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '8px' }}>
                ({currentAgent.role})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => {
                setMessages([{
                  id: `reset-${Date.now()}`,
                  sender: 'agent',
                  agentId: currentAgent.id,
                  text: `halo bang bin! sesi baru dibuka. apa yang perlu ${currentAgent.name} kerjakan sekarang?`,
                  timestamp: 'Baru saja'
                }]);
                showToast(`Sesi kerja ${currentAgent.name} di-refresh`);
              }}
              style={{
                background: 'transparent',
                border: '1px solid #e2e8f0',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={12} /> Reset Chat
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const agent = AGENT_PROFILES.find(a => a.id === msg.agentId) || currentAgent;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                {/* Sender Tag */}
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  {isUser ? 'Bang Robin' : `${agent.name} • ${msg.timestamp}`}
                </div>

                {/* Bubble Message */}
                <div style={{
                  maxWidth: '75%',
                  padding: '14px 18px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isUser ? '#0284c7' : '#f8fafc',
                  color: isUser ? '#ffffff' : '#1e293b',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                  border: isUser ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>

                {/* ATTACHMENT 1: File Berkas Dokumen Generator */}
                {msg.fileAttached && (
                  <div style={{
                    marginTop: '10px',
                    width: '100%',
                    maxWidth: '480px',
                    border: '1px solid #bae6fd',
                    background: '#f0f9ff',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#0284c7', color: '#ffffff', padding: '8px', borderRadius: '8px' }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0369a1' }}>
                          {msg.fileAttached.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Format: Microsoft Word (.doc) • {msg.fileAttached.size}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(msg.fileAttached.name, msg.fileAttached.content, 'doc')}
                      style={{
                        background: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={13} /> Unduh Berkas
                    </button>
                  </div>
                )}

                {/* ATTACHMENT 2: Visual Image Generator */}
                {msg.imageAttached && (
                  <div style={{
                    marginTop: '10px',
                    width: '100%',
                    maxWidth: '480px',
                    border: '1px solid #fbcfe8',
                    background: '#fdf2f8',
                    borderRadius: '12px',
                    padding: '12px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be185d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ImageIcon size={14} /> {msg.imageAttached.title}
                      </span>
                      <a 
                        href={msg.imageAttached.url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ fontSize: '0.72rem', color: '#0284c7', textDecoration: 'none', fontWeight: 700 }}
                      >
                        Resolusi Penuh ↗
                      </a>
                    </div>
                    <img 
                      src={msg.imageAttached.url} 
                      alt="Generated Graphic" 
                      style={{
                        width: '100%',
                        height: '240px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #fce7f3'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* ATTACHMENT 3: Status Otomasi */}
                {msg.automationAttached && (
                  <div style={{
                    marginTop: '10px',
                    width: '100%',
                    maxWidth: '480px',
                    border: '1px solid #bbf7d0',
                    background: '#f0fdf4',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: '#16a34a', color: '#ffffff', padding: '6px', borderRadius: '50%' }}>
                        <Clock size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#15803d' }}>
                          {msg.automationAttached.workflowName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Status: {msg.automationAttached.status} • Eksekusi: {msg.automationAttached.nextRun}
                        </div>
                      </div>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                      Running
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.82rem' }}>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid #0284c7',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <span>{currentAgent.name} sedang memproses instruksi & merancang output...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Prompt Suggestions Bar */}
        <div style={{ padding: '8px 20px', background: '#f8fafc', borderTop: '1px solid #edf2f7', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            Ide Perintah:
          </span>
          {currentAgent.samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sample)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.72rem',
                color: '#334155',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 20px', background: '#ffffff', borderTop: '1px solid #edf2f7', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder={`Suruh ${currentAgent.name} (${currentAgent.role}) ... tekan Enter untuk kirim`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'border 0.2s ease'
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            style={{
              background: isLoading || !inputPrompt.trim() ? '#94a3b8' : '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: isLoading || !inputPrompt.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={15} /> Kirim
          </button>
        </div>
      </div>
    </main>
  );
}
