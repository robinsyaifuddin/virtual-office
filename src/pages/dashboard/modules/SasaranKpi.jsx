import React from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart, ProgressBarWidget } from '../components/ChartWidgets';
import { Target, Award, TrendingUp } from 'lucide-react';

export default function SasaranKpi() {
  const { okrGoals, addOkrGoal, updateOkrGoal, deleteOkrGoal } = useWorkspaceStore();

  // Data Bar Chart: Progres Capaian per Sasaran (OKR)
  const okrBarData = okrGoals.slice(0, 5).map((g, idx) => {
    let pct = Math.round((g.currentNum / g.targetNum) * 100);
    if (g.unit === 'Detik') pct = Math.round((g.targetNum / g.currentNum) * 100);
    const colors = ['#0284c7', '#38bdf8', '#10b981', '#6366f1', '#f59e0b'];
    // Ambil kata pertama yang informatif agar pas di layar mobile tanpa terpotong
    const firstWord = g.objective.split(' ')[0] || `OKR ${idx+1}`;
    return {
      label: firstWord,
      value: Math.min(pct, 100),
      displayVal: `${pct}%`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Alokasi Sasaran per Divisi
  const divisionCounts = okrGoals.reduce((acc, g) => {
    const div = g.division || 'Umum';
    acc[div] = (acc[div] || 0) + 1;
    return acc;
  }, {});

  const divColors = {
    'Marketing': '#f59e0b',
    'Finance': '#10b981',
    'Operasional/Produksi': '#0284c7',
    'Teknologi': '#6366f1'
  };

  const okrDonutData = Object.keys(divisionCounts).map(div => ({
    label: div.replace('/Produksi', ''),
    value: divisionCounts[div],
    displayVal: `${divisionCounts[div]} OKR`,
    color: divColors[div] || '#0284c7'
  }));

  const columns = [
    { key: 'objective', label: 'Sasaran Utama (Objective)', minWidth: '180px' },
    { key: 'keyResult', label: 'Indikator Kunci (Key Result)', minWidth: '180px' },
    { key: 'division', label: 'Divisi', minWidth: '110px' },
    { key: 'quarter', label: 'Periode', minWidth: '80px' },
    {
      key: 'progress',
      label: 'Capaian Progres',
      minWidth: '110px',
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
    { key: 'owner', label: 'Pemilik (Owner)', minWidth: '120px' }
  ];

  const handleAddGoal = () => {
    const newGoal = {
      id: `OKR-${Date.now().toString().slice(-4)}`,
      objective: 'Pengembangan Fitur Automasi Lanjutan',
      keyResult: 'Implementasi 5 integrasi webhook baru',
      division: 'Operasional/Produksi',
      quarter: 'Q4',
      targetNum: 5,
      currentNum: 2,
      unit: 'Fitur',
      owner: 'Maya Nirmala'
    };
    addOkrGoal(newGoal);
    return newGoal;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Sasaran & KPI (OKR Perusahaan)
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
          title="Sebaran Sasaran Strategis per Divisi"
          subtitle="Fokus prioritas per departemen"
          data={okrDonutData}
          centerValue={`${okrGoals.length}`}
          centerLabel="Total OKR"
        />
      </div>

      <NotionTable
        title="Matriks OKR Kuartal 4"
        data={okrGoals}
        columns={columns}
        onAddRow={handleAddGoal}
        onDeleteRow={deleteOkrGoal}
        onUpdateCell={(id, field, val) => updateOkrGoal(id, { [field]: val })}
        exportFileName="okr_kpi_digibooster.csv"
      />
    </div>
  );
}
