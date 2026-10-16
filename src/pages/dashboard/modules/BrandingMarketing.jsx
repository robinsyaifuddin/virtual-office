import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import NotionKanban from '../components/NotionKanban';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { Megaphone, Calendar, Share2, Plus, Table as TableIcon, LayoutGrid } from 'lucide-react';

export default function BrandingMarketing() {
  const { marketingCampaigns, addMarketingCampaign, updateMarketingCampaign, deleteMarketingCampaign } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState('table');

  const totalReach = marketingCampaigns.reduce((acc, c) => acc + (c.metrics?.reach || 0), 0);
  const totalLeads = marketingCampaigns.reduce((acc, c) => acc + (c.metrics?.leads || 0), 0);

  // Data Bar Chart: Jangkauan Konten per Judul/Kampanye
  const marketingBarData = marketingCampaigns.slice(0, 5).map((c, i) => {
    const reachVal = c.metrics?.reach || 1000;
    const colors = ['#0284c7', '#38bdf8', '#818cf8', '#a855f7', '#ec4899'];
    return {
      label: c.title.split(' ').slice(0, 2).join(' ') || `Konten ${i+1}`,
      value: reachVal,
      displayVal: reachVal >= 1000 ? `${(reachVal/1000).toFixed(0)}k` : reachVal,
      color: colors[i % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Saluran / Channel Konten
  const channelCounts = marketingCampaigns.reduce((acc, c) => {
    const ch = c.channel || 'Instagram';
    acc[ch] = (acc[ch] || 0) + 1;
    return acc;
  }, {});

  const channelColors = {
    'Instagram': '#e1306c',
    'LinkedIn': '#0077b5',
    'TikTok': '#0f172a',
    'Website': '#0284c7',
    'YouTube': '#ff0000'
  };

  const marketingDonutData = Object.keys(channelCounts).map(ch => ({
    label: ch,
    value: channelCounts[ch],
    displayVal: `${channelCounts[ch]} Post`,
    color: channelColors[ch] || '#0284c7'
  }));

  const columns = [
    { key: 'title', label: 'Judul Konten / Kampanye' },
    { key: 'channel', label: 'Channel Distribusi' },
    { key: 'pillar', label: 'Pilar Konten' },
    {
      key: 'stage',
      label: 'Status Produksi',
      render: (val) => (
        <span style={{
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: val === 'Selesai Tayang' ? '#dcfce7' : '#eff6ff',
          color: val === 'Selesai Tayang' ? '#15803d' : '#1d4ed8'
        }}>
          {val}
        </span>
      )
    },
    { key: 'publishDate', label: 'Jadwal Tayang' },
    {
      key: 'metrics',
      label: 'Performa (Reach / Leads)',
      render: (val) => val ? `${val.reach?.toLocaleString()} reach (${val.leads} leads)` : '-'
    }
  ];

  const kanbanStages = [
    { id: 'Ide', title: 'Ide Konten', color: '#94a3b8' },
    { id: 'Design/Video', title: 'Design/Video', color: '#38bdf8' },
    { id: 'Review', title: 'Review', color: '#fbbf24' },
    { id: 'Siap Tayang', title: 'Siap Tayang', color: '#818cf8' },
    { id: 'Selesai Tayang', title: 'Selesai Tayang', color: '#22c55e' }
  ];

  const handleAddCampaign = () => {
    const newCamp = {
      id: `MKT-${Date.now().toString().slice(-4)}`,
      title: 'Ide Video Edukasi Baru',
      channel: ['TikTok', 'Instagram'],
      pillar: 'Edukasi',
      stage: 'Ide',
      publishDate: new Date().toISOString().split('T')[0],
      adSpend: 0,
      metrics: { reach: 0, leads: 0 },
      mediaLink: null,
      createdBy: 'Executive Owner',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedBy: 'Executive Owner',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      comments: []
    };
    addMarketingCampaign(newCamp);
    return newCamp;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="ws-page-title">
            Branding & Marketing
          </h2>
        </div>

        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Tabel
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'kanban' ? '#ffffff' : 'transparent',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Kanban Produksi
          </button>
        </div>
      </div>

      <div className="ws-metric-grid">
        <MetricCard
          title="Total Jangkauan (Reach)"
          value={totalReach.toLocaleString('id-ID')}
          change="+32%"
          trend="up"
          icon={Megaphone}
        />
        <MetricCard
          title="Leads Masuk dari Konten"
          value={totalLeads}
          subtitle="Konversi kampanye aktif"
          icon={Share2}
        />
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Jangkauan Audiens Konten (Top 5)"
          subtitle="Perkiraan reach tayangan konten"
          data={marketingBarData}
        />
        <DonutChart
          title="Sebaran Konten per Channel Media"
          subtitle="Komposisi jalur publikasi digital"
          data={marketingDonutData}
          centerValue={`${marketingCampaigns.length}`}
          centerLabel="Total Post"
        />
      </div>

      {viewMode === 'table' ? (
        <NotionTable
          title="Kalender & Kampanye Pemasaran"
          data={marketingCampaigns}
          columns={columns}
          onAddRow={handleAddCampaign}
          onDeleteRow={deleteMarketingCampaign}
          onUpdateCell={(id, field, val) => updateMarketingCampaign(id, { [field]: val })}
          exportFileName="marketing_campaigns_digibooster.csv"
        />
      ) : (
        <NotionKanban
          columns={kanbanStages}
          items={marketingCampaigns}
          statusKey="stage"
          onAddItem={() => handleAddCampaign()}
          renderCard={(camp) => (
            <div>
              <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>{camp.pillar}</span>
              <h5 style={{ margin: '4px 0 6px 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{camp.title}</h5>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {camp.channel?.map((c, i) => (
                  <span key={i} style={{ fontSize: '0.68rem', backgroundColor: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
