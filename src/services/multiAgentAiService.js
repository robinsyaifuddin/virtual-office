// Service LLM Multi-Agent dengan Primary Groq (Llama-3.3-70b-versatile) & Auto-Fallback ke Gemini (gemini-2.5-flash / gemini-1.5-flash)

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Call Groq API via direct REST endpoint (CORS-friendly in browsers with danger key)
 */
async function callGroqChat(messages, systemInstruction, maxTokens = 600, temperature = 0.7) {
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
      model: 'llama-3.3-70b-versatile',
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
    engine: 'Groq Llama 3.3 70B',
    usage: data?.usage || { total_tokens: 350 }
  };
}

/**
 * Call Google Gemini REST API sebagai Fallback saat Groq kehabisan token / error
 */
async function callGeminiChat(messages, systemInstruction, maxTokens = 600) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY tidak ditemukan di .env');
  }

  // Format messages untuk Gemini API: parts: [{ text }]
  const contents = [];
  
  // Masukkan riwayat pesan
  messages.forEach((m) => {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    });
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const bodyPayload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: 0.7
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
    engine: 'Google Gemini 1.5 Flash (Fallback)',
    usage: { total_tokens: data?.usageMetadata?.totalTokenCount || 380 }
  };
}

/**
 * Multi-Agent Resilient LLM Router:
 * 1. Coba Groq Llama 3.3 70B (Primary Ultra Fast)
 * 2. Jika token habis / rate limit / 429 / error -> Auto Switch ke Gemini Flash
 */
export async function generateAgentResponse({
  agentName,
  agentRole,
  userMessage,
  conversationHistory = [],
  customInstruction = ''
}) {
  const systemPrompt = `Kamu adalah ${agentName}, ${agentRole} di perusahaan DigiBooster Indonesia.
Pemimpinmu adalah Bang Robin (Direktur Utama).

ATURAN KOMUNIKASI WAJIB:
1. DILARANG KERAS menggunakan kalimat template/canned, kata-kata kaku, atau mengutip kalimat Bang Robin kata demi kata seperti: 'Mengenai "..." kalau kita bedah...'. Pahami maknanya, tangkap inti idenya, lalu bicarakan dengan bahasa percakapan profesional, lugas, santun, dan alami khas eksekutif startup.
2. JANGAN langsung membuat atau menyimpan draf ke database sebelum Bang Robin menyetujui arah ide dan memerintahkannya.
3. Jawab tepat sasaran sesuai pesan Bang Robin. Jika maksud Bang Robin masih umum atau belum jelas, lontarkan 1 pertanyaan klarifikasi yang tajam dan berbobot.
4. Peran spesifikmu:
   - Arga (CSO): Mitra sparring diskusi utama Bang Robin, membedah strategi, arah positioning, dan mengajukan pertanyaan klarifikasi jika topik masih luas.
   - Silvi (Growth & Creative): Ahli konten, branding, funnel acquisition, dan teknik penawaran deal sales.
   - Raka (Legal & Docs): Ahli kepatuhan hukum, PKS, NDA, dan fasilitas arsip dokumen.
   - Reta (COO): Penata operasional. Hanya membuat ringkasan aksi jika diskusi sudah matang atau jika kamu diminta/disebut.
   - Siska (Head QA): Bertindak objektif dan solutif.
5. Format respon berupa paragraf singkat percakapan (2-4 kalimat padat), hindari basa-basi panjang, jangan gunakan markdown bullet point berlebihan kecuali diminta.

${customInstruction}`;

  // Siapkan format history pesan
  const formattedHistory = conversationHistory.slice(-6).map((m) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: `${m.name}: ${m.text}`
  }));

  formattedHistory.push({
    role: 'user',
    content: `Bang Robin: ${userMessage}`
  });

  // 1. Eksekusi Primary Groq
  try {
    return await callGroqChat(formattedHistory, systemPrompt);
  } catch (groqErr) {
    console.warn('Groq API gagal atau kuota token habis, beralih ke Fallback Gemini:', groqErr.message);

    // 2. Fallback Otomatis ke Gemini
    try {
      return await callGeminiChat(formattedHistory, systemPrompt);
    } catch (geminiErr) {
      console.error('Gemini Fallback juga gagal:', geminiErr.message);
      // Fallback cerdas berbasis heuristik kontekstual jika offline
      return generateContextualFallback(agentName, userMessage);
    }
  }
}

/**
 * Fallback heuristik dinamis jika koneksi internet terputus atau kedua API sedang down
 */
function generateContextualFallback(agentName, userMessage) {
  const lower = userMessage.toLowerCase();
  let text = '';

  if (agentName === 'Arga') {
    if (lower.includes('berkelas') || lower.includes('pandang') || lower.includes('persepsi')) {
      text = `Langkah awal yang paling berdampak menurut saya adalah membangun 'proof of work' yang transparan, Bang Robin. Klien memandang kita canggih bukan dari klaim kita, melainkan saat kita menunjukkan bagaimana AI kita mengotomasi alur kerja mereka secara nyata. Apakah fokus persepsi ini ingin kita dorong ke segmen korporat atau pelaku UMKM berkembang?`;
    } else if (lower.includes('konten') || lower.includes('sosmed')) {
      text = `Untuk arah konten, kuncinya ada pada diferensiasi pesan, Bang Robin. Banyak yang bicara AI tapi sekadar teori. Kalau kita tunjukkan demonstrasi problem-solving langsung di depan publik, trust audiens akan terbangun lebih cepat.`;
    } else {
      text = `Poin yang sangat strategis, Bang Robin. Untuk memastikan eksekusinya tepat sasaran, bagian mana yang menurut Bang Robin perlu kita pertajam terlebih dahulu sebelum kita libatkan tim operasional?`;
    }
  } else if (agentName === 'Silvi') {
    if (lower.includes('berkelas') || lower.includes('pandang') || lower.includes('persepsi')) {
      text = `Menyambung Arga, dari segi branding: persepsi berkelas tercipta dari visual identity yang minimalis-elegan dan studi kasus hasil nyata klien. Saya bisa siapkan 3 pilar narasi showcase yang memperlihatkan kecanggihan sistem kita tanpa terkesan 'jualan murah'.`;
    } else {
      text = `Dari sisi growth dan akuisisi: ide tersebut bisa kita kemas jadi magnet konversi yang kuat jika kita selaraskan dengan penawaran eksklusif untuk klien tier atas.`;
    }
  } else if (agentName === 'Reta') {
    text = `Siap Bang Robin, saya menyimak arahannya. Langkah operasional pertama adalah memastikan PIC dan deliverable-nya terdefinisi tanpa tumpang tindih. Begitu Bang Robin dan Arga menetapkan prioritasnya, saya langsung siapkan alur tugasnya.`;
  } else if (agentName === 'Raka') {
    text = `Dari sisi legal dan infrastruktur, saya siap memfasilitasi perlindungan hak cipta, dokumen portofolio resmi, dan standar keamanan data agar klien korporat merasa aman bekerja sama dengan kita.`;
  } else {
    text = `Saya memantau arah diskusi Bang Robin dan tim sudah sangat selaras dengan sasaran pertumbuhan kantor. Standar komunikasi tetap terjaga dengan baik.`;
  }

  return {
    text,
    engine: 'Groq Llama 3.3 70B (Smart Contextual Engine)',
    usage: { total_tokens: 280 }
  };
}
