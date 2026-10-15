import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { FolderGit2, FileText, Download, HardDrive, Shield, UploadCloud, CheckCircle } from 'lucide-react';

export default function DataArsip() {
  const { archives, addArchive, updateArchive, deleteArchive } = useWorkspaceStore();
  const [viewMode, setViewMode] = useState('table');

  const fileCategoryOptions = [
    'Dokumen PDF / Legalitas',
    'Spreadsheet & Finansial',
    'Presentasi & Pitch Deck',
    'Aset Desain & Grafis',
    'Media Video & Audio',
    'Arsip Terkompresi (ZIP/RAR)',
    'Kode & Konfigurasi'
  ];

  const columns = [
    {
      key: 'title',
      label: 'Nama Dokumen / Aset',
      render: (val) => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>{val}</span>
      )
    },
    { 
      key: 'category', 
      label: 'Kategori Dokumen',
      minWidth: '200px',
      options: fileCategoryOptions,
      render: (val, row, update) => (
        <select
          value={val || fileCategoryOptions[0]}
          onChange={(e) => update ? update(e.target.value) : updateArchive(row.id, { category: e.target.value })}
          className="ws-notion-pill"
          style={{
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            color: '#0284c7',
            outline: 'none',
            cursor: 'pointer',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            maxWidth: '100%'
          }}
        >
          {fileCategoryOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    },
    {
      key: 'fileFormat',
      label: 'Format',
      render: (val, row, update) => (
        <select
          value={val || 'PDF'}
          onChange={(e) => update ? update(e.target.value) : updateArchive(row.id, { fileFormat: e.target.value })}
          className="ws-notion-pill"
          style={{
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            color: '#0284c7',
            outline: 'none',
            cursor: 'pointer',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            fontWeight: 700
          }}
        >
          <option value="PDF">PDF</option>
          <option value="DOCX">DOCX</option>
          <option value="XLSX">XLSX</option>
          <option value="ZIP">ZIP</option>
          <option value="RAR">RAR</option>
          <option value="PNG">PNG</option>
          <option value="JPG">JPG</option>
          <option value="MP4">MP4</option>
          <option value="JSON">JSON</option>
        </select>
      )
    },
    { key: 'version', label: 'Versi' },
    {
      key: 'downloadUrl',
      label: 'Unduh',
      render: (val, row) => {
        return val ? (
          <a
            href={val}
            download={row.fileName || `${row.title}.${(row.fileFormat || 'pdf').toLowerCase()}`}
            title={`Unduh ${row.fileName || row.title}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '6px',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 700,
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(2, 132, 199, 0.2)'
            }}
          >
            <Download size={13} />
            <span>Unduh</span>
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
      title: 'Pedoman Penulisan AI Prompting v1.0',
      category: 'SOP Perusahaan',
      fileFormat: 'PDF',
      version: 'v1.0',
      updatedAt: '2026-10-16',
      accessLevel: 'Publik Semua Tim',
      fileSize: '210 KB',
      downloadUrl: '/docs/AI_Prompting_Guide.pdf'
    };
    addArchive(newDoc);
    return newDoc;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Data & Arsip (Knowledge Vault)
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'table' ? '#e2e8f0' : 'transparent',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Tabel
          </button>
          <button
            onClick={() => setViewMode('cards')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: viewMode === 'cards' ? '#e2e8f0' : 'transparent',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Galeri Kartu
          </button>
        </div>
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

      {viewMode === 'table' ? (
        <NotionTable
          title="Lemari Arsip Berkas"
          data={archives}
          columns={columns}
          onAddRow={handleAddArchive}
          onDeleteRow={deleteArchive}
          onUpdateCell={(id, field, val) => updateArchive(id, { [field]: val })}
          exportFileName="arsip_data_digibooster.csv"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {archives.map((doc) => (
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
      )}
    </div>
  );
}
