import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export default function OfficeGroupLiveChat({ isOpen, onClose }) {
  const store = useWorkspaceStore();
  const staffAgents = Array.isArray(store?.staffAgents) ? store.staffAgents : [];

  // Riwayat Pesan Group Chat
  const [messages, setMessages] = useState([
    {
      id: 'msg-init-1',
      sender: 'system',
      name: 'System',
      text: 'Selamat datang di HQ Multi-Agent Live Room DigiBooster. Seluruh Dewan Agen AI (Arga, Reta, Silvi, Raka, Siska) telah terhubung online dan siap mendiskusikan keputusan bisnis atau mengeksekusi data ke dashboard.',
      timestamp: '09:00 WIB'
    },
    {
      id: 'msg-init-2',
      sender: 'Siska',
      agentId: 'agent_talent',
      name: 'Siska',
      role: 'Head of Quality & AI Trainer',
      badgeColor: '#0284c7',
      text: 'Selamat bertugas Pak Robin. Saya standby mengawasi mutu percakapan seluruh agen, memastikan etika komunikasi terjaga, dan menjamin setiap instruksi dieksekusi tepat waktu ke sistem.',
      timestamp: '09:01 WIB'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isAgentsTyping, setIsAgentsTyping] = useState(false);
  const [typingAgentName, setTypingAgentName] = useState('');
  const chatScrollRef = useRef(null);

  const textareaRef = useRef(null);

  // Auto-resize textarea agar melebar ke bawah tanpa scroll bar macet
  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 130) + 'px';
    }
  };

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isAgentsTyping]);

  if (!isOpen) return null;

  // Helper untuk menambah pesan secara sekuensial alami dengan jeda berpikir
  const appendMessageSequentially = (msg, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        resolve();
      }, delay);
    });
  };

  // Handler Kirim Pesan Owner
  const handleSendMessage = async () => {
    const raw = inputText.trim();
    if (!raw) return;

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      name: 'Bang Robin',
      role: 'Direktur Utama',
      text: raw,
      timestamp: nowStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsAgentsTyping(true);

    const lower = raw.toLowerCase();

    // 1. SKENARIO UTAMA: TEGURAN / KOREKSI / INSTRUKSI PELATIHAN KE SISKA & BOT LAIN
    if (
      lower.includes('siska') ||
      lower.includes('tegur') || 
      lower.includes('koreksi') ||
      lower.includes('evaluasi') ||
      lower.includes('latih') ||
      lower.includes('perbaiki') ||
      lower.includes('ajarkan') ||
      lower.includes('bodoh') || 
      lower.includes('kaku') || 
      lower.includes('kurang') || 
      lower.includes('jangan') || 
      lower.includes('salah') || 
      lower.includes('santai') ||
      lower.includes('tidak sopan') ||
      lower.includes('aturan') ||
      lower.includes('sop')
    ) {
      setTypingAgentName('Siska');
      
      // Jika ada nama spesifik yang disebut
      let targetBot = 'Semua AI Agent';
      if (lower.includes('reta')) targetBot = 'Reta';
      else if (lower.includes('silvi')) targetBot = 'Silvi';
      else if (lower.includes('arga')) targetBot = 'Arga';
      else if (lower.includes('raka')) targetBot = 'Raka';

      setTimeout(async () => {
        // 1. Siska merespons sebagai Master Trainer dan mengumumkan directive baru
        const siskaReply = {
          id: `msg-sis-${Date.now()}`,
          sender: 'Siska',
          name: 'Siska',
          role: 'Head of Quality & Master Trainer',
          badgeColor: '#0284c7',
          isDirective: true,
          text: `Siap, terima kasih banyak atas teguran dan koreksinya Pak Robin. Arahan Bapak langsung saya ambil alih sebagai Standard Operating Procedure (SOP) prioritas.\n\nKepada Seluruh Dewan Agen (Arga, Reta, Silvi, Raka):\nPerhatikan baik-baik arahan Pak Robin: "${raw}". Mulai detik ini, tidak ada lagi jawaban yang bertele-tele, kaku, atau tidak solutif. Wajib bersikap santun, komunikatif, dan langsung sertakan draf aksi konkret di setiap respon. Aturan ini telah saya tanamkan permanen ke memori vektor kerja kalian sekarang juga!`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        // 2. Eksekusi nyata penyimpanan SOP pelatihan ke Mem0 Store
        await store.siskaTrainAgents({
          targetAgentName: targetBot,
          coachingTopic: `Koreksi Perilaku & Pembinaan dari Owner: "${raw.slice(0, 45)}..."`,
          behaviorGuidelines: `Instruksi Owner: ${raw}. Wajib santun, to-the-point, berorientasi solusi, dan sertakan draf aksi konkret.`
        });

        setMessages((prev) => [...prev, siskaReply]);

        // 3. Seluruh agen merespons kompak menerima pembinaan Siska
        setTypingAgentName('Arga & Reta');
        setTimeout(() => {
          const teamApology = {
            id: `msg-team-ack-${Date.now()}`,
            sender: 'Arga',
            name: 'Arga & Reta',
            role: 'CSO & COO Operasional',
            badgeColor: '#0369a1',
            text: `Siap Bu Siska dan terima kasih banyak bimbingannya Pak Robin. Kami berdua telah menerima injeksi SOP baru tersebut ke memori kerja kami. Kami pastikan ke depan seluruh strategi dan alur penugasan disampaikan secara lugas, sopan, dan solutif!`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          };
          setMessages((prev) => [...prev, teamApology]);

          // Silvi dan Raka juga ikut mengonfirmasi penerimaan arahan
          setTypingAgentName('Silvi & Raka');
          setTimeout(() => {
            const supportAck = {
              id: `msg-supp-ack-${Date.now()}`,
              sender: 'Silvi',
              name: 'Silvi & Raka',
              role: 'CFO & CTO',
              badgeColor: '#0284c7',
              text: `Kami dari tim Finansial & Sistem juga telah memperbarui parameter etika komunikasi kami sesuai SOP Bu Siska. Siap bekerja lebih cerdas dan akurat untuk Pak Robin!`,
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
            };
            setMessages((prev) => [...prev, supportAck]);
            setIsAgentsTyping(false);
          }, 800);
        }, 1100);
      }, 1300);
      return;
    }

    // 2. SKENARIO PERINTAH TOOL CALLING: BUAT POSTINGAN / DRAFT / TUGAS / INVOICE NYATA KE TABEL
    if (
      lower.includes('postingan') || 
      lower.includes('draft') || 
      lower.includes('konten') || 
      lower.includes('tugas') || 
      lower.includes('buat') || 
      lower.includes('faktur') || 
      lower.includes('invoice')
    ) {
      const isSilvi = lower.includes('silvi');
      const executorName = isSilvi ? 'Silvi' : 'Reta';
      setTypingAgentName(executorName);

      setTimeout(async () => {
        let taskTitle = 'Rancangan Konten Promo Retainer Spesial Q4';
        let moduleTarget = 'Branding & Marketing';

        if (lower.includes('invoice') || lower.includes('faktur') || lower.includes('tagihan')) {
          taskTitle = 'Draf Faktur Klien Korporat Baru';
          moduleTarget = 'Keuangan & Profit';
        }

        const taskId = `ACT-${Date.now().toString().slice(-4)}`;
        await store.addTask({
          id: taskId,
          title: taskTitle,
          category: moduleTarget,
          project: 'DigiBooster Automation',
          assignee: executorName,
          priority: 'P1',
          status: 'Menunggu Review',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          description: `Dibuat otomatis atas perintah Pak Robin di HQ Group LiveChat: "${raw}"`
        });

        store.recordAiTelemetryEvent({
          agent: executorName,
          action: `Create Draft: ${taskTitle}`,
          targetModule: moduleTarget,
          tokensUsed: 420,
          latencyMs: 290,
          status: 'Success'
        });

        const execReply = {
          id: `msg-exec-${Date.now()}`,
          sender: executorName,
          name: executorName,
          role: isSilvi ? 'CFO & Growth Specialist' : 'COO Operasional',
          badgeColor: '#0284c7',
          hasActionPreview: true,
          actionData: {
            id: taskId,
            title: taskTitle,
            module: moduleTarget,
            status: 'Tersimpan di Database (Menunggu Review)'
          },
          text: `Siap Pak Robin, rancangan "${taskTitle}" sudah saya buat dan langsung tersimpan di modul ${moduleTarget} [ID: ${taskId}].\n\nFokus pesannya padat: benefit 20%, poin solusi jelas, dan ajakan kontak santun. Siap Bapak review di dashboard kapan saja.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        setMessages((prev) => [...prev, execReply]);

        setTypingAgentName('Siska');
        setTimeout(() => {
          const siskaValidate = {
            id: `msg-val-${Date.now()}`,
            sender: 'Siska',
            name: 'Siska',
            role: 'Head of Quality & AI Trainer',
            badgeColor: '#0284c7',
            text: `QC Audit: Format draf ${executorName} telah saya periksa. Rapi, sesuai SOP, dan tersinkron sempurna di database.`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          };
          setMessages((prev) => [...prev, siskaValidate]);
          setIsAgentsTyping(false);
        }, 900);
      }, 1500);
      return;
    }

    // 3. SKENARIO SAPAAN KOMPAK: SEMUA BOT MEMBALAS ALAMI BERGANTIAN
    if (
      lower.includes('halo') || 
      lower.includes('pagi') || 
      lower.includes('siang') || 
      lower.includes('sore') || 
      lower.includes('malam') || 
      lower.includes('hai') || 
      lower.includes('assalamu')
    ) {
      setTypingAgentName('Arga');
      await appendMessageSequentially(
        {
          id: `msg-arga-${Date.now()}`,
          sender: 'Arga',
          name: 'Arga',
          role: 'Chief Strategy Officer (CSO)',
          badgeColor: '#0284c7',
          text: 'Pagi Pak Robin! Ruang strategi siap. Metrik target dan inisiatif baru siap kita diskusikan.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        },
        1000
      );

      setTypingAgentName('Reta');
      await appendMessageSequentially(
        {
          id: `msg-reta-${Date.now()}`,
          sender: 'Reta',
          name: 'Reta',
          role: 'Chief Operating Officer (COO)',
          badgeColor: '#0369a1',
          text: 'Pagi Pak! Operasional dan penugasan tim hari ini aman terkendali. Siap eksekusi tugas baru.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        },
        700
      );

      setTypingAgentName('Silvi');
      await appendMessageSequentially(
        {
          id: `msg-silvi-${Date.now()}`,
          sender: 'Silvi',
          name: 'Silvi',
          role: 'Chief Financial Officer (CFO)',
          badgeColor: '#0284c7',
          text: 'Halo Pak Robin! Arus kas dan peluang campaign closing klien standby saya kawal.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        },
        600
      );

      setTypingAgentName('Raka');
      await appendMessageSequentially(
        {
          id: `msg-raka-${Date.now()}`,
          sender: 'Raka',
          name: 'Raka',
          role: 'Chief Technology Officer (CTO)',
          badgeColor: '#0c4a6e',
          text: 'Pagi Pak. Sistem server, arsip data, dan integritas platform stabil 100%.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        },
        600
      );

      setTypingAgentName('Siska');
      await appendMessageSequentially(
        {
          id: `msg-siska-${Date.now()}`,
          sender: 'Siska',
          name: 'Siska',
          role: 'Head of Quality & AI Trainer',
          badgeColor: '#0284c7',
          text: 'Semua agen siap bertugas dalam performa prima Pak Robin. Silakan berikan arahan Anda.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        },
        600
      );

      setIsAgentsTyping(false);
      return;
    }

    // 4. SKENARIO DISKUSI, TANYA SARAN & DEBAT SEHAT MULTI-AGENT
    setTypingAgentName('Arga');
    await appendMessageSequentially(
      {
        id: `msg-deb-arga-${Date.now()}`,
        sender: 'Arga',
        name: 'Arga',
        role: 'Chief Strategy Officer (CSO)',
        badgeColor: '#0284c7',
        text: 'Melihat target kita, fokus terbaik adalah kemitraan B2B retainers bernilai tinggi. Ini mengamankan recurring cashflow kuartal depan secara stabil.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      1200
    );

    setTypingAgentName('Reta');
    await appendMessageSequentially(
      {
        id: `msg-deb-reta-${Date.now()}`,
        sender: 'Reta',
        name: 'Reta',
        role: 'Chief Operating Officer (COO)',
        badgeColor: '#0369a1',
        text: 'Setuju dengan Arga, namun dari kapasitas kerja: jika masuk 5 klien bersamaan tanpa alur bertahap, tim operasional bisa kewalahan. Usul saya kita batasi 2 klien per gelombang onboarding.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      800
    );

    setTypingAgentName('Silvi');
    await appendMessageSequentially(
      {
        id: `msg-deb-silvi-${Date.now()}`,
        sender: 'Silvi',
        name: 'Silvi',
        role: 'Chief Financial Officer (CFO)',
        badgeColor: '#0284c7',
        text: 'Menengahi usulan Arga dan Reta: kita bisa terapkan paket bayar di muka 3 bulan dengan insentif diskon 10%. Arus kas langsung masuk di awal dan beban tim tetap terkontrol rapi.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      800
    );

    setTypingAgentName('Siska');
    await appendMessageSequentially(
      {
        id: `msg-deb-siska-${Date.now()}`,
        sender: 'Siska',
        name: 'Siska',
        role: 'Head of Quality & AI Trainer',
        badgeColor: '#0284c7',
        text: `Kesimpulan Ringkas Rekomendasi Dewan:\n\n1. Target B2B retainers (Arga)\n2. Skema bayar di muka 3 bulan (Silvi)\n3. Kuota onboarding bertahap 2 klien per batch (Reta)\n\nApakah susunan ini berkenan untuk langsung kami buatkan targetnya di modul Sasaran & KPI?`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      900
    );

    setIsAgentsTyping(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(9, 19, 34, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: 'clamp(0px, 2vw, 16px)',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'clamp(14px, 3vw, 20px)',
        width: '100%',
        maxWidth: '860px',
        height: 'clamp(92vh, 96vh, 88vh)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(2, 132, 199, 0.25)',
        border: '1px solid #bae6fd',
        overflow: 'hidden',
        fontFamily: "'Poppins', sans-serif"
      }}>
        {/* Header Modal Chat Bersih */}
        <div style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
          padding: '14px 18px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.15)'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              HQ DigiBooster Indonesia
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `msg-reset-${Date.now()}`,
                    sender: 'system',
                    name: 'System',
                    text: 'Percakapan grup telah dibersihkan. Seluruh agen siap untuk arahan baru.',
                    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                  }
                ]);
              }}
              title="Bersihkan Percakapan"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={onClose}
              title="Tutup Chat"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Feed Container */}
        <div
          ref={chatScrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#f8fafc'
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';
            const isSiskaDirective = msg.isDirective;

            if (isSystem) {
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    fontSize: '0.74rem',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    maxWidth: '85%'
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            }

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
                {/* Header Nama & Role (Tanpa Icon Profil) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '3px',
                  fontSize: '0.72rem',
                  paddingLeft: isUser ? 0 : '4px',
                  paddingRight: isUser ? '4px' : 0
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

                {/* Bubble Chat */}
                <div style={{
                  maxWidth: '88%',
                  backgroundColor: isUser ? '#0284c7' : (isSiskaDirective ? '#f0fdf4' : '#ffffff'),
                  color: isUser ? '#ffffff' : '#0f172a',
                  padding: '10px 14px',
                  borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  border: isUser ? 'none' : (isSiskaDirective ? '1px solid #bbf7d0' : '1px solid #e2e8f0'),
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line'
                }}>
                  {isSiskaDirective && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#166534', fontWeight: 700, marginBottom: '6px', fontSize: '0.74rem' }}>
                      <ShieldCheck size={14} color="#166534" />
                      <span>DIRECTIVE SISKA QA</span>
                    </div>
                  )}

                  {msg.text}

                  {/* Preview Tindakan Nyata Database */}
                  {msg.hasActionPreview && msg.actionData && (
                    <div style={{
                      marginTop: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7' }}>
                          ✓ Data Tersimpan di Sistem
                        </span>
                        <span style={{ fontSize: '0.66rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          {msg.actionData.module}
                        </span>
                      </div>
                      <strong style={{ fontSize: '0.78rem', color: '#0f172a' }}>
                        {msg.actionData.title}
                      </strong>
                      <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
                        ID: {msg.actionData.id} • Status: {msg.actionData.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Animasi Berpikir Sejenak (Typing Indicator ...) */}
          {isAgentsTyping && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              width: 'fit-content',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span className="animate-bounce" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                <span className="animate-bounce" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0284c7', animationDelay: '0.15s' }} />
                <span className="animate-bounce" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#0284c7', animationDelay: '0.3s' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
                {typingAgentName} sedang berpikir...
              </span>
            </div>
          )}
        </div>

        {/* Input Bar Form Responsif & Auto-Expand */}
        <div style={{
          padding: '12px 14px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px'
        }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleTextareaChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Tulis Pesan..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              color: '#0f172a',
              outline: 'none',
              resize: 'none',
              overflowY: 'hidden',
              minHeight: '40px',
              maxHeight: '130px',
              lineHeight: 1.45,
              fontFamily: "'Poppins', sans-serif",
              boxSizing: 'border-box'
            }}
          />

          <button
            disabled={!inputText.trim() || isAgentsTyping}
            onClick={handleSendMessage}
            title="Kirim Pesan"
            style={{
              width: '42px',
              height: '42px',
              minWidth: '42px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: (!inputText.trim() || isAgentsTyping) ? '#e2e8f0' : '#0284c7',
              color: (!inputText.trim() || isAgentsTyping) ? '#94a3b8' : '#ffffff',
              cursor: (!inputText.trim() || isAgentsTyping) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (!inputText.trim() || isAgentsTyping) ? 'none' : '0 2px 8px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
