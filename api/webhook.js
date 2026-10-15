import Groq from 'groq-sdk';
import { GoogleGenAI } from '@google/genai';

// Inisialisasi Klien AI (Menggunakan Environment Variables agar aman dari Secret Scanning)
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';

let groq = null;
if (GROQ_API_KEY) {
  groq = new Groq({ apiKey: GROQ_API_KEY });
}

let gemini = null;
if (GEMINI_API_KEY) {
  gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

// Multi-Agent Task Orchestrator (Prioritas: Groq Llama 3.3 70B, Fallback: Gemini 2.5 Flash)
async function processTaskWithAgents(instruction, senderName) {
  const systemPrompt = `Anda adalah Chief of Staff (Manager Agent) dari kantor virtual DigiBooster AI.
Anda memimpin tim agent virtual yang terdiri dari:
1. @Admin (Pencatatan data, kalkulasi, format dokumen, invoice, operasional)
2. @Creative (Copywriting sosmed, script video viral TikTok/Reels, headline, ide kampanye)
3. @Research (Analisis fakta, riset pasar/kompetitor, ringkasan materi)

Ada instruksi masuk dari: "${senderName}"
Isi Instruksi: "${instruction}"

Tugas Anda:
1. Berikan pengantar ramah dan profesional sebagai Manager.
2. Delegasikan dan tampilkan hasil kerja agent spesialis yang relevan secara lengkap, terstruktur, dan siap pakai.
3. Berikan kesimpulan dan tindak lanjut singkat untuk Boss.

Format respon dengan gaya markdown rapi untuk WhatsApp (gunakan tanda *bold*, _italic_, bullet points, dan emoji), tanpa format HTML.`;

  // --- 1. ENGINE UTAMA: GROQ (Llama 3.3 70B - Ultra Fast) ---
  if (groq) {
    try {
      console.log('⚡ Menjalankan tugas dengan Groq Llama 3.3 70B (Primary)...');
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Anda adalah koordinator Multi-Agent AI kantor profesional berbahasa Indonesia.' },
          { role: 'user', content: systemPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      });

      const output = completion.choices[0]?.message?.content;
      if (output && output.trim()) {
        return output;
      }
    } catch (groqErr) {
      console.warn('⚠️ Groq mengalami limit/error, otomatis beralih ke Backup (Gemini):', groqErr.message);
    }
  }

  // --- 2. ENGINE BACKUP: GEMINI (Gemini 2.5 Flash) ---
  if (gemini) {
    try {
      console.log('🛡️ Menjalankan tugas dengan Gemini 2.5 Flash (Backup Engine)...');
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt
      });

      const output = response.text;
      if (output && output.trim()) {
        return `${output}\n\n_(🛡️ Diproses via Backup Engine: Gemini)_`;
      }
    } catch (geminiErr) {
      console.error('❌ Gemini Backup juga mengalami kendala:', geminiErr.message);
      return `❌ Maaf Boss, kedua engine AI (Groq & Gemini) sedang mengalami limit/gangguan: ${geminiErr.message}`;
    }
  }

  return '⚠️ Kunci API (GROQ_API_KEY / GEMINI_API_KEY) belum disetel di Vercel Environment Variables.';
}

// Fungsi mengirim pesan via Green API
async function sendGreenApiMessage(idInstance, apiTokenInstance, chatId, textMessage, quotedMessageId = null) {
  const url = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
  
  const payload = {
    chatId: chatId,
    message: textMessage
  };

  if (quotedMessageId) {
    payload.quotedMessageId = quotedMessageId;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    console.error('Green API Send Error:', error);
    return null;
  }
}

// Vercel Serverless Webhook Handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'active', service: 'DigiBooster Multi-Agent Webhook (Groq Primary + Gemini Backup)' });
  }

  const idInstance = process.env.GREEN_API_ID_INSTANCE;
  const apiTokenInstance = process.env.GREEN_API_TOKEN_INSTANCE;

  const body = req.body;
  if (!body || !body.typeWebhook) {
    return res.status(200).json({ status: 'ignored_empty' });
  }

  if (body.typeWebhook === 'incomingMessageReceived') {
    const messageData = body.messageData;
    const senderData = body.senderData || {};

    const chatId = senderData.chatId;
    const senderName = senderData.senderName || 'Boss';
    const messageId = body.idMessage;

    let messageText = '';
    if (messageData.typeMessage === 'textMessage') {
      messageText = messageData.textMessageData?.textMessage || '';
    } else if (messageData.typeMessage === 'extendedTextMessage') {
      messageText = messageData.extendedTextMessageData?.text || '';
    }

    messageText = messageText.trim();
    const isGroup = chatId.endsWith('@g.us');
    const shouldReply = messageText.startsWith('!') || messageText.toLowerCase().includes('bot') || !isGroup;

    if (shouldReply && messageText && idInstance && apiTokenInstance) {
      const cleanInstruction = messageText.replace(/^!/, '').trim();

      // 1. Konfirmasi cepat penerimaan tugas
      await sendGreenApiMessage(
        idInstance,
        apiTokenInstance,
        chatId,
        `⚡ *[DigiBooster Agent Office]*\nSiap, tugas dari *${senderName}* diterima. Multi-Agent AI (Groq Llama 3.3 Engine) sedang bekerja...`,
        messageId
      );

      // 2. Proses tugas (Groq -> Fallback Gemini)
      const agentResult = await processTaskWithAgents(cleanInstruction, senderName);

      // 3. Kirim hasil kerja lengkap ke grup WhatsApp
      await sendGreenApiMessage(
        idInstance,
        apiTokenInstance,
        chatId,
        agentResult,
        messageId
      );
    }
  }

  return res.status(200).json({ status: 'processed' });
}
