import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { Mic, Video, CheckSquare, Plus, Link } from 'lucide-react';

export default function RapatCatatan() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useWorkspaceStore();

  // Data Bar Chart: Jumlah Peserta Hadir per Topik Rapat
  const meetingBarData = meetings.slice(0, 5).map((m, idx) => {
    const pCount = Array.isArray(m.participants) ? m.participants.length : 2;
    const colors = ['#0284c7', '#38bdf8', '#818cf8', '#34d399', '#f59e0b'];
    return {
      label: m.title.split(' ').slice(0, 2).join(' ') || `Rapat ${idx+1}`,
      value: pCount,
      displayVal: `${pCount} Orang`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Tipe Rapat
  const typeCounts = meetings.reduce((acc, m) => {
    const t = m.type || 'Internal Sync';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const typeColors = {
    'Internal Weekly Sync': '#0284c7',
    'Review Sprint': '#38bdf8',
    'Evaluasi Klien': '#10b981',
    'Strategi Bisnis': '#f59e0b'
  };

  const meetingDonutData = Object.keys(typeCounts).map(t => ({
    label: t,
    value: typeCounts[t],
    displayVal: `${typeCounts[t]} Sesi`,
    color: typeColors[t] || '#6366f1'
  }));

  const columns = [
    { key: 'title', label: 'Topik Rapat' },
    { key: 'dateTime', label: 'Waktu Pelaksanaan' },
    { key: 'type', label: 'Tipe Rapat' },
    { key: 'participants', label: 'Peserta Hadir' },
    {
      key: 'link',
      label: 'Google Meet',
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>
          <Video size={13} /> Link
        </a>
      ) : '-'
    },
    {
      key: 'actionItems',
      label: 'Action Items Selesai',
      render: (val) => {
        if (!val || !val.length) return '-';
        const done = val.filter(a => a.done).length;
        return `${done}/${val.length} Selesai`;
      }
    }
  ];

  const handleAddMeeting = () => {
    const newM = {
      id: `MTG-${Date.now().toString().slice(-4)}`,
      title: 'Koordinasi Internal Sinkronisasi Modul',
      dateTime: '2026-10-18 10:00 WIB',
      type: 'Internal Weekly Sync',
      participants: ['Kevin Pratama', 'Maya Nirmala'],
      link: 'https://meet.google.com/dgb-test',
      summaryNotes: 'Sinkronisasi rancangan halaman dashboard baru.',
      actionItems: []
    };
    addMeeting(newM);
    return newM;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Rapat & Notulensi Catatan
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
          title="Kategori Jenis Rapat Internal"
          subtitle="Komposisi format koordinasi"
          data={meetingDonutData}
          centerValue={`${meetings.length}`}
          centerLabel="Sesi Rapat"
        />
      </div>

      <NotionTable
        title="Daftar Rapat & Catatan"
        data={meetings}
        columns={columns}
        onAddRow={handleAddMeeting}
        onDeleteRow={deleteMeeting}
        onUpdateCell={(id, field, val) => updateMeeting(id, { [field]: val })}
        exportFileName="notulensi_rapat_digibooster.csv"
      />
    </div>
  );
}
