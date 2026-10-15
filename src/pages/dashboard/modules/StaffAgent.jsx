import React from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { Users, Bot, Briefcase, Mail } from 'lucide-react';

export default function StaffAgent() {
  const { staffAgents, addStaffAgent, updateStaffAgent, deleteStaffAgent } = useWorkspaceStore();

  const humanStaff = staffAgents.filter(s => s.type === 'Staf Manusia');
  const aiStaff = staffAgents.filter(s => s.type.includes('AI'));

  const columns = [
    {
      key: 'name',
      label: 'Nama Anggota / AI Agent',
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
      label: 'Tipe',
      render: (val) => (
        <span style={{
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          backgroundColor: val.includes('AI') ? '#faf5ff' : '#eff6ff',
          color: val.includes('AI') ? '#7e22ce' : '#1d4ed8'
        }}>
          {val}
        </span>
      )
    },
    { key: 'role', label: 'Peran & Tanggung Jawab' },
    { key: 'department', label: 'Departemen' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span style={{
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          backgroundColor: val.includes('Online') ? '#dcfce7' : '#f1f5f9',
          color: val.includes('Online') ? '#15803d' : '#64748b'
        }}>
          {val}
        </span>
      )
    },
    { key: 'contact', label: 'Jalur Kontak' }
  ];

  const handleAddStaff = () => {
    const newAgent = {
      id: `STF-${Date.now().toString().slice(-4)}`,
      name: 'DigiBot Sales Assistant',
      type: 'AI Agent DigiBooster',
      role: 'Autonomous Lead Qualifier (Groq Engine)',
      department: 'Sales & Marketing',
      status: 'Online / Bertugas',
      activeProjects: ['Pipeline Auto-Followup'],
      contact: 'bot-sales@digibooster.internal',
      avatar: null
    };
    addStaffAgent(newAgent);
    return newAgent;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Staff & AI Agents (Direktori SDM)
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

      <NotionTable
        title="Direktori Karyawan & Autonomous Agents"
        data={staffAgents}
        columns={columns}
        onAddRow={handleAddStaff}
        onDeleteRow={deleteStaffAgent}
        onUpdateCell={(id, field, val) => updateStaffAgent(id, { [field]: val })}
        exportFileName="staff_ai_agents_digibooster.csv"
      />
    </div>
  );
}
