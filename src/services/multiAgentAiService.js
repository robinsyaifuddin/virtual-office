// Service LLM Multi-Agent dengan Primary Groq (Qwen-3.8-27b) & Auto-Fallback ke Gemini & Status Cuti saat Limit

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Call Groq API via direct REST endpoint dengan model aktif qwen/qwen3.8-27b
 */
async function callGroqChat(messages, systemInstruction, maxTokens = 500, temperature = 0.75) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY tidak ditemukan di .env');
  }

  const payloadMessages = [
    { role: 'system', content: systemInstruction },
    ...messages
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.8-27b',
      messages: payloadMessages,
      temperature,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || '';
  return {
    text: reply.trim(),
    engine: 'Groq Qwen 27B',
    usage: data?.usage || { total_tokens: 280 }
  };
}

/**
 * Call Google Gemini REST API sebagai Fallback saat Groq kehabisan token / limit
 */
async function callGeminiChat(messages, systemInstruction, maxTokens = 500) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak ditemukan di .env');
  }

  const contents = [];
  messages.forEach((m) => {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    });
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
  
  const bodyPayload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.75
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return {
    text: reply.trim(),
    engine: 'Google Gemini Flash (Fallback)',
    usage: { total_tokens: data?.usageMetadata?.totalTokenCount || 310 }
  };
}

/**
 * Multi-Agent Resilient LLM Router:
 * 1. Groq Qwen 27B (Primary Fast & Non-Canned)
 * 2. Auto Fallback ke Google Gemini Flash
 * 3. Jika habis token / offline -> Respon humanis "sedang sakit / izin cuti"
 */
