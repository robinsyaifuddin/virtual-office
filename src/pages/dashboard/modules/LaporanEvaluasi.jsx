import React from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { FileBarChart, Star, CheckCircle } from 'lucide-react';

export default function LaporanEvaluasi() {
  const { reports, addReport, updateReport, deleteReport } = useWorkspaceStore();

  const columns = [
    { key: 'period', label: 'Nama Laporan / Periode' },
    { key: 'category', label: 'Kategori' },
    {
      key: 'rating',
      label: 'Skor Mutu',
      render: (val) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#eab308' }}>
          <Star size={14} fill="#eab308" /> {val}/5
        </span>
      )
    },
    { key: 'whatWentWell', label: 'Pencapaian Positif' },
    { key: 'bottlenecks', label: 'Kendala Utama' },
    { key: 'author', label: 'Penyusun' }
  ];

  const handleAddReport = () => {
    const newRpt = {
      id: `RPT-${Date.now().toString().slice(-4)}`,
      period: 'Evaluasi Pasca Rilis Fitur Baru',
      category: 'Audit Kualitas',
      rating: 5,
      whatWentWell: 'Modul baru berjalan stabil tanpa komplain dari pengguna.',
      bottlenecks: 'Perlu peningkatan dokumentasi API.',
      actionPlan: 'Pembaruan panduan instalasi teknis.',
      author: 'Kevin Pratama',
      attachmentDoc: 'Report_Rilis.pdf'
    };
    addReport(newRpt);
    return newRpt;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Laporan & Evaluasi Mutu
        </h2>
      </div>

      <div className="ws-metric-grid">
        <MetricCard
          title="Rata-rata Skor Mutu Layanan"
          value="4.5 / 5.0"
          subtitle="Berdasarkan audit internal & klien"
          icon={Star}
        />
        <MetricCard
          title="Laporan Terarsip"
          value={reports.length}
          subtitle="Dokumen evaluasi berkala"
          icon={FileBarChart}
        />
      </div>

      <NotionTable
        title="Daftar Dokumen Audit & Evaluasi"
        data={reports}
        columns={columns}
        onAddRow={handleAddReport}
        onDeleteRow={deleteReport}
        onUpdateCell={(id, field, val) => updateReport(id, { [field]: val })}
        exportFileName="evaluasi_laporan_digibooster.csv"
      />
    </div>
  );
}
