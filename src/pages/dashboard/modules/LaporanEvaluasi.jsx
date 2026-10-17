import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { FileBarChart, Star, CheckCircle } from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';
import { toInputDateFormat } from '../../../utils/dateFormatter';

export default function LaporanEvaluasi() {
  const { reports, addReport, updateReport, deleteReport } = useWorkspaceStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Draft', 'Review', 'Final', 'Disahkan', 'Arsip'];

  const auditCategories = [
    'Audit Kualitas',
    'Review Kinerja',
    'Evaluasi Sprint',
    'Kepuasan Klien'
  ];

  // Filter laporan berdasarkan status dokumen & kategori evaluasi
  const filteredReports = reports.filter((r) => {
    const matchesStatus = (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all')
      ? true 
      : r.status === statusFilter;
    const matchesCat = (!activeCategory || activeCategory === 'ALL' || activeCategory === 'all')
      ? true 
      : r.category === activeCategory;
    return matchesStatus && matchesCat;
  });

  // Data Bar Chart: Skor Mutu per Dokumen Evaluasi
  const reportBarData = reports.slice(0, 5).map((r, idx) => {
    const ratingScore = r.rating || 4;
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawPeriod = (r.period && typeof r.period === 'string' && r.period.trim()) ? r.period : `Audit ${idx+1}`;
    return {
      label: rawPeriod.split(' ').slice(0, 2).join(' ') || `Audit ${idx+1}`,
      value: ratingScore,
      displayVal: `${ratingScore}/5`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Audit & Evaluasi
  const statusCounts = reports.reduce((acc, r) => {
    const s = r.status || 'Draft';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Draft': '#d97706',
    'Review': '#4f46e5',
    'Final': '#0284c7',
    'Disahkan': '#16a34a',
    'Arsip': '#64748b'
  };

  const reportDonutData = Object.keys(statusCounts).map(st => ({
    label: st,
    value: statusCounts[st],
    displayVal: `${statusCounts[st]} Dokumen`,
    color: statusColors[st] || '#0284c7'
  }));

  const columns = [
    { 
      key: 'period', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Nama Laporan / Evaluasi
        </span>
      ), 
      minWidth: '220px' 
    },
    { 
      key: 'category', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Kategori Audit
        </span>
      ), 
      minWidth: '160px',
      options: auditCategories,
      render: (val) => (
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#334155'
          }}
        >
          {val || 'Audit Kualitas'}
        </span>
      )
    },
    { 
      key: 'date', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Tanggal Evaluasi
        </span>
      ), 
      minWidth: '135px',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
          {val || '-'}
        </span>
      )
    },
    {
      key: 'rating',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Skor Mutu
        </span>
      ),
      minWidth: '130px',
      render: (val) => {
        const score = Number(val) || 5;
        return (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#ca8a04'
            }}
          >
            ★ {score}/5
          </span>
        );
      }
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Status Audit
        </span>
      ),
      minWidth: '140px',
      options: ['Draft', 'Review', 'Final', 'Disahkan', 'Arsip'],
      render: (val) => {
        const statusColors = {
          'Draft': '#d97706',
          'Review': '#4f46e5',
          'Final': '#0284c7',
          'Disahkan': '#16a34a',
          'Arsip': '#64748b'
        };
        const currentTextColor = statusColors[val] || '#0284c7';
        return (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: currentTextColor
            }}
          >
            {val || 'Final'}
          </span>
        );
      }
    },
    { 
      key: 'whatWentWell', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Pencapaian Positif
        </span>
      ), 
      minWidth: '220px',
      render: (val) => (
        <span style={{ color: '#334155', fontSize: '0.8rem' }}>
          {val || '-'}
        </span>
      )
    },
    { 
      key: 'bottlenecks', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Kendala Utama
        </span>
      ), 
      minWidth: '200px',
      render: (val) => (
        <span style={{ color: '#334155', fontSize: '0.8rem' }}>
          {val || '-'}
        </span>
      )
    },
    { 
      key: 'author', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> Penyusun
        </span>
      ), 
      minWidth: '130px',
      render: (val) => (
        <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.8rem' }}>
          {val || '-'}
        </span>
      )
    }
  ];

  const handleAddReport = (overrideCat) => {
    const defaultCat = overrideCat || ((activeCategory && activeCategory !== 'ALL' && activeCategory !== 'all')
      ? activeCategory
      : auditCategories[0]);

    const newRpt = {
      id: `RPT-${Date.now().toString().slice(-4)}`,
      period: '',
      category: defaultCat,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0],
      rating: 5,
      whatWentWell: '',
      bottlenecks: '',
      actionPlan: '',
      author: '',
      attachmentDoc: ''
    };
    addReport(newRpt);
    return newRpt;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Laporan &amp; Evaluasi
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

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Skor Audit Kualitas per Evaluasi"
          subtitle="Tingkat kepuasan & mutu deliverable"
          data={reportBarData}
        />
        <DonutChart
          title="Distribusi Status Audit & Evaluasi"
          subtitle="Status verifikasi dokumen mutu berkala"
          data={reportDonutData}
        />
      </div>

      <NotionTable
        title="Daftar Dokumen Audit & Evaluasi"
        data={filteredReports}
        columns={columns}
        onAddRow={handleAddReport}
        onDeleteRow={deleteReport}
        onUpdateCell={(id, field, val) => updateReport(id, { [field]: val })}
        exportFileName="evaluasi_laporan_digibooster.csv"
        categories={auditCategories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        categoryKey="category"
        statusFilter={statusFilter}
        onChangeStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        archiveMonth={archiveMonth}
        onChangeArchiveMonth={setArchiveMonth}
        availableArchiveMonths={['September 2026', 'Agustus 2026', 'Juli 2026']}
      />
    </div>
  );
}
