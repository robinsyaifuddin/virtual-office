import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import NotionKanban from '../components/NotionKanban';
import NotionDetailDrawer from '../components/NotionDetailDrawer';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { Users, DollarSign, Plus, Table as TableIcon, LayoutGrid, FileText, Download } from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';

export default function CrmKlien() {
  const { crmClients, addCrmClient, updateCrmClient, deleteCrmClient, staffAgents } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Lead Masuk', 'Discovery Call', 'Proposal Terkirim', 'Negosiasi', 'Deal Won', 'Deal Lost'];

  // Filter klien berdasarkan tahapan / status pipeline prospek
  const filteredClients = crmClients.filter((c) => {
    if (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all') {
      return true;
    }
    return c.stage === statusFilter;
  });

  // Total Pipeline Value
  const totalPipeline = crmClients.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);
  const wonClients = crmClients.filter(c => c.stage?.includes('Won'));
  const totalWonValue = wonClients.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

  // Data Grafik Batang: Nilai Pipeline per Klien
  const crmBarData = crmClients.slice(0, 5).map((c, i) => {
    const valJt = Math.round((c.dealValue || 0) / 1000000);
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawName = (c.name && typeof c.name === 'string' && c.name.trim()) ? c.name : `Klien ${i+1}`;
    return {
      label: rawName.split(' ')[0] || `Klien ${i+1}`,
      value: valJt,
      displayVal: `Rp ${valJt}Jt`,
      color: colors[i % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Tahapan (Stage) Klien
  const stageCounts = crmClients.reduce((acc, c) => {
    const stg = c.stage || 'Prospek Awal';
    acc[stg] = (acc[stg] || 0) + 1;
    return acc;
  }, {});

  const stageColorMap = {
    'Prospek Awal': '#60a5fa',
    'Follow-up / Demo': '#f59e0b',
    'Negosiasi Proposal': '#0ea5e9',
    'Deal Won': '#0284c7',
    'Deal Lost': '#ef4444'
  };

  const crmDonutData = Object.keys(stageCounts).map(stage => ({
    label: stage,
    value: stageCounts[stage],
    displayVal: `${stageCounts[stage]} Klien`,
    color: stageColorMap[stage] || '#0284c7'
  }));

  const columns = [
    { 
      key: 'name', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Nama Klien / Perusahaan
        </span>
      ), 
      minWidth: '220px',
      render: (val) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {val || '-'}
        </span>
      )
    },
    { 
      key: 'contact', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> WhatsApp PIC
        </span>
      ), 
      minWidth: '150px',
      render: (val) => (
        <span style={{ color: '#334155', fontWeight: 500 }}>
          {val || '-'}
        </span>
      )
    },
    {
      key: 'stage',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Tahapan (Stage)
        </span>
      ),
      minWidth: '160px',
      render: (val) => {
        const stageColors = {
          'Lead Masuk': { text: '#64748b', bg: '#f1f5f9' },
          'Discovery Call': { text: '#0284c7', bg: '#e0f2fe' },
          'Proposal Terkirim': { text: '#d97706', bg: '#fef3c7' },
          'Negosiasi': { text: '#0284c7', bg: '#eff6ff' },
          'Deal Won': { text: '#16a34a', bg: '#dcfce7' },
          'Deal Lost': { text: '#dc2626', bg: '#fee2e2' }
        };
        const conf = stageColors[val] || { text: '#0284c7', bg: '#eff6ff' };
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: conf.text,
              backgroundColor: conf.bg
            }}
          >
            {val || 'Lead Masuk'}
          </span>
        );
      }
    },
    {
      key: 'dealValue',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Nilai Deal
        </span>
      ),
      minWidth: '130px',
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>
          {`Rp ${(val || 0).toLocaleString('id-ID')}`}
        </span>
      )
    },
    { 
      key: 'services', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Paket Layanan
        </span>
      ),
      minWidth: '150px',
      render: (val) => {
        const svc = Array.isArray(val) ? val[0] : (val || 'Custom AI');
        return (
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
            {svc}
          </span>
        );
      }
    },
    { 
      key: 'pic', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> PIC Internal
        </span>
      ),
      minWidth: '150px',
      render: (val) => (
        <span style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.8rem' }}>
          {val || '-'}
        </span>
      )
    },
    { 
      key: 'updatedAt', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Terakhir Diperbarui
        </span>
      ),
      minWidth: '135px',
      render: (val) => (
        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
          {val ? String(val).split(' ')[0] : '-'}
        </span>
      )
    },
    {
      key: 'contractDoc',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Kontrak PKS
        </span>
      ),
      minWidth: '150px',
      render: (val) => val ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontSize: '0.78rem', fontWeight: 600 }}>
          <FileText size={12} /> {val}
        </span>
      ) : (
        <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Belum ada</span>
      )
    }
  ];

  const kanbanColumns = [
    { id: 'Lead Masuk', title: 'Lead Masuk', color: '#94a3b8' },
    { id: 'Discovery Call', title: 'Discovery Call', color: '#38bdf8' },
    { id: 'Proposal Terkirim', title: 'Proposal Terkirim', color: '#fbbf24' },
    { id: 'Negosiasi', title: 'Negosiasi', color: '#0284c7' },
    { id: 'Deal Won', title: 'Deal Won', color: '#0284c7' }
  ];

  const handleRowClick = (client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleAddQuickClient = () => {
    const newId = `CRM-00${crmClients.length + 1}`;
    const newClient = {
      id: newId,
      name: '',
      contact: '',
      stage: 'Lead Masuk',
      dealValue: 0,
      services: [],
      pic: '',
      contractDoc: null,
      createdBy: 'Executive Owner',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedBy: 'Executive Owner',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      comments: []
    };
    addCrmClient(newClient);
    return newClient;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="ws-page-title">
            CRM &amp; Klien
          </h2>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="ws-metric-grid">
        <MetricCard
          title="Total Nilai Pipeline"
          value={`Rp ${(totalPipeline / 1000000).toFixed(0)} Juta`}
          subtitle={`${crmClients.length} Prospek Aktif`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Total Deal Won"
          value={`Rp ${(totalWonValue / 1000000).toFixed(0)} Juta`}
          subtitle={`${wonClients.length} Klien Menang`}
          icon={Users}
          color="green"
        />
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Nilai Prospek per Klien (Top 5)"
          subtitle="Estimasi potensi nilai kesepakatan"
          data={crmBarData}
        />
        <DonutChart
          title="Distribusi Tahapan Pipeline Klien"
          subtitle="Status perjalanan konversi prospek"
          data={crmDonutData}
        />
      </div>

      {/* Main Content Area: NotionTable membungkus seluruh mode tampilan (Tabel & Kanban) */}
      <NotionTable
        title="Daftar Klien & Prospek"
        data={filteredClients}
        columns={columns}
        onAddRow={handleAddQuickClient}
        onEditRow={handleRowClick}
        onDeleteRow={deleteCrmClient}
        onUpdateCell={(id, field, val) => updateCrmClient(id, { [field]: val })}
        exportFileName="crm_klien_digibooster.csv"
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
                columns={kanbanColumns}
                items={filteredData}
                statusKey="stage"
                onAddItem={() => handleAddQuickClient()}
                renderCard={(client) => (
                  <div onClick={() => handleRowClick(client)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h5 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{client.name}</h5>
                    </div>
                    <p style={{ margin: '6px 0 8px 0', fontSize: '0.85rem', fontWeight: 700, color: '#0284c7' }}>
                      Rp {(client.dealValue || 0).toLocaleString('id-ID')}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                      <span>PIC: {client.pic}</span>
                      <span>{client.services?.[0]}</span>
                    </div>
                  </div>
                )}
              />
            );
          }
          return null;
        }}
      />

      {/* Detail Drawer */}
      <NotionDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={selectedClient}
        fields={[
          { key: 'name', label: 'Nama Perusahaan / Klien' },
          { key: 'contact', label: 'Nomor Kontak & WhatsApp' },
          { key: 'stage', label: 'Tahapan Saat Ini' },
          { key: 'dealValue', label: 'Nilai Deal (IDR)' },
          { key: 'services', label: 'Layanan yang Diambil' },
          { key: 'pic', label: 'Penanggung Jawab Internal (PIC)' },
          { key: 'contractDoc', label: 'Lampiran Berkas Kontrak' },
          { key: 'updatedAt', label: 'Terakhir Diperbarui' }
        ]}
      />
    </div>
  );
}
