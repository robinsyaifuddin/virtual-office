import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import pino from 'pino';
import QRCode from 'qrcode';
import { GoogleGenAI } from '@google/genai';
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from '@whiskeysockets/baileys';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory state
let qrCodeDataUrl = '';
let connectionStatus = 'initializing';
let activeAgents = [
  { id: 'manager', name: 'Chief Manager', status: 'idle', task: 'Siap menerima instruksi di Grup WhatsApp' },
  { id: 'admin', name: 'Admin Officer', status: 'idle', task: 'Siaga rekap & operasional' },
  { id: 'creative', name: 'Creative Specialist', status: 'idle', task: 'Siaga copywriting & konten' },
  { id: 'research', name: 'Research Analyst', status: 'idle', task: 'Siaga data & pencarian' }
];

// Initialize Google Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let ai = null;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

// Multi-Agent Task Orchestrator via Gemini
async function processTaskWithAgents(instruction, senderName) {
  if (!ai) {
    return `⚠️ Gemini API Key belum disetel di server environment (GEMINI_API_KEY). Silakan masukkan API Key di dashboard Render.`;
  }

  try {
    // 1. Manager Agent Plan & Route
    activeAgents.forEach(a => { if (a.id === 'manager') a.status = 'working'; });
    
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

Format respon dengan gaya markdown rapi, gunakan emoji sesuai konteks, dan langsung berikan output kerja yang konkret.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    activeAgents.forEach(a => a.status = 'idle');
    return response.text || 'Maaf, terjadi kendala saat memproses jawaban.';
  } catch (error) {
    console.error('Agent AI Error:', error);
    activeAgents.forEach(a => a.status = 'idle');
    return `❌ Terjadi kendala teknis pada sistem Agent AI: ${error.message}`;
  }
}

// WhatsApp Baileys Setup
let sock = null;
async function startWhatsAppBot() {
  const authPath = path.join(__dirname, 'auth_info_baileys');
  if (!fs.existsSync(authPath)) {
    fs.mkdirSync(authPath, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      connectionStatus = 'scan_needed';
      qrCodeDataUrl = await QRCode.toDataURL(qr);
      console.log('📌 QR Code baru telah di-generate. Silakan buka dashboard untuk scan!');
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      connectionStatus = 'disconnected';
      console.log('Koneksi terputus. Status code:', statusCode, 'Reconnect:', shouldReconnect);
      if (shouldReconnect) {
        setTimeout(startWhatsAppBot, 5000);
      }
    } else if (connection === 'open') {
      connectionStatus = 'connected';
      qrCodeDataUrl = '';
      console.log('✅ WhatsApp Multi-Agent Bot BERHASIL TERHUBUNG!');
    }
  });

  // Listen to incoming messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const remoteJid = msg.key.remoteJid;
      const isGroup = remoteJid.endsWith('@g.us');
      const senderName = msg.pushName || 'Boss';

      // Ekstrak teks pesan
      const messageText =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      if (!messageText.trim()) continue;

      console.log(`[Pesan Masuk] Dari: ${senderName} (${remoteJid}): ${messageText}`);

      // Filter: Respon jika di mention bot atau perintah diawali tanda ! atau di grup/private chat
      const shouldReply = messageText.startsWith('!') || messageText.toLowerCase().includes('bot') || !isGroup;

      if (shouldReply) {
        const cleanInstruction = messageText.replace(/^!/, '').trim();
        
        // 1. Kirim konfirmasi kilat (Ack)
        await sock.sendMessage(remoteJid, {
          text: `⚡ *[DigiBooster Agent Office]*\nSiap, instruksi diterima dari *${senderName}*. Tim agent AI sedang menyusun pekerjaan...`
        }, { quoted: msg });

        // 2. Proses instruksi dengan Gemini Multi-Agent
        const agentResult = await processTaskWithAgents(cleanInstruction, senderName);

        // 3. Kirim hasil lengkap kembali ke chat/grup
        await sock.sendMessage(remoteJid, {
          text: agentResult
        }, { quoted: msg });
      }
    }
  });
}

// Start WhatsApp Bot
startWhatsAppBot().catch(err => console.error('Error starting WhatsApp bot:', err));

// --- HTTP API & Static Web Server ---

// Ping endpoint (mencegah Render sleep via UptimeRobot)
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), botStatus: connectionStatus });
});

// Status API untuk dashboard 3D
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    bot: {
      connection: connectionStatus,
      qrCode: qrCodeDataUrl
    },
    agents: activeAgents
  });
});

// Layanan Web Dashboard Status & Scan QR
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Virtual Office - WhatsApp Bot Manager</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; display: flex; flex-direction: column; align-items: center; }
        .card { background: #1e293b; border-radius: 12px; padding: 2rem; max-width: 500px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center; }
        .badge { display: inline-block; padding: 0.35rem 0.75rem; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; margin-bottom: 1rem; }
        .badge.connected { background: #059669; color: white; }
        .badge.scan_needed { background: #d97706; color: white; }
        .badge.disconnected { background: #dc2626; color: white; }
        .badge.initializing { background: #475569; color: white; }
        img { border-radius: 8px; margin: 1.5rem 0; background: white; padding: 10px; }
        .instructions { text-align: left; background: #334155; padding: 1rem; border-radius: 8px; font-size: 0.9rem; line-height: 1.5; }
        a { color: #38bdf8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Virtual Office WhatsApp Bot</h2>
        <div class="badge ${connectionStatus}">Status: ${connectionStatus.toUpperCase()}</div>
        
        ${
          connectionStatus === 'connected'
            ? `<div style="padding: 1.5rem; color: #34d399; font-weight: bold; font-size: 1.2rem;">✅ WhatsApp Berhasil Terhubung! Bot Siap di Grup.</div>`
            : connectionStatus === 'scan_needed' && qrCodeDataUrl
            ? `<div>
                <p>Silakan scan QR Code ini melalui WhatsApp di HP Anda:<br/>(Menu <b>Linked Devices / Perangkat Tertaut</b>)</p>
                <img src="${qrCodeDataUrl}" alt="WhatsApp QR Code" width="260" height="260" />
               </div>`
            : `<p>Menghubungkan ke WhatsApp... Segarkan halaman dalam beberapa detik.</p>`
        }

        <div class="instructions">
          <b>Petunjuk Penggunaan:</b>
          <ol>
            <li>Buka WhatsApp di HP Anda.</li>
            <li>Buka <b>Pengaturan / Titik 3 $\rightarrow$ Perangkat Tertaut</b>.</li>
            <li>Scan QR Code di atas.</li>
            <li>Masukkan bot ke grup kantor Anda dan ketik instruksi diawali kata <b>bot</b> atau <b>!</b>.</li>
          </ol>
        </div>
      </div>
      <script>
        // Auto refresh jika status belum connected
        if ("${connectionStatus}" !== "connected") {
          setTimeout(() => location.reload(), 6000);
        }
      </script>
    </body>
    </html>
  `);
});

// Serve frontend build (dist) jika tersedia
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.redirect('/admin');
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Virtual Office All-in-One Server running on http://localhost:${PORT}`);
});
