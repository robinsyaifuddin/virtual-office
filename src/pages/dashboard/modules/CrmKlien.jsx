import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import NotionKanban from '../components/NotionKanban';
import NotionDetailDrawer from '../components/NotionDetailDrawer';
import MetricCard from '../components/MetricCard';
import { Users, DollarSign, Plus, Table as TableIcon, LayoutGrid, FileText, Download } from 'lucide-react';

export default function CrmKlien() {
  const { crmClients, addCrmClient, updateCrmClient, deleteCrmClient, staffAgents } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Total Pipeline Value
  const totalPipeline = crmClients.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);
  const wonClients = crmClients.filter(c => c.stage.includes('Won'));
  const totalWonValue = wonClients.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);

  const columns = [
    { key: 'name', label: 'Nama Klien / Perusahaan' },
    { key: 'contact', label: 'WhatsApp PIC' },
    {
      key: 'stage',
      label: 'Tahapan (Stage)',
      render: (val) => {
        const isWon = val.includes('Won');
        const isLost = val.includes('Lost');
        return (
          <span style={{
            padding: '3px 8px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: isWon ? '#dcfce7' : isLost ? '#fee2e2' : '#eff6ff',
            color: isWon ? '#15803d' : isLost ? '#b91c1c' : '#1d4ed8'
          }}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'dealValue',
      label: 'Nilai Deal',
      render: (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`
    },
    { key: 'services', label: 'Paket Layanan' },
    { 
      key: 'pic', 
      label: 'PIC Internal',
      render: (val, row, update) => (
        <select
          value={val || (staffAgents && staffAgents[0] ? staffAgents[0].name : '')}
          onChange={(e) => update ? update(e.target.value) : updateCrmClient(row.id, { pic: e.target.value })}
          style={{
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            color: '#0284c7',
            fontSize: '0.78rem',
            fontWeight: 500,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {staffAgents && staffAgents.map((staff) => (
            <option key={staff.id || staff.name} value={staff.name}>
              {staff.name}
            </option>
          ))}
        </select>
      )
    },
    {
      key: 'contractDoc',
      label: 'Kontrak PKS',
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
    { id: 'Negosiasi', title: 'Negosiasi', color: '#818cf8' },
    { id: 'Deal Won 🎉', title: 'Deal Won 🎉', color: '#22c55e' }
  ];

  const handleRowClick = (client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleAddQuickClient = () => {
    const newId = `CRM-00${crmClients.length + 1}`;
    const newClient = {
      id: newId,
      name: 'Klien Prospek Baru',
      contact: '+62 812-0000-1111',
      stage: 'Lead Masuk',
      dealValue: 25000000,
      services: ['Custom AI'],
      pic: 'Kevin Pratama',
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
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            CRM & Manajemen Klien
          </h2>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#0f172a' : '#64748b',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <TableIcon size={14} /> Tabel
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'kanban' ? '#ffffff' : 'transparent',
                color: viewMode === 'kanban' ? '#0f172a' : '#64748b',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <LayoutGrid size={14} /> Pipeline Kanban
            </button>
          </div>
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

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <NotionTable
          title="Daftar Klien & Prospek"
          data={crmClients}
          columns={columns}
          onAddRow={handleAddQuickClient}
          onEditRow={handleRowClick}
          onDeleteRow={deleteCrmClient}
          onUpdateCell={(id, field, val) => updateCrmClient(id, { [field]: val })}
          exportFileName="crm_klien_digibooster.csv"
        />
      ) : (
        <NotionKanban
          columns={kanbanColumns}
          items={crmClients}
          statusKey="stage"
          onAddItem={() => handleAddQuickClient()}
          renderCard={(client) => (
            <div onClick={() => handleRowClick(client)}>
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
      )}

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
