import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { Users, Bot, Briefcase, Mail } from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';

export default function StaffAgent() {
  const { staffAgents, addStaffAgent, updateStaffAgent, deleteStaffAgent } = useWorkspaceStore();
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Online / Bertugas', 'Standby', 'Istirahat', 'Cuti / Off'];

  // Filter staf berdasarkan status ketersediaan personil
  const filteredStaff = staffAgents.filter((s) => {
    if (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all') {
      return true;
    }
    return s.status === statusFilter;
  });

  const humanStaff = staffAgents.filter(s => s.type === 'Staf Manusia');
  const aiStaff = staffAgents.filter(s => (s.type || '').includes('AI'));

  // Data Bar Chart: Personil per Departemen
  const deptCounts = staffAgents.reduce((acc, s) => {
    const d = s.department || 'Operasional';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const staffBarData = Object.keys(deptCounts).map((dept, idx) => {
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawDept = (dept && typeof dept === 'string') ? dept : `Divisi ${idx+1}`;
    return {
      label: rawDept.split(' ')[0] || dept,
      value: deptCounts[dept],
      displayVal: `${deptCounts[dept]} Orang`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Komposisi Manusia vs Autonomous AI Agent
  const staffDonutData = [
    { label: 'Staf Manusia', value: humanStaff.length, displayVal: `${humanStaff.length}`, color: '#0284c7' },
    { label: 'Autonomous AI', value: aiStaff.length, displayVal: `${aiStaff.length}`, color: '#0ea5e9' }
  ];

  const columns = [
    {
      key: 'name',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> Nama Anggota / AI Agent
        </span>
      ),
      minWidth: '220px',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {row.avatar ? (
            <img src={row.avatar} alt={val} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem' }}>
              AI
            </div>
          )}
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{val}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Tipe Anggota
        </span>
      ),
      minWidth: '150px',
      render: (val, row, update) => (
        <select
          value={val || 'Staf Manusia'}
          onChange={(e) => update ? update(e.target.value) : updateStaffAgent(row.id, { type: e.target.value })}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0f172a',
            outline: 'none',
            cursor: 'pointer',
            padding: '2px 0'
          }}
        >
          <option value="Staf Manusia" style={{ color: '#0f172a', fontWeight: 600 }}>Staf Manusia</option>
          <option value="AI Agent DigiBooster" style={{ color: '#0f172a', fontWeight: 600 }}>AI Agent DigiBooster</option>
        </select>
      )
    },
    { 
      key: 'role', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Peran & Tanggung Jawab
        </span>
      ), 
      minWidth: '200px' 
    },
    { 
      key: 'department', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Departemen
        </span>
      ),
      minWidth: '150px',
      render: (val, row, update) => (
        <select
          value={val || 'Manajemen'}
          onChange={(e) => update ? update(e.target.value) : updateStaffAgent(row.id, { department: e.target.value })}
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
          <option value="Manajemen" style={{ color: '#0f172a', fontWeight: 500 }}>Manajemen</option>
          <option value="Tech" style={{ color: '#0f172a', fontWeight: 500 }}>Tech</option>
          <option value="Kreatif" style={{ color: '#0f172a', fontWeight: 500 }}>Kreatif</option>
          <option value="Sales & Marketing" style={{ color: '#0f172a', fontWeight: 500 }}>Sales & Marketing</option>
        </select>
      )
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status Kerja
        </span>
      ),
      minWidth: '140px',
      render: (val, row, update) => {
        const isOnline = val?.includes('Online');
        const isRest = val?.includes('Istirahat');
        const isStandby = val?.includes('Standby');
        const statusColor = isOnline ? '#16a34a' : isRest ? '#d97706' : isStandby ? '#0284c7' : '#64748b';
        return (
          <select
            value={val || 'Online / Bertugas'}
            onChange={(e) => update ? update(e.target.value) : updateStaffAgent(row.id, { status: e.target.value })}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: statusColor,
              outline: 'none',
              cursor: 'pointer',
              padding: '2px 0'
            }}
          >
            <option value="Online / Bertugas" style={{ color: '#16a34a', fontWeight: 600 }}>Online / Bertugas</option>
            <option value="Standby" style={{ color: '#0284c7', fontWeight: 600 }}>Standby</option>
            <option value="Istirahat" style={{ color: '#d97706', fontWeight: 600 }}>Istirahat</option>
            <option value="Cuti / Off" style={{ color: '#64748b', fontWeight: 600 }}>Cuti / Off</option>
          </select>
        );
      }
    },
    { 
      key: 'contact', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Jalur Kontak
        </span>
      ), 
      minWidth: '160px' 
    }
  ];

  const handleAddStaff = () => {
    const newAgent = {
      id: `STF-${Date.now().toString().slice(-4)}`,
      name: '',
      type: 'Staf Manusia',
      role: '',
      department: 'Manajemen',
      status: 'Online / Bertugas',
      activeProjects: [],
      contact: '',
      avatar: null
    };
    addStaffAgent(newAgent);
    return newAgent;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Staff &amp; AI Agents
        </h2>
      </div>

      <div className="ws-metric-grid">
        <MetricCard
          title="Staf Manusia Aktif"
          value={humanStaff.length}
          subtitle="Tim inti & spesialis"
          icon={Users}
        />
        <MetricCard
          title="AI Agents Operasional"
          value={aiStaff.length}
          subtitle="Autonomous 24/7 worker"
          icon={Bot}
        />
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Alokasi Tim per Departemen"
          subtitle="Sebaran SDM dan agen automasi kerja"
          data={staffBarData}
        />
        <DonutChart
          title="Rasio Staf Manusia vs Autonomous AI"
          subtitle="Struktur kolaborasi tenaga kerja modern"
          data={staffDonutData}
          
        />
      </div>

      <NotionTable
        title="Direktori Karyawan & Autonomous Agents"
        data={filteredStaff}
        columns={columns}
        onAddRow={handleAddStaff}
        onDeleteRow={deleteStaffAgent}
        onUpdateCell={(id, field, val) => updateStaffAgent(id, { [field]: val })}
        exportFileName="staff_ai_agents_digibooster.csv"
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
