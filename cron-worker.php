<?php
/**
 * DigiBooster Indonesia - Autonomous Agent Worker (Triggered by cPanel Cron Job)
 * Jalankan file ini melalui cPanel Cron Job setiap 5 atau 10 menit:
 * Contoh command cron: php -q /home/username/public_html/cron-worker.php >/dev/null 2>&1
 */

set_time_limit(120); // Maksimal 2 menit eksekusi agar ramah shared hosting

$gemini_api_key = "GANTI_DENGAN_GEMINI_API_KEY_ANDA";

/**
 * Fungsi Panggil Google Gemini API (100% Gratis via cURL)
 */
function callGemini($prompt, $apiKey) {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;
    
    $payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $prompt]
                ]
            ]
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    return $result['candidates'][0]['content']['parts'][0]['text'] ?? "Gagal memproses AI.";
}

/**
 * Fungsi Kirim Balasan Otomatis ke WhatsApp Pemilik / Grup
 */
function sendWhatsApp($targetPhone, $messageText, $token) {
    // Contoh integrasi Fonnte / WhatsApp Gateway API
    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => 'https://api.fonnte.com/send',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => array(
        'target' => $targetPhone,
        'message' => $messageText,
      ),
      CURLOPT_HTTPHEADER => array(
        "Authorization: $token"
      ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    return $response;
}

echo "Cron worker berhasil dieksekusi pada: " . date('Y-m-d H:i:s') . "\n";
?>
