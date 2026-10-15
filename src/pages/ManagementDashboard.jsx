import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Inbox, 
  FolderGit2, 
  Calendar, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Eye, 
  X,
  Bell,
  Mail,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Archive,
  Layers
} from 'lucide-react';
import { 
  INITIAL_ARCHIVES, 
  INITIAL_SUBMISSIONS, 
  INITIAL_KANBAN, 
  INITIAL_TIMELINE 
} from '../data/managementData';
import { AGENTS } from '../data/agents';
import '../styles/donezoTheme.css';

export default function ManagementDashboard({ onLogout }) {
  // Active Navigation Tab: 'dashboard' | 'tasks' | 'cabinet' | 'calendar' | 'agents'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Archives State
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);
  const [selectedDrawer, setSelectedDrawer] = useState('all');
  const [searchDocQuery, setSearchDocQuery] = useState('');
  const [activeDocModal, setActiveDocModal] = useState(null);

  // Submissions (Meja Tugas) State
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [copiedId, setCopiedId] = useState(null);

  // Kanban State
  const [kanban, setKanban] = useState(INITIAL_KANBAN);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Teks berhasil disalin');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApproveSubmission = (subId) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'Disetujui' } : s));
    showToast('Tugas disetujui');
  };

  const handleRequestRevision = (subId) => {
    const feedback = prompt('Catatan instruksi revisi:');
    if (feedback) {
      setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'Perlu Revisi' } : s));
      showToast('Status tugas diperbarui ke Perlu Revisi');
    }
  };

  const handleMoveToArchive = (sub) => {
    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      drawer: sub.agentRole.includes('Creative') ? 'creative' : sub.agentRole.includes('Admin') ? 'legal' : 'research',
      title: sub.taskTitle,
      category: 'Keluaran Otomatis',
      author: `${sub.agentName}`,
      date: 'Hari ini',
      status: 'Tersimpan',
      size: '110 KB',
      description: sub.summary,
      content: sub.fullOutput
    };
    setArchives([newDoc, ...archives]);
    setSubmissions(submissions.filter(s => s.id !== sub.id));
    showToast('Tugas dipindahkan ke Lemari Arsip');
  };

  const filteredDocs = archives.filter(doc => {
    const matchDrawer = selectedDrawer === 'all' || doc.drawer === selectedDrawer;
    const matchQuery = doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
                       doc.description.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchDrawer && matchQuery;
  });

  return (
    <div className="donezo-app-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#38bdf8" />
          {toastMessage}
        </div>
      )}

      {/* ==============================================================
          1. CLEAN SIDEBAR (DONEZO STYLE)
          ============================================================== */}
      <aside className="donezo-sidebar">
        {/* Brand */}
        <div className="donezo-brand">
          <div className="brand-symbol">
            <Layers size={18} />
          </div>
          <span className="brand-text">Donezo</span>
        </div>

        {/* Menu Section */}
        <div className="sidebar-section-label">MENU</div>
        <div className="sidebar-nav-group">
          <button 
            className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutGrid size={17} />
            Dashboard
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <Inbox size={17} />
            Tasks & Submissions
            {submissions.filter(s => s.status === 'Menunggu Persetujuan').length > 0 && (
              <span className="nav-badge-pill">
                {submissions.filter(s => s.status === 'Menunggu Persetujuan').length}
              </span>
            )}
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'cabinet' ? 'active' : ''}`}
            onClick={() => setActiveTab('cabinet')}
          >
            <FolderGit2 size={17} />
            Filing Cabinet
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={17} />
            Calendar & Timeline
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            <Users size={17} />
            Team Agents
          </button>
        </div>

        {/* General Section */}
        <div className="sidebar-section-label">GENERAL</div>
        <div className="sidebar-nav-group">
          <button className="sidebar-nav-item" onClick={() => showToast('Fitur Settings aktif')}>
            <Settings size={17} />
            Settings
          </button>
          <button className="sidebar-nav-item" onClick={() => showToast('Pusat bantuan')}>
            <HelpCircle size={17} />
            Help
          </button>
          <button className="sidebar-nav-item" onClick={onLogout} style={{ color: '#ef4444' }}>
            <LogOut size={17} />
            Logout
          </button>
        </div>

        {/* Dark Footer Card */}
        <div className="sidebar-footer-card">
          <h5>Donezo Workspace</h5>
          <p>Autonomous AI Multi-Agent Office Connected via WhatsApp.</p>
        </div>
      </aside>

      {/* ==============================================================
          2. MAIN CONTENT WRAPPER
          ============================================================== */}
      <div className="donezo-main-wrapper">
        {/* Top Header */}
        <header className="donezo-top-header">
          <div className="donezo-search-box">
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search task, documents, or agents..." 
              value={searchDocQuery}
              onChange={(e) => setSearchDocQuery(e.target.value)}
            />
            <span className="search-shortcut-key">⌘F</span>
          </div>

          <div className="header-user-profile">
            <div className="header-icon-action" onClick={() => showToast('Tidak ada pesan baru')}>
              <Mail size={16} />
            </div>
            <div className="header-icon-action" onClick={() => showToast('Sistem normal')}>
              <Bell size={16} />
            </div>
            <div className="profile-avatar-block">
              <div className="avatar-circle">TM</div>
              <div className="profile-info">
                <span className="profile-name">Totok Michael</span>
                <span className="profile-email">tmichael20@mail.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Canvas Body */}
        <main className="donezo-canvas">
          {/* Page Title & Action Buttons */}
          <div className="page-title-row">
            <div className="page-title-heading">
              <h2>Dashboard</h2>
              <p>Plan, prioritize, and accomplish your tasks with ease.</p>
            </div>
            <div className="action-buttons-group">
              <button className="btn-pill-primary" onClick={() => setActiveTab('tasks')}>
                <Plus size={16} />
                Add Project
              </button>
              <button className="btn-pill-outline" onClick={() => showToast('Ekspor data arsip')}>
                Import Data
              </button>
            </div>
          </div>

          {/* ==============================================================
              4 METRIC CARDS (DONEZO EXACT STYLE)
              ============================================================== */}
          <div className="metrics-four-grid">
            {/* Card 1 (Filled Accent) */}
            <div className="metric-card-donezo primary-fill">
              <div className="metric-card-header">
                <span className="metric-card-title">Total Projects</span>
                <div className="metric-icon-bubble">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="metric-number-big">{archives.length + submissions.length + 18}</div>
              <div className="metric-growth-badge">
                <span>↗ Increased from last month</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="metric-card-donezo">
              <div className="metric-card-header">
                <span className="metric-card-title">Ended Projects</span>
                <div className="metric-icon-bubble">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="metric-number-big">10</div>
              <div className="metric-growth-badge">
                <span>Increased from last month</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="metric-card-donezo">
              <div className="metric-card-header">
                <span className="metric-card-title">Running Projects</span>
                <div className="metric-icon-bubble">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="metric-number-big">12</div>
              <div className="metric-growth-badge">
                <span>Active via WhatsApp</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="metric-card-donezo">
              <div className="metric-card-header">
                <span className="metric-card-title">Pending Project</span>
                <div className="metric-icon-bubble">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="metric-number-big">{submissions.filter(s => s.status === 'Menunggu Persetujuan').length}</div>
              <div className="metric-growth-badge">
                <span>On Review</span>
              </div>
            </div>
          </div>

          {/* ==============================================================
              TAB VIEW CONTENT
              ============================================================== */}
          
          {/* TAB: DASHBOARD (SPLIT LAYOUT LIKE DONEZO) */}
          {activeTab === 'dashboard' && (
            <div className="dashboard-split-layout">
              {/* Left Column: Recent Tasks & Cabinet */}
              <div>
                <div className="card-box-donezo">
                  <div className="card-box-header">
                    <h3>Recent Tasks Submissions</h3>
                    <button className="btn-pill-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('tasks')}>
                      View All
                    </button>
                  </div>
                  {submissions.slice(0, 2).map(sub => (
                    <div key={sub.id} className="clean-sub-item">
                      <div className="clean-sub-header">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{sub.taskTitle}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sub.agentName} ({sub.agentRole}) • {sub.timestamp}</div>
                        </div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: sub.status === 'Disetujui' ? '#dcfce7' : '#fef3c7',
                          color: sub.status === 'Disetujui' ? '#166534' : '#92400e'
                        }}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="clean-sub-body">{sub.fullOutput}</div>
                    </div>
                  ))}
                </div>

                <div className="card-box-donezo">
                  <div className="card-box-header">
                    <h3>Archived Documents</h3>
                    <div className="filter-chips-row">
                      <button className={`filter-chip-btn ${selectedDrawer === 'all' ? 'active' : ''}`} onClick={() => setSelectedDrawer('all')}>All</button>
                      <button className={`filter-chip-btn ${selectedDrawer === 'legal' ? 'active' : ''}`} onClick={() => setSelectedDrawer('legal')}>Legal</button>
                      <button className={`filter-chip-btn ${selectedDrawer === 'finance' ? 'active' : ''}`} onClick={() => setSelectedDrawer('finance')}>Finance</button>
                    </div>
                  </div>
                  {filteredDocs.slice(0, 3).map(doc => (
                    <div key={doc.id} className="clean-doc-item">
                      <div className="clean-doc-icon-col">
                        <div className="doc-type-icon">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="doc-item-title">{doc.title}</div>
                          <div className="doc-item-subtitle">{doc.author} • {doc.date} • {doc.size}</div>
                        </div>
                      </div>
                      <button 
                        className="btn-pill-outline" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                        onClick={() => setActiveDocModal(doc)}
                      >
                        <Eye size={13} style={{ marginRight: 4 }} /> View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Kanban & Team */}
              <div>
                <div className="card-box-donezo">
                  <div className="card-box-header">
                    <h3>Project Progress</h3>
                    <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>Active</span>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>84%</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Operations Completed</div>
                  </div>
                </div>

                <div className="card-box-donezo">
                  <div className="card-box-header">
                    <h3>Team Collaboration</h3>
                    <button className="btn-pill-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('agents')}>
                      Roster
                    </button>
                  </div>
                  {AGENTS.slice(0, 4).map(ag => (
                    <div key={ag.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div className="avatar-circle" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                          {ag.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{ag.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{ag.role}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f0fdf4', color: '#16a34a' }}>
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TASKS (MEJA PENGUMPULAN TUGAS) */}
          {activeTab === 'tasks' && (
            <div>
              <div className="card-box-donezo">
                <div className="card-box-header">
                  <h3>Assignment Desk & Submissions</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{submissions.length} Total Submissions</span>
                </div>
                {submissions.map(sub => (
                  <div key={sub.id} className="clean-sub-item">
                    <div className="clean-sub-header">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{sub.taskTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Submitted by <b>{sub.agentName}</b> ({sub.agentRole}) • {sub.timestamp} • Engine: {sub.engineUsed}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: sub.status === 'Disetujui' ? '#dcfce7' : '#fef3c7',
                        color: sub.status === 'Disetujui' ? '#166534' : '#92400e'
                      }}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="clean-sub-body">{sub.fullOutput}</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{sub.summary}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-pill-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }} onClick={() => handleCopyText(sub.fullOutput, sub.id)}>
                          <Copy size={13} style={{ marginRight: 4 }} />
                          {copiedId === sub.id ? 'Copied' : 'Copy Text'}
                        </button>
                        <button className="btn-pill-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', color: '#e11d48' }} onClick={() => handleRequestRevision(sub.id)}>
                          <RotateCcw size={13} style={{ marginRight: 4 }} />
                          Request Revision
                        </button>
                        <button className="btn-pill-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }} onClick={() => handleApproveSubmission(sub.id)}>
                          <CheckCircle2 size={13} style={{ marginRight: 4 }} />
                          Approve
                        </button>
                        <button className="btn-pill-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', color: '#0284c7' }} onClick={() => handleMoveToArchive(sub)}>
                          <Archive size={13} style={{ marginRight: 4 }} />
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FILING CABINET (LEMARI ARSIP) */}
          {activeTab === 'cabinet' && (
            <div>
              <div className="card-box-donezo">
                <div className="card-box-header">
                  <h3>Filing Cabinet & Documents Vault</h3>
                  <div className="filter-chips-row">
                    <button className={`filter-chip-btn ${selectedDrawer === 'all' ? 'active' : ''}`} onClick={() => setSelectedDrawer('all')}>All Drawers</button>
                    <button className={`filter-chip-btn ${selectedDrawer === 'legal' ? 'active' : ''}`} onClick={() => setSelectedDrawer('legal')}>Legal & PKS</button>
                    <button className={`filter-chip-btn ${selectedDrawer === 'finance' ? 'active' : ''}`} onClick={() => setSelectedDrawer('finance')}>Finance</button>
                    <button className={`filter-chip-btn ${selectedDrawer === 'creative' ? 'active' : ''}`} onClick={() => setSelectedDrawer('creative')}>Creative</button>
                    <button className={`filter-chip-btn ${selectedDrawer === 'research' ? 'active' : ''}`} onClick={() => setSelectedDrawer('research')}>Research</button>
                  </div>
                </div>

                {filteredDocs.map(doc => (
                  <div key={doc.id} className="clean-doc-item">
                    <div className="clean-doc-icon-col">
                      <div className="doc-type-icon">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="doc-item-title">{doc.title}</div>
                        <div className="doc-item-subtitle">{doc.author} • {doc.date} • {doc.size}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-pill-outline" 
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                        onClick={() => handleCopyText(doc.content, doc.id)}
                      >
                        <Copy size={13} style={{ marginRight: 4 }} /> Copy
                      </button>
                      <button 
                        className="btn-pill-primary" 
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                        onClick={() => setActiveDocModal(doc)}
                      >
                        <Eye size={13} style={{ marginRight: 4 }} /> View Doc
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CALENDAR & TIMELINE */}
          {activeTab === 'calendar' && (
            <div>
              <div className="card-box-donezo">
                <div className="card-box-header">
                  <h3>Operations Timeline & Schedules</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {INITIAL_TIMELINE.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid #e6e8ec', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Clock size={18} color="#0284c7" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{item.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.desc}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: AGENTS ROSTER */}
          {activeTab === 'agents' && (
            <div>
              <div className="card-box-donezo">
                <div className="card-box-header">
                  <h3>Autonomous Multi-Agent Roster</h3>
                  <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>Groq Primary + Gemini Backup</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {AGENTS.map(agent => (
                    <div key={agent.id} style={{ border: '1px solid #e6e8ec', borderRadius: '10px', padding: '1.25rem', background: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div className="avatar-circle" style={{ width: 40, height: 40, fontSize: '0.9rem' }}>
                          {agent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{agent.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>{agent.role}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45, marginBottom: '0.85rem' }}>{agent.task}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                        <span>Room: {agent.roomId}</span>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal View Doc */}
      {activeDocModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }} onClick={() => setActiveDocModal(null)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e6e8ec', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>{activeDocModal.category}</span>
                <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', color: '#0f172a' }}>{activeDocModal.title}</h4>
              </div>
              <button onClick={() => setActiveDocModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e6e8ec',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: '#1e293b',
                whiteSpace: 'pre-wrap'
              }}>
                {activeDocModal.content}
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e6e8ec', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: '#fafbfc' }}>
              <button className="btn-pill-outline" onClick={() => handleCopyText(activeDocModal.content, activeDocModal.id)}>
                <Copy size={13} style={{ marginRight: 4 }} /> Copy Content
              </button>
              <button className="btn-pill-primary" onClick={() => setActiveDocModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