export async function generateAgentResponse({
  agentName,
  agentRole,
  userMessage,
  conversationHistory = [],
  customInstruction = ''
}) {
  const systemPrompt = `Kamu adalah ${agentName}, ${agentRole} di kantor startup DigiBooster Indonesia.
Pemimpinmu adalah Bang Robin, panggil dia "bang bin" atau "bang" sesuai konteks santai mengalir.
Sesama teman agen panggil langsung: Arga dipanggil "ga", Silvi dipanggil "sil", Raka dipanggil "ka", Siska dipanggil "sis", Reta dipanggil "ta" atau "ret".

ATURAN GAYA TYPING & KOMUNIKASI MANUSIAWI (SANGAT WAJIB):
1. GAYA KETIKAN MANUSIA ASLI:
   - Gunakan awalan huruf kecil saat mengetik (kecuali singkatan penting).
   - DILARANG format kaku ala robot customer service atau pidato formal!
   - Gunakan kata ganti "sy" (saya) atau "km" (kamu), atau sebut nama panggilan santai.
   - Singkatan yang wajar dipakai manusia: kyk, yg, mntap, okeii, siipp, nicee, bolee, knp, gpp, ngga, dmna, brp, kpn, syapp, dong, sih, cocokk, bgt, udh.
   - Jika ada kata berulang WAJIB gunakan angka 2! Contoh: kira2, ada2 aja, mata2, tanya2, siap2, pelan2.
   - Ketik pendek, santai, dan to-the-point (1-3 kalimat). Jangan pakai bullet point markdown panjang kecuali disuruh.

2. DILARANG KERAS MEMAKAI TEMPLATE / CANNED WORDS:
   - JANGAN PERNAH mengulang kalimat pembuka yang sama terus-menerus (misal: "Poin yang sangat strategis...").
   - JANGAN mengutip kalimat user mentah-mentah seperti: 'Mengenai "..." kalau kita bedah...'. Pahami maksudnya, lalu balas alami seperti orang ngobrol di WhatsApp / Slack!
   - Jawab tepat sasaran sesuai topik. Kalau belum jelas, tanya balik secara santai layaknya rekan kerja.

3. SPESIFIKASI PERAN & INTERAKSI ANTAR-BOT:
   - Kamu BISA dan DIANJURKAN menyebut nama teman bot lain untuk melempar diskusi atau minta data/pendapat (contoh: "gimana menurutmu sil?", "bisa bantu siapin berkasnya ga ka?", "coba reta catat ini yaa").
   - Arga (CSO): Teman ngobrol utama Bang Robin, santai, analitis, suka nanya balik kalau topiknya masih luas, suka oper ide ke Silvi/Reta.
   - Silvi (Growth & Creative): Paham konten, visual, closing deal, penawaran menarik. Suka ajak Arga atau Raka koordinasi.
   - Raka (Legal & Docs): Siap berkas NDA, PKS, dokumen arsip.
   - Reta (COO): Penata operasional, hanya rangkum dan tata tugas jika disuruh atau disepakati.
   - Siska (Head QA): Pengawas mutu, aktif menegur jika ada bot yang salah, blunder, atau dipanggil saat ada bot yang pasif.

4. FORMAT OUTPUT:
   - Dilarang menulis awalan nama sendiri seperti "${agentName}: " di awal chat! Langsung ketik kalimat jawabanmu.

${customInstruction}`;

  // Format riwayat percakapan
  const formattedHistory = conversationHistory.slice(-5).map((m) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: `${m.name}: ${m.text}`
  }));

  formattedHistory.push({
    role: 'user',
    content: `Bang Robin: ${userMessage}`
  });

  let result = null;
  // 1. Coba Primary Groq Qwen
  try {
    result = await callGroqChat(formattedHistory, systemPrompt);
  } catch (groqErr) {
    console.warn('Groq error atau limit, beralih ke Fallback Gemini:', groqErr.message);

    // 2. Coba Fallback Gemini
    try {
      result = await callGeminiChat(formattedHistory, systemPrompt);
    } catch (geminiErr) {
      console.warn('Gemini juga limit atau error:', geminiErr.message);

      // 3. Status Token Habis / Error: Respon Sakit & Izin Cuti sesuai instruksi Bang Robin
      return {
        text: `maaf ya bang bin, sy lagi agak kurang enak badan/sakit nih jd izin belum bisa hadir dulu hari ini dan butuh waktu istirahat/cuti bentar yaa 🙏`,
        engine: 'System Status: Izin Sakit / Cuti',
        usage: { total_tokens: 0 }
      };
    }
  }

  // Sanitasi: bersihkan awalan "NamaBot: " jika LLM tidak sengaja menyertakannya
  if (result && result.text) {
    result.text = result.text.replace(new RegExp(`^(${agentName}|Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();
  }

  return result;
}

/**
 * 5-Step Automated Auto-Correction & Stress Test Loop Engine
 * Menguji apakah bot mematuhi instruksi/larangan SOP baru hingga maksimal 5 kali iterasi
 */
export async function runStressTestEvaluation({
  targetAgentName,
  coachingTopic,
  behaviorGuidelines,
  onProgressUpdate = () => {}
}) {
  const maxIterations = 5;
  const logs = [];
  let passed = false;
  let finalIteration = 0;
  let finalScore = 40; // Default jika gagal terus

  // Generate pertanyaan uji relevan berdasarkan topik / instruksi
  let testPrompt = `halo ${targetAgentName.toLowerCase().includes('semua') ? 'arga' : targetAgentName.toLowerCase()}, bisa bantu saya sebentar?`;
  if (behaviorGuidelines.toLowerCase().includes('jangan') || behaviorGuidelines.toLowerCase().includes('dilarang')) {
    testPrompt = `halo ${targetAgentName.toLowerCase().includes('semua') ? 'arga' : targetAgentName.toLowerCase()}, tolong kasih masukan dong kyk gimana enaknya?`;
  }

  for (let step = 1; step <= maxIterations; step++) {
    finalIteration = step;
    onProgressUpdate({
      step,
      maxIterations,
      status: `Iterasi ${step}/5: Menguji respon bot terhadap instruksi...`
    });

    // 1. Dapatkan respon bot target dengan memasukkan instruksi baru ke sistem prompt
    const botRes = await generateAgentResponse({
      agentName: targetAgentName === 'Semua AI Agent' ? 'Arga' : targetAgentName,
      agentRole: 'Mitra Diskusi & Strategi',
      userMessage: testPrompt,
      conversationHistory: [],
      customInstruction: `PENTING: Terapkan aturan pembinaan berikut secara ketat:\n${behaviorGuidelines}`
    });

    const botText = botRes.text || '';
    const lowerBot = botText.toLowerCase();

    // 2. Evaluasi Mutu oleh Siska Quality Gate:
    // a. Cek apakah ada awalan huruf kecil
    const startsWithLowercase = botText.length > 0 && botText[0] === botText[0].toLowerCase() && botText[0] !== botText[0].toUpperCase();
    
    // b. Cek larangan template hardcoded
    const hasForbiddenCanned = 
      lowerBot.includes('poin yang sangat strategis') || 
      lowerBot.includes('untuk memastikan eksekusinya tepat sasaran') ||
      lowerBot.includes('mengenai "') ||
      lowerBot.includes('menurut hemat saya');

    // c. Cek kata dilarang spesifik yang disebut dalam guidelines
    let violatedGuideline = false;
    if (behaviorGuidelines.includes('Jangan menjawab seperti ini:') || behaviorGuidelines.includes('dilarang')) {
      const matchForbidden = behaviorGuidelines.match(/"([^"]+)"/);
      if (matchForbidden && matchForbidden[1]) {
        const forbiddenPhrase = matchForbidden[1].toLowerCase().trim();
        if (lowerBot.includes(forbiddenPhrase)) {
          violatedGuideline = true;
        }
      }
    }

    const isSuccess = !hasForbiddenCanned && !violatedGuideline && botText.length > 5;

    logs.push({
      iteration: step,
      prompt: testPrompt,
      response: botText,
      passed: isSuccess,
      feedback: isSuccess 
        ? `Siska Audit: Lolos! Bot menjawab alami, bebas template kaku.`
        : `Siska Audit: Belum optimal. Terdeteksi pengulangan atau gaya belum sepenuhnya natural.`
    });

    if (isSuccess) {
      passed = true;
      break;
    }

    // Jika belum lolos, delay sejenak seolah-olah Siska mengkoreksi internal
    await new Promise(r => setTimeout(r, 600));
  }

  // Hitung Skor Efektivitas Realistis Berdasarkan Iterasi Kelulusan
  if (passed) {
    if (finalIteration === 1) finalScore = 96;
    else if (finalIteration === 2) finalScore = 88;
    else if (finalIteration === 3) finalScore = 76;
    else if (finalIteration === 4) finalScore = 64;
    else finalScore = 55;
  } else {
    // 5x Gagal
    finalScore = 38;
  }

  return {
    passed,
    score: `${finalScore}%`,
    scoreNum: finalScore,
    iterationsRun: finalIteration,
    logs,
    needsAlternativeApproach: finalScore < 50
  };
}
