import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import NotionKanban from '../components/NotionKanban';
import NotionCalendar from '../components/NotionCalendar';
import NotionFullPageView from '../components/NotionFullPageView';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { CheckSquare, Calendar, Clock, AlertCircle, LayoutGrid, Table, CalendarDays } from 'lucide-react';

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
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    taskCategories,
    staffAgents 
  } = useWorkspaceStore();

  const [viewMode, setViewMode] = useState('table');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedFullTaskId, setSelectedFullTaskId] = useState(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Selesai').length;
  const inProgressTasks = tasks.filter(t => t.status === 'Sedang Dikerjakan' || t.status === 'ON PROGRESS').length;

  // Data Bar Chart: Beban Tugas per PIC / Assignee
  const assigneeCounts = tasks.reduce((acc, t) => {
    const pic = t.assignee || 'Unassigned';
    acc[pic] = (acc[pic] || 0) + 1;
    return acc;
  }, {});

  const taskBarData = Object.keys(assigneeCounts).slice(0, 5).map((pic, idx) => {
    const colors = ['#0284c7', '#38bdf8', '#818cf8', '#34d399', '#f59e0b'];
    return {
      label: pic.split(' ')[0] || pic,
      value: assigneeCounts[pic],
      displayVal: `${assigneeCounts[pic]} Tugas`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Tugas
  const statusCounts = {
    'Selesai': tasks.filter(t => t.status === 'Selesai').length,
    'Sedang Dikerjakan': tasks.filter(t => t.status === 'Sedang Dikerjakan' || t.status === 'ON PROGRESS').length,
    'Menunggu Review': tasks.filter(t => t.status === 'Menunggu Review').length,
    'Backlog': tasks.filter(t => t.status === 'Backlog' || !t.status).length
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
      label: 'Nama Tugas',
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
        const statusColors = {
          'Backlog': { bg: '#fee2e2', text: '#b91c1c' },
          'Sedang Dikerjakan': { bg: '#fef3c7', text: '#b45309' },
          'Menunggu Review': { bg: '#e0e7ff', text: '#4338ca' },
          'Selesai': { bg: '#dcfce7', text: '#15803d' }
        };
        const currentStyle = statusColors[val] || { bg: '#f1f5f9', text: '#475569' };

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Icon3DStatusDot status={val} size={9} />
            <select
              value={val || 'Backlog'}
              onChange={(e) => update(e.target.value)}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: currentStyle.bg,
                color: currentStyle.text,
                fontSize: '0.75rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Backlog">Belum mulai / Backlog</option>
              <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
              <option value="Menunggu Review">Menunggu Review</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
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
          className="ws-notion-pill"
          style={{
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {taskCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
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
            fontWeight: 600,
            color: val === 'P1' || val === 'Urgent' ? '#dc2626' : (val === 'P2' ? '#7c3aed' : '#64748b'),
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="P1">P1 (Tinggi)</option>
          <option value="P2">P2 (Sedang)</option>
          <option value="P3">P3 (Rendah)</option>
          <option value="Urgent">Urgent</option>
        </select>
      )
    },
    {
      key: 'assignee',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> PIC
        </span>
      ),
      minWidth: '170px',
      render: (val, row, update) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} />
          <select
            value={val || (staffAgents && staffAgents[0] ? staffAgents[0].name : 'Unassigned')}
            onChange={(e) => update(e.target.value)}
            style={{
              padding: '4px 8px',
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
        </div>
      )
    }
  ];

  const kanbanColumns = [
    { id: 'Backlog', title: 'Belum Mulai / Backlog', color: '#ef4444' },
    { id: 'Sedang Dikerjakan', title: 'Sedang Dikerjakan', color: '#f59e0b' },
    { id: 'Menunggu Review', title: 'Menunggu Review', color: '#6366f1' },
    { id: 'Selesai', title: 'Selesai', color: '#22c55e' }
  ];

  const handleAddTask = () => {
    const newTask = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title: 'Tugas Operasional Baru',
      description: 'Klik untuk mengisi keterangan tugas...',
      category: activeCategory !== 'ALL' ? activeCategory : (taskCategories[0] || 'Website & Tracking'),
      project: 'Internal Agency',
      assignee: 'Kayla',
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
      {/* Header View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="ws-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon3DClipboard size={22} />
            <span>Tugas Operasional</span>
          </h2>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: viewMode === 'table' ? '#0284c7' : '#475569',
              cursor: 'pointer',
              boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Table size={14} />
            <span>Tabel View</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'kanban' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: viewMode === 'kanban' ? '#0284c7' : '#475569',
              cursor: 'pointer',
              boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <LayoutGrid size={14} />
            <span>Sprint Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'calendar' ? '#ffffff' : 'transparent',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: viewMode === 'calendar' ? '#0284c7' : '#475569',
              cursor: 'pointer',
              boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <CalendarDays size={14} />
            <span>Kalender</span>
          </button>
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
          centerValue={`${totalTasks}`}
          centerLabel="Total Tugas"
        />
      </div>

      {/* Main View Render */}
      {viewMode === 'table' && (
        <NotionTable
          title="Daftar Tugas Operasional"
          data={tasks}
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
        />
      )}

      {viewMode === 'kanban' && (
        <NotionKanban
          columns={kanbanColumns}
          items={tasks}
          statusKey="status"
          onAddItem={handleAddTask}
          renderCard={(t) => (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="ws-notion-pill" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                  {t.category}
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: t.priority === 'P1' || t.priority === 'Urgent' ? '#dc2626' : '#7c3aed' }}>
                  {t.priority}
                </span>
              </div>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                {t.title}
              </h5>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.74rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {t.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                <span>👤 {t.assignee}</span>
                <span>📅 {t.dueDate?.slice(5)}</span>
              </div>
            </div>
          )}
        />
      )}

      {viewMode === 'calendar' && (
        <NotionCalendar
          events={tasks}
          dateKey="dueDate"
          titleKey="title"
        />
      )}
    </div>
  );
}
