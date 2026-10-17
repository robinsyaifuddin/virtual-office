import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import NotionKanban from '../components/NotionKanban';
import NotionCalendar from '../components/NotionCalendar';
import NotionFullPageView from '../components/NotionFullPageView';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { CheckSquare, Calendar, Clock, AlertCircle, LayoutGrid, Table, CalendarDays, User, Bot, Sparkles, Play, CheckCircle2, Cpu } from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DStatusDot, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';

export default function TugasKalender() {
  const store = useWorkspaceStore();
  const tasks = Array.isArray(store?.tasks) ? store.tasks : [];
  const addTask = store?.addTask || (() => {});
  const updateTask = store?.updateTask || (() => {});
  const deleteTask = store?.deleteTask || (() => {});
  const taskCategories = Array.isArray(store?.taskCategories) ? store.taskCategories : ['Website & Tracking'];
  const staffAgents = Array.isArray(store?.staffAgents) ? store.staffAgents : [];

  const [viewMode, setViewMode] = useState('table');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedFullTaskId, setSelectedFullTaskId] = useState(null);
  const [executingTaskId, setExecutingTaskId] = useState(null);
  const [executionResultModal, setExecutionResultModal] = useState(null);

  // Fungsi simulasi eksekusi cerdas AI Agent berdasar Persona & Task Prompt
  const handleRunAiAgent = (task, agent) => {
    if (!task || !task.id || !agent) return;
    setExecutingTaskId(task.id);
    
    setTimeout(() => {
      // Hasil eksekusi berdasarkan spesialisasi persona AI Agent
      let generatedDeliverable = '';
      let executionLog = '';
      const agentName = agent?.name || 'DigiBot AI';

      if (agentName.includes('Researcher')) {
        generatedDeliverable = `[Analisis Riset AI - ${agentName}]
1. Ringkasan Topik: ${task.title || 'Tugas Riset'}
2. Temuan Utama: Telah dilakukan profiling kompetitor & perbandingan arsitektur pasar 2026.
3. Rekomendasi Eksekutif: Prioritaskan implementasi modular dengan latensi di bawah 2 detik. Dokumen lengkap siap di-review manajemen.`;
        executionLog = `DigiBot Researcher selesai memindai rujukan data internal & menyusun executive summary riset.`;
      } else if (agentName.includes('Copywriter')) {
        generatedDeliverable = `[Draft Copywriting AI - ${agentName}]
- Headline / Hook: "Transformasi Otomasi Bisnis 24/7 dengan Agen Cerdas DigiBooster"
- Inti Pesan: ${task.description || task.title || 'Konten Kampanye DigiBooster'}
- Call to Action (CTA): Jadwalkan demo implementasi hari ini via Portal Dashboard. Siap tayang di multi-channel.`;
        executionLog = `DigiBot Copywriter sukses menyusun materi teks sesuai formula AIDA & persona branding.`;
      } else {
        generatedDeliverable = `[Output Eksekusi Autonomous AI - ${agentName}]
✓ Tugas: "${task.title || 'Tugas Otomasi'}" berhasil diuraikan menjadi checklist operasional.
✓ Status Deliverable: Draft implementasi selesai dibuat dan siap diajukan ke tahap review manajemen.
✓ Timestamp: ${new Date().toLocaleString('id-ID')}`;
        executionLog = `AI Agent ${agentName} berhasil mengeksekusi flow otomatis untuk tugas ini.`;
      }

      // Update data task di Zustand Store secara otomatis
      updateTask(task.id, {
        status: 'Menunggu Review',
        outputResult: generatedDeliverable,
        completedDate: new Date().toISOString().split('T')[0]
      });

      // Tambahkan komentar notifikasi otomatis
      const currentStore = useWorkspaceStore.getState();
      if (typeof currentStore.addTaskComment === 'function') {
        currentStore.addTaskComment(
          task.id, 
          `🤖 [Autonomous AI Execution] ${executionLog}`, 
          agentName
        );
      }

      // Tingkatkan hitungan eksekusi agent jika ada
      if (agent.id && typeof currentStore.updateStaffAgent === 'function') {
        currentStore.updateStaffAgent(agent.id, {
          executionCount: (agent.executionCount || 0) + 1
        });
      }

      setExecutingTaskId(null);
      setExecutionResultModal({
        taskTitle: task.title || 'Tugas Tanpa Judul',
        agentName: agentName,
        deliverable: generatedDeliverable,
        log: executionLog
      });
    }, 1800);
  };

  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Backlog', 'Sedang Dikerjakan', 'Menunggu Review', 'Selesai'];

  // Filter tasks berdasarkan status tugas
  const filteredTasks = tasks.filter((t) => {
    if (!t) return false;
    if (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all') {
      return true;
    }
    if (statusFilter === 'Sedang Dikerjakan') {
      return t.status === 'Sedang Dikerjakan' || t.status === 'ON PROGRESS';
    }
    if (statusFilter === 'Backlog') {
      return t.status === 'Backlog' || t.status === 'Belum Mulai';
    }
    return t.status === statusFilter;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t?.status === 'Selesai').length;
  const inProgressTasks = tasks.filter(t => t?.status === 'Sedang Dikerjakan' || t?.status === 'ON PROGRESS').length;

  // Data Bar Chart: Beban Tugas per PIC / Assignee
  const assigneeCounts = tasks.reduce((acc, t) => {
    const pic = (t && t.assignee && typeof t.assignee === 'string' && t.assignee.trim()) ? t.assignee.trim() : 'Unassigned';
    acc[pic] = (acc[pic] || 0) + 1;
    return acc;
  }, {});

  const taskBarData = Object.keys(assigneeCounts).slice(0, 5).map((pic, idx) => {
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawPic = (pic && typeof pic === 'string') ? pic : `PIC ${idx+1}`;
    return {
      label: (typeof rawPic === 'string' && rawPic.includes(' ')) ? rawPic.split(' ')[0] : rawPic,
      value: assigneeCounts[pic] || 0,
      displayVal: `${assigneeCounts[pic] || 0} Tugas`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Tugas
  const statusCounts = {
    'Selesai': tasks.filter(t => t?.status === 'Selesai').length,
    'Sedang Dikerjakan': tasks.filter(t => t?.status === 'Sedang Dikerjakan' || t?.status === 'ON PROGRESS').length,
    'Menunggu Review': tasks.filter(t => t?.status === 'Menunggu Review').length,
    'Backlog': tasks.filter(t => !t?.status || t?.status === 'Backlog' || t?.status === 'Belum Mulai').length
  };

  const taskDonutData = [
    { label: 'Selesai', value: statusCounts['Selesai'], displayVal: `${statusCounts['Selesai']}`, color: '#10b981' },
    { label: 'Dikerjakan', value: statusCounts['Sedang Dikerjakan'], displayVal: `${statusCounts['Sedang Dikerjakan']}`, color: '#f59e0b' },
    { label: 'Review', value: statusCounts['Menunggu Review'], displayVal: `${statusCounts['Menunggu Review']}`, color: '#6366f1' },
    { label: 'Backlog', value: statusCounts['Backlog'], displayVal: `${statusCounts['Backlog']}`, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const handleUpdateCell = (taskId, field, value) => {
    updateTask(taskId, { [field]: value });
  };

  const columns = [
    {
      key: 'title',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Nama Tugas
        </span>
      ),
      minWidth: '220px',
      maxWidth: '280px',
      render: (val, row, update) => (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update(e.currentTarget.innerText)}
          className="ws-cell-hover"
          style={{
            fontWeight: 600,
            color: '#0f172a',
            padding: '4px 6px',
            borderRadius: '4px',
            outline: 'none',
            cursor: 'text'
          }}
          title="Klik untuk ubah nama tugas"
        >
          {val || 'Tanpa Judul'}
        </div>
      )
    },
    {
      key: 'description',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Keterangan
        </span>
      ),
      minWidth: '260px',
      maxWidth: '360px',
      render: (val, row, update) => (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => update(e.currentTarget.innerText)}
          className="ws-cell-hover"
          style={{
            color: '#475569',
            padding: '4px 6px',
            borderRadius: '4px',
            outline: 'none',
            cursor: 'text',
            lineHeight: 1.45
          }}
          title="Klik untuk ubah keterangan"
        >
          {val || '-'}
        </div>
      )
    },
    {
      key: 'dueDate',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Jadwal Tugas
        </span>
      ),
      minWidth: '135px',
      render: (val, row, update) => (
        <input
          type="date"
          value={val || ''}
          onChange={(e) => update(e.target.value)}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.82rem',
            fontFamily: 'inherit',
            color: '#0f172a',
            outline: 'none',
            padding: '3px 4px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        />
      )
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status
        </span>
      ),
      minWidth: '160px',
      render: (val, row, update) => {
        const textColors = {
          'Backlog': '#dc2626',
          'Sedang Dikerjakan': '#d97706',
          'Menunggu Review': '#4f46e5',
          'Selesai': '#16a34a'
        };
        const currentTextColor = textColors[val] || '#64748b';

        return (
          <select
            value={val || 'Backlog'}
            onChange={(e) => update(e.target.value)}
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
            <option value="Backlog" style={{ color: '#dc2626', fontWeight: 600 }}>Belum mulai / Backlog</option>
            <option value="Sedang Dikerjakan" style={{ color: '#d97706', fontWeight: 600 }}>Sedang Dikerjakan</option>
            <option value="Menunggu Review" style={{ color: '#4f46e5', fontWeight: 600 }}>Menunggu Review</option>
            <option value="Selesai" style={{ color: '#16a34a', fontWeight: 600 }}>Selesai</option>
          </select>
        );
      }
    },
    {
      key: 'category',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Kategori Tugas
        </span>
      ),
      minWidth: '180px',
      render: (val, row, update) => (
        <select
          value={val || taskCategories[0] || 'General'}
          onChange={(e) => update(e.target.value)}
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
          {taskCategories.map((c) => (
            <option key={c} value={c} style={{ color: '#0f172a', fontWeight: 500 }}>{c}</option>
          ))}
        </select>
      )
    },
    {
      key: 'priority',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Prioritas
        </span>
      ),
      minWidth: '110px',
      render: (val, row, update) => (
        <select
          value={val || 'P2'}
          onChange={(e) => update(e.target.value)}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: val === 'P1' || val === 'Urgent' ? '#dc2626' : (val === 'P2' ? '#0284c7' : '#64748b'),
            outline: 'none',
            cursor: 'pointer',
            padding: '2px 0'
          }}
        >
          <option value="P1" style={{ color: '#dc2626', fontWeight: 600 }}>P1 (Tinggi)</option>
          <option value="P2" style={{ color: '#0284c7', fontWeight: 600 }}>P2 (Sedang)</option>
          <option value="P3" style={{ color: '#64748b', fontWeight: 600 }}>P3 (Rendah)</option>
          <option value="Urgent" style={{ color: '#dc2626', fontWeight: 600 }}>Urgent</option>
        </select>
      )
    },
    {
      key: 'assignee',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> PIC Penugasan
        </span>
      ),
      minWidth: '220px',
      render: (val, row, update) => {
        const assignedStaff = Array.isArray(staffAgents) ? (staffAgents.find(s => s && s.name === val) || null) : null;
        const isAI = assignedStaff && typeof assignedStaff.type === 'string' && assignedStaff.type.includes('AI');

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: isAI ? '6px' : '50%',
              backgroundColor: isAI ? '#0284c7' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isAI ? '#ffffff' : '#334155',
              fontSize: '0.65rem',
              fontWeight: 800,
              flexShrink: 0
            }}>
              {isAI ? <Bot size={13} /> : (assignedStaff?.avatar ? <img src={assignedStaff.avatar} alt={val || 'PIC'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : 'H')}
            </div>

            <select
              value={val || (staffAgents && staffAgents[0] ? staffAgents[0].name : 'Unassigned')}
              onChange={(e) => update(e.target.value)}
              style={{
                border: isAI ? '1px solid #bae6fd' : '1px solid transparent',
                backgroundColor: isAI ? '#f0f9ff' : 'transparent',
                color: isAI ? '#0284c7' : '#0f172a',
                fontSize: '0.8rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer',
                padding: '3px 6px',
                borderRadius: '6px',
                maxWidth: '170px'
              }}
              title={isAI ? `PIC adalah Autonomous AI Agent (${assignedStaff?.aiEngine || 'Groq Engine'})` : 'PIC Staf Manusia'}
            >
              <optgroup label="🤖 Autonomous AI Agents">
                {(Array.isArray(staffAgents) ? staffAgents : []).filter(s => s && typeof s.type === 'string' && s.type.includes('AI')).map((staff) => (
                  <option key={staff.id || staff.name} value={staff.name} style={{ color: '#0284c7', fontWeight: 600 }}>
                    ✨ {staff.name} (AI)
                  </option>
                ))}
              </optgroup>
              <optgroup label="👤 Staf Manusia (PIC Tim)">
                {(Array.isArray(staffAgents) ? staffAgents : []).filter(s => s && !(typeof s.type === 'string' && s.type.includes('AI'))).map((staff) => (
                  <option key={staff.id || staff.name} value={staff.name} style={{ color: '#0f172a', fontWeight: 500 }}>
                    👤 {staff.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        );
      }
    },
    {
      key: 'aiAction',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#0284c7" /> Eksekusi AI Agent
        </span>
      ),
      minWidth: '160px',
      render: (val, row) => {
        if (!row) return null;
        const assignedStaff = Array.isArray(staffAgents) ? (staffAgents.find(s => s && s.name === row.assignee) || null) : null;
        const isAI = assignedStaff && typeof assignedStaff.type === 'string' && assignedStaff.type.includes('AI');
        const isExecuting = executingTaskId === row.id;

        if (!isAI) {
          return (
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
              PIC Manusia (Manual)
            </span>
          );
        }

        return (
          <button
            onClick={() => handleRunAiAgent(row, assignedStaff)}
            disabled={isExecuting}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isExecuting ? '#e2e8f0' : '#0284c7',
              color: isExecuting ? '#64748b' : '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              boxShadow: isExecuting ? 'none' : '0 2px 6px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.15s ease'
            }}
            title={`Jalankan persona ${assignedStaff.name} untuk memproses tugas ini secara otomatis`}
          >
            {isExecuting ? (
              <>
                <Cpu size={12} className="spin-animate" /> Memproses...
              </>
            ) : (
              <>
                <Play size={11} fill="#ffffff" /> Jalankan AI PIC
              </>
            )}
          </button>
        );
      }
    }
  ];

  const kanbanColumns = [
    { id: 'Backlog', title: 'Belum Mulai / Backlog', color: '#ef4444' },
    { id: 'Sedang Dikerjakan', title: 'Sedang Dikerjakan', color: '#f59e0b' },
    { id: 'Menunggu Review', title: 'Menunggu Review', color: '#6366f1' },
    { id: 'Selesai', title: 'Selesai', color: '#22c55e' }
  ];

  const handleAddTask = (overrideCategory) => {
    const targetCategory = overrideCategory || (activeCategory !== 'ALL' ? activeCategory : (taskCategories[0] || 'Website & Tracking'));
    const newTask = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title: '',
      description: '',
      category: targetCategory,
      project: '',
      assignee: '',
      priority: 'P2',
      status: 'Backlog',
      dueDate: new Date().toISOString().split('T')[0],
      completedDate: '',
      outputResult: '',
      createdBy: 'Executive Owner',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedBy: 'Executive Owner',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      comments: []
    };
    addTask(newTask);
    return newTask;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="ws-page-title">
            Tugas &amp; Kalender
          </h2>
        </div>
      </div>

      {/* Metric Cards Ringkasan */}
      <div className="ws-metric-grid">
        <MetricCard
          title="Tugas Aktif Selesai"
          value={`${completedTasks}/${totalTasks}`}
          subtitle={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% selesai`}
          icon={CheckSquare}
        />
        <MetricCard
          title="Sedang Dikerjakan"
          value={inProgressTasks}
          subtitle="Dalam antrean pengerjaan tim"
          icon={Clock}
        />
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Distribusi Beban Kerja per PIC (Top 5)"
          subtitle="Jumlah tiket penugasan aktif karyawan"
          data={taskBarData}
        />
        <DonutChart
          title="Status Progres Sprint Tugas"
          subtitle="Tingkat penyelesaian backlog & sprint"
          data={taskDonutData}
        />
      </div>

      {/* Main View Render: NotionTable membungkus seluruh mode tampilan (Tabel, Kanban, Kalender) sehingga Header Toolbar tetap tampil */}
      <NotionTable
        title="Daftar Tugas Operasional"
        data={filteredTasks}
        columns={columns}
        onAddRow={handleAddTask}
        onDeleteRow={deleteTask}
        onOpenFullView={(id) => setSelectedFullTaskId(id)}
        onUpdateCell={handleUpdateCell}
        exportFileName="tugas_operasional_notion.csv"
        categories={taskCategories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        enableStickyFreeze={true}
        currentViewMode={viewMode}
        onChangeViewMode={setViewMode}
        availableViewModes={['table', 'kanban', 'calendar']}
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
                statusKey="status"
                onAddItem={handleAddTask}
                renderCard={(t) => {
                  if (!t) return null;
                  return (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span className="ws-notion-pill" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                          {t.category || 'General'}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: t.priority === 'P1' || t.priority === 'Urgent' ? '#dc2626' : '#0284c7' }}>
                          {t.priority || 'P2'}
                        </span>
                      </div>
                      <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        {t.title || 'Tanpa Judul'}
                      </h5>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.74rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {t.description || '-'}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={12} color="#0284c7" /> {t.assignee || 'Unassigned'}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} color="#0284c7" /> {typeof t.dueDate === 'string' ? t.dueDate.slice(5) : '-'}</span>
                      </div>
                    </div>
                  );
                }}
              />
            );
          }
          if (viewMode === 'calendar') {
            return (
              <NotionCalendar
                events={Array.isArray(filteredData) ? filteredData : []}
                dateKey="dueDate"
                titleKey="title"
              />
            );
          }
          return null;
        }}
      />

      {/* Modal Popup Hasil Eksekusi AI Agent */}
      {executionResultModal && (
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
            maxWidth: '600px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Eksekusi AI Agent Berhasil!
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    PIC Persona: <strong style={{ color: '#0284c7' }}>{executionResultModal.agentName}</strong>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setExecutionResultModal(null)}
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

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Nama Tugas:
              </label>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', padding: '6px 10px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                {executionResultModal.taskTitle}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Deliverable / Output yang Dihasilkan Otomatis:
              </label>
              <pre style={{
                margin: 0,
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                fontSize: '0.82rem',
                color: '#0369a1',
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                lineHeight: 1.5
              }}>
                {executionResultModal.deliverable}
              </pre>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#16a34a',
              fontWeight: 700,
              backgroundColor: '#dcfce7',
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              <CheckCircle2 size={16} /> Status tugas otomatis dialihkan ke: &quot;Menunggu Review&quot; dan deliverable telah tersimpan ke database tugas.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                onClick={() => setExecutionResultModal(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Selesai &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Full Page View saat klik baris tugas */}
      {selectedFullTaskId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          padding: '24px',
          overflowY: 'auto'
        }}>
          <NotionFullPageView
            taskId={selectedFullTaskId}
            onClose={() => setSelectedFullTaskId(null)}
          />
        </div>
      )}
    </div>
  );
}
