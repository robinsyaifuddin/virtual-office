import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  CheckSquare, 
  Calendar, 
  BarChart2, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  ArrowUpRight, 
  Plus, 
  Play, 
  Pause, 
  Square,
  Mail, 
  Bell, 
  Clock, 
  Video, 
  Layers,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Copy,
  Eye,
  X,
  FileText,
  RotateCcw,
  CheckCircle2,
  FolderGit2,
  Inbox,
  Filter,
  Trash2
} from 'lucide-react';
import { INITIAL_ARCHIVES, INITIAL_SUBMISSIONS, INITIAL_KANBAN, INITIAL_TIMELINE } from '../data/managementData';
import { AGENTS } from '../data/agents';
import '../styles/donezoExact.css';

export default function ManagementDashboard({ onLogout, onSwitchTo3D }) {
  // Navigation: 'dashboard' | 'tasks' | 'calendar' | 'analytics' | 'team' | 'cabinet' | 'settings' | 'help'
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(5048); // 01:24:08
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Data States
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);
  const [selectedDrawer, setSelectedDrawer] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Project List
  const [projects, setProjects] = useState([
    { id: 'PRJ-1', name: 'Develop API Endpoints', date: 'Nov 26, 2026', color: '#0284c7', status: 'Running' },
    { id: 'PRJ-2', name: 'Onboarding Flow', date: 'Nov 28, 2026', color: '#059669', status: 'Running' },
    { id: 'PRJ-3', name: 'Build Dashboard', date: 'Nov 30, 2026', color: '#d97706', status: 'Ended' },
    { id: 'PRJ-4', name: 'Optimize Page Load', date: 'Dec 5, 2026', color: '#7c3aed', status: 'Running' },
    { id: 'PRJ-5', name: 'Cross-Browser Testing', date: 'Dec 6, 2026', color: '#ea580c', status: 'Running' },
    { id: 'PRJ-6', name: 'WhatsApp Webhook Engine', date: 'Dec 12, 2026', color: '#0284c7', status: 'Ended' }
  ]);

  // Modals & Notifications
  const [activeDocModal, setActiveDocModal] = useState(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Teks berhasil disalin ke clipboard');
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

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const newPrj = {
      id: `PRJ-${Date.now().toString().slice(-3)}`,
      name: newProjectName.trim(),
      date: 'Dec 15, 2026',
      color: '#0284c7',
      status: 'Running'
    };
    setProjects([newPrj, ...projects]);
    setNewProjectName('');
    setIsNewProjectModalOpen(false);
    showToast('Project baru berhasil ditambahkan');
  };

  // Filters
  const pendingSubmissionsCount = submissions.filter(s => s.status === 'Menunggu Persetujuan').length;
  const runningProjectsCount = projects.filter(p => p.status === 'Running').length;
  const endedProjectsCount = projects.filter(p => p.status === 'Ended').length;

  const filteredDocs = archives.filter(doc => {
    const matchDrawer = selectedDrawer === 'all' || doc.drawer === selectedDrawer;
    const matchQuery = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDrawer && matchQuery;
  });

  return (
    <div className="donezo-viewport-wrapper">
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

      <div className="donezo-app-container">
        
        {/* ==============================================================
            1. LEFT SIDEBAR (1:1 DONEZO CLEAN)
            ============================================================== */}
        <aside className="dz-sidebar">
          {/* Brand Logo Website */}
          <div className="dz-brand-row">
            <img 
              src="/logo.webp" 
              alt="Logo" 
              style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/favicon.svg';
              }}
            />
          </div>

          {/* Section: MENU */}
          <div className="dz-menu-label">MENU</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button 
              className={`dz-nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveMenu('dashboard')}
            >
              <LayoutGrid size={17} />
              Dashboard
            </button>
            <button 
              className={`dz-nav-item ${activeMenu === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveMenu('tasks')}
            >
              <CheckSquare size={17} />
              Tasks
              <span className="dz-pill-badge">{pendingSubmissionsCount > 0 ? `${pendingSubmissionsCount}+` : '12+'}</span>
            </button>
            <button 
              className={`dz-nav-item ${activeMenu === 'cabinet' ? 'active' : ''}`}
              onClick={() => setActiveMenu('cabinet')}
            >
              <FolderGit2 size={17} />
              Documents Vault
            </button>
            <button 
              className={`dz-nav-item ${activeMenu === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveMenu('calendar')}
            >
              <Calendar size={17} />
              Calendar
            </button>
            <button 
              className={`dz-nav-item ${activeMenu === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveMenu('analytics')}
            >
              <BarChart2 size={17} />
              Analytics
            </button>
            <button 
              className={`dz-nav-item ${activeMenu === 'team' ? 'active' : ''}`}
              onClick={() => setActiveMenu('team')}
            >
              <Users size={17} />
              Team
            </button>
          </nav>

          {/* Section: GENERAL */}
          <div className="dz-menu-label" style={{ marginTop: '20px' }}>GENERAL</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button 
              className={`dz-nav-item ${activeMenu === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveMenu('settings')}
            >
              <Settings size={17} />
              Settings
            </button>
            <button 
              className={`dz-nav-item ${activeMenu === 'help' ? 'active' : ''}`}
              onClick={() => setActiveMenu('help')}
            >
              <HelpCircle size={17} />
              Help
            </button>
            {onSwitchTo3D && (
              <button 
                className="dz-nav-item" 
                onClick={onSwitchTo3D} 
                style={{ color: '#0284c7', fontWeight: 700 }}
                title="Kembali ke Denah Kantor 3D Interaktif"
              >
                <Layers size={17} />
                Kembali ke Kantor 3D
              </button>
            )}
            <button className="dz-nav-item" onClick={onLogout} style={{ color: '#ef4444' }}>
              <LogOut size={17} />
              Logout
            </button>
          </nav>

          {/* Dark Download Card at bottom */}
          <div className="dz-download-card">
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
              <Sparkles size={14} color="#38bdf8" />
            </div>
            <h5>Download our Mobile App</h5>
            <p>Get easy in another way</p>
            <button className="dz-btn-download" onClick={() => showToast('Mobile PWA Client tersedia')}>Download</button>
          </div>
        </aside>

        {/* ==============================================================
            2. MAIN APP CANVAS
            ============================================================== */}
        <div className="dz-main">
          {/* Top Header */}
          <header className="dz-header">
            {/* Search Pill */}
            <div className="dz-search-pill">
              <Search size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search task, project, or documents" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="dz-search-kbd">⌘ F</span>
            </div>

            {/* Header Right Actions */}
            <div className="dz-header-right">
              <div className="dz-circle-btn" onClick={() => showToast('Tidak ada pesan masuk')} title="Messages">
                <Mail size={16} />
              </div>
              <div className="dz-circle-btn" onClick={() => showToast('Semua sistem normal')} title="Notifications">
                <Bell size={16} />
              </div>
              <div className="dz-user-profile">
                <div className="dz-user-avatar">RS</div>
                <div className="dz-user-meta">
                  <span className="dz-user-name">Robin Syaifuddin</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Body Canvas */}
          <div className="dz-content">
            
            {/* ==============================================================
                VIEW: DASHBOARD (PERSIS GAMBAR 2 DENGAN DATA AKTIF)
                ============================================================== */}
            {activeMenu === 'dashboard' && (
              <>
                {/* Title Section */}
                <div className="dz-title-section">
                  <div className="dz-title-text">
                    <h1>Dashboard</h1>
                    <p>Plan, prioritize, and accomplish your tasks with ease.</p>
                  </div>
                  <div className="dz-actions-group">
                    <button className="dz-btn-primary" onClick={() => setIsNewProjectModalOpen(true)}>
                      <Plus size={16} />
                      Add Project
                    </button>
                    <button className="dz-btn-outline" onClick={() => showToast('Data sinkronisasi dari WhatsApp selesai')}>
                      Import Data
                    </button>
                  </div>
                </div>

                {/* 4 Metrics Row */}
                <div className="dz-metrics-row">
                  {/* Card 1: Featured Blue */}
                  <div className="dz-stat-card featured" style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('tasks')}>
                    <div className="dz-stat-header">
                      <span className="dz-stat-label">Total Projects</span>
                      <div className="dz-stat-icon-btn">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                    <div className="dz-stat-value">{projects.length + archives.length + 10}</div>
                    <div className="dz-stat-footer">
                      <span className="dz-badge-box" style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'transparent' }}>5▲</span>
                      <span>Increased from last month</span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="dz-stat-card">
                    <div className="dz-stat-header">
                      <span className="dz-stat-label">Ended Projects</span>
                      <div className="dz-stat-icon-btn">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                    <div className="dz-stat-value">{endedProjectsCount + 8}</div>
                    <div className="dz-stat-footer">
                      <span className="dz-badge-box">4▲</span>
                      <span>Increased from last month</span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="dz-stat-card">
                    <div className="dz-stat-header">
                      <span className="dz-stat-label">Running Projects</span>
                      <div className="dz-stat-icon-btn">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                    <div className="dz-stat-value">{runningProjectsCount + 8}</div>
                    <div className="dz-stat-footer">
                      <span className="dz-badge-box">2▲</span>
                      <span>Increased from last month</span>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="dz-stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('tasks')}>
                    <div className="dz-stat-header">
                      <span className="dz-stat-label">Pending Project</span>
                      <div className="dz-stat-icon-btn">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                    <div className="dz-stat-value">{pendingSubmissionsCount > 0 ? pendingSubmissionsCount : 2}</div>
                    <div className="dz-stat-footer">
                      <span>On Discuss</span>
                    </div>
                  </div>
                </div>

                {/* Middle Grid (Project Analytics, Reminders, Project List) */}
                <div className="dz-middle-grid">
                  {/* Widget 1: Project Analytics Bar Chart */}
                  <div className="dz-card" style={{ cursor: 'pointer' }} onClick={() => setActiveMenu('analytics')}>
                    <div className="dz-card-head">
                      <h3>Project Analytics</h3>
                    </div>
                    <div className="dz-bar-chart">
                      <div className="dz-bar-col">
                        <div className="dz-bar-pill" style={{ height: '70px' }}></div>
                        <span className="dz-bar-day">S</span>
                      </div>
                      <div className="dz-bar-col">
                        <div className="dz-bar-pill solid-blue" style={{ height: '100px' }}></div>
                        <span className="dz-bar-day">M</span>
                      </div>
                      <div className="dz-bar-col">
                        <div className="dz-bar-pill light-blue" style={{ height: '80px' }}>
                          <span className="dz-bar-tag-float">74%</span>
                        </div>
                        <span className="dz-bar-day">T</span>
                      </div>
                      <div className="dz-bar-col">
                        <div className="dz-bar-pill solid-blue" style={{ height: '115px' }}></div>
                        <span className="dz-bar-day">W</span>
                      </div>
                      <div className="dz-bar-col">
                        <div className="dz-bar-pill" style={{ height: '85px' }}></div>
                        <span className="dz-bar-day">T</span>
                      </div>
                      <div className="dz-bar-col">
                        <div className="dz-bar-pill" style={{ height: '65px' }}></div>
                        <span className="dz-bar-day">F</span>
                      </div>
                      <div className="dz-bar-col">
                        <div className="dz-bar-pill" style={{ height: '90px' }}></div>
                        <span className="dz-bar-day">S</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget 2: Reminders */}
                  <div className="dz-card">
                    <div className="dz-card-head">
                      <h3>Reminders</h3>
                    </div>
                    <h4 className="dz-reminder-title">Meeting with Arc Company</h4>
                    <div className="dz-reminder-time">Time : 02.00 pm - 04.00 pm</div>
                    <button className="dz-btn-start" onClick={() => showToast('Menghubungkan ke ruang rapat virtual...')}>
                      <Video size={16} />
                      Start Meeting
                    </button>
                  </div>

                  {/* Widget 3: Project List */}
                  <div className="dz-card">
                    <div className="dz-card-head">
                      <h3>Project</h3>
                      <button 
                        className="dz-btn-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '14px' }}
                        onClick={() => setIsNewProjectModalOpen(true)}
                      >
                        + New
                      </button>
                    </div>
                    <div>
                      {projects.slice(0, 4).map(item => (
                        <div key={item.id} className="dz-project-item">
                          <div className="dz-project-left">
                            <div className="dz-project-bullet" style={{ background: item.color }}></div>
                            <div>
                              <div className="dz-project-name">{item.name}</div>
                              <div className="dz-project-date">Due date: {item.date}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Grid (Team Collaboration, Project Progress Gauge, Time Tracker) */}
                <div className="dz-bottom-grid">
                  {/* Widget 4: Team Collaboration */}
                  <div className="dz-card">
                    <div className="dz-card-head">
                      <h3>Team Collaboration</h3>
                      <button 
                        className="dz-btn-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '14px' }}
                        onClick={() => setActiveMenu('team')}
                      >
                        + Add Member
                      </button>
                    </div>
                    <div>
                      <div className="dz-team-row">
                        <div className="dz-team-meta">
                          <div className="dz-member-avatar" style={{ background: '#fce7f3', color: '#db2777' }}>AD</div>
                          <div>
                            <div className="dz-member-name">Alexandra Deff</div>
                            <div className="dz-member-desc">Working on Github Project Repository</div>
                          </div>
                        </div>
                        <span className="dz-status-tag completed">Completed</span>
                      </div>

                      <div className="dz-team-row">
                        <div className="dz-team-meta">
                          <div className="dz-member-avatar" style={{ background: '#dbeafe', color: '#1d4ed8' }}>EA</div>
                          <div>
                            <div className="dz-member-name">Edwin Adenike</div>
                            <div className="dz-member-desc">Working on Integrate User Authentication</div>
                          </div>
                        </div>
                        <span className="dz-status-tag inprogress">In Progress</span>
                      </div>

                      <div className="dz-team-row">
                        <div className="dz-team-meta">
                          <div className="dz-member-avatar" style={{ background: '#e0e7ff', color: '#4338ca' }}>IO</div>
                          <div>
                            <div className="dz-member-name">Isaac Oluwatemilorun</div>
                            <div className="dz-member-desc">Working on Develop Search and Filter Functionality</div>
                          </div>
                        </div>
                        <span className="dz-status-tag pending">Pending</span>
                      </div>

                      <div className="dz-team-row">
                        <div className="dz-team-meta">
                          <div className="dz-member-avatar" style={{ background: '#fef3c7', color: '#d97706' }}>DO</div>
                          <div>
                            <div className="dz-member-name">David Oshodi</div>
                            <div className="dz-member-desc">Working on Responsive Layout for Homepage</div>
                          </div>
                        </div>
                        <span className="dz-status-tag inprogress">In Progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget 5: Project Progress Semi-Circle */}
                  <div className="dz-card">
                    <div className="dz-card-head">
                      <h3>Project Progress</h3>
                    </div>
                    <div className="dz-progress-box">
                      <svg width="180" height="100" viewBox="0 0 200 110">
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="22" strokeLinecap="round" />
                        <path d="M 20 100 A 80 80 0 0 1 125 24" fill="none" stroke="#0284c7" strokeWidth="22" strokeLinecap="round" />
                      </svg>
                      <div className="dz-progress-big-num">41%</div>
                      <div className="dz-progress-subtitle">Project Ended</div>
                      <div className="dz-progress-legend">
                        <span><span className="dz-legend-dot" style={{ background: '#0284c7' }}></span> Completed</span>
                        <span><span className="dz-legend-dot" style={{ background: '#38bdf8' }}></span> In Progress</span>
                        <span><span className="dz-legend-dot" style={{ background: '#cbd5e1' }}></span> Pending</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget 6: Time Tracker Dark Widget */}
                  <div className="dz-tracker-card">
                    <div className="dz-tracker-label">Time Tracker</div>
                    <div className="dz-tracker-time">{formatTime(timerSeconds)}</div>
                    <div className="dz-tracker-controls">
                      <button 
                        className={`dz-timer-btn ${isTimerRunning ? 'active' : ''}`}
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                      >
                        {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button 
                        className="dz-timer-btn" 
                        onClick={() => { setIsTimerRunning(false); setTimerSeconds(0); }}
                        title="Reset Timer"
                      >
                        <Square size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ==============================================================
                VIEW: TASKS (MEJA PENGUMPULAN TUGAS)
                ============================================================== */}
            {activeMenu === 'tasks' && (
              <div>
                <div className="dz-title-section">
                  <div className="dz-title-text">
                    <h1>Tasks & Submissions</h1>
                    <p>Review and approve outputs produced by autonomous AI agents from WhatsApp.</p>
                  </div>
                </div>

                <div className="dz-card">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {submissions.map(sub => (
                      <div key={sub.id} style={{ border: '1px solid #edf0f4', borderRadius: '14px', padding: '18px', background: '#ffffff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: '#121826' }}>{sub.taskTitle}</h4>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              Agent: <b>{sub.agentName}</b> ({sub.agentRole}) • {sub.timestamp} • Engine: <b>{sub.engineUsed}</b>
                            </span>
                          </div>
                          <span className={`dz-status-tag ${sub.status === 'Disetujui' ? 'completed' : 'inprogress'}`}>
                            {sub.status}
                          </span>
                        </div>

                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '14px',
                          fontFamily: 'Consolas, monospace',
                          fontSize: '0.82rem',
                          lineHeight: 1.5,
                          color: '#334155',
                          maxHeight: '180px',
                          overflowY: 'auto',
                          whiteSpace: 'pre-wrap',
                          marginBottom: '12px'
                        }}>
                          {sub.fullOutput}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{sub.summary}</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="dz-btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleCopyText(sub.fullOutput, sub.id)}>
                              <Copy size={13} /> {copiedId === sub.id ? 'Copied' : 'Copy'}
                            </button>
                            <button className="dz-btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem', color: '#e11d48' }} onClick={() => handleRequestRevision(sub.id)}>
                              <RotateCcw size={13} /> Revision
                            </button>
                            <button className="dz-btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }} onClick={() => handleApproveSubmission(sub.id)}>
                              <CheckCircle2 size={13} /> Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                VIEW: DOCUMENTS VAULT (LEMARI ARSIP)
                ============================================================== */}
            {activeMenu === 'cabinet' && (
              <div>
                <div className="dz-title-section">
                  <div className="dz-title-text">
                    <h1>Documents Vault & Archives</h1>
                    <p>Centralized secure storage for legal contracts, financial reports, and intelligence.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className={`dz-btn-outline ${selectedDrawer === 'all' ? 'active' : ''}`} onClick={() => setSelectedDrawer('all')}>All</button>
                    <button className={`dz-btn-outline ${selectedDrawer === 'legal' ? 'active' : ''}`} onClick={() => setSelectedDrawer('legal')}>Legal</button>
                    <button className={`dz-btn-outline ${selectedDrawer === 'finance' ? 'active' : ''}`} onClick={() => setSelectedDrawer('finance')}>Finance</button>
                    <button className={`dz-btn-outline ${selectedDrawer === 'creative' ? 'active' : ''}`} onClick={() => setSelectedDrawer('creative')}>Creative</button>
                  </div>
                </div>

                <div className="dz-card">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredDocs.map(doc => (
                      <div key={doc.id} className="dz-project-item" style={{ padding: '14px 12px' }}>
                        <div className="dz-project-left">
                          <div className="dz-project-bullet" style={{ background: '#0284c7' }}></div>
                          <div>
                            <div className="dz-project-name" style={{ fontSize: '0.92rem' }}>{doc.title}</div>
                            <div className="dz-project-date">{doc.author} • {doc.date} • {doc.size}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="dz-btn-outline" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => handleCopyText(doc.content, doc.id)}>
                            <Copy size={13} /> Copy
                          </button>
                          <button className="dz-btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }} onClick={() => setActiveDocModal(doc)}>
                            <Eye size={13} /> View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                VIEW: CALENDAR
                ============================================================== */}
            {activeMenu === 'calendar' && (
              <div>
                <div className="dz-title-section">
                  <div className="dz-title-text">
                    <h1>Operations Calendar</h1>
                    <p>Automated agent shifts, scheduled briefings, and marketing broadcasts.</p>
                  </div>
                </div>

                <div className="dz-card">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {INITIAL_TIMELINE.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid #edf0f4', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <Clock size={18} color="#0284c7" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#121826' }}>{item.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.desc}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                VIEW: ANALYTICS
                ============================================================== */}
            {activeMenu === 'analytics' && (
              <div>
                <div className="dz-title-section">
                  <div className="dz-title-text">
                    <h1>Performance Analytics</h1>
                    <p>Real-time execution latency and dual-engine throughput metrics.</p>
                  </div>
                </div>

                <div className="dz-metrics-row">
                  <div className="dz-stat-card featured">
                    <div className="dz-stat-label">Total Queries</div>
                    <div className="dz-stat-value">1,482</div>
                    <div className="dz-stat-footer">Processed via Groq Engine</div>
                  </div>
                  <div className="dz-stat-card">
                    <div className="dz-stat-label">Average Latency</div>
                    <div className="dz-stat-value">0.42s</div>
                    <div className="dz-stat-footer">Ultra-fast inference</div>
                  </div>
                  <div className="dz-stat-card">
                    <div className="dz-stat-label">Gemini Fallback</div>
                    <div className="dz-stat-value">3</div>
                    <div className="dz-stat-footer">Times switched safely</div>
                  </div>
                  <div className="dz-stat-card">
                    <div className="dz-stat-label">System Uptime</div>
                    <div className="dz-stat-value">99.9%</div>
                    <div className="dz-stat-footer">24/7 Cloud Active</div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                VIEW: TEAM ROSTER
                ============================================================== */}
            {activeMenu === 'team' && (
              <div>
                <div className="dz-title-section">
                  <div className="dz-title-text">
                    <h1>Team Members & Agents</h1>
                    <p>Autonomous AI specialists deployed in your virtual headquarters.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {AGENTS.map(agent => (
                    <div key={agent.id} className="dz-card" style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div className="dz-member-avatar" style={{ width: 42, height: 42, fontSize: '0.85rem' }}>
                          {agent.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#121826' }}>{agent.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 600 }}>{agent.role}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45, marginBottom: '14px' }}>
                        {agent.task}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <span>Room: {agent.roomId}</span>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>WhatsApp Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==============================================================
                VIEW: SETTINGS & HELP
                ============================================================== */}
            {(activeMenu === 'settings' || activeMenu === 'help') && (
              <div>
                <div className="dz-title-section">
                  <div className="dz-title-text">
                    <h1>{activeMenu === 'settings' ? 'Workspace Settings' : 'Help & Documentation'}</h1>
                    <p>Configure credentials, webhooks, and multi-agent coordination preferences.</p>
                  </div>
                </div>

                <div className="dz-card">
                  <h4 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 800 }}>Dual-Engine AI Status</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                    Primary Engine: <b>Groq Llama 3.3 70B</b> (Active & Ultra-Fast)<br />
                    Backup Engine: <b>Google Gemini 2.5 Flash</b> (Standby on rate limit)<br />
                    Gateway: <b>Green API WhatsApp Cloud</b>
                  </p>
                  <button className="dz-btn-primary" style={{ marginTop: '12px' }} onClick={() => showToast('Semua koneksi engine normal')}>
                    Verify Connections
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
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
            borderRadius: '18px',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #edf0f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>{activeDocModal.category}</span>
                <h4 style={{ margin: '4px 0 0', fontSize: '1.1rem', color: '#121826' }}>{activeDocModal.title}</h4>
              </div>
              <button onClick={() => setActiveDocModal(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #edf0f4',
                borderRadius: '10px',
                padding: '16px',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                color: '#1e293b',
                whiteSpace: 'pre-wrap'
              }}>
                {activeDocModal.content}
              </div>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid #edf0f4', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: '#fafbfc' }}>
              <button className="dz-btn-outline" onClick={() => handleCopyText(activeDocModal.content, activeDocModal.id)}>
                <Copy size={13} /> Copy Content
              </button>
              <button className="dz-btn-primary" onClick={() => setActiveDocModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Project */}
      {isNewProjectModalOpen && (
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
        }} onClick={() => setIsNewProjectModalOpen(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Add New Project</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>
                Project Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. Automasi CRM WhatsApp" 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '16px'
                }}
                autoFocus
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="dz-btn-outline" onClick={() => setIsNewProjectModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dz-btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
