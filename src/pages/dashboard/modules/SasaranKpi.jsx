import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart, ProgressBarWidget } from '../components/ChartWidgets';
import { Target, Award, TrendingUp } from 'lucide-react';

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

export default function SasaranKpi() {
  const { okrGoals, addOkrGoal, updateOkrGoal, deleteOkrGoal, okrCategories, addOkrCategory, deleteOkrCategory } = useWorkspaceStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Belum Mulai', 'On Track', 'At Risk', 'Tercapai'];

  const categoryOptions = okrCategories || [
    'Revenue & Pertumbuhan',
    'Teknologi & Infrastruktur',
    'Brand & Komunitas',
    'Efisiensi Operasional',
    'Kepuasan Klien'
  ];

  // Filter sasaran & KPI berdasarkan status ketercapaian & kategori sasaran
  const filteredGoals = okrGoals.filter((g) => {
    let matchesStatus = true;
    if (statusFilter && statusFilter !== 'Semua Status' && statusFilter !== 'ALL' && statusFilter !== 'all') {
      let pct = Math.round((g.currentNum / g.targetNum) * 100);
      if (g.unit === 'Detik') pct = Math.round((g.targetNum / g.currentNum) * 100);
      const autoStatus = pct >= 100 ? 'Tercapai' : pct > 0 ? 'On Track' : 'Belum Mulai';
      const currentStatus = g.status || autoStatus;
      matchesStatus = (currentStatus === statusFilter);
    }
    const matchesCat = (!activeCategory || activeCategory === 'ALL' || activeCategory === 'all')
      ? true 
      : g.category === activeCategory;
    return matchesStatus && matchesCat;
  });

  // Data Bar Chart: Progres Capaian per Sasaran (OKR)
  const okrBarData = okrGoals.slice(0, 5).map((g, idx) => {
    const tgt = g.targetNum || 1;
    const cur = g.currentNum || 0;
    let pct = Math.round((cur / tgt) * 100);
    if (g.unit === 'Detik' && cur > 0) pct = Math.round((tgt / cur) * 100);
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    // Ambil kata pertama yang informatif agar pas di layar mobile tanpa terpotong
    const rawObj = (g.objective && typeof g.objective === 'string') ? g.objective : `OKR ${idx+1}`;
    const firstWord = rawObj.split(' ')[0] || `OKR ${idx+1}`;
    return {
      label: firstWord,
      value: Math.min(Math.max(pct, 0), 100),
      displayVal: `${Math.max(pct, 0)}%`,
      color: colors[idx % colors.length]
    };
  });


  // Data Donut Chart: Distribusi Status Capaian OKR
  const statusCounts = okrGoals.reduce((acc, g) => {
    let pct = Math.round(((g.currentNum || 0) / (g.targetNum || 1)) * 100);
    if (g.unit === 'Detik') pct = Math.round(((g.targetNum || 1) / (g.currentNum || 1)) * 100);
    const autoStatus = pct >= 100 ? 'Tercapai' : pct > 0 ? 'On Track' : 'Belum Mulai';
    const s = g.status || autoStatus;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Tercapai': '#16a34a',
    'On Track': '#0284c7',
    'At Risk': '#d97706',
    'Belum Mulai': '#dc2626'
  };

  const okrDonutData = Object.keys(statusCounts).map(st => ({
    label: st,
    value: statusCounts[st],
    displayVal: `${statusCounts[st]} Sasaran`,
    color: statusColors[st] || '#0284c7'
  }));

  const columns = [
    { 
      key: 'objective', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Sasaran Utama (Objective)
        </span>
      ), 
      minWidth: '220px' 
    },
    { 
      key: 'keyResult', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Indikator Kunci (Key Result)
        </span>
      ), 
      minWidth: '220px' 
    },
    {
      key: 'category',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Kategori Sasaran
        </span>
      ),
      minWidth: '180px',
      options: categoryOptions,
      render: (val) => (
        <span
          className="ws-notion-pill"
          style={{
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '6px',
            display: 'inline-block'
          }}
        >
          {val || categoryOptions[0]}
        </span>
      )
    },
    { 
      key: 'division', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Divisi
        </span>
      ), 
      minWidth: '150px',
      render: (val) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            backgroundColor: '#f1f5f9',
            color: '#334155'
          }}
        >
          {val || 'Sales & Marketing'}
        </span>
      )
    },
    { 
      key: 'quarter', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Periode Kuartal
        </span>
      ), 
      minWidth: '110px',
      render: (val) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 700,
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#0284c7'
          }}
        >
          {val || 'Q4'}
        </span>
      )
    },
    { 
      key: 'targetDeadline', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Target Deadline
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
      key: 'progress',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Capaian Progres
        </span>
      ),
      minWidth: '130px',
      render: (_, row) => {
        let pct = Math.round((row.currentNum / row.targetNum) * 100);
        if (row.unit === 'Detik') {
          pct = Math.round((row.targetNum / row.currentNum) * 100);
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '100px' }}>
            <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', backgroundColor: pct >= 70 ? '#16a34a' : '#eab308' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>{pct}%</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status
        </span>
      ),
      minWidth: '140px',
      render: (val, row) => {
        let pct = Math.round((row.currentNum / row.targetNum) * 100);
        if (row.unit === 'Detik') pct = Math.round((row.targetNum / row.currentNum) * 100);
        const autoStatus = pct >= 100 ? 'Tercapai' : pct > 0 ? 'On Track' : 'Belum Mulai';
        const displayStatus = val || autoStatus;

        const statusColors = {
          'Belum Mulai': { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
          'On Track': { bg: '#eff6ff', border: '#bfdbfe', text: '#0284c7' },
          'At Risk': { bg: '#fffbeb', border: '#fef3c7', text: '#d97706' },
          'Tercapai': { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' }
        };
        const current = statusColors[displayStatus] || { bg: '#eff6ff', border: '#bfdbfe', text: '#0284c7' };

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: current.bg,
              border: `1px solid ${current.border}`,
              color: current.text
            }}
          >
            {displayStatus}
          </span>
        );
      }
    },
    { 
      key: 'owner', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> Pemilik (Owner)
        </span>
      ), 
      minWidth: '140px' 
    }
  ];

  const handleAddGoal = (overrideCat) => {
    const defaultCat = overrideCat || ((activeCategory && activeCategory !== 'ALL' && activeCategory !== 'all')
      ? activeCategory
      : categoryOptions[0]);

    const newGoal = {
      id: `OKR-${Date.now().toString().slice(-4)}`,
      objective: '',
      keyResult: '',
      category: defaultCat,
      division: 'Operasional/Produksi',
      quarter: 'Q4',
      targetNum: 100,
      currentNum: 0,
      unit: '%',
      status: 'Belum Mulai',
      owner: ''
    };
    addOkrGoal(newGoal);
    return newGoal;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Sasaran &amp; KPI
        </h2>
      </div>

      <div className="ws-metric-grid">
        <div className="ws-col-span-full">
          <MetricCard
            title="Total Sasaran Aktif (Q4)"
            value={okrGoals.length}
            subtitle="Lintas 3 Departemen"
            icon={Target}
          />
        </div>
        <div className="ws-col-span-full">
          <ProgressBarWidget
            title="Rata-rata Kelulusan Key Results"
            percentage={78}
            statusLabel="On Track"
            targetText="Target Kuartal >= 75%"
          />
        </div>
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Persentase Pencapaian Sasaran (Top 5)"
          subtitle="Tingkat keberhasilan indikator kinerja"
          data={okrBarData}
        />
        <DonutChart
          title="Distribusi Status Capaian OKR"
          subtitle="Tingkat keberhasilan indikator kinerja"
          data={okrDonutData}
        />
      </div>

      <NotionTable
        title="Matriks OKR Kuartal 4"
        data={filteredGoals}
        columns={columns}
        onAddRow={handleAddGoal}
        onDeleteRow={deleteOkrGoal}
        onUpdateCell={(id, field, val) => updateOkrGoal(id, { [field]: val })}
        exportFileName="okr_kpi_digibooster.csv"
        categories={categoryOptions}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        onAddCategory={(cat) => addOkrCategory && addOkrCategory(cat)}
        onDeleteCategory={(cat) => deleteOkrCategory && deleteOkrCategory(cat)}
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
