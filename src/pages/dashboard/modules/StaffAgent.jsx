import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { 
  Users, 
  Bot, 
  Briefcase, 
  Mail, 
  Sparkles, 
  Cpu, 
  Sliders, 
  Terminal, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Settings, 
  Zap, 
  UserCheck, 
  FileText,
  Plus
} from 'lucide-react';

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
  const store = useWorkspaceStore();
  const staffAgents = Array.isArray(store?.staffAgents) ? store.staffAgents : [];
  const addStaffAgent = store?.addStaffAgent || (() => {});
  const updateStaffAgent = store?.updateStaffAgent || (() => {});
  const deleteStaffAgent = store?.deleteStaffAgent || (() => {});

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'human' | 'ai'
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const [selectedAgentForSetup, setSelectedAgentForSetup] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const statusOptions = ['Semua Status', 'Online / Bertugas', 'Standby', 'Istirahat', 'Cuti / Off'];

  // Pisahkan kategori personil
  const humanStaff = staffAgents.filter(s => s && s.type === 'Staf Manusia');
  const aiStaff = staffAgents.filter(s => s && (s.type || '').includes('AI'));

  // Data terfilter sesuai tab aktif & status filter
  const currentTabPool = activeTab === 'human' 
    ? humanStaff 
    : activeTab === 'ai' 
      ? aiStaff 
      : staffAgents;

  const filteredStaff = currentTabPool.filter((s) => {
    if (!s) return false;
    if (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all') {
      return true;
    }
    return s.status === statusFilter;
  });

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

  // Data Donut Chart: Distribusi Status Kerja Personil & AI
  const statusCounts = staffAgents.reduce((acc, s) => {
    const st = (s && s.status && typeof s.status === 'string' && s.status.trim()) ? s.status.trim() : 'Online / Bertugas';
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Online / Bertugas': '#16a34a',
    'Standby': '#0284c7',
    'Istirahat': '#d97706',
    'Cuti / Off': '#dc2626'
  };

  const staffDonutData = Object.keys(statusCounts).map(st => ({
    label: st,
    value: statusCounts[st],
    displayVal: `${statusCounts[st]} Personil`,
    color: statusColors[st] || '#0284c7'
  }));

  const handleOpenSetupModal = (agent) => {
    setSelectedAgentForSetup({ ...agent });
    setShowSetupModal(true);
  };

  const handleSaveSetupModal = (e) => {
    e.preventDefault();
    if (!selectedAgentForSetup) return;
    updateStaffAgent(selectedAgentForSetup.id, {
      persona: selectedAgentForSetup.persona,
      systemPrompt: selectedAgentForSetup.systemPrompt,
      aiEngine: selectedAgentForSetup.aiEngine,
      role: selectedAgentForSetup.role,
      name: selectedAgentForSetup.name,
      department: selectedAgentForSetup.department,
      status: selectedAgentForSetup.status
    });
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      setShowSetupModal(false);
    }, 1200);
  };

  // Kolom Tabel Standar
  const columns = [
    {
      key: 'name',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> Nama Anggota / AI Agent
        </span>
      ),
      minWidth: '240px',
      render: (val, row) => {
        const isAI = (row.type || '').includes('AI');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {row.avatar ? (
              <img 
                src={row.avatar} 
                alt={val} 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: isAI ? '2px solid #0284c7' : '2px solid #e2e8f0' 
                }} 
              />
            ) : (
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                backgroundColor: isAI ? '#0284c7' : '#64748b', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                fontSize: '0.72rem',
                fontWeight: 700,
                boxShadow: isAI ? '0 2px 8px rgba(2, 132, 199, 0.35)' : 'none'
              }}>
                {isAI ? <Bot size={18} /> : 'HM'}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{val}</span>
                {isAI && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Sparkles size={9} /> AI Agent
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>
                ID: {row.id}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'type',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Tipe Anggota
        </span>
      ),
      minWidth: '160px',
      render: (val, row, update) => (
        <select
          value={val || 'Staf Manusia'}
          onChange={(e) => update ? update(e.target.value) : updateStaffAgent(row.id, { type: e.target.value })}
          style={{
            border: '1px solid #e2e8f0',
            backgroundColor: val?.includes('AI') ? '#f0f9ff' : '#ffffff',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: val?.includes('AI') ? '#0284c7' : '#0f172a',
            outline: 'none',
            cursor: 'pointer',
            padding: '4px 8px'
          }}
        >
          <option value="Staf Manusia" style={{ color: '#0f172a', fontWeight: 600 }}>Staf Manusia</option>
          <option value="AI Agent DigiBooster" style={{ color: '#0284c7', fontWeight: 700 }}>AI Agent DigiBooster</option>
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
      minWidth: '220px' 
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
      minWidth: '150px',
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
      key: 'personaSetup', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={14} color="#0284c7" /> Setup Persona & Prompt
        </span>
      ), 
      minWidth: '200px',
      render: (val, row) => {
        const isAI = (row.type || '').includes('AI');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleOpenSetupModal(row)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: isAI ? '1px solid #bae6fd' : '1px solid #cbd5e1',
                backgroundColor: isAI ? '#f0f9ff' : '#f8fafc',
                color: isAI ? '#0284c7' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Setup instruksi persona & model AI"
            >
              {isAI ? <Sparkles size={12} /> : <Sliders size={12} />}
              {isAI ? 'Setup AI Persona' : 'Setup Profile PIC'}
            </button>
            {isAI && row.executionCount !== undefined && (
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                {row.executionCount}x Eksekusi
              </span>
            )}
          </div>
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
    const isAiTab = activeTab === 'ai';
    const newAgent = {
      id: `STF-${Date.now().toString().slice(-4)}`,
      name: isAiTab ? 'New DigiBot Agent' : 'Nama Staf Baru',
      type: isAiTab ? 'AI Agent DigiBooster' : 'Staf Manusia',
      role: isAiTab ? 'Autonomous AI Specialist' : 'Staff Operasional',
      department: 'Manajemen',
      status: 'Online / Bertugas',
      activeProjects: [],
      contact: isAiTab ? 'bot@digibooster.internal' : '',
      avatar: null,
      persona: isAiTab ? 'AI Agent yang siap mengeksekusi tugas otomatis saat di-tag sebagai PIC.' : 'Personil tim operasional.',
      systemPrompt: isAiTab ? 'Kamu adalah AI Agent DigiBooster yang bertugas mengeksekusi tugas secara otomatis.' : '',
      aiEngine: isAiTab ? 'Groq Llama 3.3 70B Versatile' : 'Human Operator',
      capabilities: isAiTab ? ['Eksekusi Tugas Otomatis', 'Pembuatan Draft Deliverable'] : ['Manajemen PIC'],
      executionCount: 0
    };
    addStaffAgent(newAgent);
    return newAgent;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Halaman */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="ws-page-title">
            Staff &amp; AI Agents Hub
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Manajemen direktori tim operasional, PIC penugasan, serta konfigurasi persona AI Agent mandiri.
          </p>
        </div>

        {/* Tab Filter Tampilan: Semua | Staf Manusia | AI Agent Persona */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          backgroundColor: '#f1f5f9',
          borderRadius: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'all' ? '#ffffff' : 'transparent',
              color: activeTab === 'all' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'all' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            Semua ({staffAgents.length})
          </button>
          <button
            onClick={() => setActiveTab('human')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'human' ? '#ffffff' : 'transparent',
              color: activeTab === 'human' ? '#0284c7' : '#64748b',
              fontWeight: activeTab === 'human' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'human' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <UserCheck size={14} /> Staf Manusia ({humanStaff.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: activeTab === 'ai' ? '#0284c7' : 'transparent',
              color: activeTab === 'ai' ? '#ffffff' : '#64748b',
              fontWeight: activeTab === 'ai' ? 700 : 500,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'ai' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} /> Persona AI Agents ({aiStaff.length})
          </button>
        </div>
      </div>

      {/* Metric Cards Ringkasan */}
      <div className="ws-metric-grid">
        <MetricCard
          title="Staf Manusia Aktif"
          value={humanStaff.length}
          subtitle="Tim inti penanggung jawab (PIC)"
          icon={Users}
        />
        <MetricCard
          title="AI Agents Operasional"
          value={aiStaff.length}
          subtitle="Autonomous 24/7 worker & persona"
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
          title="Distribusi Status Kerja Personil & AI"
          subtitle="Kesiapan penugasan tim & autonomous agent"
          data={staffDonutData}
        />
      </div>

      {/* Mode Khusus Kartu Persona AI Agent jika tab 'ai' aktif */}
      {activeTab === 'ai' && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #bae6fd',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="#0284c7" /> Persona AI Agent DigiBooster (Auto-Executor PIC)
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                AI Agent di bawah ini siap langsung mengeksekusi tugas saat dipilih/di-tag sebagai PIC di tabel Tugas &amp; Kalender.
              </p>
            </div>
            <button
              onClick={handleAddStaff}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <Plus size={15} /> Tambah AI Agent Baru
            </button>
          </div>

          {/* Grid Kartu Persona AI Agent */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {aiStaff.map((agent) => (
              <div 
                key={agent.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '16px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: '#0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)'
                      }}>
                        <Bot size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{agent.name}</h4>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{agent.role}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: agent.status?.includes('Online') ? '#dcfce7' : '#f1f5f9',
                      color: agent.status?.includes('Online') ? '#16a34a' : '#64748b'
                    }}>
                      ● {agent.status || 'Online'}
                    </span>
                  </div>

                  {/* Engine Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      backgroundColor: '#eff6ff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Zap size={11} /> {agent.aiEngine || 'Groq Llama 3.3 70B'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      Divisi: {agent.department}
                    </span>
                  </div>

                  {/* Deskripsi Persona */}
                  <p style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.78rem',
                    color: '#334155',
                    lineHeight: 1.5,
                    backgroundColor: '#f8fafc',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    borderLeft: '3px solid #0284c7'
                  }}>
                    {agent.persona || 'Persona belum dikonfigurasi. Klik Setup untuk menyesuaikan kepribadian dan gaya kerja.'}
                  </p>

                  {/* Capabilities Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {(agent.capabilities || ['Eksekusi Tugas Otomatis']).map((cap, i) => (
                      <span 
                        key={i}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        ✓ {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {agent.executionCount || 0} tugas dieksekusi
                  </span>
                  <button
                    onClick={() => handleOpenSetupModal(agent)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: '1px solid #bae6fd',
                      backgroundColor: '#f0f9ff',
                      color: '#0284c7',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Sliders size={13} /> Setup Persona
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabel Utama Notion */}
      <NotionTable
        title={activeTab === 'human' ? "Direktori Staf Manusia (PIC)" : activeTab === 'ai' ? "Direktori Autonomous AI Agents" : "Direktori Lengkap Karyawan & Autonomous Agents"}
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

      {/* Modal Setup Persona & Konfigurasi AI Agent */}
      {showSetupModal && selectedAgentForSetup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Header Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: selectedAgentForSetup.type?.includes('AI') ? '#0284c7' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  {selectedAgentForSetup.type?.includes('AI') ? <Sparkles size={20} /> : <UserCheck size={20} />}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedAgentForSetup.type?.includes('AI') ? 'Setup Persona & Prompt AI Agent' : 'Setup Profil & Tanggung Jawab PIC'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Konfigurasi respon, sistem instruksi, dan model LLM saat dipilih di Tabel PIC
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {saveSuccessMsg && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} /> Persona dan konfigurasi agent berhasil diperbarui!
              </div>
            )}

            <form onSubmit={handleSaveSetupModal} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Nama & Tipe */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Nama Karakter / Persona</label>
                  <input
                    type="text"
                    value={selectedAgentForSetup.name || ''}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, name: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Role / Tanggung Jawab</label>
                  <input
                    type="text"
                    value={selectedAgentForSetup.role || ''}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, role: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Engine & Departemen */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Mesin Eksekusi / Model LLM</label>
                  <select
                    value={selectedAgentForSetup.aiEngine || 'Groq Llama 3.3 70B Versatile'}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, aiEngine: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Groq Llama 3.3 70B Versatile">Groq Llama 3.3 70B Versatile (Super Cepat)</option>
                    <option value="Google Gemini 2.5 Flash">Google Gemini 2.5 Flash (Kreatif & Logis)</option>
                    <option value="Claude 3.5 Sonnet Engine">Claude 3.5 Sonnet Engine (Analisis Kompleks)</option>
                    <option value="Human Operator">Human Operator (Manual Verifikasi)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Departemen</label>
                  <select
                    value={selectedAgentForSetup.department || 'Tech'}
                    onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, department: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="Manajemen">Manajemen</option>
                    <option value="Tech">Tech</option>
                    <option value="Kreatif">Kreatif</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                  </select>
                </div>
              </div>

              {/* Persona Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Persona &amp; Karakter Kerja (Gaya Komunikasi)
                </label>
                <textarea
                  rows={2}
                  value={selectedAgentForSetup.persona || ''}
                  onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, persona: e.target.value })}
                  placeholder="Contoh: Sangat analitis, selalu menyajikan data berupa poin-poin ringkas dan action plan."
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* System Prompt / Instruksi Eksekusi Otomatis */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={14} color="#0284c7" /> System Prompt (Instruksi Otomatis Saat Di-Tag di PIC Tugas)
                </label>
                <textarea
                  rows={4}
                  value={selectedAgentForSetup.systemPrompt || ''}
                  onChange={(e) => setSelectedAgentForSetup({ ...selectedAgentForSetup, systemPrompt: e.target.value })}
                  placeholder="Instruksi sistem yang dijalankan otomatis saat agent ini dipilih sebagai PIC pada tabel tugas..."
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    backgroundColor: '#fafbfc',
                    resize: 'vertical'
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Tip: Masukkan kriteria deliverable dan format output yang diharapkan dari persona ini.
                </span>
              </div>

              {/* Tombol Simpan */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} /> Simpan Konfigurasi Persona
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
