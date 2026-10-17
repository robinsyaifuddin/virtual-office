import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { Mic, Video, CheckSquare, Plus, Link } from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';

export default function RapatCatatan() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useWorkspaceStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan'];

  const meetingTypes = [
    'Internal Weekly Sync',
    'Client Kick-off',
    'Review Sprint',
    'Evaluasi Klien',
    'Strategi Bisnis'
  ];

  // Filter rapat berdasarkan status rapat & format kategori rapat
  const filteredMeetings = meetings.filter((m) => {
    const matchesStatus = (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all')
      ? true 
      : m.status === statusFilter;
    const matchesCat = (!activeCategory || activeCategory === 'ALL' || activeCategory === 'all')
      ? true 
      : (m.type === activeCategory || m.category === activeCategory);
    return matchesStatus && matchesCat;
  });

  // Data Bar Chart: Jumlah Peserta Hadir per Topik Rapat
  const meetingBarData = meetings.slice(0, 5).map((m, idx) => {
    const pCount = Array.isArray(m.participants) ? m.participants.length : 2;
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawTitle = (m.title && typeof m.title === 'string' && m.title.trim()) ? m.title : `Rapat ${idx+1}`;
    return {
      label: rawTitle.split(' ').slice(0, 2).join(' ') || `Rapat ${idx+1}`,
      value: pCount,
      displayVal: `${pCount} Orang`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Rapat
  const statusCounts = meetings.reduce((acc, m) => {
    const s = (m.status && typeof m.status === 'string' && m.status.trim()) ? m.status.trim() : 'Terjadwal';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Terjadwal': '#0284c7',
    'Berlangsung': '#d97706',
    'Selesai': '#16a34a',
    'Dibatalkan': '#dc2626'
  };

  const meetingDonutData = Object.keys(statusCounts).map(st => ({
    label: st,
    value: statusCounts[st],
    displayVal: `${statusCounts[st]} Sesi`,
    color: statusColors[st] || '#0284c7'
  }));

  const columns = [
    { 
      key: 'title', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Topik Rapat
        </span>
      ), 
      minWidth: '220px' 
    },
    { 
      key: 'dateTime', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Tanggal Sesi
        </span>
      ),
      minWidth: '135px',
      render: (val, row, update) => (
        <input
          type="date"
          value={val ? String(val).split(' ')[0] : ''}
          onChange={(e) => update ? update(e.target.value) : updateMeeting(row.id, { dateTime: e.target.value })}
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
      key: 'type', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Tipe Rapat
        </span>
      ),
      minWidth: '160px',
      options: meetingTypes,
      render: (val, row, update) => (
        <select
          value={val || 'Internal Weekly Sync'}
          onChange={(e) => update ? update(e.target.value) : updateMeeting(row.id, { type: e.target.value })}
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
          <option value="Internal Weekly Sync" style={{ color: '#0f172a', fontWeight: 500 }}>Internal Weekly Sync</option>
          <option value="Client Kick-off" style={{ color: '#0f172a', fontWeight: 500 }}>Client Kick-off</option>
          <option value="Review Sprint" style={{ color: '#0f172a', fontWeight: 500 }}>Review Sprint</option>
          <option value="Evaluasi Klien" style={{ color: '#0f172a', fontWeight: 500 }}>Evaluasi Klien</option>
          <option value="Strategi Bisnis" style={{ color: '#0f172a', fontWeight: 500 }}>Strategi Bisnis</option>
        </select>
      )
    },
    { 
      key: 'participants', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> Peserta Hadir
        </span>
      ), 
      minWidth: '160px' 
    },
    {
      key: 'link',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Google Meet
        </span>
      ),
      minWidth: '120px',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>
          <Video size={13} /> Link
        </a>
      ) : '-'
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status
        </span>
      ),
      minWidth: '140px',
      render: (val, row, update) => {
        const statusColors = {
          'Terjadwal': '#0284c7',
          'Berlangsung': '#d97706',
          'Selesai': '#16a34a',
          'Dibatalkan': '#dc2626'
        };
        const currentTextColor = statusColors[val] || '#0284c7';
        return (
          <select
            value={val || 'Terjadwal'}
            onChange={(e) => update ? update(e.target.value) : updateMeeting(row.id, { status: e.target.value })}
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
            <option value="Terjadwal" style={{ color: '#0284c7', fontWeight: 600 }}>Terjadwal</option>
            <option value="Berlangsung" style={{ color: '#d97706', fontWeight: 600 }}>Berlangsung</option>
            <option value="Selesai" style={{ color: '#16a34a', fontWeight: 600 }}>Selesai</option>
            <option value="Dibatalkan" style={{ color: '#dc2626', fontWeight: 600 }}>Dibatalkan</option>
          </select>
        );
      }
    },
    {
      key: 'actionItems',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Action Items
        </span>
      ),
      minWidth: '130px',
      render: (val) => {
        if (!val || !val.length) return '-';
        const done = val.filter(a => a.done).length;
        return `${done}/${val.length} Selesai`;
      }
    }
  ];

  const handleAddMeeting = (overrideType) => {
    const defaultType = overrideType || ((activeCategory && activeCategory !== 'ALL' && activeCategory !== 'all')
      ? activeCategory
      : meetingTypes[0]);

    const newM = {
      id: `MTG-${Date.now().toString().slice(-4)}`,
      title: '',
      dateTime: new Date().toISOString().split('T')[0],
      type: defaultType,
      status: 'Terjadwal',
      participants: [],
      link: '',
      summaryNotes: '',
      actionItems: []
    };
    addMeeting(newM);
    return newM;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Rapat &amp; Catatan
        </h2>
      </div>

      <div className="ws-metric-grid">
        <MetricCard
          title="Total Notulensi Tersimpan"
          value={meetings.length}
          subtitle="Arsip koordinasi digital"
          icon={Mic}
        />
        <MetricCard
          title="Tingkat Eksekusi Keputusan"
          value="85%"
          subtitle="Action items terealisasi"
          icon={CheckSquare}
        />
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Kehadiran Peserta per Sesi Rapat"
          subtitle="Jumlah personil tim dalam koordinasi"
          data={meetingBarData}
        />
        <DonutChart
          title="Distribusi Status Rapat"
          subtitle="Status penjadwalan & pelaksanaan rapat"
          data={meetingDonutData}
        />
      </div>

      <NotionTable
        title="Daftar Rapat & Catatan"
        data={filteredMeetings}
        columns={columns}
        onAddRow={handleAddMeeting}
        onDeleteRow={deleteMeeting}
        onUpdateCell={(id, field, val) => updateMeeting(id, { [field]: val })}
        exportFileName="notulensi_rapat_digibooster.csv"
        categories={meetingTypes}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        categoryKey="type"
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
