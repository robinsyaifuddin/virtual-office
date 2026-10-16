import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import NotionKanban from '../components/NotionKanban';
import NotionCalendar from '../components/NotionCalendar';
import NotionFullPageView from '../components/NotionFullPageView';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { CheckSquare, Calendar, Clock, AlertCircle, LayoutGrid, Table, CalendarDays, User } from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Backlog', 'Sedang Dikerjakan', 'Menunggu Review', 'Selesai'];

  // Filter tasks berdasarkan status tugas
  const filteredTasks = tasks.filter((t) => {
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
  const completedTasks = tasks.filter(t => t.status === 'Selesai').length;
  const inProgressTasks = tasks.filter(t => t.status === 'Sedang Dikerjakan' || t.status === 'ON PROGRESS').length;

  // Data Bar Chart: Beban Tugas per PIC / Assignee
  const assigneeCounts = tasks.reduce((acc, t) => {
    const pic = t.assignee || 'Unassigned';
    acc[pic] = (acc[pic] || 0) + 1;
    return acc;
  }, {});

  const taskBarData = Object.keys(assigneeCounts).slice(0, 5).map((pic, idx) => {
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawPic = (pic && typeof pic === 'string') ? pic : `PIC ${idx+1}`;
    return {
      label: rawPic.split(' ')[0] || rawPic,
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
          <Icon3DUser size={14} /> PIC
        </span>
      ),
      minWidth: '170px',
      render: (val, row, update) => (
        <select
          value={val || (staffAgents && staffAgents[0] ? staffAgents[0].name : 'Unassigned')}
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
          {staffAgents && staffAgents.map((staff) => (
            <option key={staff.id || staff.name} value={staff.name} style={{ color: '#0f172a', fontWeight: 500 }}>
              {staff.name}
            </option>
          ))}
        </select>
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
      title: '',
      description: '',
      category: activeCategory !== 'ALL' ? activeCategory : (taskCategories[0] || 'Website & Tracking'),
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
                renderCard={(t) => (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="ws-notion-pill" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                        {t.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: t.priority === 'P1' || t.priority === 'Urgent' ? '#dc2626' : '#0284c7' }}>
                        {t.priority}
                      </span>
                    </div>
                    <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      {t.title}
                    </h5>
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.74rem', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {t.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '6px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={12} color="#0284c7" /> {t.assignee}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} color="#0284c7" /> {t.dueDate?.slice(5)}</span>
                    </div>
                  </div>
                )}
              />
            );
          }
          if (viewMode === 'calendar') {
            return (
              <NotionCalendar
                events={filteredData}
                dateKey="dueDate"
                titleKey="title"
              />
            );
          }
          return null;
        }}
      />
    </div>
  );
}
