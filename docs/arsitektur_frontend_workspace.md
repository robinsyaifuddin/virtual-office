# Arsitektur Frontend & Routing Workspace DigiBooster

Dokumen ini merinci arsitektur direktori kode frontend yang modular, aman, rapi, dan mudah dikelola untuk Workspace DigiBooster.

---

## 1. Skema URL & Routing (Path Pattern)

Sistem menggunakan routing yang sinkron dengan URL browser (mendukung `window.history.pushState` / direct link browser):

| Menu | Path URL | File Komponen |
|---|---|---|
| Denah Kantor 3D | `/` | `src/Office3D.jsx` |
| Login Eksekutif | `/login` | `src/pages/LoginPage.jsx` |
| **Pintu Utama Dashboard** | `/dashboard` *(default ke Executive)* | `src/pages/dashboard/DashboardLayout.jsx` |
| 1. Executive Dashboard | `/dashboard/executivedashboard` | `src/pages/dashboard/modules/ExecutiveDashboard.jsx` |
| 2. CRM & Klien | `/dashboard/crmdanklien` | `src/pages/dashboard/modules/CrmKlien.jsx` |
| 3. Keuangan & Profit | `/dashboard/keuangandanprofit` | `src/pages/dashboard/modules/KeuanganProfit.jsx` |
| 4. Branding & Marketing | `/dashboard/brandingdanmarketing` | `src/pages/dashboard/modules/BrandingMarketing.jsx` |
| 5. Tugas & Kalender | `/dashboard/tugasdankalender` | `src/pages/dashboard/modules/TugasKalender.jsx` |
| 6. Sasaran & KPI | `/dashboard/sasarandankpi` | `src/pages/dashboard/modules/SasaranKpi.jsx` |
| 7. Rapat & Catatan | `/dashboard/rapatdancatatan` | `src/pages/dashboard/modules/RapatCatatan.jsx` |
| 8. Laporan & Evaluasi | `/dashboard/laporandanevaluasi` | `src/pages/dashboard/modules/LaporanEvaluasi.jsx` |
| 9. Data & Arsip | `/dashboard/datadandarsip` | `src/pages/dashboard/modules/DataArsip.jsx` |
| 10. Staff & AI Agents | `/dashboard/staffagent` | `src/pages/dashboard/modules/StaffAgent.jsx` |
| ⚙️ Pengaturan Workspace | `/dashboard/pengaturanworkspace` | `src/pages/dashboard/modules/PengaturanWorkspace.jsx` |

*(Path lama `/manajemen` otomatis di-redirect ke `/dashboard` untuk backward compatibility).*

---

## 2. Struktur Folder & Modul Frontend (`src/`)

Arsitektur dipecah dari 1 file raksasa `ManagementDashboard.jsx` menjadi struktur modular terorganisir:

```
src/
├── App.jsx                                  (Router utama & state autentikasi)
├── pages/
│   ├── LoginPage.jsx
│   └── dashboard/                           (Folder Utama Dashboard)
│       ├── DashboardLayout.jsx              (Shell: Sidebar seragam, Header search/profile, Toast)
│       │
│       ├── components/                      (Komponen Reusable Ala Notion)
│       │   ├── NotionTable.jsx              (Tabel CRUD inline, search, filter, export CSV)
│       │   ├── NotionKanban.jsx             (Board drag & drop per tahapan/status)
│       │   ├── NotionCalendar.jsx           (Kalender deadline / jadwal rilis)
│       │   ├── NotionDetailDrawer.jsx       (Slide-over modal preview & edit properti baris)
│       │   ├── MetricCard.jsx               (Stat card ringkasan metrik angka)
│       │   └── ChartWidgets.jsx             (Bar, Line, Donut, Progress gauge seragam)
│       │
│       └── modules/                         (1 File untuk Setiap Menu Resmi)
│           ├── ExecutiveDashboard.jsx       (/dashboard/executivedashboard)
│           ├── CrmKlien.jsx                 (/dashboard/crmdanklien)
│           ├── KeuanganProfit.jsx           (/dashboard/keuangandanprofit)
│           ├── BrandingMarketing.jsx        (/dashboard/brandingdanmarketing)
│           ├── TugasKalender.jsx            (/dashboard/tugasdankalender)
│           ├── SasaranKpi.jsx               (/dashboard/sasarandankpi)
│           ├── RapatCatatan.jsx             (/dashboard/rapatdancatatan)
│           ├── LaporanEvaluasi.jsx          (/dashboard/laporandanevaluasi)
│           ├── DataArsip.jsx                (/dashboard/datadandarsip)
│           ├── StaffAgent.jsx               (/dashboard/staffagent)
│           └── PengaturanWorkspace.jsx      (/dashboard/pengaturanworkspace)
│
├── store/
│   └── workspaceStore.js                    (Zustand Store: State CRUD lokal terpusat & siap kirim ke Database Anda)
│
└── styles/
    └── workspaceNotion.css                  (Styling Notion Theme modern yang selaras dengan Flowora/Donezo)
```

---

## 3. Keuntungan Arsitektur Ini: Aman, Fleksibel, & Bersih

1. **Isolasi Masalah (Fault Isolation):**
   Jika sedang mengedit atau menambah fitur di `CrmKlien.jsx`, menu lain seperti `KeuanganProfit.jsx` tidak akan terpengaruh atau rusak.
2. **Konsistensi UI (Shared Notion Components):**
   Setiap menu menggunakan komponen dasar yang sama (`NotionTable`, `NotionKanban`, `MetricCard`), sehingga desain tombol, warna tag status, fungsi download, dan search bar dijamin seragam 100%.
3. **Database Readiness (Mudah Dikaitkan ke Backend Anda):**
   Semua data disimpan terpusat di `workspaceStore.js`. Saat Anda siap menghubungkan database sendiri (misal Supabase / PostgreSQL / REST API), Anda cukup mengganti pemanggilan function di store tersebut tanpa mengubah satu pun baris tampilan di modul UI.
4. **URL Sinkron & Bookmarkable:**
   Jika pengguna me-refresh halaman browser di `http://localhost:5173/dashboard/crmdanklien`, aplikasi langsung membuka menu CRM & Klien tanpa ter-reset ke halaman awal.
