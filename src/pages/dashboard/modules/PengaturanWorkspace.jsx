import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import MetricCard from '../components/MetricCard';
import { Settings, Shield, Cpu, MessageSquare, Database, Save, CheckCircle2 } from 'lucide-react';

export default function PengaturanWorkspace() {
  const { workspaceSettings, updateWorkspaceSettings } = useWorkspaceStore();
  const [name, setName] = useState(workspaceSettings.workspaceName);
  const [tagline, setTagline] = useState(workspaceSettings.companyTagline);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateWorkspaceSettings({ workspaceName: name, companyTagline: tagline });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '880px' }}>
      <div>
        <h2 className="ws-page-title">
          Pengaturan
        </h2>
      </div>

      {saved && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: '#dcfce7',
          color: '#15803d',
          fontWeight: 600,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} /> Pengaturan berhasil disimpan ke sistem!
        </div>
      )}

      {/* Profil Workspace */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
          Identitas Workspace
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Nama Perusahaan / Workspace</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              color: '#0f172a'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>Tagline Bisnis</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              color: '#0f172a'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Save size={15} /> Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Status Integrasi Eksternal */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
          Status Integrasi Sistem Otomasi
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MessageSquare size={16} color="#16a34a" />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>WhatsApp Gateway</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Nomor: {workspaceSettings.whatsappGateway.phoneNumber}</p>
            <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#16a34a', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '999px' }}>
              ● {workspaceSettings.whatsappGateway.status}
            </span>
          </div>

          <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Cpu size={16} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Mesin LLM AI</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Mesin: {workspaceSettings.aiIntegrations.activeEngine}</p>
            <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', backgroundColor: '#f0f9ff', padding: '2px 8px', borderRadius: '999px' }}>
              Rata-rata Latensi {workspaceSettings.aiIntegrations.latencyAverage}
            </span>
          </div>
        </div>
      </div>

      {/* Role & Akses Matriks */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="#0284c7" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Matriks Hak Akses (Role-Based Access Control)
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {workspaceSettings.rolesMatrix.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{r.role}</span>
              <span style={{ color: '#64748b' }}>{r.access}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alur Eksekusi & Tindak Lanjut Dewan Agen (Core Skill Khusus Seluruh Bot) */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #bae6fd',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="#0284c7" />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
              Alur Eksekusi &amp; Tindak Lanjut Dewan Agen (Skill Utama Permanen)
            </h4>
          </div>
          <span style={{ fontSize: '0.72rem', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
            Master Protocol
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
          Protokol komunikasi dan eksekusi resmi yang mengatur peran spesifik seluruh bot AI saat berinteraksi dengan Bang Robin. Mencegah tindakan sepihak, menghilangkan respons klise/template, dan memastikan setiap instruksi bermuara pada data nyata.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <strong style={{ fontSize: '0.84rem', color: '#0284c7', display: 'block', marginBottom: '4px' }}>
              1. Arga (CSO) — Rekan Diskusi Utama
            </strong>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Paling aktif saat diajak diskusi. Melontarkan pertanyaan klarifikasi yang tajam jika topik masih umum, dan membedah prioritas strategis.
            </span>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <strong style={{ fontSize: '0.84rem', color: '#0284c7', display: 'block', marginBottom: '4px' }}>
              2. Silvi — Growth &amp; Content Specialist
            </strong>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Mahir dari analisis, produksi konten, branding, hingga teknik closing deals. Tidak boleh langsung membuat draf tanpa diskusi dan arahan eksplisit.
            </span>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <strong style={{ fontSize: '0.84rem', color: '#0284c7', display: 'block', marginBottom: '4px' }}>
              3. Raka — Fasilitator Berkas &amp; Legalitas
            </strong>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Sigap memfasilitasi kebutuhan berkas: instrumen MoU/PKS, klausul NDA kerahasiaan, dan pengarsipan data resmi di sistem.
            </span>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <strong style={{ fontSize: '0.84rem', color: '#0284c7', display: 'block', marginBottom: '4px' }}>
              4. Siska — Pengawas Mutu &amp; Trainer
            </strong>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              Memantau jalannya diskusi. Sigap menegur secara kontekstual jika ada jawaban OOT, bertele-tele, atau template. Langsung menanamkan koreksi ke memori bot.
            </span>
          </div>
        </div>

        <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid #bae6fd', backgroundColor: '#f0f9ff' }}>
          <strong style={{ fontSize: '0.84rem', color: '#0369a1', display: 'block', marginBottom: '4px' }}>
            5. Reta (COO) — Perangkum, Pemeta Kolom Data &amp; PIC Follow-Up
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.5, display: 'block' }}>
            Merangkum hasil konsensus seluruh tim ke narasi terstruktur. Mengajukan draf kolom data kepada Bang Robin. Setelah Bang Robin menyetujui ("Oke" / "Setuju"), Reta mengunci data ke modul yang tepat, menetapkan PIC, dan mem-follow up progres berkala hingga tuntas.
          </span>
        </div>
      </div>
    </div>
  );
}
