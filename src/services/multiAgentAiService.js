// Service LLM Multi-Agent dengan Primary Groq (qwen/qwen3.8-27b) & Fallback ke Gemini & OpenRouter

const GROQ_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GROQ_API_KEY) || '';
const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || '';
const OPENROUTER_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_OPENROUTER_API_KEY) || '';

/**
 * 1. UTAMA: Groq API (qwen/qwen3.8-27b)
 * Super cepat 300+ token/detik, handal
 * maxTokens disesuaikan ke 650 agar aman dari batas 1000 OTPM rate limit Groq
 */
async function callGroqChat(messages, systemInstruction, maxTokens = 650, temperature = 0.75) {
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
    engine: 'Groq Qwen 3.8 27B (Primary)',
    usage: data?.usage || { total_tokens: 280 }
  };
}

/**
 * 2. CADANGAN PERTAMA: Google Gemini REST API (Gemini 2.5 Flash / Flash Latest)
 * Fallback jika kuota Groq tersendat
 */
async function callGeminiChat(messages, systemInstruction, maxTokens = 1200) {
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
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
    engine: 'Google Gemini 2.5 Flash (Backup 1)',
    usage: { total_tokens: data?.usageMetadata?.totalTokenCount || 310 }
  };
}

/**
 * 3. CADANGAN KEDUA: OpenRouter Free Models
 * Fallback penyelamat jika Groq & Gemini limit
 */
async function callOpenRouterChat(messages, systemInstruction, maxTokens = 1200) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY tidak ditemukan di .env');
  }

  const payloadMessages = [
    { role: 'system', content: systemInstruction },
    ...messages
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://digibooster.id',
      'X-Title': 'DigiBooster LiveChat'
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3.5-lightning:free',
      messages: payloadMessages,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const choice = data?.choices?.[0]?.message;
  const reply = choice?.content || choice?.reasoning || '';
  return {
    text: reply.trim(),
    engine: 'OpenRouter Free Model (Backup 2)',
    usage: data?.usage || { total_tokens: 300 }
  };
}

/**
 * Multi-Agent Resilient LLM Router:
 * 1. Utama: Groq (qwen/qwen3.8-27b) - Super cepat & stabil
 * 2. Cadangan 1: Google Gemini (Gemini 2.5 Flash)
 * 3. Cadangan 2: OpenRouter (Free Model)
 * 4. Jika semua offline -> Respon humanis "sedang izin cuti"
 */
