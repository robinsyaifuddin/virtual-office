import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import NotionKanban from '../components/NotionKanban';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { Megaphone, Calendar, Share2, Plus, Table as TableIcon, LayoutGrid } from 'lucide-react';

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

export default function BrandingMarketing() {
  const { marketingCampaigns, addMarketingCampaign, updateMarketingCampaign, deleteMarketingCampaign } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState('table');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Ide', 'Design/Video', 'Review', 'Siap Tayang', 'Selesai Tayang'];

  const marketingPillars = [
    'Edukasi',
    'Case Study',
    'Promo/Hard Sell',
    'Branding',
    'Behind The Scenes',
    'Tips & Trick'
  ];

  // Filter kampanye berdasarkan status tahapan konten & pilar kategori
  const filteredCampaigns = marketingCampaigns.filter((c) => {
    let matchesStatus = true;
    if (statusFilter && statusFilter !== 'Semua Status' && statusFilter !== 'ALL' && statusFilter !== 'all') {
      if (statusFilter === 'Ide' || statusFilter === 'Ide Konten') {
        matchesStatus = (c.stage === 'Ide' || c.stage === 'Ide Konten');
      } else {
        matchesStatus = (c.stage === statusFilter);
      }
    }
    const matchesCat = (!activeCategory || activeCategory === 'ALL' || activeCategory === 'all')
      ? true 
      : c.pillar === activeCategory;
    return matchesStatus && matchesCat;
  });

  const totalReach = marketingCampaigns.reduce((acc, c) => acc + (c.metrics?.reach || 0), 0);
  const totalLeads = marketingCampaigns.reduce((acc, c) => acc + (c.metrics?.leads || 0), 0);

  // Data Bar Chart: Jangkauan Konten per Judul/Kampanye
  const marketingBarData = marketingCampaigns.slice(0, 5).map((c, i) => {
    const reachVal = c.metrics?.reach || 1000;
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawTitle = (c.title && typeof c.title === 'string' && c.title.trim()) ? c.title : `Konten ${i+1}`;
    const shortLabel = rawTitle.split(' ').slice(0, 2).join(' ') || `Konten ${i+1}`;
    return {
      label: shortLabel,
      value: reachVal,
      displayVal: reachVal >= 1000 ? `${(reachVal/1000).toFixed(0)}k` : reachVal,
      color: colors[i % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Produksi Kampanye
  const stageCounts = marketingCampaigns.reduce((acc, c) => {
    const stg = (c.stage && typeof c.stage === 'string' && c.stage.trim()) ? c.stage.trim() : 'Ide';
    acc[stg] = (acc[stg] || 0) + 1;
    return acc;
  }, {});

  const stageColors = {
    'Ide': '#64748b',
    'Design/Video': '#0284c7',
    'Review': '#d97706',
    'Siap Tayang': '#6366f1',
    'Selesai Tayang': '#16a34a'
  };

  const marketingDonutData = Object.keys(stageCounts).map(stg => ({
    label: stg,
    value: stageCounts[stg],
    displayVal: `${stageCounts[stg]} Konten`,
    color: stageColors[stg] || '#0284c7'
  }));

  const columns = [
    { 
      key: 'title', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Judul Konten / Kampanye
        </span>
      ), 
      minWidth: '220px' 
    },
    { 
      key: 'channel', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Channel Distribusi
        </span>
      ),
      minWidth: '140px',
      render: (val, row, update) => {
        const ch = Array.isArray(val) ? val[0] : (val || 'Instagram');
        return (
          <select
            value={ch}
            onChange={(e) => update ? update([e.target.value]) : updateMarketingCampaign(row.id, { channel: [e.target.value] })}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: '#0f172a',
              fontSize: '0.8rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              padding: '2px 0'
            }}
          >
            <option value="Instagram" style={{ color: '#0f172a', fontWeight: 500 }}>Instagram</option>
            <option value="TikTok" style={{ color: '#0f172a', fontWeight: 500 }}>TikTok</option>
            <option value="LinkedIn" style={{ color: '#0f172a', fontWeight: 500 }}>LinkedIn</option>
            <option value="YouTube" style={{ color: '#0f172a', fontWeight: 500 }}>YouTube</option>
            <option value="Website" style={{ color: '#0f172a', fontWeight: 500 }}>Website</option>
            <option value="Meta Ads" style={{ color: '#0f172a', fontWeight: 500 }}>Meta Ads</option>
            <option value="Email" style={{ color: '#0f172a', fontWeight: 500 }}>Email</option>
          </select>
        );
      }
    },
    { 
      key: 'pillar', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Pilar Konten
        </span>
      ),
      minWidth: '150px',
      options: marketingPillars,
      render: (val, row, update) => (
        <select
          value={val || 'Edukasi'}
          onChange={(e) => update ? update(e.target.value) : updateMarketingCampaign(row.id, { pillar: e.target.value })}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: '#0f172a',
            fontSize: '0.8rem',
            fontWeight: 700,
            outline: 'none',
            cursor: 'pointer',
            padding: '2px 0'
          }}
        >
          <option value="Edukasi" style={{ color: '#0f172a', fontWeight: 500 }}>Edukasi</option>
          <option value="Case Study" style={{ color: '#0f172a', fontWeight: 500 }}>Case Study</option>
          <option value="Promo/Hard Sell" style={{ color: '#0f172a', fontWeight: 500 }}>Promo/Hard Sell</option>
          <option value="Branding" style={{ color: '#0f172a', fontWeight: 500 }}>Branding</option>
          <option value="Behind The Scenes" style={{ color: '#0f172a', fontWeight: 500 }}>Behind The Scenes</option>
          <option value="Tips & Trick" style={{ color: '#0f172a', fontWeight: 500 }}>Tips & Trick</option>
        </select>
      )
    },
    {
      key: 'stage',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status Produksi
        </span>
      ),
      minWidth: '150px',
      render: (val, row, update) => {
        const stageTextColors = {
          'Ide': '#64748b',
          'Design/Video': '#0284c7',
          'Review': '#d97706',
          'Siap Tayang': '#6366f1',
          'Selesai Tayang': '#16a34a'
        };
        const currentTextColor = stageTextColors[val] || '#0284c7';
        return (
          <select
            value={val || 'Ide'}
            onChange={(e) => update ? update(e.target.value) : updateMarketingCampaign(row.id, { stage: e.target.value })}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: currentTextColor,
              fontSize: '0.8rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              padding: '2px 0'
            }}
          >
            <option value="Ide" style={{ color: '#64748b', fontWeight: 600 }}>Ide Konten</option>
            <option value="Design/Video" style={{ color: '#0284c7', fontWeight: 600 }}>Design/Video</option>
            <option value="Review" style={{ color: '#d97706', fontWeight: 600 }}>Review</option>
            <option value="Siap Tayang" style={{ color: '#6366f1', fontWeight: 600 }}>Siap Tayang</option>
            <option value="Selesai Tayang" style={{ color: '#16a34a', fontWeight: 600 }}>Selesai Tayang</option>
          </select>
        );
      }
    },
    { 
      key: 'publishDate', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Jadwal Tayang
        </span>
      ),
      minWidth: '135px',
      render: (val, row, update) => (
        <input
          type="date"
          value={toInputDateFormat(val)}
          onChange={(e) => update ? update(e.target.value) : updateMarketingCampaign(row.id, { publishDate: e.target.value })}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'inherit',
            color: '#0f172a',
            outline: 'none',
            padding: '2px 4px',
            cursor: 'pointer'
          }}
        />
      )
    },
    {
      key: 'metrics',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Performa (Reach / Leads)
        </span>
      ),
      minWidth: '160px',
      render: (val) => val ? `${(val.reach || 0).toLocaleString('id-ID')} reach (${val.leads || 0} leads)` : '-'
    }
  ];

  const kanbanStages = [
    { id: 'Ide', title: 'Ide Konten', color: '#94a3b8' },
    { id: 'Design/Video', title: 'Design/Video', color: '#38bdf8' },
    { id: 'Review', title: 'Review', color: '#fbbf24' },
    { id: 'Siap Tayang', title: 'Siap Tayang', color: '#818cf8' },
    { id: 'Selesai Tayang', title: 'Selesai Tayang', color: '#22c55e' }
  ];

  const handleAddCampaign = (overridePillar) => {
    const defaultPillar = overridePillar || ((activeCategory && activeCategory !== 'ALL' && activeCategory !== 'all')
      ? activeCategory
      : marketingPillars[0]);

    const newCamp = {
      id: `MKT-${Date.now().toString().slice(-4)}`,
      title: '',
      channel: ['Instagram'],
      pillar: defaultPillar,
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
          title="Distribusi Status Produksi Konten"
          subtitle="Status siklus kampanye & publikasi"
          data={marketingDonutData}
        />
      </div>

      {/* Main Content Area: NotionTable membungkus seluruh mode tampilan (Tabel & Kanban) */}
      <NotionTable
        title="Kalender & Kampanye Pemasaran"
        data={filteredCampaigns}
        columns={columns}
        onAddRow={handleAddCampaign}
        onDeleteRow={deleteMarketingCampaign}
        onUpdateCell={(id, field, val) => updateMarketingCampaign(id, { [field]: val })}
        exportFileName="marketing_campaigns_digibooster.csv"
        categories={marketingPillars}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        categoryKey="pillar"
        currentViewMode={viewMode}
        onChangeViewMode={setViewMode}
        availableViewModes={['table', 'kanban']}
        statusFilter={statusFilter}
        onChangeStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        archiveMonth={archiveMonth}
        onChangeArchiveMonth={setArchiveMonth}
        availableArchiveMonths={['September 2026', 'Agustus 2026', 'Juli 2026']}
        renderCustomView={({ filteredData }) => {
          if (viewMode === 'kanban') {
            return (
              <NotionKanban
                columns={kanbanStages}
                items={filteredData}
                statusKey="stage"
                onAddItem={() => handleAddCampaign()}
                renderCard={(camp) => {
                  const channelList = Array.isArray(camp.channel) 
                    ? camp.channel 
                    : (camp.channel ? [camp.channel] : ['Instagram']);
                  return (
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>{camp.pillar || 'Konten'}</span>
                      <h5 style={{ margin: '4px 0 6px 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{camp.title || 'Tanpa Judul'}</h5>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {channelList.map((c, i) => (
                          <span key={i} style={{ fontSize: '0.68rem', backgroundColor: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
            );
          }
          return null;
        }}
      />
    </div>
  );
}
