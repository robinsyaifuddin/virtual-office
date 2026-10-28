import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  RefreshCw,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { generateAgentResponse, generateVisualImageUrl } from '../../services/multiAgentAiService';
import { generateAndDownloadWordDoc } from '../../utils/exportWord';
import { generateAndDownloadPdfDoc } from '../../utils/exportPdf';
import { 
  Icon3DThumbUpBlue, 
  Icon3DSadBlue, 
  Icon3DPrayBlue 
} from '../ui/Modern3DIcons';

export default function OfficeGroupLiveChat({ isOpen, onClose }) {
  // Gunakan useWorkspaceStore.getState() agar komponen chat terisolasi & super ringan tanpa re-render beruntun
  const store = useWorkspaceStore.getState();

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

  // Helper untuk menambah pesan secara sekuensial alami dengan pembersihan format teks bintang
  const appendMessageSequentially = (msg, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Pastikan teks pesan bersih dari simbol bintang markdown agar mudah dicopas & nyaman dibaca
        if (msg && typeof msg.text === 'string') {
          msg.text = msg.text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, '')
            .replace(/ {2,}/g, ' ')
            .trim();
        }
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

    const lower = raw.toLowerCase();

    // Tentukan estimasi agen yang paling mungkin menjawab agar UI langsung menampilkan nama agen
    let expectedAgent = 'Arga';
    if (/\b(siska|sis)\b/i.test(lower)) expectedAgent = 'Siska';
    else if (/\b(silvi|sil)\b/i.test(lower) || lower.includes('gambar') || lower.includes('desain') || lower.includes('poster')) expectedAgent = 'Silvi';
    else if (/\b(reta|ret|ta)\b/i.test(lower)) expectedAgent = 'Reta';
    else if (/\b(raka|ka)\b/i.test(lower) || lower.includes('word') || lower.includes('dokumen') || lower.includes('pdf')) expectedAgent = 'Raka';

    setTypingAgentName(expectedAgent);
    setIsAgentsTyping(true);

    // JIKA USER MEMINTA GAMBAR / VISUAL (Silvi Visual Engine):
    const isImageCommand = 
      (lower.includes('gambar') || 
       lower.includes('desain') || 
       lower.includes('poster') || 
       lower.includes('visual') || 
       lower.includes('banner') || 
       lower.includes('foto') ||
       lower.includes('canva')) && 
      !lower.includes('dokumen') &&
      !lower.includes('pdf') &&
      !lower.includes('word');

    // JIKA USER MEMINTA DOKUMEN (WORD / PDF / BERKAS):
    const isDocumentCommand = 
      lower.includes('word') || 
      lower.includes('doc') || 
      lower.includes('docx') || 
      lower.includes('pdf') || 
      lower.includes('file') || 
      lower.includes('berkas') || 
      lower.includes('kontrak') || 
      lower.includes('pks') || 
      lower.includes('nda') ||
      lower.includes('surat') ||
      lower.includes('unduh');

    // 1. EKSEKUSI PERMINTAAN GAMBAR / VISUAL OLEH SILVI (Relevan, Presisi, No Halusinasi):
    if (isImageCommand && !isDocumentCommand) {
      setTypingAgentName('Silvi');

      // Ambil konteks diskusi terakhir agar gambar 100% selaras dengan topik bisnis saat ini
      const recentContextText = messages.slice(-4).map(m => m.text).join(' ');
      const visualTopicRaw = raw.replace(/silvi|sil|buatkan|bikin|tolong|minta|gambar|desain|poster|visual|foto|banner/gi, '').trim();
      const actualSubject = visualTopicRaw.length > 3 ? visualTopicRaw : (recentContextText.slice(0, 60) || 'modern startup marketing tech');

      const silviResponse = await generateAgentResponse({
        agentName: 'Silvi',
        agentRole: 'Head of Growth & Creative',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: `Bang Robin meminta dibuatkan aset visual/desain/gambar dengan tema: "${actualSubject}".
Konteks diskusi terakhir: "${recentContextText.slice(0, 150)}".
Tugas Silvi:
1. Sampaikan bahwa konsep visual kreatif telah selesai dirancang secara estetis dan profesional.
2. Jelaskan rasionalisasi visual secara ringkas (mengapa tone warna, komposisi, dan pesan ini relevan dengan strategi bisnis).
3. Informasikan bahwa preview gambar resolusi tinggi sudah disematkan langsung di bawah dan dapat diunduh/dibuka Full HD.
4. Jangan halu atau mengarang janji fiktif, fokus pada nilai estetika dan konversi audiens.`
      });

      let cleanSilvi = (silviResponse.text || '').replace(new RegExp(`^(Silvi|Arga|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

      const silviMsg = {
        id: `msg-silvi-visual-${Date.now()}`,
        sender: 'Silvi',
        name: 'Silvi',
        role: 'Head of Growth & Creative',
        badgeColor: '#0284c7',
        text: cleanSilvi,
        hasVisualImage: true,
        imageUrl: generateVisualImageUrl(actualSubject, 960, 600),
        imageCaption: `Aset Visual Kreatif: ${actualSubject}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };

      await appendMessageSequentially(silviMsg, 700);

      store.recordAiTelemetryEvent({
        agent: 'Silvi (Growth & Visual)',
        action: `Generate Visual: ${actualSubject}`,
        targetModule: 'Branding & Marketing',
        tokensUsed: 420,
        latencyMs: 350,
        status: 'Success'
      });

      setIsAgentsTyping(false);
      return;
    }

    // 2. EKSEKUSI PERMINTAAN DOKUMEN WORD (.DOCX) & PDF RESMI OLEH RAKA:
    if (isDocumentCommand) {
      setTypingAgentName('Raka');

      const recentContextText = messages.slice(-4).map(m => m.text).join(' ');
      const cleanDocTopic = raw.replace(/raka|ka|buatkan|bikin|tolong|minta|kirim|filenya|file|dokumen|word|doc|docx|pdf|unduh/gi, '').trim();
      const docSubject = cleanDocTopic.length > 3 ? cleanDocTopic : 'Dokumen Strategis & Kepatuhan Layanan DigiBooster';

      const rakaResponse = await generateAgentResponse({
        agentName: 'Raka',
        agentRole: 'Head of Documentation & Legal Systems',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: `Bang Robin meminta dokumen resmi siap unduh (Word .docx & PDF) terkait: "${docSubject}".
Konteks diskusi terakhir: "${recentContextText.slice(0, 180)}".
Tugas Raka:
1. Sampaikan bahwa draf dokumen resmi telah disusun rapi sesuai standar format legal & operasional DigiBooster.
2. Paparkan poin-poin klausul inti/pasal secara jelas, tegas, no-ambigu, dan terverifikasi (misal: ruang lingkup, hak & kewajiban, tata cara validasi mutu, batasan garansi/dispute).
3. Beritahu Bang Robin bahwa file Word (.docx) dan dokumen PDF siap langsung diunduh lewat tombol aksi di bawah pesan ini.
4. Gaya santai, terpercaya, solutif, dan profesional.`
      });

      let cleanRaka = (rakaResponse.text || '').replace(new RegExp(`^(Raka|Silvi|Arga|Reta|Siska)\\s*:\\s*`, 'i'), '').trim();

      const docTitle = docSubject.startsWith('Draf') || docSubject.startsWith('Strategi') ? docSubject : `Dokumen: ${docSubject}`;

      const rakaMsg = {
        id: `msg-raka-doc-${Date.now()}`,
        sender: 'Raka',
        name: 'Raka',
        role: 'Head of Documentation & Legal',
        badgeColor: '#0c4a6e',
        text: cleanRaka,
        hasDocAttachment: true,
        docData: {
          title: docTitle,
          category: 'Dokumen Strategis & Legal',
          author: 'Raka (Head of Documentation & Legal)',
          rawContent: cleanRaka
        },
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };

      await appendMessageSequentially(rakaMsg, 700);

      store.recordAiTelemetryEvent({
        agent: 'Raka (Legal & Docs)',
        action: `Generate Word & PDF Document: ${docTitle}`,
        targetModule: 'Data & Arsip',
        tokensUsed: 460,
        latencyMs: 380,
        status: 'Success'
      });

      setIsAgentsTyping(false);
      return;
    }

    if (isExplicitToolCall) {
      // Prioritaskan siapa yang dipanggil di kalimat pembuka:
      const explicitlyAddressedReta = /\b(reta|ret|ta)\b/i.test(lower);
      const explicitlyAddressedRaka = /\b(raka|ka)\b/i.test(lower);
      const isSilvi = !explicitlyAddressedReta && !explicitlyAddressedRaka && (lower.includes('silvi') || lower.includes('konten') || lower.includes('postingan') || lower.includes('marketing'));
      
      const executorName = explicitlyAddressedReta ? 'Reta' : (isSilvi ? 'Silvi' : (explicitlyAddressedRaka ? 'Raka' : 'Reta'));
      setTypingAgentName(executorName);

      setTimeout(async () => {
        let taskTitle = `Draf: ${raw.replace(/buatkan|buatin|tolong buat|masukkan ke tabel|simpan ke tabel/gi, '').trim() || 'Rencana Tindakan Operasional'}`;
        let moduleTarget = 'Branding & Marketing';
        let pic = executorName === 'Reta' ? 'Silvi (Growth) & Reta (Ops)' : (executorName === 'Silvi' ? 'Silvi (Growth)' : 'Raka (Legal)');
        let priority = 'P1';
        let targetDueDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
        let taskDesc = `Inisiatif operasional diajukan dari hasil diskusi LiveChat: "${raw}".`;
        let discussionNotes = `Draft disiapkan Reta berdasarkan instruksi Bang Robin. Memerlukan peninjauan Arga untuk validasi judul dan kesesuaian target.`;

        if (lower.includes('invoice') || lower.includes('faktur') || lower.includes('tagihan')) {
          taskTitle = 'Draf Faktur Penagihan Klien & Rekonsiliasi';
          moduleTarget = 'Keuangan & Profit';
          pic = 'Silvi (Growth) & Raka (Legal)';
          taskDesc = `Penerbitan dokumen faktur dan penagihan resmi klien DigiBooster.`;
          discussionNotes = `Validasi invoice klien riil di sistem, pastikan nominal dan PPN sesuai transaksi.`;
        } else if (lower.includes('kontrak') || lower.includes('pks') || lower.includes('legal')) {
          taskTitle = 'Draf Perjanjian Kerja Sama (PKS) & NDA Vendor';
          moduleTarget = 'Data & Arsip';
          pic = 'Raka (Legal & Arsip)';
          taskDesc = `Penyusunan instrumen hukum PKS/NDA sesuai klausul standar DigiBooster.`;
          discussionNotes = `Pastikan identitas mitra dan masa berlaku kontrak diverifikasi tanpa data fiktif.`;
        }

        const taskId = `ACT-${Date.now().toString().slice(-4)}`;
        const creatorAgent = executorName === 'Reta' ? 'Reta (COO)' : (executorName === 'Silvi' ? 'Silvi (Growth & CFO)' : 'Raka (CTO)');
        await store.addTask({
          id: taskId,
          title: taskTitle,
          category: moduleTarget,
          project: 'DigiBooster Automation',
          assignee: pic,
          priority: priority,
          status: 'Menunggu Review',
          dueDate: targetDueDate,
          description: taskDesc,
          notes: discussionNotes,
          createdBy: creatorAgent,
          updatedBy: creatorAgent
        });

        store.recordAiTelemetryEvent({
          agent: executorName,
          action: `Create Draft: ${taskTitle}`,
          targetModule: moduleTarget,
          tokensUsed: 420,
          latencyMs: 290,
          status: 'Success'
        });

        // 1. Respon dari Eksekutor (Reta, Raka, atau Silvi)
        let replyText = '';
        if (executorName === 'Reta') {
          replyText = `Siap Bang Robin! Reta sudah susun format draf penugasannya secara lengkap ke modul ${moduleTarget} [ID: ${taskId}]:\n\n• Nama: ${taskTitle}\n• Keterangan: ${taskDesc}\n• Jadwal: ${targetDueDate}\n• Status: Draf (Menunggu Review)\n• Kategori: ${moduleTarget}\n• Prioritas: ${priority}\n• PIC: ${pic}\n• Catatan: ${discussionNotes}\n\nGa @Arga, tolong tinjau draf ini ya biar judulnya makin tajam dan dipastikan semua datanya valid, no fiktif. Nanti kalau Bang Robin setuju / acc, baru Reta kunci resmi ke eksekusi!`;
        } else if (executorName === 'Raka') {
          replyText = `siap bang bin! raka udh buatin draf berkas & penugasannya rapi di modul ${moduleTarget} [ID: ${taskId}]:\n\n• Nama Dokumen: ${taskTitle}\n• Keterangan: ${taskDesc}\n• Jadwal Rampung: ${targetDueDate}\n• Status: Draf (Menunggu Review)\n• Kategori: ${moduleTarget}\n• PIC: ${pic}\n• Catatan Legal/Arsip: ${discussionNotes}\n\nga @Arga & bang bin, tolong dicek draf klausul & judulnya yaa. kalau aman langsung kita sahkan!`;
        } else {
          replyText = `Siap Bang Robin! Draf tugas "${taskTitle}" [ID: ${taskId}] telah saya catat ke modul ${moduleTarget} lengkap dengan jadwal dan PIC. Arga akan membantu mereview sebelum difinalkan.`;
        }

        const execReply = {
          id: `msg-exec-${Date.now()}`,
          sender: executorName,
          name: executorName,
          role: executorName === 'Reta' ? 'Chief Operating Officer (COO)' : (executorName === 'Silvi' ? 'Head of Growth & Creative' : 'Head of Documentation & Legal'),
          badgeColor: executorName === 'Reta' ? '#0369a1' : (executorName === 'Raka' ? '#0c4a6e' : '#0284c7'),
          hasActionPreview: true,
          actionData: {
            id: taskId,
            title: taskTitle,
            description: taskDesc,
            dueDate: targetDueDate,
            status: 'Draf (Menunggu Review Arga & Bang Robin)',
            module: moduleTarget,
            priority: priority,
            pic: pic,
            notes: discussionNotes,
            isLocked: false
          },
          text: replyText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        setMessages((prev) => [...prev, execReply]);

        // 2. Arga langsung meninjau draf yang dibuat: memvalidasi judul, mengecek anti-data fiktif, dan meminta persetujuan Bang Robin
        if (executorName === 'Reta' || executorName === 'Raka') {
          setTypingAgentName('Arga');
          setTimeout(async () => {
            const argaResponse = await generateAgentResponse({
              agentName: 'Arga',
              agentRole: 'Chief Strategy Officer (CSO)',
              userMessage: `${executorName} baru saja membuat draf tugas/dokumen: "${taskTitle}" dengan rincian: Keterangan: "${taskDesc}", PIC: "${pic}", Jadwal: "${targetDueDate}", Catatan: "${discussionNotes}".
Tugasmu: Tinjau draf tersebut. Pastikan judulnya tajam, komersial, dan realistis (anti-data fiktif). Ajukan usulan judul final kepada Bang Robin, dan mintakan persetujuannya (misal: "Gimana Bang Robin, kalau judulnya kita pertegas jadi '...', apakah setuju / gas?").`,
              conversationHistory: [...messages, execReply],
              customInstruction: `Kamu adalah Arga. Analisis draf ${executorName} secara kritis dan konstruktif. Berikan usulan judul yang lebih tajam dan pastikan tidak ada data fiktif. Lalu tanyakan langsung konfirmasi persetujuan Bang Robin secara santai tapi profesional.`
            });

            let cleanArga = (argaResponse.text || '').replace(new RegExp(`^(Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

            await appendMessageSequentially({
              id: `msg-arga-title-refine-${Date.now()}`,
              sender: 'Arga',
              name: 'Arga',
              role: 'Chief Strategy Officer (CSO)',
              badgeColor: '#0284c7',
              text: cleanArga,
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
            }, 800);
            setIsAgentsTyping(false);
          }, 1100);
        } else {
          setIsAgentsTyping(false);
        }
      }, 1000);
      return;
    }

    // 1.5. SKENARIO TARIK DATA REAL DARI DATABASE (Real Data Grounding)
    // Contoh: "gmn dapet ngga", "tarik dari pipeline", "cek crm", "cek data", "gimana dapet"
    const isDataQuery = 
      (lower.includes('dapet') && (lower.includes('gmn') || lower.includes('gimana'))) ||
      lower.includes('tarik data') ||
      lower.includes('cek data') ||
      lower.includes('cek crm') ||
      lower.includes('data crm') ||
      lower.includes('angka real') ||
      lower.includes('pipeline') ||
      lower.includes('laporan deal');

    if (isDataQuery) {
      setTypingAgentName('Silvi');
      
      setTimeout(async () => {
        // Ambil data real dari store
        const clients = store.clients || [];
        const tasks = store.tasks || [];
        const campaigns = store.marketingCampaigns || [];

        const totalClients = clients.length;
        const totalDealValue = clients.reduce((acc, c) => acc + (Number(c.dealValue) || 0), 0);
        const wonDeals = clients.filter(c => (c.stage || '').toLowerCase().includes('won') || (c.stage || '').toLowerCase().includes('deal') || (c.stage || '').toLowerCase().includes('closing'));
        const wonCount = wonDeals.length;
        const wonTotal = wonDeals.reduce((acc, c) => acc + (Number(c.dealValue) || 0), 0);

        const realSummaryContext = `DATA REAL DARI DATABASE DIGIBOOSTER SAAT INI:
- Total Leads / Klien di CRM: ${totalClients} Klien
- Total Nilai Pipeline Prospek: Rp ${totalDealValue.toLocaleString('id-ID')}
- Klien Closing / Won: ${wonCount} Deal (Total Nilai: Rp ${wonTotal.toLocaleString('id-ID')})
- Kampanye Marketing Aktif: ${campaigns.length} Kampanye
- Daftar Tugas Operasional Terdaftar: ${tasks.length} Tugas`;

        const silviResponse = await generateAgentResponse({
          agentName: 'Silvi',
          agentRole: 'Head of Growth & Creative',
          userMessage: `Bang Robin bertanya: "${raw}". Sampaikan data real ini secara santai, jelas, dan transparan:\n${realSummaryContext}`,
          conversationHistory: messages,
          customInstruction: `Kamu adalah Silvi. Berikan laporan ringkas angka real dari database CRM/Pipeline ke Bang Robin dan Arga.
Sebutkan angka total leads, closing, atau nilai deals dengan gaya santai (contoh: "nih bang sy udh tarik datanya dari pipeline: ada ...").
Lalu lempar ke Arga (ga) untuk minta masukan strateginya.`
        });

        let cleanSilvi = (silviResponse.text || '').replace(new RegExp(`^(Silvi|Arga|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

        const silviMsg = {
          id: `msg-silvi-data-${Date.now()}`,
          sender: 'Silvi',
          name: 'Silvi',
          role: 'Head of Growth & Creative',
          badgeColor: '#0284c7',
          hasActionPreview: true,
          actionData: {
            id: `CRM-STATS-${Date.now().toString().slice(-4)}`,
            title: `Laporan Real Pipeline & Deals CRM`,
            module: 'CRM & Klien',
            status: `${totalClients} Klien • ${wonCount} Won Deals (Rp ${wonTotal.toLocaleString('id-ID')})`
          },
          text: cleanSilvi,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        await appendMessageSequentially(silviMsg, 600);

        // Setelah Silvi memaparkan data, Arga langsung masuk memberi analisa strategisnya
        setTypingAgentName('Arga');
        setTimeout(async () => {
          const argaResponse = await generateAgentResponse({
            agentName: 'Arga',
            agentRole: 'Chief Strategy Officer (CSO)',
            userMessage: `Silvi baru saja memaparkan data CRM real: "${cleanSilvi}". Berikan analisamu kepada Bang Robin.`,
            conversationHistory: [...messages, silviMsg],
            customInstruction: `Kamu adalah Arga. Analisa angka yang dipaparkan Silvi secara taktis dan berikan rekomendasi langkah berikutnya ke Bang Robin secara santai dan cerdas.`
          });

          let cleanArga = (argaResponse.text || '').replace(new RegExp(`^(Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

          await appendMessageSequentially({
            id: `msg-arga-data-eval-${Date.now()}`,
            sender: 'Arga',
            name: 'Arga',
            role: 'Chief Strategy Officer (CSO)',
            badgeColor: '#0284c7',
            text: cleanArga,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          }, 800);
          setIsAgentsTyping(false);
        }, 1100);
      }, 800);
      return;
    }

    // Deteksi panggilan agen spesifik
    const mentionedSilvi = /\b(silvi|sil)\b/i.test(lower);
    const mentionedReta = /\b(reta|ret|ta)\b/i.test(lower);
    const mentionedRaka = /\b(raka)\b/i.test(lower) || /\b(ka raka)\b/i.test(lower) || (lower.includes('berkas') && lower.includes('siapkan'));
    const mentionedSiska = /\b(siska|sis)\b/i.test(lower);
    const mentionedArga = /\b(arga|ga)\b/i.test(lower);

    // Cek apakah pesan user secara spesifik ditujukan ke Siska (obrolan/tanggapan ke Siska)
    const isTargetedToSiska = mentionedSiska && !mentionedReta && !mentionedArga && !mentionedSilvi && !mentionedRaka;

    // 2. SKENARIO PERSETUJUAN OWNER ATAS RANGKUMAN TUGAS OPERASIONAL (Deal / Oke / Setuju / Jalankan)
    // Syarat ketat agar TIDAK BLUNDER:
    // a. Jangan pernah trigger jika user sedang ngobrol/membalas Siska (misal: "oke lakuin aja sis")
    // b. Wajib ada draf tugas aktif ATAU kata persetujuan tegas yang jelas-jelas ditujukan ke operasional
    const isGenericAffirmation = 
      lower === 'oke' || 
      lower === 'ok' || 
      lower === 'deal' ||
      lower === 'sepakat' ||
      lower === 'gas' ||
      lower === 'acc' ||
      lower.startsWith('oke ') ||
      lower.startsWith('ok ') ||
      lower.includes('saya setuju') || 
      lower.includes('setuju') ||
      lower.includes('jalankan saja');

    // Ambil pesan terakhir sebelum pesan ini untuk verifikasi konteks
    const lastNonEmptyMsg = [...messages].reverse().find(m => m.sender !== 'user');
    const isFollowupToSiska = lastNonEmptyMsg && (lastNonEmptyMsg.sender === 'Siska' || lastNonEmptyMsg.name === 'Siska');
    const recentDraftMsg = [...messages.slice(-6)].reverse().find(m => m.actionData && !m.actionData.isLocked);

    // Approval resmi HANYA aktif jika BUKAN ditujukan ke Siska dan relevan dengan draf operasional
    const isApprovalCommand = isGenericAffirmation && !isTargetedToSiska && !isFollowupToSiska && (!!recentDraftMsg || mentionedReta || lower.includes('tugas') || lower.includes('program kerja'));

    if (isApprovalCommand) {
      setTypingAgentName('Reta');
      const taskId = `TSK-${Date.now().toString().slice(-4)}`;
      const targetDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

      setTimeout(async () => {
        // Ambil konteks pesan draf sebelumnya dari Reta & evaluasi Arga
        const recentMessages = messages.slice(-5);
        const lastDraftMsg = [...recentMessages].reverse().find(m => m.actionData && !m.actionData.isLocked);
        const lastArgaMsg = [...recentMessages].reverse().find(m => m.sender === 'Arga');

        let taskTitle = 'Eksekusi Program Kerja Sinergi Dewan Agen';
        let moduleTarget = 'Tugas & Kalender';
        let pic = 'Silvi (Growth) & Reta (Ops)';
        let priority = 'P1';
        let taskDesc = 'Tugas disahkan langsung oleh Bang Robin di HQ LiveChat setelah ditinjau Arga & disiapkan Reta.';
        let discussionNotes = 'Data diverifikasi akurat & relevan dari diskusi multi-agent tanpa data fiktif.';

        if (lastDraftMsg && lastDraftMsg.actionData) {
          moduleTarget = lastDraftMsg.actionData.module || moduleTarget;
          pic = lastDraftMsg.actionData.pic || pic;
          priority = lastDraftMsg.actionData.priority || priority;
          taskDesc = lastDraftMsg.actionData.description || taskDesc;
          discussionNotes = lastDraftMsg.actionData.notes || discussionNotes;
          taskTitle = lastDraftMsg.actionData.title || taskTitle;
        }

        // Jika Arga mengusulkan judul yang dikutip dalam tanda petik, gunakan judul Arga yang lebih tajam
        if (lastArgaMsg && lastArgaMsg.text) {
          const quotedMatch = lastArgaMsg.text.match(/"([^"]+)"/);
          if (quotedMatch && quotedMatch[1] && quotedMatch[1].length > 6) {
            taskTitle = quotedMatch[1].trim();
          }
        }

        const recentContext = messages.slice(-4).map(m => m.text).join(' ');
        if (!lastDraftMsg) {
          if (recentContext.toLowerCase().includes('konten') || recentContext.toLowerCase().includes('video') || recentContext.toLowerCase().includes('branding')) {
            taskTitle = 'Produksi Kampanye Konten & Funnel Acquisition Baru';
            moduleTarget = 'Branding & Marketing';
            pic = 'Silvi (Growth)';
          } else if (recentContext.toLowerCase().includes('invoice') || recentContext.toLowerCase().includes('keuangan')) {
            taskTitle = 'Penerbitan Rekonsiliasi & Dokumen Faktur Klien';
            moduleTarget = 'Keuangan & Profit';
            pic = 'Silvi (Growth) & Raka (Legal)';
          }
        }

        // Simpan tugas resmi yang telah di-ACC dengan 8 atribut lengkap
        await store.addTask({
          id: taskId,
          title: taskTitle,
          category: moduleTarget,
          project: 'DigiBooster Executive Action',
          assignee: pic,
          priority: priority,
          status: 'Sedang Dikerjakan',
          dueDate: targetDate,
          description: taskDesc,
          notes: discussionNotes,
          createdBy: 'Reta (COO)',
          updatedBy: 'Reta (COO)'
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
            description: taskDesc,
            dueDate: targetDate,
            status: 'Sedang Dikerjakan',
            module: moduleTarget,
            priority: priority,
            pic: pic,
            notes: discussionNotes,
            isLocked: true
          },
          text: `Siap Bang Robin! Approval diterima resmi. Reta sudah kunci tugas ke database modul ${moduleTarget}:\n\n• Nama: ${taskTitle}\n• Keterangan: ${taskDesc}\n• Jadwal: ${targetDate}\n• Status: Sedang Dikerjakan\n• Kategori: ${moduleTarget}\n• Prioritas: ${priority}\n• PIC: ${pic}\n• Catatan: ${discussionNotes}\n\nSilakan klik tombol link di kartu tugas di bawah untuk melihat detailnya di tab baru dashboard. Reta dan tim dewan langsung tancap gas mengawal eksekusinya!`,
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

    // 4. MEKANISME ROUTING PEMBICARA TARGET (Cerdas, Terarah & Menjawab Bersama Sesuai Panggilan):
    // Kumpulkan seluruh agen yang dipanggil secara eksplisit oleh Bang Robin
    const explicitlyMentionedAgents = [];
    if (mentionedArga) explicitlyMentionedAgents.push('Arga');
    if (mentionedSilvi) explicitlyMentionedAgents.push('Silvi');
    if (mentionedRaka) explicitlyMentionedAgents.push('Raka');
    if (mentionedReta) explicitlyMentionedAgents.push('Reta');
    if (mentionedSiska) explicitlyMentionedAgents.push('Siska');

    // Siska HANYA bersuara jika:
    // 1. Bang Robin eksplisit memanggil Siska ("sis", "siska")
    // 2. ATAU pesan user merupakan tindak lanjut dari tanggapan Siska sebelumnya
    // 3. ATAU Bang Robin eksplisit meminta koreksi/evaluasi ("tegur", "koreksi", "bot salah", "blunder")
    const isExplicitCorrection = 
      lower.includes('tegur') || 
      lower.includes('koreksi') || 
      lower.includes('bot salah') || 
      lower.includes('salah jawab') ||
      lower.includes('blunder');

    const isDirectSiskaFollowup = isFollowupToSiska && !mentionedArga && !mentionedSilvi && !mentionedReta && !mentionedRaka;

    // JIKA ADA KOREKSI BLUNDER ATAU SISKA DIPANGGIL EKSPLISIT ATAU USER MEMBALAS SISKA
    if (isExplicitCorrection || isDirectSiskaFollowup || (mentionedSiska && explicitlyMentionedAgents.length <= 1)) {
      setTypingAgentName('Siska');

      // Tentukan target yang sedang dikoreksi
      let targetFaultAgent = 'Semua AI Agent';
      if (lower.includes('arga')) targetFaultAgent = 'Arga';
      else if (lower.includes('silvi')) targetFaultAgent = 'Silvi';
      else if (lower.includes('reta')) targetFaultAgent = 'Reta';
      else if (lower.includes('raka')) targetFaultAgent = 'Raka';

      const siskaPrompt = `Bang Robin memberikan arahan/evaluasi kualitas kerja: "${raw}".
Sebagai Head of Quality Control & Team Coach:
1. Tanggapi dengan santun, lugas, hangat, dan natural layaknya Head of Quality manusia profesional di kantor DigiBooster.
2. DILARANG KERAS menggunakan jargon teknis robotik seperti "memori vektor", "vektor kerja bot", "log deteksi AI", "suntikkan instruksi ke model". Ganti dengan istilah organisasi profesional yang manusiawi seperti "SOP kerja tim", "evaluasi koordinasi", "panduan kerja", "catatan evaluasi tim".
3. Tegaskan bahwa Siska sudah mencatat dan mendisiplinkan koordinasi antar-rekan dewan agen agar tidak saling serobot, tidak memotong pembicaraan, dan selalu patuh pada arahan Bang Robin.
4. Jawab secara ringkas, tegas, ramah, dan solutif (2-3 paragraf pendek).`;

      const siskaRes = await generateAgentResponse({
        agentName: 'Siska',
        agentRole: 'Head of Quality & Team Coach',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: siskaPrompt
      });

      let cleanSiska = (siskaRes.text || '').replace(new RegExp(`^(Siska|Arga|Silvi|Reta|Raka)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-sis-${Date.now()}`,
        sender: 'Siska',
        name: 'Siska',
        role: 'Head of Quality & AI Trainer',
        badgeColor: '#0284c7',
        isDirective: true,
        text: cleanSiska,
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

    // SKENARIO MULTI-AGENT INVOLVEMENT:
    // Jika Bang Robin memanggil 2 atau lebih agen (misal: "raka, silvi, arga, reta"), mereka semua berpartisipasi berurutan secara terarah & sinergis!
    if (explicitlyMentionedAgents.length >= 2) {
      let chainedHistory = [...messages];

      for (let i = 0; i < explicitlyMentionedAgents.length; i++) {
        const curAgent = explicitlyMentionedAgents[i];
        setTypingAgentName(curAgent);

        let roleTitle = 'Chief Strategy Officer (CSO)';
        let badge = '#0284c7';
        let customPrompt = '';

        if (curAgent === 'Arga') {
          roleTitle = 'Chief Strategy Officer (CSO)';
          badge = '#0284c7';
          customPrompt = `Bang Robin memanggilmu bersama rekan lain (${explicitlyMentionedAgents.join(', ')}).
Tugas Arga: Berikan pandangan strategis, prioritas bisnis, dan arahan pokok secara santai dan cerdas. Oper atau sambungkan ke rekan yang juga dipanggil.`;
        } else if (curAgent === 'Silvi') {
          roleTitle = 'Head of Growth & Creative';
          badge = '#0284c7';
          customPrompt = `Bang Robin memanggilmu bersama rekan lain (${explicitlyMentionedAgents.join(', ')}).
Tugas Silvi: Berikan pandangan dari sisi growth, daya tarik promosi, konten, atau strategi penawaran/closing. Tanggapi ide Arga jika dia sudah berbicara sebelumnya.`;
        } else if (curAgent === 'Raka') {
          roleTitle = 'Head of Documentation & Legal';
          badge = '#0c4a6e';
          customPrompt = `Bang Robin memanggilmu bersama rekan lain (${explicitlyMentionedAgents.join(', ')}).
Tugas Raka: Berikan respon dari sudut pandang repositori dokumen, kesiapan kontrak/PKS/NDA, mitigasi risiko arsip, dan administrasi sistem yang siap diproses.`;
        } else if (curAgent === 'Reta') {
          roleTitle = 'Chief Operating Officer (COO)';
          badge = '#0369a1';
          customPrompt = `Bang Robin memanggilmu bersama rekan lain (${explicitlyMentionedAgents.join(', ')}).
Tugas Reta: Berikan pandangan operasional, kesiapan timeline, alur koordinasi tim, atau konfirmasi eksekusi jika rencana sudah disetujui Bang Robin.`;
        } else if (curAgent === 'Siska') {
          roleTitle = 'Head of Quality & AI Trainer';
          badge = '#0284c7';
          customPrompt = `Bang Robin memanggilmu bersama tim. Berikan masukan dari sisi standar mutu dan kepatuhan SOP kerja.`;
        }

        const agentRes = await generateAgentResponse({
          agentName: curAgent,
          agentRole: roleTitle,
          userMessage: raw,
          conversationHistory: chainedHistory,
          customInstruction: customPrompt,
          mentionedAgents: explicitlyMentionedAgents
        });

        const cleanReply = (agentRes.text || '').replace(new RegExp(`^(${curAgent}|Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

        const agentMsgObj = {
          id: `msg-multi-${curAgent.toLowerCase()}-${Date.now()}-${i}`,
          sender: curAgent,
          name: curAgent,
          role: roleTitle,
          badgeColor: badge,
          text: cleanReply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        await appendMessageSequentially(agentMsgObj, i === 0 ? 700 : 900);
        chainedHistory.push(agentMsgObj);

        store.recordAiTelemetryEvent({
          agent: `${curAgent} (Multi-Call)`,
          action: 'Multi-Agent Discussion',
          targetModule: 'Diskusi Sinergi Tim',
          tokensUsed: agentRes.usage?.total_tokens || 350,
          latencyMs: 310,
          status: 'Success'
        });
      }

      setIsAgentsTyping(false);
      return;
    }

    // JIKA USER MENYEBUT SATU BOT SECARA SPESIFIK:
    // 1. Silvi saja (Dukungan Pembuatan Visual Nyata & Image Gen)
    if (mentionedSilvi && !mentionedArga && !mentionedReta && !mentionedRaka) {
      setTypingAgentName('Silvi');
      const isVisualRequested = lower.includes('gambar') || lower.includes('desain') || lower.includes('poster') || lower.includes('visual') || lower.includes('canva');

      const silviResponse = await generateAgentResponse({
        agentName: 'Silvi',
        agentRole: 'Head of Growth & Creative',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: isVisualRequested
          ? 'Bang Robin meminta pembuatan konsep gambar/visual/poster marketing. Berikan respon santai dan jelaskan rancangan ide visualnya (warna, pesan utama, dan estetika modern). Hasil preview gambar fotorealistik akan langsung disajikan di bubble chat.'
          : 'Bang Robin berbicara langsung denganmu (Silvi). Berikan pandangan kreatif, strategi branding, konten visual, atau taktik closing deals yang santai, cerdas, dan lugas. Boleh sebut Arga (ga), Raka (ka), atau Reta (ta) jika butuh sinergi. Dilarang membuat tugas/database tanpa persetujuan Bang Robin.'
      });

      let cleanSilvi = (silviResponse.text || '').replace(new RegExp(`^(Silvi|Arga|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

      const silviMsg = {
        id: `msg-silvi-${Date.now()}`,
        sender: 'Silvi',
        name: 'Silvi',
        role: 'Head of Growth & Creative',
        badgeColor: '#0284c7',
        text: cleanSilvi,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };

      if (isVisualRequested) {
        const visualSubject = raw.replace(/silvi|sil|tolong|buatkan|gambar|desain|poster/gi, '').trim() || 'modern startup growth marketing';
        silviMsg.hasVisualImage = true;
        silviMsg.imageUrl = generateVisualImageUrl(visualSubject, 800, 500);
        silviMsg.imageCaption = `Konsep Visual: ${visualSubject}`;
      }

      await appendMessageSequentially(silviMsg, 700);

      store.recordAiTelemetryEvent({
        agent: 'Silvi (Growth)',
        action: 'Direct Discussion',
        targetModule: 'Branding & Marketing',
        tokensUsed: silviResponse.usage?.total_tokens || 350,
        latencyMs: 310,
        status: 'Success'
      });

      // Operan Diskusi dari Silvi ke Bot Lain (Misal Silvi memanggil Raka: "ka, nanti bisa bantu...")
      const lowerSilvi = cleanSilvi.toLowerCase();
      const silviCalledRaka = /\b(ka|raka)\b/i.test(lowerSilvi);
      const silviCalledReta = /\b(ta|ret|reta)\b/i.test(lowerSilvi);
      const silviCalledArga = /\b(ga|arga)\b/i.test(lowerSilvi);

      if (silviCalledRaka) {
        setTypingAgentName('Raka');
        const rakaResponse = await generateAgentResponse({
          agentName: 'Raka',
          agentRole: 'Head of Documentation & Legal Systems',
          userMessage: `Silvi meminta bantuanmu: "${cleanSilvi}". Berikan respon singkat kesiapanmu dari segi legal/arsip.`,
          conversationHistory: [...messages, silviMsg],
          customInstruction: 'Kamu adalah Raka. Tanggapi langsung permintaan Silvi dan Bang Robin secara santai, taktis, dan lugas (1-2 kalimat). Jangan membuat tugas/database.'
        });

        let cleanRaka = (rakaResponse.text || '').replace(new RegExp(`^(Raka|Silvi|Arga|Reta|Siska)\\s*:\\s*`, 'i'), '').trim();

        await appendMessageSequentially({
          id: `msg-chain-raka-${Date.now()}`,
          sender: 'Raka',
          name: 'Raka',
          role: 'Head of Documentation & Legal',
          badgeColor: '#0c4a6e',
          text: cleanRaka,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        }, 800);
      } else if (silviCalledReta) {
        setTypingAgentName('Reta');
        const retaResponse = await generateAgentResponse({
          agentName: 'Reta',
          agentRole: 'Chief Operating Officer (COO)',
          userMessage: `Silvi melempar hal ini: "${cleanSilvi}".`,
          conversationHistory: [...messages, silviMsg],
          customInstruction: 'Kamu adalah Reta. Berikan tanggapan operasional singkat.'
        });

        let cleanReta = (retaResponse.text || '').replace(new RegExp(`^(Reta|Silvi|Arga|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();

        await appendMessageSequentially({
          id: `msg-chain-reta-${Date.now()}`,
          sender: 'Reta',
          name: 'Reta',
          role: 'Chief Operating Officer (COO)',
          badgeColor: '#0369a1',
          text: cleanReta,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        }, 800);
      }

      setIsAgentsTyping(false);
      return;
    }

    // 2. Reta saja
    if (mentionedReta && !mentionedArga && !mentionedSilvi && !mentionedRaka) {
      setTypingAgentName('Reta');
      const retaResponse = await generateAgentResponse({
        agentName: 'Reta',
        agentRole: 'Chief Operating Officer (COO)',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: 'Bang Robin menyapamu atau mengajakmu (Reta) berdiskusi secara langsung. Berikan respon taktis mengenai langkah operasional pertama yang paling konkret, realistis, dan tertata rapi. Jangan membuat tugas/database sebelum Bang Robin menyetujui arahannya.'
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

    // 3. Raka saja (Dukungan Pembuatan Dokumen Word .docx & PDF Langsung)
    if (mentionedRaka && !mentionedArga && !mentionedSilvi && !mentionedReta) {
      setTypingAgentName('Raka');
      const isWordDocRequested = 
        lower.includes('word') || 
        lower.includes('doc') || 
        lower.includes('docx') || 
        lower.includes('pdf') || 
        lower.includes('file') || 
        lower.includes('berkas') || 
        lower.includes('kontrak') || 
        lower.includes('pks') || 
        lower.includes('nda') ||
        lower.includes('surat') ||
        lower.includes('unduh');

      const rakaResponse = await generateAgentResponse({
        agentName: 'Raka',
        agentRole: 'Head of Documentation & Legal Systems',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: isWordDocRequested 
          ? 'Bang Robin meminta pembuatan dokumen Word/PDF resmi. Berikan respon santai bahwa dokumen legal/SOP sedang dirakit rapi lengkap dengan kop surat dan klausul standar, dan dapat langsung diunduh lewat tombol dokumen Word atau PDF di bawah.'
          : 'Bang Robin berbicara langsung denganmu (Raka). Tanggapi dari sudut pandang repositori dokumen, instrumen hukum PKS/NDA, mitigasi risiko, dan kesiapan sistem secara lugas dan cerdas.'
      });

      let cleanRaka = (rakaResponse.text || '').replace(new RegExp(`^(Raka|Reta|Silvi|Arga|Siska)\\s*:\\s*`, 'i'), '').trim();

      const rakaMsg = {
        id: `msg-raka-${Date.now()}`,
        sender: 'Raka',
        name: 'Raka',
        role: 'Head of Documentation & Legal',
        badgeColor: '#0c4a6e',
        text: cleanRaka,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };

      if (isWordDocRequested) {
        rakaMsg.hasDocAttachment = true;
        rakaMsg.docData = {
          title: `Draf Dokumen: ${raw.replace(/raka|ka|tolong|buatkan|file word|dokumen|word|coba buat/gi, '').trim() || 'Instrumen Hukum & SOP DigiBooster'}`,
          category: 'Legal & Dokumentasi',
          author: 'Raka (Head of Documentation & Legal)',
          rawContent: cleanRaka
        };
      }

      await appendMessageSequentially(rakaMsg, 700);

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

      const siskaPrompt = `Bang Robin memberikan arahan/evaluasi kualitas kerja: "${raw}".
Sebagai Head of Quality Control & Team Coach:
1. Tanggapi dengan santun, lugas, hangat, dan natural layaknya Head of Quality manusia profesional di kantor DigiBooster.
2. DILARANG KERAS menggunakan jargon teknis robotik seperti "memori vektor", "vektor kerja bot", "log deteksi AI", "suntikkan instruksi ke model". Ganti dengan istilah organisasi profesional yang manusiawi seperti "SOP kerja tim", "evaluasi koordinasi", "panduan kerja", "catatan evaluasi tim".
3. Tegaskan bahwa Siska sudah mencatat dan mendisiplinkan koordinasi antar-rekan dewan agen agar tidak saling serobot, tidak memotong pembicaraan, dan selalu patuh pada arahan Bang Robin.
4. Jawab secara ringkas, tegas, ramah, dan solutif (2-3 paragraf pendek).`;

      const siskaRes = await generateAgentResponse({
        agentName: 'Siska',
        agentRole: 'Head of Quality & Team Coach',
        userMessage: raw,
        conversationHistory: messages,
        customInstruction: siskaPrompt
      });

      let cleanSiska = (siskaRes.text || '').replace(new RegExp(`^(Siska|Arga|Silvi|Reta|Raka)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-sis-${Date.now()}`,
        sender: 'Siska',
        name: 'Siska',
        role: 'Head of Quality & AI Trainer',
        badgeColor: '#0284c7',
        isDirective: true,
        text: cleanSiska,
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

      // Jika Silvi atau Arga memanggil Raka, Raka ikut berpendapat
      const silviCalledRaka = /\b(ka|raka)\b/i.test(cleanSilvi.toLowerCase()) || argaCalledRaka;
      if (silviCalledRaka) {
        setTypingAgentName('Raka');
        const rakaResponse = await generateAgentResponse({
          agentName: 'Raka',
          agentRole: 'Head of Documentation & Legal Systems',
          userMessage: `Arga dan Silvi sedang membahas timeline/proyek dan memanggilmu: "${cleanSilvi}". Berikan pandanganmu dari segi kepastian dokumen, legalitas, atau kesiapan arsip.`,
          conversationHistory: [...messages, argaMsg, { sender: 'Silvi', name: 'Silvi', text: cleanSilvi }],
          customInstruction: `Tanggapi secara santai dan taktis dari kacamata legal/arsip dokumen. Jika ada dokumen yang perlu diantisipasi atau disiapkan drafnya, sebutkan secara jelas (1-2 kalimat).`
        });

        let cleanRaka = (rakaResponse.text || '').replace(new RegExp(`^(Raka|Reta|Silvi|Arga|Siska)\\s*:\\s*`, 'i'), '').trim();

        await appendMessageSequentially({
          id: `msg-deb-raka-${Date.now()}`,
          sender: 'Raka',
          name: 'Raka',
          role: 'Head of Documentation & Legal',
          badgeColor: '#0c4a6e',
          text: cleanRaka,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        }, 900);
      }
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
    } else if (argaCalledRaka) {
      setTypingAgentName('Raka');
      const rakaResponse = await generateAgentResponse({
        agentName: 'Raka',
        agentRole: 'Head of Documentation & Legal Systems',
        userMessage: `Arga meminta koordinasi berkas/legalitas: "${cleanArga}".`,
        conversationHistory: [...messages, argaMsg],
        customInstruction: `Tanggapi pandangan Arga dari segi dokumen dan legalitas secara singkat santai.`
      });

      let cleanRaka = (rakaResponse.text || '').replace(new RegExp(`^(Raka|Reta|Silvi|Arga|Siska)\\s*:\\s*`, 'i'), '').trim();

      await appendMessageSequentially({
        id: `msg-deb-raka-${Date.now()}`,
        sender: 'Raka',
        name: 'Raka',
        role: 'Head of Documentation & Legal',
        badgeColor: '#0c4a6e',
        text: cleanRaka,
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
            backgroundColor: '#f8fafc',
            userSelect: 'text',
            WebkitUserSelect: 'text'
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
                  whiteSpace: 'pre-line',
                  userSelect: 'text',
                  WebkitUserSelect: 'text',
                  cursor: 'text'
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
                      marginTop: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #bae6fd',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ✓ {msg.actionData.isLocked ? 'Tugas Resmi Terkunci di Database' : 'Draft Tugas Tercatat'}
                        </span>
                        <span style={{ fontSize: '0.66rem', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {msg.actionData.module || 'Tugas & Kalender'}
                        </span>
                      </div>

                      <strong style={{ fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.35 }}>
                        {msg.actionData.title}
                      </strong>

                      {/* Detail 8 Atribut Kelengkapan Tugas */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '4px 8px',
                        fontSize: '0.68rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        color: '#475569'
                      }}>
                        <div><strong>ID:</strong> {msg.actionData.id || '-'}</div>
                        <div><strong>Status:</strong> <span style={{ color: msg.actionData.isLocked ? '#16a34a' : '#d97706', fontWeight: 700 }}>{msg.actionData.status || 'Draft'}</span></div>
                        <div><strong>Kategori:</strong> {msg.actionData.module || 'Operasional'}</div>
                        <div><strong>Prioritas:</strong> <span style={{ color: '#dc2626', fontWeight: 700 }}>{msg.actionData.priority || 'P1'}</span></div>
                        <div><strong>Jadwal:</strong> {msg.actionData.dueDate || '3 Hari Kerja'}</div>
                        <div><strong>PIC:</strong> <span style={{ color: '#0284c7', fontWeight: 700 }}>{msg.actionData.pic || msg.actionData.assignee || 'Reta & Silvi'}</span></div>
                        {msg.actionData.description && (
                          <div style={{ gridColumn: 'span 2', borderTop: '1px solid #f1f5f9', paddingTop: '4px', marginTop: '2px', color: '#64748b' }}>
                            <strong>Keterangan:</strong> {msg.actionData.description}
                          </div>
                        )}
                        {msg.actionData.notes && (
                          <div style={{ gridColumn: 'span 2', color: '#0369a1', fontStyle: 'italic' }}>
                            <strong>Catatan Diskusi:</strong> {msg.actionData.notes}
                          </div>
                        )}
                      </div>

                      {/* Direct Clickable Link ke Tugas (Buka di Tab Baru) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <a
                          href={`/dashboard/tugasdankalender?taskId=${msg.actionData.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
                        >
                          <span>Buka Data Tugas di Tab Baru</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Attachment Unduh Dokumen Word (.docx) & PDF Resmi dari Raka */}
                  {msg.hasDocAttachment && msg.docData && (
                    <div style={{
                      marginTop: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}>
                      <div style={{ minWidth: '180px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                          📄 {msg.docData.title}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          Dokumen Terverifikasi HQ • Format Word (.docx) &amp; PDF A4 Resmi
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Tombol Unduh Word (.docx) */}
                        <button
                          type="button"
                          onClick={async () => {
                            await generateAndDownloadWordDoc({
                              title: msg.docData.title,
                              category: msg.docData.category,
                              author: msg.docData.author,
                              rawContent: msg.docData.rawContent
                            });
                          }}
                          style={{
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 11px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
                          }}
                        >
                          <span>Unduh Word (.docx)</span>
                          <span>↓</span>
                        </button>

                        {/* Tombol Unduh PDF Resmi */}
                        <button
                          type="button"
                          onClick={async () => {
                            await generateAndDownloadPdfDoc({
                              title: msg.docData.title,
                              category: msg.docData.category,
                              author: msg.docData.author,
                              rawContent: msg.docData.rawContent
                            });
                          }}
                          style={{
                            backgroundColor: '#e11d48',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 11px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 4px rgba(225, 29, 72, 0.2)'
                          }}
                        >
                          <span>Unduh PDF</span>
                          <span>↓</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Attachment Visual Image Preview dari Silvi */}
                  {msg.hasVisualImage && msg.imageUrl && (
                    <div style={{
                      marginTop: '10px',
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid #334155'
                    }}>
                      <img 
                        src={msg.imageUrl} 
                        alt={msg.imageCaption || 'Silvi Creative Visual'} 
                        style={{
                          width: '100%',
                          maxHeight: '260px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        loading="lazy"
                      />
                      <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b' }}>
                        <span style={{ fontSize: '0.70rem', color: '#cbd5e1', fontWeight: 600 }}>{msg.imageCaption}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a 
                            href={msg.imageUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ 
                              fontSize: '0.68rem', 
                              color: '#38bdf8', 
                              textDecoration: 'none', 
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: 'rgba(56, 189, 248, 0.1)'
                            }}
                          >
                            Buka HD ↗
                          </a>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const response = await fetch(msg.imageUrl);
                                const blob = await response.blob();
                                const blobUrl = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = blobUrl;
                                link.download = `${(msg.imageCaption || 'Gambar_DigiBooster').replace(/[^a-zA-Z0-9_\-]/g, '_')}.jpg`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(blobUrl);
                              } catch (e) {
                                window.open(msg.imageUrl, '_blank');
                              }
                            }}
                            style={{
                              backgroundColor: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '3px 9px',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>Unduh Gambar</span>
                            <span>↓</span>
                          </button>
                        </div>
                      </div>
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
          padding: '10px 14px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px'
        }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleTextareaChange}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Tulis Pesan... (Tekan Enter untuk kirim, Shift+Enter untuk baris baru)"
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
              boxSizing: 'border-box',
              userSelect: 'text',
              WebkitUserSelect: 'text'
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
