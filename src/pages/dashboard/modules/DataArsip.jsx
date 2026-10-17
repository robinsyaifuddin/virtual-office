import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { FolderGit2, FileText, Download, HardDrive, Shield, UploadCloud, CheckCircle } from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes,
  Icon3DDownload
} from '../../../components/ui/Modern3DIcons';
import { toInputDateFormat } from '../../../utils/dateFormatter';

export default function DataArsip() {
  const { archives, addArchive, updateArchive, deleteArchive } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState('table');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Draft', 'Review', 'Disetujui', 'Aktif', 'Arsip'];

  const fileCategoryOptions = [
    'Dokumen PDF / Legalitas',
    'Spreadsheet & Finansial',
    'Presentasi & Pitch Deck',
    'Aset Desain & Grafis',
    'Media Video & Audio',
    'Arsip Terkompresi (ZIP/RAR)',
    'Kode & Konfigurasi'
  ];

  // Filter berkas berdasarkan status dokumen & kategori dokumen
  const filteredArchives = archives.filter((doc) => {
    let matchesStatus = true;
    if (statusFilter && statusFilter !== 'Semua Status' && statusFilter !== 'ALL' && statusFilter !== 'all') {
      if (statusFilter === 'Aktif') {
        matchesStatus = (doc.status === 'Aktif' || doc.status === 'Publik');
      } else {
        matchesStatus = (doc.status === statusFilter);
      }
    }
    const matchesCat = (!activeCategory || activeCategory === 'ALL' || activeCategory === 'all')
      ? true 
      : doc.category === activeCategory;
    return matchesStatus && matchesCat;
  });

  // Data Bar Chart: Dokumen per Kategori
  const catDocCounts = archives.reduce((acc, a) => {
    const rawCat = (a.category && typeof a.category === 'string') ? a.category : 'Dokumen PDF / Legalitas';
    const c = rawCat.split('/')[0].trim() || 'Dokumen';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  const archiveBarData = Object.keys(catDocCounts).slice(0, 5).map((c, idx) => {
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawC = (c && typeof c === 'string') ? c : `Kategori ${idx+1}`;
    return {
      label: rawC.split(' ')[0] || c,
      value: catDocCounts[c],
      displayVal: `${catDocCounts[c]} File`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Berkas Arsip
  const statusCounts = archives.reduce((acc, a) => {
    const s = (a.status && typeof a.status === 'string' && a.status.trim()) ? a.status.trim() : 'Publik';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Publik': '#16a34a',
    'Aktif': '#16a34a',
    'Disetujui': '#0284c7',
    'Review': '#4f46e5',
    'Draft': '#d97706',
    'Arsip': '#64748b'
  };

  const archiveDonutData = Object.keys(statusCounts).map(st => ({
    label: st,
    value: statusCounts[st],
    displayVal: `${statusCounts[st]} Berkas`,
    color: statusColors[st] || '#0284c7'
  }));

  const columns = [
    {
      key: 'title',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Nama Dokumen / Aset
        </span>
      ),
      minWidth: '220px',
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.82rem' }}>
          {val || 'Tanpa Judul'}
        </span>
      )
    },
    { 
      key: 'category', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Kategori Dokumen
        </span>
      ),
      minWidth: '200px',
      options: fileCategoryOptions,
      render: (val) => (
        <span
          className="ws-notion-pill"
          style={{
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '6px',
            display: 'inline-block'
          }}
        >
          {val || fileCategoryOptions[0]}
        </span>
      )
    },
    {
      key: 'fileFormat',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Format
        </span>
      ),
      minWidth: '100px',
      render: (val) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0'
          }}
        >
          {val || 'PDF'}
        </span>
      )
    },
    { 
      key: 'version', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Versi
        </span>
      ), 
      minWidth: '90px' 
    },
    {
      key: 'accessLevel',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Tingkat Akses
        </span>
      ),
      minWidth: '150px',
      render: (val) => (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            backgroundColor: val?.includes('Rahasia') ? '#fef2f2' : (val?.includes('Manager') ? '#fffbeb' : '#f0fdf4'),
            color: val?.includes('Rahasia') ? '#dc2626' : (val?.includes('Manager') ? '#d97706' : '#16a34a'),
            border: `1px solid ${val?.includes('Rahasia') ? '#fecaca' : (val?.includes('Manager') ? '#fef3c7' : '#bbf7d0')}`
          }}
        >
          {val || 'Publik Semua Tim'}
        </span>
      )
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status
        </span>
      ),
      minWidth: '130px',
      options: ['Draft', 'Review', 'Disetujui', 'Aktif', 'Arsip'],
      render: (val) => {
        const statusColors = {
          'Draft': { bg: '#fffbeb', border: '#fef3c7', text: '#d97706' },
          'Review': { bg: '#eef2ff', border: '#c7d2fe', text: '#4f46e5' },
          'Disetujui': { bg: '#eff6ff', border: '#bfdbfe', text: '#0284c7' },
          'Aktif': { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
          'Publik': { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
          'Arsip': { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' }
        };
        const current = statusColors[val] || { bg: '#eff6ff', border: '#bfdbfe', text: '#0284c7' };
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: current.bg,
              border: `1px solid ${current.border}`,
              color: current.text
            }}
          >
            {val || 'Disetujui'}
          </span>
        );
      }
    },
    {
      key: 'updatedAt',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Tanggal Arsip
        </span>
      ),
      minWidth: '135px',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
          {val || '-'}
        </span>
      )
    },
    {
      key: 'downloadUrl',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DDownload size={14} /> Unduh
        </span>
      ),
      minWidth: '70px',
      render: (val, row) => {
        return val ? (
          <a
            href={val}
            download={row.fileName || `${row.title}.${(row.fileFormat || 'pdf').toLowerCase()}`}
            title={`Unduh ${row.fileName || row.title}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(2, 132, 199, 0.2)'
            }}
          >
            <Download size={14} />
          </a>
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>-</span>
        );
      }
    }
  ];

  const handleAddArchive = (overrideCat) => {
    const defaultCat = overrideCat || ((activeCategory && activeCategory !== 'ALL' && activeCategory !== 'all')
      ? activeCategory
      : fileCategoryOptions[0]);

    const newDoc = {
      id: `ARC-${Date.now().toString().slice(-4)}`,
      title: '',
      category: defaultCat,
      fileFormat: 'PDF',
      version: 'v1.0',
      status: 'Draft',
      updatedAt: new Date().toISOString().split('T')[0],
      accessLevel: 'Publik Semua Tim',
      fileSize: '',
      downloadUrl: ''
    };
    addArchive(newDoc);
    return newDoc;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 className="ws-page-title">
          Data &amp; Arsip
        </h2>
      </div>

      <div className="ws-metric-grid">
        <MetricCard
          title="Total Dokumen & Aset"
          value={archives.length}
          subtitle="Tersimpan aman & terindeks"
          icon={FolderGit2}
        />
        <MetricCard
          title="Penyimpanan Terpakai"
          value="15.8 MB"
          subtitle="Dari kuota 5.0 GB"
          icon={HardDrive}
        />
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Sebaran Berkas per Kategori Arsip"
          subtitle="Jumlah file terindeks di vault"
          data={archiveBarData}
        />
        <DonutChart
          title="Distribusi Status Berkas Arsip"
          subtitle="Status validasi & publikasi arsip digital"
          data={archiveDonutData}
        />
      </div>

      {/* Main Content Area: NotionTable membungkus seluruh mode tampilan (Tabel & Galeri Kartu) */}
      <NotionTable
        title="Lemari Arsip Berkas"
        data={filteredArchives}
        columns={columns}
        onAddRow={handleAddArchive}
        onDeleteRow={deleteArchive}
        onUpdateCell={(id, field, val) => updateArchive(id, { [field]: val })}
        exportFileName="arsip_data_digibooster.csv"
        categories={fileCategoryOptions}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        categoryKey="category"
        currentViewMode={viewMode}
        onChangeViewMode={setViewMode}
        availableViewModes={['table', 'kanban']}
        statusFilter={statusFilter}
        onChangeStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        archiveMonth={archiveMonth}
        onChangeArchiveMonth={setArchiveMonth}
        availableArchiveMonths={['September 2026', 'Agustus 2026', 'Juli 2026']}
        renderCustomView={({ filteredData }) => {
          if (viewMode === 'kanban') {
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {filteredData.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7' }}>{doc.category}</span>
                      <h4 style={{ margin: '6px 0 4px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{doc.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.version}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => alert(`Mengunduh: ${doc.title}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <Download size={13} /> Unduh
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  );
}
