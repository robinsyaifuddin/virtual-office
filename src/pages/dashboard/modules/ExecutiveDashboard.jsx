import React from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart, ProgressBarWidget } from '../components/ChartWidgets';
import { DollarSign, Briefcase, Zap, Target, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ExecutiveDashboard({ onNavigateModule }) {
  const { executiveSummary, crmClients } = useWorkspaceStore();

  const cashflowBarData = [
    { label: 'Mei', value: 42, displayVal: '42M' },
    { label: 'Jun', value: 48, displayVal: '48M' },
    { label: 'Jul', value: 55, displayVal: '55M' },
    { label: 'Agu', value: 50, displayVal: '50M' },
    { label: 'Sep', value: 58, displayVal: '58M' },
    { label: 'Okt', value: 68, displayVal: '68.5M', color: '#0284c7' }
  ];

  // Data Donut Chart: Komposisi Status Pipeline Klien
  const stageCounts = (Array.isArray(crmClients) ? crmClients : []).reduce((acc, c) => {
    const stg = (c && c.stage && typeof c.stage === 'string' && c.stage.trim()) ? c.stage.trim() : 'Prospek Awal';
    acc[stg] = (acc[stg] || 0) + 1;
    return acc;
  }, {});

  const stageColorMap = {
    'Lead Masuk': '#64748b',
    'Discovery Call': '#0284c7',
    'Proposal Terkirim': '#d97706',
    'Negosiasi': '#0ea5e9',
    'Deal Won': '#16a34a',
    'Deal Lost': '#dc2626'
  };

  const executiveDonutData = Object.keys(stageCounts).map(stg => ({
    label: stg,
    value: stageCounts[stg],
    displayVal: `${stageCounts[stg]} Klien`,
    color: stageColorMap[stg] || '#0284c7'
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header (Clean tanpa button) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h2 className="ws-page-title">
          Executive Dashboard
        </h2>
      </div>

      {/* 4 Top Metric Cards (Selaras Biru) dengan Navigasi Simulasi Demo */}
      <div className="ws-metric-grid">
        <div onClick={() => onNavigateModule && onNavigateModule('keuangandanprofit')} style={{ cursor: 'pointer' }} title="Klik untuk simulasi buka modul Keuangan & Profit">
          <MetricCard
            title="Net Cashflow Bulan Ini"
            value={executiveSummary.monthlyNetCashflow}
            change={executiveSummary.cashflowGrowth}
            trend="up"
            subtitle="vs bulan lalu"
            icon={DollarSign}
          />
        </div>
        <div onClick={() => onNavigateModule && onNavigateModule('crmdanklien')} style={{ cursor: 'pointer' }} title="Klik untuk simulasi buka modul CRM & Klien">
          <MetricCard
            title="Active Pipeline Value"
            value={executiveSummary.activePipelineValue}
            subtitle={`${crmClients.length} Prospek Aktif`}
            icon={Briefcase}
          />
        </div>
        <div onClick={() => onNavigateModule && onNavigateModule('tugasdankalender')} style={{ cursor: 'pointer' }} title="Klik untuk simulasi buka modul Tugas &amp; Kalender">
          <MetricCard
            title="Task Velocity & Health"
            value={`${executiveSummary.taskVelocityPercent}%`}
            subtitle={`${executiveSummary.taskVelocityStatus} delivery`}
            icon={Zap}
          />
        </div>
        <div onClick={() => onNavigateModule && onNavigateModule('sasarandankpi')} style={{ cursor: 'pointer' }} title="Klik untuk simulasi buka modul Sasaran & KPI">
          <MetricCard
            title="Rata-rata Capaian OKR"
            value={`${executiveSummary.okrAverageProgress}%`}
            subtitle="Target Kuartal Q4"
            icon={Target}
          />
        </div>
      </div>

      {/* Analytics 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Tren Arus Kas Bersih (6 Bulan Terakhir)"
          subtitle="Total pertumbuhan performa finansial"
          data={cashflowBarData}
        />
        <DonutChart
          title="Distribusi Tahapan Pipeline Klien"
          subtitle="Status perjalanan konversi prospek bisnis"
          data={executiveDonutData}
        />
      </div>

      {/* Progress & Alerts */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <ProgressBarWidget
          title="Kelancaran Delivery Tugas & Sprint"
          percentage={executiveSummary.taskVelocityPercent}
          statusLabel="Sangat Baik"
          targetText="Target SLA >= 90%"
        />

        {/* Action Center & Critical Alerts dengan Tombol Tindaklanjuti */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#0284c7" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Action Center & Critical Alerts
              </h4>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Simulasi Demo</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {executiveSummary.criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1' }}>
                    {alert.title}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {alert.detail}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (alert.title.includes('Proposal') || alert.title.includes('Enterprise')) {
                      onNavigateModule && onNavigateModule('crmdanklien');
                    } else if (alert.title.includes('Invoice') || alert.title.includes('Tagihan')) {
                      onNavigateModule && onNavigateModule('keuangandanprofit');
                    } else {
                      onNavigateModule && onNavigateModule('tugasdankalender');
                    }
                  }}
                  className="ws-btn-transition"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}
                >
                  <span>Buka Modul</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
