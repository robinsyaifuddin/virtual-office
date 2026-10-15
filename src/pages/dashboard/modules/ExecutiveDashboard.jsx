import React from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, ProgressBarWidget } from '../components/ChartWidgets';
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header (Clean tanpa subtitle) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <h2 className="ws-page-title">
          Executive Dashboard
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onNavigateModule && onNavigateModule('crmdanklien')}
            className="ws-btn-transition"
            style={{
              padding: '9px 16px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            Lihat Pipeline Klien <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards (Selaras Biru) */}
      <div className="ws-metric-grid">
        <MetricCard
          title="Net Cashflow Bulan Ini"
          value={executiveSummary.monthlyNetCashflow}
          change={executiveSummary.cashflowGrowth}
          trend="up"
          subtitle="vs bulan lalu"
          icon={DollarSign}
        />
        <MetricCard
          title="Active Pipeline Value"
          value={executiveSummary.activePipelineValue}
          subtitle={`${crmClients.length} Prospek Aktif`}
          icon={Briefcase}
        />
        <MetricCard
          title="Task Velocity & Health"
          value={`${executiveSummary.taskVelocityPercent}%`}
          subtitle={`${executiveSummary.taskVelocityStatus} delivery`}
          icon={Zap}
        />
        <MetricCard
          title="Rata-rata Capaian OKR"
          value={`${executiveSummary.okrAverageProgress}%`}
          subtitle="Target Kuartal Q4"
          icon={Target}
        />
      </div>

      {/* Analytics & Alerts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <SimpleBarChart
          title="Tren Arus Kas Bersih (6 Bulan Terakhir)"
          data={cashflowBarData}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ProgressBarWidget
            title="Kelancaran Delivery Tugas & Sprint"
            percentage={executiveSummary.taskVelocityPercent}
            statusLabel="Sangat Baik"
            targetText="Target SLA >= 90%"
          />

          {/* Action Center & Critical Alerts */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#0284c7" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                Action Center & Critical Alerts
              </h4>
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
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1' }}>
                    {alert.title}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {alert.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
