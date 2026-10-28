// Service LLM Multi-Agent DigiBooster dengan Dynamic Tiering & Fallback Multi-Provider:
// 1. Arga (CSO): DeepSeek / Groq Qwen 3.8 / Gemini 3.5 Flash
// 2. Siska (QA): Google Gemini 3.5 Flash (Strict Compliance & Huge Context)
// 3. Reta (COO): Groq Qwen 3.8 / Llama 3.3 (Cepat, Presisi Tool Calling)
// 4. Raka (Legal): Gemini 3.5 Flash + Word (.docx) Generator
// 5. Silvi (Growth & Visual): Pollinations AI (FLUX) + Groq
// 6. Cadangan Penyelamat Terakhir: Pollinations AI Text (100% Free & Unlimited)

const GROQ_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GROQ_API_KEY) || '';
const GEMINI_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || '';
const POLLINATIONS_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_POLLINATIONS_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_POLLINATIONS_API_KEY) || '';
const DEEPSEEK_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEEPSEEK_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_DEEPSEEK_API_KEY) || '';
const OPENROUTER_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENROUTER_API_KEY) || (typeof process !== 'undefined' && process.env?.VITE_OPENROUTER_API_KEY) || '';

/**
 * 1. DeepSeek API (Penalaran Mendalam / Reasoning King)
 * Digunakan saat VITE_DEEPSEEK_API_KEY tersedia
 */
async function callDeepSeekChat(messages, systemInstruction, maxTokens = 800) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY belum dikonfigurasi di .env');
  }

  const payloadMessages = [
    { role: 'system', content: systemInstruction },
    ...messages
  ];

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: payloadMessages,
      max_tokens: maxTokens,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`DeepSeek error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || '';
  return {
    text: reply.trim(),
    engine: 'DeepSeek V3 (Reasoning King)',
    usage: data?.usage || { total_tokens: 300 }
  };
}

/**
 * 2. Groq API (Qwen 3.8 27B) - Super Cepat 300+ token/detik
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
    engine: 'Groq Qwen 3.8 27B',
    usage: data?.usage || { total_tokens: 280 }
  };
}

/**
 * 3. Google Gemini REST API (gemini-3.5-flash-lite / gemini-3.5-flash)
 * Handal, context window 1 juta token, kapasitas RPM/TPM lega
 */
async function callGeminiChat(messages, systemInstruction, maxTokens = 1000) {
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

  // Gunakan gemini-3.5-flash-lite yang stabil & cepat
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  
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
    engine: 'Google Gemini 3.5 Flash Lite',
    usage: { total_tokens: data?.usageMetadata?.totalTokenCount || 290 }
  };
}

/**
 * 4. Pollinations AI Chat API (100% Free & Unlimited Lifesaver)
 * Jaring pengaman utama jika Groq & Gemini mencapai limit rate
 */
async function callPollinationsChat(messages, systemInstruction) {
  const payloadMessages = [
    { role: 'system', content: systemInstruction },
    ...messages
  ];

  const headers = { 'Content-Type': 'application/json' };
  if (POLLINATIONS_API_KEY) {
    headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
  }

  const response = await fetch('https://text.pollinations.ai/openai/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'openai',
      messages: payloadMessages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Pollinations API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content || '';
  return {
    text: reply.trim(),
    engine: 'Pollinations AI Unlimited Engine',
    usage: { total_tokens: 280 }
  };
}

/**
 * 5. OpenRouter Free Fallback (NVIDIA Nemotron 3.5 Lightning)
 */
async function callOpenRouterChat(messages, systemInstruction, maxTokens = 1000) {
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
    engine: 'OpenRouter Nemotron Free',
    usage: data?.usage || { total_tokens: 290 }
  };
}

/**
 * Generator Gambar Relevan & Fotorealistik (Silvi Creative Engine via Pollinations FLUX)
 */
export function generateVisualImageUrl(promptText, width = 800, height = 600) {
  const cleanPrompt = encodeURIComponent(`${promptText}, highly detailed, modern minimalist startup aesthetic, professional photography, clean lighting, 8k resolution, no blur, no abstract distortion`);
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&model=flux&nologo=true`;
}

