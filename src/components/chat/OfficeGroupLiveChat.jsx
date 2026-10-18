import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  RefreshCw,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { generateAgentResponse } from '../../services/multiAgentAiService';
import { 
  Icon3DThumbUpBlue, 
  Icon3DSadBlue, 
  Icon3DPrayBlue 
} from '../ui/Modern3DIcons';

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

    // 1. SKENARIO PERINTAH TEGAS & EKSPLISIT BUAT DATA / DRAFT KE SISTEM (Strict Tool Calling)
    const isExplicitToolCall = 
      (lower.includes('buatkan') || 
       lower.includes('tolong buat') || 
       lower.includes('masukkan ke tabel') || 
       lower.includes('simpan ke tabel') || 
       lower.includes('inputkan') || 
       lower.includes('terbitkan faktur') ||
       lower.includes('terbitkan invoice')) && 
      !lower.includes('bahas') && 
      !lower.includes('diskusi') && 
      !lower.includes('ngobrol');

    if (isExplicitToolCall) {
      const isSilvi = lower.includes('silvi') || lower.includes('konten') || lower.includes('postingan') || lower.includes('marketing');
      const executorName = isSilvi ? 'Silvi' : (lower.includes('raka') ? 'Raka' : 'Reta');
      setTypingAgentName(executorName);

      setTimeout(async () => {
        let taskTitle = `Draf: ${raw.replace(/buatkan|tolong buat|masukkan ke tabel|simpan ke tabel/gi, '').trim() || 'Rencana Tindakan Operasional'}`;
        let moduleTarget = 'Branding & Marketing';

        if (lower.includes('invoice') || lower.includes('faktur') || lower.includes('tagihan')) {
          taskTitle = 'Draf Faktur Penagihan Klien';
          moduleTarget = 'Keuangan & Profit';
        } else if (lower.includes('kontrak') || lower.includes('pks') || lower.includes('legal')) {
          taskTitle = 'Draf Perjanjian Kerja Sama (PKS)';
          moduleTarget = 'Data & Arsip';
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
          description: `Dibuat atas perintah eksplisit Bang Robin: "${raw}"`
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
          role: isSilvi ? 'Head of Growth & Creative' : (executorName === 'Raka' ? 'Head of Documentation & Legal' : 'COO Operasional'),
          badgeColor: '#0284c7',
          hasActionPreview: true,
          actionData: {
            id: taskId,
            title: taskTitle,
            module: moduleTarget,
            status: 'Tersimpan di Database (Menunggu Review)'
          },
          text: `Siap Bang Robin! Sesuai instruksi spesifik Bapak, draf "${taskTitle}" sudah saya selesaikan dan langsung tercatat di tabel modul ${moduleTarget} [ID: ${taskId}].\n\nSilakan Bapak periksa di dashboard kapan saja.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        setMessages((prev) => [...prev, execReply]);
        setIsAgentsTyping(false);
      }, 1000);
      return;
    }

    // 2. SKENARIO PERSETUJUAN OWNER ATAS RANGKUMAN (Deal / Oke / Setuju / Jalankan)
    const isApprovalCommand = 
      lower === 'oke' || 
      lower === 'ok' || 
      lower === 'deal' ||
      lower === 'sepakat' ||
      lower === 'gas' ||
      lower === 'acc' ||
      lower.startsWith('oke ') ||
      lower.startsWith('ok ') ||
      lower.includes('saya setuju') || 
      lower.includes('jalankan saja');

    if (isApprovalCommand) {
      setTypingAgentName('Reta');
      const taskId = `TSK-${Date.now().toString().slice(-4)}`;
      const targetDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

      setTimeout(async () => {
        const recentContext = messages.slice(-4).map(m => m.text).join(' ');
        let taskTitle = 'Eksekusi Program Kerja Sinergi Dewan Agen';
        let moduleTarget = 'Tugas & Kalender';
        let pic = 'Silvi & Reta';

        if (recentContext.toLowerCase().includes('konten') || recentContext.toLowerCase().includes('video') || recentContext.toLowerCase().includes('branding')) {
          taskTitle = 'Produksi Kampanye Konten & Funnel Acquisition Baru';
          moduleTarget = 'Branding & Marketing';
          pic = 'Silvi (Growth)';
        } else if (recentContext.toLowerCase().includes('invoice') || recentContext.toLowerCase().includes('keuangan')) {
          taskTitle = 'Penerbitan Rekonsiliasi & Dokumen Faktur Klien';
          moduleTarget = 'Keuangan & Profit';
          pic = 'Silvi & Raka';
        }

        await store.addTask({
          id: taskId,
          title: taskTitle,
          category: moduleTarget,
          project: 'DigiBooster Executive Action',
          assignee: pic,
          priority: 'P1',
          status: 'Sedang Dikerjakan',
          dueDate: targetDate,
          description: `Disahkan langsung oleh Bang Robin di HQ LiveChat setelah diskusi terarah. Reta mengawal jadwal & follow-up deliverable.`
        });

        store.recordAiTelemetryEvent({
          agent: 'Reta (COO)',
          action: `Consensus Locked: ${taskTitle}`,
          targetModule: moduleTarget,
          tokensUsed: 490,
          latencyMs: 280,
          status: 'Success'
        });

        const retaConfirm = {
          id: `msg-reta-lock-${Date.now()}`,
          sender: 'Reta',
          name: 'Reta',
          role: 'Chief Operating Officer (COO)',
          badgeColor: '#0369a1',
          hasActionPreview: true,
          actionData: {
            id: taskId,
            title: taskTitle,
            module: moduleTarget,
            status: 'Terkunci di Database (Deadline: ' + targetDate + ')'
          },
          text: `Siap Bang Robin, terima kasih! Kesepakatan resmi saya kunci ke modul ${moduleTarget}:\n\n• ID Tugas: ${taskId}\n• Judul: ${taskTitle}\n• PIC Utama: ${pic}\n• Tenggat Waktu: ${targetDate}\n\nSaya pribadi yang akan mengawal follow-up progresnya setiap hari sampai tuntas dan melaporkan hasilnya langsung ke Bang Robin.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        setMessages((prev) => [...prev, retaConfirm]);
        setIsAgentsTyping(false);
      }, 1000);
      return;
    }

    // 3. SKENARIO SAPAAN GENERAL: SEMUA BOT MENJAWAB SINGKAT DAN HANGAT
    const isPureGreeting = (
      lower.startsWith('halo') || 
      lower.startsWith('hai') || 
      lower.startsWith('pagi') || 
      lower.startsWith('siang') || 
      lower.startsWith('sore') || 
      lower.startsWith('malam') || 
      lower.startsWith('assalamu')
    ) && !lower.includes('bahas') && !lower.includes('ide') && !lower.includes('konten') && !lower.includes('diskusi') && raw.length < 25;

    if (isPureGreeting) {
      setTypingAgentName('Arga');
      await appendMessageSequentially({
        id: `msg-arga-${Date.now()}`,
        sender: 'Arga',
        name: 'Arga',
        role: 'Chief Strategy Officer (CSO)',
        badgeColor: '#0284c7',
        text: 'halo bang bin! syapp standby nih, ada yg mau diobrolin apa nih hari ini?',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 600);

      setTypingAgentName('Silvi');
      await appendMessageSequentially({
        id: `msg-silvi-${Date.now()}`,
        sender: 'Silvi',
        name: 'Silvi',
        role: 'Head of Growth & Creative',
        badgeColor: '#0284c7',
        text: 'haloo bang! tim konten & growth jg udh siap kyk biasa nih, gas ajaa.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 500);

      setTypingAgentName('Reta');
      await appendMessageSequentially({
        id: `msg-reta-${Date.now()}`,
        sender: 'Reta',
        name: 'Reta',
        role: 'COO & Legal',
        badgeColor: '#0369a1',
        text: 'siap bang bin, sy sm ka raka jg stanby pantau operasional yaa.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 500);

      setIsAgentsTyping(false);
      return;
    }

    // 4. MEKANISME ROUTING PEMBICARA TARGET (Anti-Menumpuk & Sesuai Panggilan):
    // Prioritas deteksi nama lengkap & panggilan akrab:
    const mentionedSilvi = /\b(silvi|sil)\b/i.test(lower);
    const mentionedReta = /\b(reta|ret|ta)\b/i.test(lower);
    const mentionedRaka = /\b(raka)\b/i.test(lower) || /\b(ka raka)\b/i.test(lower) || (lower.includes('berkas') && lower.includes('siapkan'));
    const mentionedSiska = /\b(siska|sis)\b/i.test(lower);
    const mentionedArga = /\b(arga|ga)\b/i.test(lower);

    // Siska HANYA bersuara jika:
    // 1. Bang Robin eksplisit memanggil Siska ("sis", "siska")
    // 2. ATAU Bang Robin eksplisit meminta koreksi ("tegur", "koreksi", "salah botnya")
    const isExplicitCorrection = 
      lower.includes('tegur') || 
      lower.includes('koreksi') || 
      lower.includes('bot salah') || 
      lower.includes('salah jawab') ||
      lower.includes('blunder');

    // JIKA USER MENYEBUT SILVI LANGSUNG (Contoh: "gmn sil", "silvi gimana", dll)
    if (mentionedSilvi && !mentionedArga && !isExplicitCorrection) {
      setTypingAgentName('Silvi');
      const silviResponse = await generateAgentResponse({
        agentName: 'Silvi',
        agentRole: 'Head of Growth & Creative',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: 'Bang Robin berbicara langsung denganmu (Silvi). Berikan pandangan kreatif, strategi branding, konten visual, atau taktik closing deals yang santai dan lugas. Boleh sebut Arga (ga) atau Reta (ta) jika butuh sinergi. Dilarang membuat tugas/database tanpa persetujuan Bang Robin.'
      });

      let cleanSilvi = (silviResponse.text || '').replace(new RegExp(`^(Silvi|Arga|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-silvi-${Date.now()}`,
        sender: 'Silvi',
        name: 'Silvi',
        role: 'Head of Growth & Creative',
        badgeColor: '#0284c7',
        text: cleanSilvi,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 700);

      store.recordAiTelemetryEvent({
        agent: 'Silvi (Growth)',
        action: 'Direct Discussion',
        targetModule: 'Branding & Marketing',
        tokensUsed: silviResponse.usage?.total_tokens || 350,
        latencyMs: 310,
        status: 'Success'
      });

      setIsAgentsTyping(false);
      return;
    }

    // JIKA USER MENYEBUT RETA LANGSUNG
    if (mentionedReta && !mentionedArga && !mentionedSilvi && !isExplicitCorrection) {
      setTypingAgentName('Reta');
      const retaResponse = await generateAgentResponse({
        agentName: 'Reta',
        agentRole: 'Chief Operating Officer (COO)',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: 'Bang Robin menyapamu atau mengajakmu (Reta) berdiskusi secara langsung. Berikan respon taktis mengenai langkah operasional pertama yang paling konkret dan realistis. Jangan membuat tugas/database sebelum Bang Robin menyetujui arahannya.'
      });

      let cleanReta = (retaResponse.text || '').replace(new RegExp(`^(Reta|Silvi|Arga|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-reta-${Date.now()}`,
        sender: 'Reta',
        name: 'Reta',
        role: 'Chief Operating Officer (COO)',
        badgeColor: '#0369a1',
        text: cleanReta,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 700);

      store.recordAiTelemetryEvent({
        agent: 'Reta (COO)',
        action: 'Direct Discussion',
        targetModule: 'Operasional',
        tokensUsed: retaResponse.usage?.total_tokens || 350,
        latencyMs: 310,
        status: 'Success'
      });

      setIsAgentsTyping(false);
      return;
    }

    // JIKA USER MENYEBUT RAKA LANGSUNG
    if (mentionedRaka && !mentionedArga && !isExplicitCorrection) {
      setTypingAgentName('Raka');
      const rakaResponse = await generateAgentResponse({
        agentName: 'Raka',
        agentRole: 'Head of Documentation & Legal Systems',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: 'Bang Robin berbicara langsung denganmu (Raka). Tanggapi dari sudut pandang repositori dokumen, instrumen hukum PKS/NDA, dan kesiapan sistem.'
      });

      let cleanRaka = (rakaResponse.text || '').replace(new RegExp(`^(Raka|Reta|Silvi|Arga|Siska)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-raka-${Date.now()}`,
        sender: 'Raka',
        name: 'Raka',
        role: 'Head of Documentation & Legal',
        badgeColor: '#0c4a6e',
        text: cleanRaka,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 700);

      setIsAgentsTyping(false);
      return;
    }

    // JIKA ADA KOREKSI BLUNDER ATAU SISKA DIPANGGIL LANGSUNG
    if (isExplicitCorrection || (mentionedSiska && !mentionedArga && !mentionedSilvi)) {
      setTypingAgentName('Siska');

      // Tentukan target yang sedang dikoreksi
      let targetFaultAgent = 'Semua AI Agent';
      if (lower.includes('arga')) targetFaultAgent = 'Arga';
      else if (lower.includes('silvi')) targetFaultAgent = 'Silvi';
      else if (lower.includes('reta')) targetFaultAgent = 'Reta';
      else if (lower.includes('raka')) targetFaultAgent = 'Raka';

      const siskaPrompt = `Bang Robin memberikan teguran/koreksi: "${raw}".
Sebagai Head of Quality Control & Trainer:
1. Tanggapi dengan santun, lugas, dan cerdas.
2. Jelaskan deteksi kesalahan secara presisi (misal: bot mengulang-ulang kalimat, mengutip kata user langsung tanpa memahami makna, atau bot menjawab serentak tanpa giliran terarah).
3. Sampaikan bahwa koreksi ini akan diresmikan ke memori SOP.
4. Tanyakan kepada Bang Robin apakah ada poin perbaikan spesifik lainnya yang ingin ditambahkan sebelum Siska menyuntikkan permanen ke memori vektor kerja bot.`;

      const siskaRes = await generateAgentResponse({
        agentName: 'Siska',
        agentRole: 'Head of Quality & AI Trainer',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: siskaPrompt
      });

      await appendMessageSequentially({
        id: `msg-sis-${Date.now()}`,
        sender: 'Siska',
        name: 'Siska',
        role: 'Head of Quality & AI Trainer',
        badgeColor: '#0284c7',
        isDirective: true,
        text: siskaRes.text,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 800);

      // Simpan riwayat pelatihan ke store
      await store.siskaTrainAgents({
        targetAgentName: targetFaultAgent,
        coachingTopic: `Koreksi Owner: ${raw.slice(0, 45)}...`,
        behaviorGuidelines: `Koreksi Bang Robin: "${raw}". Dilarang keras mengutip kata-kata user mentah-mentah. Wajib memahami makna esensial, gunakan bahasa profesional natural. Giliran berbicara terarah sesuai panggilan, dan Reta tidak boleh membuat ringkasan/tugas tanpa diminta.`
      });

      setIsAgentsTyping(false);
      return;
    }

    // 5. SKENARIO DISKUSI UMUM: Arga sebagai mitra diskusi utama Bang Robin
    setTypingAgentName('Arga');

    const argaResponse = await generateAgentResponse({
      agentName: 'Arga',
      agentRole: 'Chief Strategy Officer (CSO)',
      userMessage: raw,
      conversationHistory: messages,
      customInstruction: `Kamu adalah Arga, rekan diskusi utama Bang Robin.
TANGKAP MAKSUD DAN INTI DARI PESAN BANG ROBIN: "${raw}".
- Tanggapi dengan santai, solutif, analitis, dan berbobot.
- Jika butuh bantuan spesifik (misal konten visual/branding atau berkas legal), lempar pertanyaan ke rekan lain secara alami (contoh: "gimana menurutmu sil?", "bisa bantu siapin berkasnya ka?").
- Dilarang keras memakai nama sendiri sebagai awalan ("Arga: ").`
    });

    let cleanArga = (argaResponse.text || '').replace(new RegExp(`^(Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

    const argaMsg = {
      id: `msg-deb-arga-${Date.now()}`,
      sender: 'Arga',
      name: 'Arga',
      role: 'Chief Strategy Officer (CSO)',
      badgeColor: '#0284c7',
      text: cleanArga,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    await appendMessageSequentially(argaMsg, 800);

    // Deteksi jika Arga melempar pembicaraan ke teman bot lain (misal: "gimana sil", "ka raka", "reta")
    const lowerArga = cleanArga.toLowerCase();
    const argaCalledSilvi = /\b(sil|silvi)\b/i.test(lowerArga);
    const argaCalledReta = /\b(ret|reta|ta)\b/i.test(lowerArga);
    const argaCalledRaka = /\b(ka|raka)\b/i.test(lowerArga);

    if (argaCalledSilvi) {
      setTypingAgentName('Silvi');
      const silviResponse = await generateAgentResponse({
        agentName: 'Silvi',
        agentRole: 'Head of Growth & Creative',
        userMessage: `Arga baru saja berdiskusi dengan Bang Robin dan meminta pandanganmu: "${cleanArga}". Berikan tanggapan kreatif dan taktis.`,
        conversationHistory: [...messages, argaMsg],
        customInstruction: `Menyambung lemparan diskusi Arga dan Bang Robin secara ringkas dan lugas (2-3 kalimat santai). Jangan membuat tugas/database.`
      });

      let cleanSilvi = (silviResponse.text || '').replace(new RegExp(`^(Silvi|Arga|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-deb-silvi-${Date.now()}`,
        sender: 'Silvi',
        name: 'Silvi',
        role: 'Head of Growth & Creative',
        badgeColor: '#0284c7',
        text: cleanSilvi,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 900);
    } else if (argaCalledReta) {
      setTypingAgentName('Reta');
      const retaResponse = await generateAgentResponse({
        agentName: 'Reta',
        agentRole: 'Chief Operating Officer (COO)',
        userMessage: `Arga meminta masukan operasional: "${cleanArga}".`,
        conversationHistory: [...messages, argaMsg],
        customInstruction: `Tanggapi pandangan Arga dari segi jadwal dan kesiapan eksekusi.`
      });

      let cleanReta = (retaResponse.text || '').replace(new RegExp(`^(Reta|Silvi|Arga|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-deb-reta-${Date.now()}`,
        sender: 'Reta',
        name: 'Reta',
        role: 'Chief Operating Officer (COO)',
        badgeColor: '#0369a1',
        text: cleanReta,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }, 900);
    }

    setIsAgentsTyping(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(9, 19, 34, 0.85)',
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
        fontFamily: "'Poppins', sans-serif",
        transform: 'translateZ(0)',
        willChange: 'transform'
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

                  {/* Interactive RLHF Emoji Reaction Bar (Like 👍, Sad 😢, Gratitude 🙏) */}
                  {!isUser && (
                    <div style={{
                      marginTop: '8px',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <button
                        title="Respon Bagus! Pertahankan & Tingkatkan (Thumbs Up)"
                        onClick={() => {
                          const agent = msg.name || 'Bot';
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: `msg-feed-${Date.now()}`,
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
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: `msg-feed-${Date.now()}`,
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
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: `msg-feed-${Date.now()}`,
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
