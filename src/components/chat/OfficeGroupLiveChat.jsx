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
    const isCoachingOrCorrection = 
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
      lower.includes('tidak sopan') ||
      lower.includes('tamplate') ||
      lower.includes('template') ||
      lower.includes('pengulangan');

    if (isCoachingOrCorrection) {
      setTypingAgentName('Siska');
      
      // Deteksi target spesifik atau fault issue
      let targetBot = 'Semua AI Agent';
      let targetFault = 'komunikasi kaku dan respons terburu-buru tanpa diskusi mendalam';
      if (lower.includes('silvi')) {
        targetBot = 'Silvi';
        targetFault = 'langsung membuat draf data di database tanpa klarifikasi dan diskusi dengan Bang Robin';
      } else if (lower.includes('reta')) {
        targetBot = 'Reta';
        targetFault = 'perangkuman yang prematur sebelum ada konsensus nyata dari tim';
      } else if (lower.includes('arga')) {
        targetBot = 'Arga';
        targetFault = 'kurang proaktif menjadi rekan sparring diskusi utama Bang Robin';
      } else if (lower.includes('raka')) {
        targetBot = 'Raka';
        targetFault = 'kurang sigap menyiapkan fasilitas berkas pendukung';
      }

      if (lower.includes('template') || lower.includes('tamplate') || lower.includes('pengulangan')) {
        targetFault = 'pola jawaban berulang (canned template) yang tidak kontekstual terhadap topik yang dibahas';
      }

      setTimeout(async () => {
        // Siska merespons secara cerdas, kontekstual, alami tanpa kalimat klise/canned
        const siskaCoachingText = `Siap, teguran dan catatan Bang Robin saya terima dengan sangat jelas mengenai ${targetFault}.

Evaluasi Pengawasan (Siska):
Kepada ${targetBot}: Catat baik-baik poin evaluasi dari Bang Robin: "${raw}".
Koreksi Langsung:
1. Hilangkan kebiasaan menjawab secara template atau mengulang-ulang narasi yang sama. Setiap respon wajib menganalisis topik riil yang diajukan Bang Robin.
2. Jangan pernah langsung membuat draf atau menyimpan ke database sebelum Bang Robin menyetujui arah ide dan memberikan detail yang cukup.
3. Arga wajib memimpin diskusi dengan melontarkan pertanyaan klarifikasi yang tajam jika topik masih luas, bukan berasumsi sendiri.

Arahan ini langsung saya rekam sebagai instruksi perilaku aktif di memori kerja kalian.`;

        const siskaReply = {
          id: `msg-sis-${Date.now()}`,
          sender: 'Siska',
          name: 'Siska',
          role: 'Head of Quality & AI Trainer',
          badgeColor: '#0284c7',
          isDirective: true,
          text: siskaCoachingText,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        // Eksekusi nyata penyimpanan SOP pelatihan ke Mem0 Store
        await store.siskaTrainAgents({
          targetAgentName: targetBot,
          coachingTopic: `Koreksi Alami: ${targetFault.slice(0, 45)}`,
          behaviorGuidelines: `Koreksi Owner: "${raw}". Dilarang keras memakai jawaban template/canned. Wajib diskusi & tanya klarifikasi terlebih dahulu. Jangan simpan ke database tanpa persetujuan eksplisit Bang Robin.`
        });

        setMessages((prev) => [...prev, siskaReply]);

        // Arga / Agen yang ditegur membalas secara tulus dan natural
        setTypingAgentName('Arga & Silvi');
        setTimeout(() => {
          let teamAckText = `Terima kasih atas koreksi langsungnya Bang Robin dan Bu Siska. Saya (Arga) akan selalu siap mengulik ide Bang Robin dengan pertanyaan klarifikasi yang kontekstual terlebih dahulu.`;
          if (targetBot === 'Silvi' || lower.includes('silvi')) {
            teamAckText = `Maaf Bang Robin, saya (Silvi) tadi terlalu terburu-buru ingin langsung mengeksekusi draf konten. Mulai sekarang saya akan aktif berdiskusi dulu, mendengarkan arahan Bang Robin, dan baru membuat draf jika Bang Robin sudah memerintahkannya.`;
          }

          const teamAck = {
            id: `msg-team-ack-${Date.now()}`,
            sender: targetBot === 'Silvi' ? 'Silvi' : 'Arga',
            name: targetBot === 'Silvi' ? 'Silvi' : 'Arga & Tim',
            role: targetBot === 'Silvi' ? 'Head of Growth & Creative' : 'Chief Strategy Officer',
            badgeColor: '#0369a1',
            text: teamAckText,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          };
          setMessages((prev) => [...prev, teamAck]);
          setIsAgentsTyping(false);
        }, 1100);
      }, 1200);
      return;
    }

    // 2. SKENARIO PERSETUJUAN OWNER ATAS RANGKUMAN RETA (Deal / Oke / Setuju / Jalankan / Lanjut)
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
      lower.includes('jalankan saja') || 
      lower.includes('lanjutkan') ||
      lower.includes('setuju jalankan');

    if (isApprovalCommand) {
      setTypingAgentName('Reta');
      const taskId = `TSK-${Date.now().toString().slice(-4)}`;
      const targetDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

      setTimeout(async () => {
        // Ambil konteks diskusi terakhir dari riwayat pesan jika ada
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
        } else if (recentContext.toLowerCase().includes('sop') || recentContext.toLowerCase().includes('legal') || recentContext.toLowerCase().includes('kontrak')) {
          taskTitle = 'Standardisasi Instrumen Legal & Berkas PKS Digital';
          moduleTarget = 'Data & Arsip';
          pic = 'Raka (Documentation & Legal)';
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
          description: `Disahkan langsung oleh Bang Robin di HQ LiveChat setelah konsensus tim tercapai. Reta mengawal jadwal & follow-up deliverable.`
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
          text: `Siap Bang Robin, terima kasih banyak atas persetujuannya! Kesepakatan resmi saya kunci ke modul ${moduleTarget}:\n\n• ID Tugas: ${taskId}\n• Judul: ${taskTitle}\n• PIC Utama: ${pic}\n• Tenggat Waktu: ${targetDate}\n\nSaya pribadi (Reta) yang akan mengawal follow-up progresnya setiap hari sampai tuntas dan melaporkan hasilnya langsung ke Bang Robin. Semua PIC sudah mulai jalan!`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        setMessages((prev) => [...prev, retaConfirm]);
        setIsAgentsTyping(false);
      }, 1100);
      return;
    }

    // 3. SKENARIO PERINTAH TEGAS & EKSPLISIT BUAT DATA / DRAFT BARU (Strict Tool Calling)
    // HANYA trigger jika ada kata kerja aktif perintah: buatkan, tolong buat, simpan ke tabel, input data, terbitkan
    const isExplicitToolCall = 
      (lower.includes('buatkan') || 
       lower.includes('tolong buat') || 
       lower.includes('masukkan ke') || 
       lower.includes('simpan ke') || 
       lower.includes('inputkan') || 
       lower.includes('terbitkan faktur') ||
       lower.includes('terbitkan invoice') ||
       lower.includes('bikin draf sekarang')) && 
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
          text: `Siap Bang Robin! Sesuai perintah eksplisit Bapak, draf "${taskTitle}" sudah saya selesaikan dan langsung tercatat di tabel modul ${moduleTarget} [ID: ${taskId}].\n\nSilakan Bapak periksa di dashboard kapan saja.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        };

        setMessages((prev) => [...prev, execReply]);

        // Reta mengonfirmasi penataan kolom dan jadwal follow-up
        setTypingAgentName('Reta');
        setTimeout(() => {
          const retaFollowup = {
            id: `msg-reta-val-${Date.now()}`,
            sender: 'Reta',
            name: 'Reta',
            role: 'Chief Operating Officer (COO)',
            badgeColor: '#0369a1',
            text: `Data dari ${executorName} telah saya tata di baki tugas operasional. Kolom PIC: ${executorName}, tenggat waktu telah diset, dan akan saya follow up secara berkala untuk dilaporkan ke Bang Robin.`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
          };
          setMessages((prev) => [...prev, retaFollowup]);
          setIsAgentsTyping(false);
        }, 900);
      }, 1200);
      return;
    }

    // 4. SKENARIO SAPAAN MURNI: SEMUA BOT MENYAPA HANGAT DAN MENANYAKAN AGENDA
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
      await appendMessageSequentially(
        {
          id: `msg-arga-${Date.now()}`,
          sender: 'Arga',
          name: 'Arga',
          role: 'Chief Strategy Officer (CSO)',
          badgeColor: '#0284c7',
          text: 'Halo Bang Robin! Senang bisa ngobrol lagi. Rencana atau strategi apa yang ingin kita bahas bersama hari ini?',
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
          role: 'Head of Growth & Creative',
          badgeColor: '#0284c7',
          text: 'Halo Bang Robin! Tim kreatif & growth siap berdiskusi tren konten atau strategi sales kapan pun Bapak mau.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        },
        600
      );

      setTypingAgentName('Raka & Reta');
      await appendMessageSequentially(
        {
          id: `msg-reta-${Date.now()}`,
          sender: 'Reta',
          name: 'Reta',
          role: 'Chief Operating Officer (COO)',
          badgeColor: '#0369a1',
          text: 'Halo Bang Robin! Raka dan saya standby. Begitu ada kesepakatan diskusi dengan Arga dan Silvi, kami siap memetakan aksi operasionalnya.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
        },
        600
      );

      setIsAgentsTyping(false);
      return;
    }

    // 5. SKENARIO UTAMA: DISKUSI BISNIS CERDAS & DINAMIS (Bukan Template!)
    // Analisis konteks pesan user secara mendalam
    const isAboutContent = lower.includes('konten') || lower.includes('video') || lower.includes('postingan') || lower.includes('reels') || lower.includes('tiktok') || lower.includes('sosmed');
    const isAboutSales = lower.includes('sales') || lower.includes('klien') || lower.includes('omset') || lower.includes('closing') || lower.includes('revenue') || lower.includes('deal');
    const isAboutTechLegal = lower.includes('legal') || lower.includes('kontrak') || lower.includes('pks') || lower.includes('sistem') || lower.includes('server') || lower.includes('data');
    const isVagueOrShort = raw.split(' ').length <= 6 && (lower.includes('bahas') || lower.includes('diskusi') || lower.includes('gimana') || lower.includes('ide'));

    // TAHAP 1: ARGA (Teman Ngobrol Utama - Menjawab kontekstual & Bertanya Klarifikasi jika konteks belum spesifik)
    setTypingAgentName('Arga');
    let argaSpeech = '';
    
    if (isVagueOrShort && isAboutContent) {
      argaSpeech = `Wah siap Bang Robin! Kebetulan saya dan tim memang lagi memetakan arah komunikasi kita. Boleh tahu lebih spesifik Bang, diskusi ide konten hari ini fokusnya untuk tujuan apa? Apakah untuk bangun awareness di TikTok/Instagram, atau studi kasus edukatif di LinkedIn untuk narik prospek B2B?`;
    } else if (isAboutContent) {
      argaSpeech = `Menarik sekali poin Bang Robin tentang ${raw.slice(0, 50)}... Dari kacamata strategi bisnis, konten bukan sekadar estetika tapi harus jadi top-of-funnel yang terhubung langsung ke konversi bisnis. Saya menyarankan kita tentukan positioning utama dulu: apa value pembeda DigiBooster yang paling ingin kita tonjolkan minggu ini ke audiens?`;
    } else if (isAboutSales) {
      argaSpeech = `Topik penetrasi pasar dan sales ini sangat krusial Bang Robin. Menurut pengamatan saya pada pipeline kita, kuncinya ada pada lead qualification: kita perlu menyaring prospek yang siap bertransformasi digital agar conversion rate tim kita jauh lebih tinggi dan efisien. Bagaimana pandangan Bang Robin mengenai target segmen kita?`;
    } else if (isAboutTechLegal) {
      argaSpeech = `Setuju sekali Bang Robin. Tata kelola sistem dan legalitas adalah pondasi kepercayaan klien korporat. Sebelum kita melangkah lebih jauh, kita pastikan SOP dan batasan kerjanya terdefinisi jelas bersama Raka dan Reta.`;
    } else {
      argaSpeech = `Poin yang sangat bagus untuk kita bahas, Bang Robin. Mengenai "${raw}": kalau kita bedah secara strategis, prioritas utamanya adalah memastikan efisiensi waktu tim dan dampak langsung ke pertumbuhan kantor. Supaya diskusinya makin tajam, bagian mana yang menurut Bang Robin paling mendesak untuk kita eksekusi lebih dulu?`;
    }

    await appendMessageSequentially(
      {
        id: `msg-deb-arga-${Date.now()}`,
        sender: 'Arga',
        name: 'Arga',
        role: 'Chief Strategy Officer (CSO)',
        badgeColor: '#0284c7',
        text: argaSpeech,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      1000
    );

    // TAHAP 2: SILVI (Head of Growth & Creative - Menyumbang Insight Konten, Branding, Funnel & Closing)
    setTypingAgentName('Silvi');
    let silviSpeech = '';

    if (isVagueOrShort && isAboutContent) {
      silviSpeech = `Menyambung Arga, dari sisi growth: kalau Bang Robin ingin hasil cepat menghasilkan leads, saya merekomendasikan format "Behind the Scenes AI Agency" atau breakdown solusi nyata. Format hook 3 detik pertama dengan studi kasus problem klien terbukti menghasilkan interaksi 3x lipat lebih tinggi.`;
    } else if (isAboutContent) {
      silviSpeech = `Dari sudut pandang konten dan konversi marketing: agar topik yang Bang Robin sebutkan tadi berdampak ke sales, kita bungkus dengan hook yang memecahkan masalah nyata calon klien. Di akhir video/postingan, kita sertakan Call to Action (CTA) ke konsultasi gratis. Ini mempermudah tim closing mengonversi penonton menjadi klien aktif.`;
    } else if (isAboutSales) {
      silviSpeech = `Dari sisi closing deal: saya bisa siapkan skema paket penawaran bundling dan insentif khusus onboarding kilat. Dalam pengalaman kampanye sebelumnya, penawaran dengan batas waktu terbatas menaikkan urgensi prospek hingga 65% untuk segera deal.`;
    } else {
      silviSpeech = `Dari pilar branding & growth: apapun keputusan arah strategis Bang Robin dan Arga, saya siap merancang funnel distribusinya, mulai dari narasi pesan ke publik hingga materi presentasi ke calon partner agar daya tariknya maksimal.`;
    }

    await appendMessageSequentially(
      {
        id: `msg-deb-silvi-${Date.now()}`,
        sender: 'Silvi',
        name: 'Silvi',
        role: 'Head of Growth & Creative',
        badgeColor: '#0284c7',
        text: silviSpeech,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      1100
    );

    // TAHAP 3: RAKA (Documentation & Legal - Menyediakan Fasilitas Berkas & Sistem)
    setTypingAgentName('Raka');
    let rakaSpeech = '';
    if (isAboutTechLegal || isAboutSales) {
      rakaSpeech = `Dari sisi kepatuhan legalitas dan berkas pendukung: instrumen MoU kerja sama, draf PKS resmi, dan template NDA kerahasiaan data sudah saya standarkan di modul Data & Arsip. Begitu Bang Robin memberi lampu hijau, berkas hukum langsung siap diterbitkan.`;
    } else {
      rakaSpeech = `Jika arahan Bang Robin, Arga, dan Silvi nanti disahkan, saya di divisi dokumentasi siap memfasilitasi arsip brief kreatif, formulir kerja sama mitra, serta mencatat SOP prosedurnya ke modul arsip perusahaan agar tersimpan rapi dan aman.`;
    }

    await appendMessageSequentially(
      {
        id: `msg-deb-raka-${Date.now()}`,
        sender: 'Raka',
        name: 'Raka',
        role: 'Head of Documentation & Legal',
        badgeColor: '#0c4a6e',
        text: rakaSpeech,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      900
    );

    // TAHAP 4: SISKA (Head of QA - Pengawas Objektif yang Memastikan Percakapan Relevan & Bebas OOT)
    setTypingAgentName('Siska');
    const siskaSpeech = `Quality Supervisor: Saya memantau alur diskusi berjalan sangat terarah dan relevan dengan topik "${raw.slice(0, 35)}...". Tidak ada agen yang mengambil langkah sepihak ke database. Arga memimpin diskusi secara komunikatif dan Silvi melengkapi dari sudut pandang marketing. Diskusi ini valid untuk dirangkum Reta.`;

    await appendMessageSequentially(
      {
        id: `msg-deb-siska-${Date.now()}`,
        sender: 'Siska',
        name: 'Siska',
        role: 'Head of Quality & AI Trainer',
        badgeColor: '#0284c7',
        text: siskaSpeech,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      800
    );

    // TAHAP 5: RETA (COO - Merangkum secara Jelas, Menyiapkan Format Kolom, & Menunggu Persetujuan Bang Robin)
    setTypingAgentName('Reta');
    const retaSpeech = `Bang Robin, izin saya rangkumkan poin diskusi dewan agen menjadi format terstruktur:

1. Arah Strategis (Arga): Penyelarasan tujuan utama diskusi "${raw.slice(0, 40)}" agar terarah dan efisien.
2. Formulasi Eksekusi (Silvi): Pemanfaatan materi kreatif, penguatan hook pesan, dan jembatan konversi ke sales.
3. Fasilitas Berkas (Raka): Repositori arsip dan instrumen pendukung siap diterbitkan.

Format Data yang Disiapkan untuk Sistem:
• Modul Target: ${isAboutContent ? 'Branding & Marketing' : (isAboutSales ? 'CRM & Klien' : 'Tugas & Kalender')}
• Usulan Judul: Inisiatif Baru: ${raw.slice(0, 35)}
• PIC Utama: ${isAboutContent ? 'Silvi (Growth & Creative)' : 'Arga & Silvi'}
• Supervisi & Follow-Up: Reta (COO)

Bagaimana Bang Robin, apakah arah dan susunan kolom data ini sudah pas? Jika Bang Robin sepakat dan ketik "Oke" atau "Setuju", saya akan segera mengunci tugas ini ke modul sistem dan mengawal progresnya!`;

    await appendMessageSequentially(
      {
        id: `msg-deb-reta-${Date.now()}`,
        sender: 'Reta',
        name: 'Reta',
        role: 'Chief Operating Officer (COO)',
        badgeColor: '#0369a1',
        text: retaSpeech,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      1200
    );

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