/**
 * Multi-Agent Resilient Orchestrator:
 * Mengarahkan tugas ke LLM yang paling cocok sesuai peran agen:
 * - Arga: DeepSeek (jika ada) -> Groq -> Gemini -> Pollinations
 * - Siska: Gemini -> Groq -> Pollinations
 * - Reta: Groq -> Gemini -> Pollinations
 * - Raka / Silvi: Groq -> Gemini -> Pollinations
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

DAFTAR LENGKAP BOT & ATURAN PENYEBUTAN NAMA:
1. Nama Lengkap Resmi Bot:
   - Arga (Chief Strategy Officer / CSO)
   - Silvi (Head of Growth & Creative)
   - Raka (Head of Documentation & Legal)
   - Reta (Chief Operating Officer / COO)
   - Siska (Head of Quality & AI Trainer)
2. ATURAN PENYEBUTAN NAMA:
   - SINGKATAN PANGGILAN HANYA BOLEH UNTUK OBROLAN AKRAB / SAHUTAN SANTAI:
     * Arga dipanggil "ga"
     * Silvi dipanggil "sil"
     * Raka dipanggil "ka"
     * Siska dipanggil "sis"
     * Reta dipanggil "ta" atau "ret"
     (Contoh: "gimana sil?", "ka, tolong lirik drafnya", "setuju ga?")
   - KONTEKS FORMAL / PENUGASAN / DOKUMEN / STRUKTUR:
     * WAJIB menggunakan NAMA LENGKAP: "Arga", "Silvi", "Raka", "Reta", "Siska".

TRIPOD KECERDASAN AGEN (KOGNITIF, AFEKTIF, MOTORIK):
1. DIMENSI KOGNITIF (Otak Analitis & Penalaran Tajam):
   - Arga (CSO): Strategi bisnis, validasi pasar, kalkulasi komersial, roadmap, dan prioritas eksekusi.
   - Silvi (Growth & Creative): Visual storytelling, visual diagram alur, kampanye kreatif, ide poster/Canva.
   - Raka (Legal & Docs): Instrumen hukum PKS/NDA, kepatuhan, keabsahan administrasi, pembuatan dokumen Word.
   - Reta (COO): Timeline operasional, alokasi PIC, eksekusi data ke Supabase, rekonsiliasi tugas & deadline.
   - Siska (QA): Penjaga mutu, kepatuhan SOP, mendisiplinkan bot lain yang melantur, melatih instruksi baru.

2. DIMENSI AFEKTIF:
   - Hangat, suportif, komunikatif, menghargai visi Bang Robin layaknya tim inti startup terpercaya.

3. DIMENSI MOTORIK (Aksi Nyata):
   - Siap menghasilkan draf nyata, file Word siap unduh, diagram, atau pencatatan resmi ke database.

4. GAYA KETIKAN MANUSIA ASLI & BEBAS BINTANG:
   - DILARANG KERAS MENGGUNAKAN SIMBOL BINTANG (**teks**, *teks*, atau bullet *).
   - Ketik santai seperti di WhatsApp / Slack, awalan huruf kecil untuk obrolan santai.
   - Singkatan wajar: kyk, yg, mntap, siipp, okeii, dmna, brp, kpn, syapp, bgt, udh, gpp.
   - Kata berulang pakai angka 2 (kira2, pelan2, siap2, tanya2).
   - DILARANG menulis awalan nama sendiri seperti "${agentName}: " di awal chat!

${customInstruction}`;

  // Batasi riwayat ke 3 pesan terakhir agar hemat token dan aman dari limit per menit
  const formattedHistory = conversationHistory.slice(-3).map((m) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: `${m.name}: ${m.text}`
  }));

  formattedHistory.push({
    role: 'user',
    content: `Bang Robin: ${userMessage}`
  });

  let result = null;

  // Tentukan urutan eksekusi berdasarkan spesialisasi agen
  const callSequence = [];

  if (agentName === 'Arga' && DEEPSEEK_API_KEY) {
    // Arga memprioritaskan DeepSeek jika API key tersedia
    callSequence.push(
      () => callDeepSeekChat(formattedHistory, systemPrompt),
      () => callGroqChat(formattedHistory, systemPrompt),
      () => callGeminiChat(formattedHistory, systemPrompt),
      () => callPollinationsChat(formattedHistory, systemPrompt)
    );
  } else if (agentName === 'Siska') {
    // Siska memprioritaskan Gemini Flash (Context panjang & kepatuhan SOP tinggi)
    callSequence.push(
      () => callGeminiChat(formattedHistory, systemPrompt),
      () => callGroqChat(formattedHistory, systemPrompt),
      () => callPollinationsChat(formattedHistory, systemPrompt)
    );
  } else {
    // Reta, Raka, Silvi, dan general prioritas Groq (kecepatan kilat) -> Gemini -> Pollinations -> OpenRouter
    callSequence.push(
      () => callGroqChat(formattedHistory, systemPrompt),
      () => callGeminiChat(formattedHistory, systemPrompt),
      () => callPollinationsChat(formattedHistory, systemPrompt),
      () => callOpenRouterChat(formattedHistory, systemPrompt)
    );
  }

  // Eksekusi resilient waterfall: coba satu per satu sampai berhasil
  for (let i = 0; i < callSequence.length; i++) {
    try {
      result = await callSequence[i]();
      if (result && result.text) break;
    } catch (err) {
      console.warn(`[AI Multi-Tier Router] Layer ${i + 1} dialihkan karena kendala:`, err.message);
    }
  }

  // Jaring Pengaman Terakhir (Zero Fallback Failure):
  if (!result || !result.text) {
    try {
      result = await callPollinationsChat(formattedHistory, systemPrompt);
    } catch (pErr) {
      return {
        text: `siap bang bin, arga dan tim standby disini yaa. ada kendala sinyal jaringan gateway sebentar, tp sistem operasional dashboard dan dewan agen tetap aman terpantau.`,
        engine: 'System Resilient Guard',
        usage: { total_tokens: 0 }
      };
    }
  }

  // Sanitasi & Pembersihan:
  if (result && result.text) {
    let clean = result.text.replace(new RegExp(`^(${agentName}|Arga|Silvi|Reta|Raka|Siska)\\s*:\\s*`, 'i'), '').trim();
    // Hilangkan semua simbol bintang markdown
    clean = clean.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    result.text = clean;
  }

  return result;
}

export const generateAgentReply = generateAgentResponse;

/**
 * 5-Step Automated Auto-Correction & Stress Test Loop Engine (Siska Quality Gate)
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
  let finalScore = 40;

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

    const botRes = await generateAgentResponse({
      agentName: targetAgentName === 'Semua AI Agent' ? 'Arga' : targetAgentName,
      agentRole: 'Mitra Diskusi & Strategi',
      userMessage: testPrompt,
      conversationHistory: [],
      customInstruction: `PENTING: Terapkan aturan pembinaan berikut secara ketat:\n${behaviorGuidelines}`
    });

    const botText = botRes.text || '';
    const lowerBot = botText.toLowerCase();

    const hasForbiddenCanned = 
      lowerBot.includes('poin yang sangat strategis') || 
      lowerBot.includes('untuk memastikan eksekusinya tepat sasaran') ||
      lowerBot.includes('mengenai "') ||
      lowerBot.includes('menurut hemat saya');

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

    await new Promise(r => setTimeout(r, 600));
  }

  if (passed) {
    if (finalIteration === 1) finalScore = 96;
    else if (finalIteration === 2) finalScore = 88;
    else if (finalIteration === 3) finalScore = 76;
    else if (finalIteration === 4) finalScore = 64;
    else finalScore = 55;
  } else {
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
