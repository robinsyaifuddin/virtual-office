import React from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { ProgressBarWidget } from '../components/ChartWidgets';
import { Target, Award, TrendingUp } from 'lucide-react';

export default function SasaranKpi() {
  const { okrGoals, addOkrGoal, updateOkrGoal, deleteOkrGoal } = useWorkspaceStore();

  const columns = [
    { key: 'objective', label: 'Sasaran Utama (Objective)' },
    { key: 'keyResult', label: 'Indikator Kunci (Key Result)' },
    { key: 'division', label: 'Divisi' },
    { key: 'quarter', label: 'Periode' },
    {
      key: 'progress',
      label: 'Capaian Progres',
      render: (_, row) => {
        let pct = Math.round((row.currentNum / row.targetNum) * 100);
        if (row.unit === 'Detik') {
          pct = Math.round((row.targetNum / row.currentNum) * 100);
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
            <div style={{ flex: 1, height: '6px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', backgroundColor: pct >= 70 ? '#16a34a' : '#eab308' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{pct}%</span>
          </div>
        );
      }
    },
    { key: 'owner', label: 'Pemilik (Owner)' }
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
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          Sasaran & KPI (OKR Perusahaan)
        </h2>
      </div>

      <div className="ws-metric-grid">
        <MetricCard
          title="Total Sasaran Aktif (Q4)"
          value={okrGoals.length}
          subtitle="Lintas 3 Departemen"
          icon={Target}
        />
        <ProgressBarWidget
          title="Rata-rata Kelulusan Key Results"
          percentage={78}
          statusLabel="On Track"
          targetText="Target Kuartal >= 75%"
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
