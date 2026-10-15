import React, { useState } from 'react';
import { 
  FolderLock, 
  Inbox, 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  LogOut, 
  Search, 
  CheckCircle, 
  RotateCcw, 
  Archive, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Plus, 
  Eye, 
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  INITIAL_ARCHIVES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_KANBAN, 
  INITIAL_TIMELINE 
} from '../data/managementData';
import { AGENTS } from '../data/agents';
import '../styles/management.css';

export default function ManagementDashboard({ onLogout, onSwitchTo3D }) {
  // Navigation tabs: 'cabinet' | 'submissions' | 'kanban' | 'timeline' | 'agents'
  const [activeTab, setActiveTab] = useState('cabinet');

  // Lemari Arsip State
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);
  const [selectedDrawer, setSelectedDrawer] = useState('all');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [activeDocModal, setActiveDocModal] = useState(null);

  // Meja Pengumpulan Tugas State
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [copiedId, setCopiedId] = useState(null);

  // Kanban State
  const [kanban, setKanban] = useState(INITIAL_KANBAN);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Archives by Drawer & Search
  const filteredDocs = archives.filter(doc => {
    const matchDrawer = selectedDrawer === 'all' || doc.drawer === selectedDrawer;
    const matchQuery = doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
                       doc.description.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
                       doc.category.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchDrawer && matchQuery;
  });

  // Action: Salin Teks ke Clipboard
  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Konten berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Action: Setujui Tugas di Meja Pengumpulan
  const handleApproveSubmission = (subId) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'Disetujui' } : s));
    showToast('Tugas disetujui! Status diperbarui.');
  };

  // Action: Minta Revisi Tugas
  const handleRequestRevision = (subId) => {
    const feedback = prompt('Tulis catatan revisi untuk tim agen di WhatsApp:');
    if (feedback) {
      setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'Perlu Revisi' } : s));
      showToast(`Catatan revisi dicatat: "${feedback}". Bot akan membaca instruksi ini.`);
    }
  };

  // Action: Pindahkan Tugas ke Lemari Arsip
  const handleMoveToArchive = (sub) => {
    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      drawer: sub.agentRole.includes('Creative') ? 'creative' : sub.agentRole.includes('Admin') ? 'legal' : 'research',
      title: sub.taskTitle,
      category: 'Keluaran WhatsApp',
      author: `${sub.agentName} (${sub.agentRole})`,
      date: 'Hari ini',
      status: 'Tersimpan',
      size: '128 KB',
      description: sub.summary,
      content: sub.fullOutput
    };
    setArchives([newDoc, ...archives]);
    setSubmissions(submissions.filter(s => s.id !== sub.id));
    showToast('Tugas resmi diarsipkan ke dalam Lemari Arsip Digital!');
  };

  return (
    <div className="mgmt-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(2, 132, 199, 0.3)',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} />
          {toastMessage}
        </div>
      )}

      {/* --- TOP NAVBAR --- */}
      <header className="mgmt-navbar">
        <div className="mgmt-brand">
          <div className="brand-icon-box">DB</div>
          <div className="brand-info">
            <h1>Executive Headquarters</h1>
            <span>DigiBooster Virtual Office</span>
          </div>
        </div>

        {/* Tab Menus */}
        <nav className="mgmt-nav-tabs">
          <button 
            className={`nav-tab-btn ${activeTab === 'cabinet' ? 'active' : ''}`}
            onClick={() => setActiveTab('cabinet')}
          >
            <FolderLock size={16} />
            Lemari Arsip
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <Inbox size={16} />
            Meja Pengumpulan
            {submissions.filter(s => s.status === 'Menunggu Persetujuan').length > 0 && (
              <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px' }}>
                {submissions.filter(s => s.status === 'Menunggu Persetujuan').length}
              </span>
            )}
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveTab('kanban')}
          >
            <LayoutDashboard size={16} />
            Kanban Board
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <CalendarClock size={16} />
            Timeline & Jadwal
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            <Users size={16} />
            Divisi & Agen
          </button>
        </nav>

        {/* User Badge & Actions */}
        <div className="nav-user-controls">
          <div className="user-badge">
            <span className="user-dot"></span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1' }}>Owner / Direktur Utama</span>
          </div>
          <button className="btn-secondary-nav" onClick={onSwitchTo3D} title="Buka Denah Visual 3D Kantor">
            <ExternalLink size={14} />
            Visual 3D
          </button>
          <button className="btn-secondary-nav" onClick={onLogout} title="Keluar dari Manajemen">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* --- MAIN BODY CONTAINER --- */}
      <main className="mgmt-content">

        {/* ==============================================================
            TAB 1: LEMARI ARSIP DIGITAL (FILING CABINET)
            ============================================================== */}
        {activeTab === 'cabinet' && (
          <div>
            <div className="view-header-banner">
              <div>
                <h2>Lemari Arsip & Berkas Digital Perusahaan</h2>
                <p>Penyimpanan permanen seluruh dokumen resmi, draft kontrak hukum, rekapan kas, bank konten kreatif, dan laporan intelijen pasar.</p>
              </div>
              <div className="quick-stats-row">
                <div className="quick-stat-box">
                  <span className="num">{archives.length}</span>
                  <span className="label">Total Dokumen</span>
                </div>
                <div className="quick-stat-box">
                  <span className="num">4</span>
                  <span className="label">Laci Divisi</span>
                </div>
              </div>
            </div>

            <div className="cabinet-grid">
              {/* Laci Sidebar */}
              <div className="cabinet-drawers-sidebar">
                <h3 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                  Laci Dokumen
                </h3>
                <button 
                  className={`drawer-btn ${selectedDrawer === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedDrawer('all')}
                >
                  <FolderLock size={18} />
                  Semua Laci
                  <span className="drawer-badge-count">{archives.length}</span>
                </button>
                <button 
                  className={`drawer-btn ${selectedDrawer === 'legal' ? 'active' : ''}`}
                  onClick={() => setSelectedDrawer('legal')}
                >
                  <ShieldCheck size={18} />
                  Laci Legal & PKS
                  <span className="drawer-badge-count">{archives.filter(d => d.drawer === 'legal').length}</span>
                </button>
                <button 
                  className={`drawer-btn ${selectedDrawer === 'finance' ? 'active' : ''}`}
                  onClick={() => setSelectedDrawer('finance')}
                >
                  <TrendingUp size={18} />
                  Laci Keuangan & Kas
                  <span className="drawer-badge-count">{archives.filter(d => d.drawer === 'finance').length}</span>
                </button>
                <button 
                  className={`drawer-btn ${selectedDrawer === 'creative' ? 'active' : ''}`}
                  onClick={() => setSelectedDrawer('creative')}
                >
                  <Sparkles size={18} />
                  Laci Konten Kreatif
                  <span className="drawer-badge-count">{archives.filter(d => d.drawer === 'creative').length}</span>
                </button>
                <button 
                  className={`drawer-btn ${selectedDrawer === 'research' ? 'active' : ''}`}
                  onClick={() => setSelectedDrawer('research')}
                >
                  <FileText size={18} />
                  Laci Intelijen Pasar
                  <span className="drawer-badge-count">{archives.filter(d => d.drawer === 'research').length}</span>
                </button>
              </div>

              {/* Main List Dokumen */}
              <div className="cabinet-main-view">
                <div className="docs-search-bar">
                  <input 
                    type="text" 
                    placeholder="Cari nama dokumen, kata kunci naskah, atau nomor arsip..."
                    value={searchDocQuery}
                    onChange={(e) => setSearchDocQuery(e.target.value)}
                  />
                </div>

                <div className="doc-card-grid">
                  {filteredDocs.map(doc => (
                    <div key={doc.id} className="doc-card">
                      <div className="doc-card-header">
                        <span className="doc-tag">{doc.category}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7' }}>{doc.size}</span>
                      </div>
                      <h3>{doc.title}</h3>
                      <p>{doc.description}</p>
                      <div className="doc-card-meta">
                        <span>Oleh: {doc.author}</span>
                        <span>{doc.date}</span>
                      </div>
                      <div className="doc-actions">
                        <button className="btn-doc-view" onClick={() => setActiveDocModal(doc)}>
                          <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Buka Dokumen
                        </button>
                        <button className="btn-doc-copy" onClick={() => handleCopyText(doc.content, doc.id)}>
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 2: MEJA PENGUMPULAN TUGAS (SUBMISSION DESK)
            ============================================================== */}
        {activeTab === 'submissions' && (
          <div>
            <div className="view-header-banner">
              <div>
                <h2>Meja Pengumpulan Tugas (Inbox Tray)</h2>
                <p>Tempat para Agen AI meletakkan draft naskah, laporan keuangan, dan riset dari grup WhatsApp untuk diperiksa dan disetujui oleh Direktur Utama.</p>
              </div>
              <div className="quick-stats-row">
                <div className="quick-stat-box">
                  <span className="num">{submissions.filter(s => s.status === 'Menunggu Persetujuan').length}</span>
                  <span className="label">Perlu Diperiksa</span>
                </div>
              </div>
            </div>

            <div>
              {submissions.map(sub => (
                <div key={sub.id} className="submission-card">
                  <div className="sub-header">
                    <div className="agent-identity-badge">
                      <div className="agent-avatar-small">💼</div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{sub.taskTitle}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Diserahkan oleh: <b>{sub.agentName}</b> ({sub.agentRole}) • {sub.timestamp}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: sub.status === 'Disetujui' ? '#dcfce7' : '#fef3c7',
                        color: sub.status === 'Disetujui' ? '#166534' : '#92400e'
                      }}>
                        {sub.status}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontWeight: 600
                      }}>
                        {sub.engineUsed}
                      </span>
                    </div>
                  </div>

                  <div className="sub-body-box">
                    {sub.fullOutput}
                  </div>

                  <div className="sub-actions-row">
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Ringkasan: {sub.summary}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-doc-copy" onClick={() => handleCopyText(sub.fullOutput, sub.id)}>
                        <Copy size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        {copiedId === sub.id ? 'Tersalin!' : 'Salin Teks'}
                      </button>
                      <button className="btn-revision" onClick={() => handleRequestRevision(sub.id)}>
                        <RotateCcw size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Minta Revisi
                      </button>
                      <button className="btn-approve" onClick={() => handleApproveSubmission(sub.id)}>
                        <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Setujui Hasil
                      </button>
                      <button className="btn-archive-it" onClick={() => handleMoveToArchive(sub)}>
                        <Archive size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Simpan ke Lemari Arsip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 3: KANBAN BOARD
            ============================================================== */}
        {activeTab === 'kanban' && (
          <div>
            <div className="view-header-banner">
              <div>
                <h2>Papan Alur Kerja Kantor (Kanban Board)</h2>
                <p>Pantau status pergerakan tugas antar divisi dari rencana awal, proses pengerjaan oleh AI, pemeriksaan boss, hingga status tuntas.</p>
              </div>
            </div>

            <div className="kanban-board-container">
              {/* Kolom 1: Backlog */}
              <div className="kanban-column">
                <div className="kanban-col-header">
                  <span className="kanban-col-title">📌 Backlog (Rencana)</span>
                  <span className="drawer-badge-count">{kanban.backlog.length}</span>
                </div>
                {kanban.backlog.map(item => (
                  <div key={item.id} className="kanban-card">
                    <span className="doc-tag" style={{ alignSelf: 'flex-start' }}>{item.tag}</span>
                    <h4>{item.title}</h4>
                    <div className="kanban-card-footer">
                      <span>Divisi: {item.division}</span>
                      <span>{item.owner}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kolom 2: In Progress */}
              <div className="kanban-column">
                <div className="kanban-col-header">
                  <span className="kanban-col-title">⚡ Sedang Dikerjakan</span>
                  <span className="drawer-badge-count">{kanban.in_progress.length}</span>
                </div>
                {kanban.in_progress.map(item => (
                  <div key={item.id} className="kanban-card">
                    <span className="doc-tag" style={{ alignSelf: 'flex-start' }}>{item.tag}</span>
                    <h4>{item.title}</h4>
                    <div className="kanban-card-footer">
                      <span>Divisi: {item.division}</span>
                      <span>{item.owner}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kolom 3: In Review */}
              <div className="kanban-column">
                <div className="kanban-col-header">
                  <span className="kanban-col-title">👀 Meja Review Boss</span>
                  <span className="drawer-badge-count">{kanban.in_review.length}</span>
                </div>
                {kanban.in_review.map(item => (
                  <div key={item.id} className="kanban-card" style={{ borderColor: '#38bdf8' }}>
                    <span className="doc-tag" style={{ alignSelf: 'flex-start', background: '#fef3c7', color: '#b45309' }}>{item.tag}</span>
                    <h4>{item.title}</h4>
                    <div className="kanban-card-footer">
                      <span>Divisi: {item.division}</span>
                      <span>{item.owner}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kolom 4: Done */}
              <div className="kanban-column">
                <div className="kanban-col-header">
                  <span className="kanban-col-title">✅ Selesai & Terbit</span>
                  <span className="drawer-badge-count">{kanban.done.length}</span>
                </div>
                {kanban.done.map(item => (
                  <div key={item.id} className="kanban-card" style={{ opacity: 0.85 }}>
                    <span className="doc-tag" style={{ alignSelf: 'flex-start', background: '#dcfce7', color: '#15803d' }}>{item.tag}</span>
                    <h4>{item.title}</h4>
                    <div className="kanban-card-footer">
                      <span>Divisi: {item.division}</span>
                      <span>{item.owner}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 4: TIMELINE & JADWAL
            ============================================================== */}
        {activeTab === 'timeline' && (
          <div>
            <div className="view-header-banner">
              <div>
                <h2>Timeline & Kalender Operasional Harian</h2>
                <p>Jadwal shift kerja otomatis, jam briefing standup, jadwal publikasi konten, dan evaluasi kas masuk harian.</p>
              </div>
            </div>

            <div className="timeline-list">
              {INITIAL_TIMELINE.map(item => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7' }}>{item.time}</span>
                    <span className="doc-tag">{item.badge}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: '4px 0', color: '#0f172a' }}>{item.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 5: DIVISI & AGEN ROSTER
            ============================================================== */}
        {activeTab === 'agents' && (
          <div>
            <div className="view-header-banner">
              <div>
                <h2>Personalia Tim Agen Virtual</h2>
                <p>Daftar identitas, efisiensi kerja, dan peran masing-masing agen AI yang bersiaga merespons instruksi di grup WhatsApp.</p>
              </div>
              <div className="quick-stats-row">
                <div className="quick-stat-box">
                  <span className="num">Dual Engine</span>
                  <span className="label">Groq + Gemini</span>
                </div>
              </div>
            </div>

            <div className="doc-card-grid">
              {AGENTS.map(agent => (
                <div key={agent.id} className="doc-card" style={{ borderTop: '4px solid #0284c7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="agent-avatar-small" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>
                      {agent.avatar}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{agent.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>{agent.role}</span>
                    </div>
                  </div>
                  <p style={{ margin: '8px 0', fontSize: '0.85rem' }}>{agent.task}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Tugas Selesai</span>
                      <b style={{ color: '#0f172a' }}>{agent.stats?.tasksDone || 85}</b>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Efisiensi</span>
                      <b style={{ color: '#16a34a' }}>{agent.stats?.efficiency || '99%'}</b>
                    </div>
                  </div>

                  <div className="doc-card-meta">
                    <span>Ruang: {agent.roomId}</span>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>🟢 Bersiaga di WA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- MODAL DETAIL DOKUMEN --- */}
      {activeDocModal && (
        <div className="modal-overlay" onClick={() => setActiveDocModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="doc-tag">{activeDocModal.category}</span>
                <h3 style={{ margin: '6px 0 0', fontSize: '1.15rem', color: '#0f172a' }}>{activeDocModal.title}</h3>
              </div>
              <button 
                onClick={() => setActiveDocModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Penulis: <b>{activeDocModal.author}</b> • Diterbitkan: <b>{activeDocModal.date}</b>
              </p>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1.25rem',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6
              }}>
                {activeDocModal.content}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-doc-copy" onClick={() => handleCopyText(activeDocModal.content, activeDocModal.id)}>
                <Copy size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Salin Konten
              </button>
              <button className="btn-approve" onClick={() => setActiveDocModal(null)}>
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
