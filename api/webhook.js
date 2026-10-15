import { GoogleGenAI } from '@google/genai';

// Gemini AI Setup
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
let ai = null;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

// Multi-Agent Task Orchestrator
async function processTaskWithAgents(instruction, senderName) {
  if (!ai) {
    return '⚠️ GEMINI_API_KEY belum disetel di Vercel Environment Variables.';
  }

  const prompt = `Anda adalah Chief of Staff (Manager Agent) dari kantor virtual DigiBooster AI.
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return response.text || 'Maaf, terjadi kendala saat memproses jawaban.';
  } catch (err) {
    console.error('Gemini Multi-Agent Error:', err);
    return `❌ Kendala sistem AI: ${err.message}`;
  }
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
  // Hanya menerima metode POST dari Green API
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'active', message: 'Green-API Webhook for DigiBooster Virtual Office' });
  }

  const idInstance = process.env.GREEN_API_ID_INSTANCE;
  const apiTokenInstance = process.env.GREEN_API_TOKEN_INSTANCE;

  const body = req.body;
  if (!body || !body.typeWebhook) {
    return res.status(200).json({ status: 'ignored_empty' });
  }

  // Tangkap tipe pesan masuk (incomingMessageReceived)
  if (body.typeWebhook === 'incomingMessageReceived') {
    const messageData = body.messageData;
    const senderData = body.senderData || {};

    const chatId = senderData.chatId; // Format grup: xxxx@g.us atau nomor@c.us
    const senderName = senderData.senderName || 'Boss';
    const messageId = body.idMessage;

    // Ambil isi teks pesan
    let messageText = '';
    if (messageData.typeMessage === 'textMessage') {
      messageText = messageData.textMessageData?.textMessage || '';
    } else if (messageData.typeMessage === 'extendedTextMessage') {
      messageText = messageData.extendedTextMessageData?.text || '';
    }

    messageText = messageText.trim();

    // Validasi apakah pesan perlu direspon oleh Agent Bot
    const isGroup = chatId.endsWith('@g.us');
    const shouldReply = messageText.startsWith('!') || messageText.toLowerCase().includes('bot') || !isGroup;

    if (shouldReply && messageText && idInstance && apiTokenInstance) {
      const cleanInstruction = messageText.replace(/^!/, '').trim();

      // 1. Respon kilat konfirmasi penerimaan tugas
      await sendGreenApiMessage(
        idInstance,
        apiTokenInstance,
        chatId,
        `⚡ *[DigiBooster Agent Office]*\nSiap, instruksi dari *${senderName}* diterima. Tim agen AI sedang mengerjakan...`,
        messageId
      );

      // 2. Eksekusi tugas melalui Multi-Agent Gemini
      const agentResult = await processTaskWithAgents(cleanInstruction, senderName);

      // 3. Kirim hasil lengkap kembali ke grup WhatsApp
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
