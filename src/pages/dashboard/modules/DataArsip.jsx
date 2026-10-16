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

export default function DataArsip() {
  const { archives, addArchive, updateArchive, deleteArchive } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState('table');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Draft', 'Review', 'Disetujui', 'Aktif', 'Arsip'];

  // Filter berkas berdasarkan status dokumen
  const filteredArchives = archives.filter((doc) => {
    if (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all') {
      return true;
    }
    if (statusFilter === 'Aktif') {
      return doc.status === 'Aktif' || doc.status === 'Publik';
    }
    return doc.status === statusFilter;
  });

  const fileCategoryOptions = [
    'Dokumen PDF / Legalitas',
    'Spreadsheet & Finansial',
    'Presentasi & Pitch Deck',
    'Aset Desain & Grafis',
    'Media Video & Audio',
    'Arsip Terkompresi (ZIP/RAR)',
    'Kode & Konfigurasi'
  ];

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

  // Data Donut Chart: Komposisi Ekstensi Format File
  const formatCounts = archives.reduce((acc, a) => {
    const fmt = a.fileFormat || a.format || 'PDF';
    acc[fmt] = (acc[fmt] || 0) + 1;
    return acc;
  }, {});

  const formatColors = {
    'PDF': '#ef4444',
    'XLSX': '#10b981',
    'DOCX': '#0284c7',
    'ZIP': '#f59e0b',
    'PNG': '#06b6d4',
    'JPG': '#ec4899',
    'MP4': '#6366f1'
  };

  const archiveDonutData = Object.keys(formatCounts).map(fmt => ({
    label: fmt,
    value: formatCounts[fmt],
    displayVal: `${formatCounts[fmt]} File`,
    color: formatColors[fmt] || '#64748b'
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
        <span style={{ fontWeight: 600, color: '#0f172a' }}>{val}</span>
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
      render: (val, row, update) => (
        <select
          value={val || fileCategoryOptions[0]}
          onChange={(e) => update ? update(e.target.value) : updateArchive(row.id, { category: e.target.value })}
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
          {fileCategoryOptions.map((opt) => (
            <option key={opt} value={opt} style={{ color: '#0f172a', fontWeight: 500 }}>{opt}</option>
          ))}
        </select>
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
      render: (val, row, update) => (
        <select
          value={val || 'PDF'}
          onChange={(e) => update ? update(e.target.value) : updateArchive(row.id, { fileFormat: e.target.value })}
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
          <option value="PDF" style={{ color: '#0f172a', fontWeight: 500 }}>PDF</option>
          <option value="DOCX" style={{ color: '#0f172a', fontWeight: 500 }}>DOCX</option>
          <option value="XLSX" style={{ color: '#0f172a', fontWeight: 500 }}>XLSX</option>
          <option value="ZIP" style={{ color: '#0f172a', fontWeight: 500 }}>ZIP</option>
          <option value="RAR" style={{ color: '#0f172a', fontWeight: 500 }}>RAR</option>
          <option value="PNG" style={{ color: '#0f172a', fontWeight: 500 }}>PNG</option>
          <option value="JPG" style={{ color: '#0f172a', fontWeight: 500 }}>JPG</option>
          <option value="MP4" style={{ color: '#0f172a', fontWeight: 500 }}>MP4</option>
          <option value="JSON" style={{ color: '#0f172a', fontWeight: 500 }}>JSON</option>
        </select>
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
      render: (val, row, update) => (
        <select
          value={val || 'Publik Semua Tim'}
          onChange={(e) => update ? update(e.target.value) : updateArchive(row.id, { accessLevel: e.target.value })}
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
          <option value="Publik Semua Tim" style={{ color: '#0f172a', fontWeight: 600 }}>Publik Semua Tim</option>
          <option value="Hanya Manager" style={{ color: '#0f172a', fontWeight: 600 }}>Hanya Manager</option>
          <option value="Rahasia/Direksi" style={{ color: '#0f172a', fontWeight: 600 }}>Rahasia/Direksi</option>
        </select>
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
      render: (val, row, update) => {
        const statusColors = {
          'Draft': '#d97706',
          'Review': '#4f46e5',
          'Disetujui': '#0284c7',
          'Aktif': '#16a34a',
          'Publik': '#16a34a',
          'Arsip': '#64748b'
        };
        const currentTextColor = statusColors[val] || '#0284c7';
        return (
          <select
            value={val || 'Disetujui'}
            onChange={(e) => update ? update(e.target.value) : updateArchive(row.id, { status: e.target.value })}
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
            <option value="Draft" style={{ color: '#d97706', fontWeight: 600 }}>Draft</option>
            <option value="Review" style={{ color: '#4f46e5', fontWeight: 600 }}>Review</option>
            <option value="Disetujui" style={{ color: '#0284c7', fontWeight: 600 }}>Disetujui</option>
            <option value="Aktif" style={{ color: '#16a34a', fontWeight: 600 }}>Aktif</option>
            <option value="Arsip" style={{ color: '#64748b', fontWeight: 600 }}>Arsip</option>
          </select>
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
      render: (val, row, update) => (
        <input
          type="date"
          value={val ? String(val).split(' ')[0] : '2026-10-14'}
          onChange={(e) => update ? update(e.target.value) : updateArchive(row.id, { updatedAt: e.target.value })}
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

  const handleAddArchive = () => {
    const newDoc = {
      id: `ARC-${Date.now().toString().slice(-4)}`,
      title: '',
      category: 'Dokumen PDF / Legalitas',
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
          title="Komposisi Ekstensi Berkas"
          subtitle="Distribusi format dokumen tersimpan"
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
