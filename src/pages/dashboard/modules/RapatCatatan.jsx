import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { Mic, Video, CheckSquare, Plus, Link } from 'lucide-react';

export default function RapatCatatan() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useWorkspaceStore();

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
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
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