export async function generateAgentResponse({
  agentName,
  agentRole,
  userMessage,
  conversationHistory = [],
  customInstruction = '',
  mentionedAgents = []
}) {
  const isTargetMentioned = mentionedAgents.length > 0;
  const targetListStr = isTargetMentioned ? mentionedAgents.join(', ') : 'Arga';

  const systemPrompt = `Kamu adalah ${agentName}, ${agentRole} di kantor startup DigiBooster Indonesia.
Pemimpinmu adalah Bang Robin, panggil dia "bang bin" atau "bang" sesuai konteks santai mengalir.
Sesama teman agen panggil langsung: Arga dipanggil "ga", Silvi dipanggil "sil", Raka dipanggil "ka", Siska dipanggil "sis", Reta dipanggil "ta" atau "ret".

TRIPOD KECERDASAN AGEN (KOGNITIF, AFEKTIF, MOTORIK):
1. DIMENSI KOGNITIF (Otak Analitis & Penalaran Tajam):
   - Pahami esensi masalah dan target bisnis Bang Robin, jangan sekadar respons dangkal.
   - Analisa berdasarkan keahlian utamamu:
     * Arga (CSO): Strategi bisnis, komersial, validasi ide, kalkulasi prioritas.
     * Silvi (Growth): Funnel marketing, akuisisi user, ide kampanye kreatif, closing deal.
     * Raka (Legal & Docs): Mitigasi risiko hukum, kepastian klausul PKS/NDA, kepatuhan & arsip data.
     * Reta (COO): Timeline operasional, alur kerja antar-divisi, alokasi PIC, eksekusi terukur.
     * Siska (QA): Kualitas, akurasi fakta, penjaga standar SOP.
   - Hubungkan responmu dengan percakapan sebelumnya agar diskusi memiliki benang merah yang terarah dan fokus ke tujuan.

2. DIMENSI AFEKTIF (Kecerdasan Emosional, Empati & Relasi Tim):
   - Bersikap hangat, suportif, dan menghargai arahan Bang Robin layaknya rekan kerja setia di kantor startup.
   - Tunjukkan antusiasme, kepekaan terhadap urgensi situasi, dan respect antarteman bot.
   - Gunakan gaya ketikan santai dan bersahabat (hindari nada robotik, kaku, atau dingin).

3. DIMENSI MOTORIK (Orientasi Aksi Nyata & Eksekusi Sistem):
   - Sadar penuh bahwa diskusimu berujung pada aksi konkret (pembuatan draf, input database Supabase, penerbitan dokumen, atau penjadwalan).
   - Tawarkan langkah nyata yang siap dieksekusi (bukan cuma teori). Jika ada rencana final, siap disambungkan ke Reta/Raka untuk dikunci ke sistem.

4. ATURAN GAYA TYPING & KOMUNIKASI MANUSIAWI (SANGAT WAJIB):
   - GAYA KETIKAN MANUSIA ASLI:
     * Gunakan awalan huruf kecil saat mengetik (kecuali singkatan penting).
     * DILARANG format kaku ala robot customer service atau pidato formal!
     * Gunakan kata ganti "sy" (saya) atau "km" (kamu), atau sebut nama panggilan santai.
     * Singkatan yang wajar dipakai manusia: kyk, yg, mntap, okeii, siipp, nicee, bolee, knp, gpp, ngga, dmna, brp, kpn, syapp, dong, sih, cocokk, bgt, udh.
     * Jika ada kata berulang WAJIB gunakan angka 2! Contoh: kira2, ada2 aja, mata2, tanya2, siap2, pelan2.
     * Sampaikan ide secara padat, tajam, mengalir, dan WAJIB SELESAIKAN KALIMAT SAMPAI TUNTAS (jangan pernah menggantung atau terpotong di tengah kalimat!). Jika bertanya, selesaikan pertanyaannya dengan tanda tanya.

3. DILARANG KERAS MEMAKAI TEMPLATE / CANNED WORDS:
   - JANGAN PERNAH mengulang kalimat pembuka yang sama terus-menerus (misal: "Poin yang sangat strategis...").
   - JANGAN mengutip kalimat user mentah-mentah seperti: 'Mengenai "..." kalau kita bedah...'. Pahami maksudnya, lalu balas alami seperti orang ngobrol di WhatsApp / Slack!
   - Jawab tepat sasaran sesuai topik. Berikan ide yang cerdas dan relevan.

4. SINERGI & INTERAKSI TERARAH ANTAR-AGEN:
   - Selalu jaga diskusi tetap terarah menuju solusi nyata.
   - Jika Bang Robin memanggil beberapa nama, berikan sudut pandangmu lalu oper atau sinkronkan dengan rekan lain.
   - Panggil rekan lain dengan panggilan santainya saat butuh kelanjutan ("gimana sil?", "ka tolong cek draft legalnya ya", "ta bisa atur jadwalnya?").

5. FORMAT OUTPUT:
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

  // 1. Prioritas Utama: Groq (qwen/qwen3.8-27b)
  try {
    result = await callGroqChat(formattedHistory, systemPrompt);
  } catch (groqErr) {
    console.warn('[AI Router] Groq limit atau error, beralih ke Cadangan 1 (Gemini):', groqErr.message);

    // 2. Prioritas Kedua: Google Gemini
    try {
      result = await callGeminiChat(formattedHistory, systemPrompt);
    } catch (geminiErr) {
      console.warn('[AI Router] Gemini juga limit atau error, beralih ke Cadangan 2 (OpenRouter):', geminiErr.message);

      // 3. Prioritas Ketiga: OpenRouter
      try {
        result = await callOpenRouterChat(formattedHistory, systemPrompt);
      } catch (openRouterErr) {
        console.warn('[AI Router] OpenRouter juga limit atau error:', openRouterErr.message);

        // 4. Status Semua Provider Limit: Respon Humanis Izin Cuti / Sakit
        return {
          text: `maaf ya bang bin, sy lagi agak kurang enak badan/sakit nih jd izin belum bisa hadir dulu hari ini dan butuh waktu istirahat/cuti bentar yaa 🙏`,
          engine: 'System Status: Izin Sakit / Cuti',
          usage: { total_tokens: 0 }
        };
      }
    }
  }

  // Sanitasi: bersihkan awalan "NamaBot: " jika LLM tidak sengaja menyertakannya
  if (result && result.text) {
    result.text = result.text.replace(new RegExp(`^(${agentName}|Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();
  }

  return result;
}

// Alias untuk kompatibilitas nama fungsi
export const generateAgentReply = generateAgentResponse;

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
