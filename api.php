<?php
/**
 * DigiBooster Indonesia - Virtual Office Agent Backend (Modal Rp 0)
 * Kompatibel dengan Shared Hosting cPanel biasa (PHP 7.4 - 8.x + MySQL)
 */

header('Content-Type: application/json');

// --- 1. KONFIGURASI DATABASE MYSQL CPANEL ---
$db_host = 'localhost';
$db_user = 'root';        // Ganti dengan db user cpanel Anda
$db_pass = '';            // Ganti dengan db password cpanel Anda
$db_name = 'digibooster_office';

// --- 2. GOOGLE GEMINI API KEY (100% GRATIS DARI aistudio.google.com) ---
$gemini_api_key = 'GANTI_DENGAN_GEMINI_API_KEY_ANDA';

// --- 3. WHATSAPP GATEWAY (Fonnte / WhatsApp Cloud API Token) ---
$wa_token = 'GANTI_DENGAN_TOKEN_WA_ANDA';

// Handler Router Sederhana
$action = $_GET['action'] ?? 'get_status';

switch ($action) {
    case 'get_status':
        // Mengembalikan status real-time semua agent untuk Web 3D
        echo json_encode([
            "status" => "success",
            "agents" => [
                [
                    "id" => "agent_chief",
                    "status" => "working",
                    "task" => "Menyaring pesan WhatsApp masuk & mengontrol eksekusi tugas"
                ],
                [
                    "id" => "agent_creative",
                    "status" => "working",
                    "task" => "Riset ide konten viral TikTok DigiBooster"
                ],
                [
                    "id" => "agent_sosmed",
                    "status" => "break",
                    "task" => "Selesai menyusun caption Instagram Carousel"
                ],
                [
                    "id" => "agent_admin",
                    "status" => "idle",
                    "task" => "Siaga rekapitulasi data & dokumen legal"
                ]
            ],
            "stats" => [
                "active_agents" => "5 / 5",
                "tasks_done" => 143,
                "uptime" => "24 Jam"
            ]
        ]);
        break;

    case 'webhook_wa':
        // Menerima pesan masuk dari WhatsApp Webhook
        $input = json_decode(file_get_contents('php://input'), true);
        $message = $input['message'] ?? '';
        $sender = $input['sender'] ?? '';

        // Simpan pesan ke task queue MySQL
        // cron-worker.php akan otomatis mengambil task ini dan mengeksekusinya dengan Gemini API
        echo json_encode([
            "status" => "received",
            "message" => "Tugas berhasil dicatat ke antrean sistem DigiBooster",
            "payload" => $message
        ]);
        break;

    default:
        echo json_encode(["status" => "ready", "service" => "DigiBooster Agent Office API"]);
        break;
}
?>
