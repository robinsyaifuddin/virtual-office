# Masterplan: Autonomous AI Multi-Agent & Realtime Database Dashboard

> **Proyek:** DigiBooster Indonesia Enterprise  
> **Status:** Fase 1 & 2 Selesai (Database & Zero-Dummy Aktif), Menuju Fase 3 (Trigger & WhatsApp Multi-Agent Bot)  
> **Target:** 100% Gratis Selamanya, Zero Server Maintenance, Powerfull, dan Aman.

---

## 1. Arsitektur Tingkat Tinggi (System Architecture)

```
[Human Web Interface]                         [WhatsApp Multi-Agent Group]
  Web Dashboard (React + Vite)                  WhatsApp Group (User + Staff Agents)
          │                                                │
          │                                                ▼
          │                                     Green-API Gateway (Free Tier)
          │                                                │
          │ (Zustand + Supabase Client)                    ▼
          │                                     [Agent Router & Orchestrator]
          │                                                │
          │                             ┌──────────────────┼──────────────────┐
          │                             ▼                  ▼                  ▼
          │                        Groq API ⚡        Gemini Flash 🛡️     Pollinations.ai 🎨
          │                     (Qwen 3.8 27B)      (Auto Fallback)     (Generate Gambar)
          │                             │                  │                  │
          │                             └──────────┬───────┘                  │
          ▼                                        ▼                          ▼
[PostgreSQL Database (Supabase)] <── Function Calling (CRUD)        Kirim Gambar ke WA
  - crm_clients
  - finance_transactions
  - tasks (dengan Database Webhook Trigger)
  - marketing_campaigns
  - okr_goals & audit_logs
```

---

## 2. Fitur "Database Trigger / Webhooks" di Supabase (100% Gratis)

### Apakah Fitur Trigger ini Gratis?
**YA, 100% GRATIS.**
Di PostgreSQL / Supabase, **Database Trigger** adalah fitur bawaan inti database (*native engine*), bukan fitur berbayar.
Supabase menyediakan **Database Webhooks** (yang ada di gambar menu Trigger Anda), di mana setiap kali ada baris baru masuk (*INSERT*) atau data diubah (*UPDATE*), Supabase otomatis menembak **HTTP POST Webhook** ke backend Anda.

### Alur Kerja Trigger Multi-Agent Otomatis:
```
[1. User Chat di WA] 
       │ 
       ▼ ("@Radit tolong suruh Dina buat materi promo klinik gigi")
[2. Radit (COO) Input Task ke Supabase]
       │
       ▼ (Tabel: tasks | assignee: 'Dina' | status: 'Sedang Dikerjakan')
[3. Supabase Database TRIGGER Aktif Otomatis! ⚡]
       │
       ▼ (Kirim Webhook: "Ada tugas baru ditugaskan ke Dina")
[4. Dina (Growth Lead) Terbangun & Mengerjakan Tugas]
       │ ├── Riset materi & buat copywriting
       │ └── Generate gambar visual via Pollinations.ai
       ▼
[5. Dina Simpan Hasil ke Supabase & Update Status: 'Menunggu Review']
       │
       ▼ (Trigger Kedua: Lapor ke Radit)
[6. Radit Mengecek Kualitas Hasil Kerja Dina]
       │
       ▼
[7. Radit Melaporkan Rekap Lengkap ke User di WhatsApp]:
       "Laporan Selesai, Pak!
        Dina telah menyelesaikan tugas promo klinik gigi. 
        Materi copy & banner terlampir di bawah dan sudah masuk ke Dashboard."
```

---

## 3. Profil Dewan 5 Karakter AI DigiBooster

1. **Arga – Chief Strategy Officer (CSO):**  
   * **Peran:** Rekan *brainstorming*, pemimpin jalannya rapat, perumus sasaran (OKR), dan penyusun *Action Items*.
   * **Modul:** `okr_goals`, `meetings`.
2. **Radit – Chief Operating Officer (COO):**  
   * **Peran:** Pusat komando dan operasional, pembagi tugas (*task breakdown*), delegasi ke agen lain, dan pelapor hasil ke User.
   * **Modul:** `tasks`, `executive_summary`.
3. **Dina – Head of Growth & Creative:**  
   * **Peran:** Riset pasar/sosmed, perancang skrip promosi, pembuat konsep visual gambar via Pollinations.ai, dan pengelola pipeline prospek di CRM.
   * **Modul:** `marketing_campaigns`, `crm_clients`.
4. **Bima – Head of Documentation & Knowledge:**  
   * **Peran:** Pembuat dan perapih berkas (kontrak PKS, NDA, notulen), penyusun SOP baku, serta penyiap ekspor dokumen Excel & PDF.
   * **Modul:** `archives`, `sop_items`.
5. **Sarah – Head of AI Performance & Talent Ops:**  
   * **Peran:** Evaluasi kualitas kerja dan akurasi agen, pelatih *prompting* agar bot semakin cerdas, serta pengawas log aktivitas di `audit_logs`.
   * **Modul:** `staff_agents`, `reports`, `audit_logs`.

---

## 4. Keuntungan Mekanisme Trigger Ini

1. **Owner Tidak Perlu Micromanage:**
   * Anda cukup memberi perintah ke **Radit (Manager)**.
   * Radit mendelegasikan ke **Dina/Bima/Sarah**.
   * Setelah selesai diperiksa, Radit yang memberikan laporan komprehensif ke Anda.
2. **Semua Tercatat Nyata di Dashboard:**
   * Pekerjaan bot bukan cuma mengobrol di WhatsApp, tapi **muncul nyata di tabel-tabel web dashboard Anda** secara otomatis.
3. **Audit Trail Aman:**
   * Setiap aksi perantara antar-bot tercatat di tabel `audit_logs` sehingga Sarah bisa mengaudit dan Anda bisa melihat riwayatnya kapan saja.
