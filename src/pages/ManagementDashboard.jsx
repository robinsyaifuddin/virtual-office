import React, { useState } from 'react';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Users, 
  FolderGit2, 
  FileText, 
  Target, 
  BarChart2, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Mail, 
  Moon, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Folder, 
  Upload, 
  Video, 
  Send, 
  Sparkles, 
  Copy, 
  Eye, 
  X, 
  RotateCcw,
  Check,
  ChevronRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { INITIAL_ARCHIVES, INITIAL_SUBMISSIONS } from '../data/managementData';
import { AGENTS } from '../data/agents';
import '../styles/floworaTheme.css';

export default function ManagementDashboard({ onLogout }) {
  // Navigation Tabs: 'home' (Gambar 3) | 'tasks' (Gambar 1) | 'documents' (Gambar 2) | 'team' | 'settings'
  const [activeTab, setActiveTab] = useState('home');

  // Submissions (WhatsApp Output) State
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);
  const [copiedId, setCopiedId] = useState(null);
  const [activeDocModal, setActiveDocModal] = useState(null);

  // Search & Toast
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Teks berhasil disalin ke clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApproveSubmission = (subId) => {
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: 'Disetujui' } : s));
    showToast('Tugas agen disetujui');
  };

  return (
    <div className="fl-layout">
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
          1. FLOWORA SIDEBAR (PERSIS GAMBAR 3)
          ============================================================== */}
      <aside className="fl-sidebar">
        <div className="fl-brand-header">
          <img 
            src="/logo.webp" 
            alt="Logo" 
            className="fl-brand-logo-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/favicon.svg';
              e.target.style.width = '36px';
            }}
          />
        </div>

        <nav className="fl-nav-list">
          <button 
            className={`fl-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={18} />
            Home
          </button>
          <button 
            className={`fl-nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare size={18} />
            My Tasks
            <span className="fl-nav-badge">5</span>
          </button>
          <button 
            className={`fl-nav-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={18} />
            Documents
          </button>
          <button 
            className={`fl-nav-btn ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <Users size={18} />
            Team Agents
          </button>
          <button 
            className="fl-nav-btn"
            onClick={() => showToast('Calendar harian')}
          >
            <Calendar size={18} />
            Calendar
          </button>
          <button 
            className="fl-nav-btn"
            onClick={() => showToast('Goal setting operasional')}
          >
            <Target size={18} />
            Goals
          </button>
          <button 
            className="fl-nav-btn"
            onClick={() => showToast('Report performa dual-engine')}
          >
            <BarChart2 size={18} />
            Reports
          </button>
          <button 
            className="fl-nav-btn"
            onClick={() => showToast('Pengaturan workspace')}
          >
            <Settings size={18} />
            Settings
          </button>
          <button 
            className="fl-nav-btn" 
            onClick={onLogout} 
            style={{ color: '#ef4444', marginTop: '8px' }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>

        {/* Small Progress Green Banner at Bottom */}
        <div className="fl-sidebar-banner">
          <h5>Small steps make big progress</h5>
          <p>Autonomous AI agents coordinate in background.</p>
          <button className="fl-banner-btn" onClick={() => setActiveTab('tasks')}>
            Review Tasks →
          </button>
        </div>
      </aside>

      {/* ==============================================================
          2. MAIN CONTENT WRAPPER
          ============================================================== */}
      <div className="fl-main-wrapper">
        {/* Top Header (Persis Gambar 3) */}
        <header className="fl-topbar">
          <div className="fl-search-bar">
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search anything... (tasks, people, files, etc.)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="fl-topbar-actions">
            <div className="fl-icon-circle" onClick={() => showToast('3 Notifikasi baru')}>
              <Bell size={16} />
              <span className="fl-red-dot"></span>
            </div>
            <div className="fl-icon-circle" onClick={() => showToast('Semua pesan sinkron dengan WhatsApp')}>
              <Mail size={16} />
            </div>
            <div className="fl-icon-circle" onClick={() => showToast('Tema mode disesuaikan')}>
              <Moon size={16} />
            </div>
            <div className="fl-user-badge">
              <div className="fl-user-avatar">RS</div>
              <span className="fl-user-name">Robin Syaifuddin</span>
            </div>
          </div>
        </header>

        {/* ==============================================================
            TAB 1: HOME DASHBOARD (PERSIS GAMBAR 3)
            ============================================================== */}
        {activeTab === 'home' && (
          <main className="fl-canvas">
            <div className="fl-dashboard-grid">
              {/* Left & Middle Column Stream */}
              <div>
                {/* Hero Greeting Card */}
                <div className="fl-hero-card">
                  <div className="fl-hero-left">
                    <div className="fl-hero-avatar-box">RS</div>
                    <div className="fl-hero-text">
                      <h2>Good Morning, Robin Syaifuddin</h2>
                      <p>"Great things never come from comfort zones."</p>
                    </div>
                  </div>
                  <div className="fl-hero-right-widget">
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Thu, 15 Oct 2026</span>
                    <span className="fl-weather-badge">28°C Partly Cloudy</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Jakarta, ID</span>
                  </div>
                </div>

                {/* 4 Metrics Strip */}
                <div className="fl-metrics-strip">
                  <div className="fl-metric-pill-card">
                    <div className="fl-metric-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                      <CheckSquare size={20} />
                    </div>
                    <div>
                      <div className="fl-metric-lbl">Total Tasks</div>
                      <div className="fl-metric-val">12</div>
                      <div className="fl-metric-delta">↑ 3 today</div>
                    </div>
                  </div>

                  <div className="fl-metric-pill-card">
                    <div className="fl-metric-icon-box" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
                      <FolderGit2 size={20} />
                    </div>
                    <div>
                      <div className="fl-metric-lbl">Projects</div>
                      <div className="fl-metric-val">4</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Active</div>
                    </div>
                  </div>

                  <div className="fl-metric-pill-card">
                    <div className="fl-metric-icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}>
                      <Video size={20} />
                    </div>
                    <div>
                      <div className="fl-metric-lbl">Meetings</div>
                      <div className="fl-metric-val">3</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Today</div>
                    </div>
                  </div>

                  <div className="fl-metric-pill-card">
                    <div className="fl-metric-icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="fl-metric-lbl">Hours Tracked</div>
                      <div className="fl-metric-val">6.5</div>
                      <div className="fl-metric-delta">↑ 1.2h</div>
                    </div>
                  </div>
                </div>

                {/* Analytics Row (This Month Earnings Wave + Productivity Donut + Team Activity) */}
                <div className="fl-analytics-row">
                  {/* Card 1: Performance Growth */}
                  <div className="fl-card">
                    <div className="fl-card-head">
                      <span className="fl-card-title">This Month Earnings</span>
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>↑ 12%</span>
                    </div>
                    <div className="fl-chart-val-big">$3,240</div>
                    {/* SVG Wave Chart */}
                    <svg width="100%" height="90" viewBox="0 0 240 90">
                      <path d="M 0 70 Q 40 40 80 60 T 160 30 T 240 20" fill="none" stroke="#0284c7" strokeWidth="3" />
                      <circle cx="160" cy="30" r="5" fill="#0284c7" />
                    </svg>
                  </div>

                  {/* Card 2: Productivity Donut */}
                  <div className="fl-card">
                    <div className="fl-card-head">
                      <span className="fl-card-title">Productivity</span>
                    </div>
                    <div className="fl-donut-container">
                      <svg width="110" height="110" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#0284c7" strokeWidth="12" strokeDasharray="300" strokeDashoffset="75" strokeLinecap="round" />
                      </svg>
                      <div className="fl-donut-center-text">
                        <div className="fl-donut-percent">78%</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '10px', textAlign: 'center' }}>
                      Focused Work • 4h 30m
                    </div>
                  </div>

                  {/* Card 3: Team Activity */}
                  <div className="fl-card">
                    <div className="fl-card-head">
                      <span className="fl-card-title">Team Activity</span>
                      <button className="fl-see-all" onClick={() => setActiveTab('team')}>View all →</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                        <b>Sara Ali</b> commented on Project UI
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                        <b>Ahmed Raza</b> completed a task
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                        <b>Zainab Fatima</b> joined the workspace
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Projects Row */}
                <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Recent Projects</h3>
                  <button className="fl-see-all" onClick={() => showToast('Membuka seluruh proyek')}>View all →</button>
                </div>
                <div className="fl-recent-projects-grid">
                  <div className="fl-project-box">
                    <div className="fl-project-icon-sq" style={{ background: '#0284c7' }}>
                      <Folder size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Rently</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Rental Marketplace</div>
                    </div>
                    <div className="fl-progress-track">
                      <div className="fl-progress-fill" style={{ width: '85%' }}></div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Due: 30 Aug</span>
                  </div>

                  <div className="fl-project-box">
                    <div className="fl-project-icon-sq" style={{ background: '#10b981' }}>
                      <Folder size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Green Market</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>E-commerce App</div>
                    </div>
                    <div className="fl-progress-track">
                      <div className="fl-progress-fill" style={{ width: '60%', background: '#10b981' }}></div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Due: 5 Sep</span>
                  </div>

                  <div className="fl-project-box">
                    <div className="fl-project-icon-sq" style={{ background: '#8b5cf6' }}>
                      <Folder size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>MediLink</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Doctor Appointment</div>
                    </div>
                    <div className="fl-progress-track">
                      <div className="fl-progress-fill" style={{ width: '45%', background: '#8b5cf6' }}></div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Due: 12 Sep</span>
                  </div>

                  <div className="fl-project-box">
                    <div className="fl-project-icon-sq" style={{ background: '#f59e0b' }}>
                      <Folder size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Fitness Coach</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Web Application</div>
                    </div>
                    <div className="fl-progress-track">
                      <div className="fl-progress-fill" style={{ width: '70%', background: '#f59e0b' }}></div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Due: 18 Sep</span>
                  </div>
                </div>

                {/* Quick Actions Grid (Persis Gambar 3) */}
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ margin: '0 0 14px 0', fontSize: '1rem', fontWeight: 800 }}>Quick Actions</h3>
                  <div className="fl-quick-actions-row">
                    <div className="fl-quick-act-btn" onClick={() => setActiveTab('tasks')}>
                      <Plus size={18} color="#0284c7" />
                      New Task
                    </div>
                    <div className="fl-quick-act-btn" onClick={() => showToast('Membuat Project baru')}>
                      <FolderGit2 size={18} color="#7c3aed" />
                      New Project
                    </div>
                    <div className="fl-quick-act-btn" onClick={() => setActiveTab('documents')}>
                      <Upload size={18} color="#059669" />
                      Upload File
                    </div>
                    <div className="fl-quick-act-btn" onClick={() => showToast('Jadwal event ditambahkan')}>
                      <Calendar size={18} color="#d97706" />
                      Add Event
                    </div>
                    <div className="fl-quick-act-btn" onClick={() => showToast('Timer operasional aktif')}>
                      <Clock size={18} color="#ea580c" />
                      Start Timer
                    </div>
                    <div className="fl-quick-act-btn" onClick={() => showToast('Laporan diekspor ke PDF')}>
                      <BarChart2 size={18} color="#0284c7" />
                      Generate Report
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Column (Calendar + Upcoming Tasks + Flowora AI) */}
              <div className="fl-right-col">
                {/* Mini Calendar Widget */}
                <div className="fl-calendar-widget">
                  <div className="fl-card-head">
                    <span className="fl-card-title">Calendar</span>
                    <button className="fl-see-all">View all →</button>
                  </div>
                  <div style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.92rem', marginBottom: '12px' }}>
                    August 2026
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    <span>24</span><span>25</span><span style={{ background: '#0284c7', color: '#fff', borderRadius: '50%', padding: '2px' }}>26</span><span>27</span><span>28</span><span>29</span><span>30</span>
                  </div>
                </div>

                {/* Upcoming Tasks */}
                <div className="fl-card">
                  <div className="fl-card-head">
                    <span className="fl-card-title">Upcoming Tasks</span>
                    <button className="fl-see-all" onClick={() => setActiveTab('tasks')}>View all →</button>
                  </div>
                  <div className="fl-upcoming-item">
                    <CheckCircle2 size={16} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Design dashboard UI</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Today • 11:00 AM</div>
                    </div>
                  </div>
                  <div className="fl-upcoming-item">
                    <CheckCircle2 size={16} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Client meeting (Zoom)</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Today • 3:00 PM</div>
                    </div>
                  </div>
                  <div className="fl-upcoming-item">
                    <CheckCircle2 size={16} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Project presentation</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tomorrow • 10:00 AM</div>
                    </div>
                  </div>
                </div>

                {/* Flowora AI Assistant Card */}
                <div className="fl-ai-bot-widget">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="#38bdf8" />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Flowora AI</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)' }}>
                    Your smart assistant connected to Groq Llama 3.3. How can I help you today?
                  </p>
                  <div className="fl-ai-input-pill">
                    <input type="text" placeholder="Ask anything..." onKeyDown={(e) => { if (e.key === 'Enter') { showToast('Tugas diproses via Groq'); e.target.value = ''; } }} />
                    <Send size={14} color="#38bdf8" style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ==============================================================
            TAB 2: MY TASKS (PERSIS GAMBAR 1 - KIM NAMJOON STYLE)
            ============================================================== */}
        {activeTab === 'tasks' && (
          <main className="fl-canvas">
            <div className="kn-tasks-layout">
              {/* Left Column: Today Task + 3 Cards + Task Progress */}
              <div>
                {/* Hero Today Task Banner */}
                <div className="kn-hero-card">
                  <div>
                    <h2 className="kn-hero-title">Today Task</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      Check your daily tasks and schedules submitted by AI Agents.
                    </p>
                    <button className="kn-btn-schedule" onClick={() => showToast('Jadwal hari ini sinkron')}>
                      Today's schedule
                    </button>
                  </div>
                  <div style={{ fontSize: '2.5rem', background: '#f0f9ff', padding: '16px 24px', borderRadius: '18px', color: '#0284c7' }}>
                    📋
                  </div>
                </div>

                {/* 3 Progress Cards (Web Dashboard, Mobile App, Animation) */}
                <div className="kn-cards-row">
                  <div className="kn-card">
                    <span className="kn-card-date">Mar 2, 2026</span>
                    <div className="kn-card-name">Web Dashboard</div>
                    <span className="kn-card-category">Designing</span>
                    <div className="fl-progress-track" style={{ marginTop: '8px' }}>
                      <div className="fl-progress-fill" style={{ width: '90%' }}></div>
                    </div>
                    <div className="kn-card-footer">
                      <span className="kn-pill-left">Progress 90%</span>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>3 days left</span>
                    </div>
                  </div>

                  <div className="kn-card">
                    <span className="kn-card-date">Mar 6, 2026</span>
                    <div className="kn-card-name">Mobile App</div>
                    <span className="kn-card-category">Shopping</span>
                    <div className="fl-progress-track" style={{ marginTop: '8px' }}>
                      <div className="fl-progress-fill" style={{ width: '30%', background: '#38bdf8' }}></div>
                    </div>
                    <div className="kn-card-footer">
                      <span className="kn-pill-left">Progress 30%</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>25 days left</span>
                    </div>
                  </div>

                  <div className="kn-card">
                    <span className="kn-card-date">Mar 8, 2026</span>
                    <div className="kn-card-name">Animation</div>
                    <span className="kn-card-category">Designing</span>
                    <div className="fl-progress-track" style={{ marginTop: '8px' }}>
                      <div className="fl-progress-fill" style={{ width: '75%', background: '#f59e0b' }}></div>
                    </div>
                    <div className="kn-card-footer">
                      <span className="kn-pill-left">Progress 75%</span>
                      <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 700 }}>7 days left</span>
                    </div>
                  </div>
                </div>

                {/* Agent WhatsApp Task Submissions Feed */}
                <div className="fl-card" style={{ marginBottom: '24px' }}>
                  <div className="fl-card-head">
                    <span className="fl-card-title">Live Submissions from WhatsApp Group</span>
                    <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>Groq + Gemini</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {submissions.map(sub => (
                      <div key={sub.id} style={{ border: '1px solid #edf2f7', borderRadius: '12px', padding: '16px', background: '#ffffff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{sub.taskTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sub.agentName} ({sub.agentRole}) • {sub.timestamp}</div>
                          </div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: sub.status === 'Disetujui' ? '#dcfce7' : '#fef3c7', color: sub.status === 'Disetujui' ? '#166534' : '#b45309' }}>
                            {sub.status}
                          </span>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', fontFamily: 'Consolas, monospace', whiteSpace: 'pre-wrap', maxHeight: '140px', overflowY: 'auto', marginBottom: '10px' }}>
                          {sub.fullOutput}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }} onClick={() => handleCopyText(sub.fullOutput, sub.id)}>
                            <Copy size={13} /> {copiedId === sub.id ? 'Copied' : 'Copy'}
                          </button>
                          <button className="fl-banner-btn" onClick={() => handleApproveSubmission(sub.id)}>
                            <Check size={13} /> Approve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Schedule Timeline & Batchmates */}
              <div className="kn-right-col">
                {/* Schedule Card */}
                <div className="kn-schedule-box">
                  <div className="fl-card-head">
                    <span className="fl-card-title">March Schedule</span>
                    <button className="fl-see-all">+ Add Task</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginBottom: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <div>4<br/><span style={{ color: '#94a3b8' }}>mon</span></div>
                    <div>5<br/><span style={{ color: '#94a3b8' }}>tue</span></div>
                    <div style={{ background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '8px' }}>6<br/><span>wed</span></div>
                    <div>7<br/><span style={{ color: '#94a3b8' }}>thu</span></div>
                    <div>8<br/><span style={{ color: '#94a3b8' }}>fri</span></div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '12px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>UI Motion</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>10:00am - 12:00pm</div>
                    </div>
                    <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '12px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>UI Design Review</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>12:00pm - 01:00pm</div>
                    </div>
                  </div>
                </div>

                {/* Batchmates / AI Agents Roster */}
                <div className="kn-batchmates-box">
                  <div className="fl-card-head">
                    <span className="fl-card-title">Batchmates</span>
                    <button className="fl-see-all">See all</button>
                  </div>
                  {AGENTS.slice(0, 3).map(ag => (
                    <div key={ag.id} className="kn-member-card">
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#bae6fd', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                        {ag.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{ag.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ag.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ==============================================================
            TAB 3: DOCUMENTS (PERSIS GAMBAR 2)
            ============================================================== */}
        {activeTab === 'documents' && (
          <main className="fl-canvas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Documents</h1>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Manage, inspect and verify policies and reports.</p>
              </div>
              <button className="fl-banner-btn" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={() => showToast('Form upload dokumen dibuka')}>
                + New Document
              </button>
            </div>

            {/* 4 Top Folders (Policies, Inspection, Claims, Verify) */}
            <div className="doc-top-folders">
              <div className="doc-folder-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0284c7' }}>
                  <Folder size={22} />
                  <ArrowUpRight size={16} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Policies 2026</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>45 files • 256 Mb</div>
              </div>

              <div className="doc-folder-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0284c7' }}>
                  <Folder size={22} />
                  <ArrowUpRight size={16} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Inspection Reports</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>30 files • 512 Mb</div>
              </div>

              <div className="doc-folder-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0284c7' }}>
                  <Folder size={22} />
                  <ArrowUpRight size={16} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Claim Documentation</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>8 files • 32 Mb</div>
              </div>

              <div className="doc-folder-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0284c7' }}>
                  <Folder size={22} />
                  <ArrowUpRight size={16} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Verify Required Docs</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>12 files • 64 Mb</div>
              </div>
            </div>

            {/* Split: Table Recent Files + Document Compliance & Storage */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '24px' }}>
              {/* Table */}
              <div className="doc-table-box">
                <div className="fl-card-head">
                  <span className="fl-card-title">Recent Files</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }}>Import</button>
                    <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }}>Renew</button>
                  </div>
                </div>

                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>File ID</th>
                      <th>Uploaded by</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archives.map(doc => (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 700 }}>{doc.category}</td>
                        <td style={{ color: '#64748b' }}>{doc.id}</td>
                        <td>{doc.author}</td>
                        <td>{doc.date}</td>
                        <td>
                          <span className={doc.status === 'Lunas' || doc.status === 'Aktif' || doc.status === 'Siap Tayang' ? 'doc-tag-valid' : 'doc-tag-invalid'}>
                            • Valid
                          </span>
                        </td>
                        <td>
                          <button className="fl-see-all" onClick={() => setActiveDocModal(doc)}>
                            <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right Side Widgets: Compliance & Blue Storage Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Document Compliance */}
                <div className="doc-compliance-card">
                  <div className="fl-card-head">
                    <span className="fl-card-title">Document Compliance</span>
                  </div>
                  <div className="doc-segmented-bar">
                    <div style={{ width: '16%', background: '#f59e0b' }}></div>
                    <div style={{ width: '62%', background: '#0284c7' }}></div>
                    <div style={{ width: '22%', background: '#10b981' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginBottom: '16px' }}>
                    <div><b>421</b><br/><span style={{ fontSize: '0.72rem', color: '#64748b' }}>Valid</span></div>
                    <div><b>48</b><br/><span style={{ fontSize: '0.72rem', color: '#64748b' }}>Pending</span></div>
                    <div><b>5</b><br/><span style={{ fontSize: '0.72rem', color: '#dc2626' }}>Expired</span></div>
                  </div>
                </div>

                {/* Storage Usage Blue Card */}
                <div className="doc-storage-blue-card">
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>Storage Usage</div>
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>25%</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>124 GB out of 500GB</div>
                  </div>
                  <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>• 12% - 60 GB Policy Files</div>
                    <div>• 7% - 35 GB Contracts</div>
                    <div>• 6% - 30 GB Intelligence</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ==============================================================
            TAB 4: TEAM AGENTS
            ============================================================== */}
        {activeTab === 'team' && (
          <main className="fl-canvas">
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Team Agents</h1>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Autonomous multi-agents active and connected to WhatsApp.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {AGENTS.map(agent => (
                <div key={agent.id} className="fl-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div className="fl-hero-avatar-box" style={{ width: 44, height: 44, fontSize: '0.9rem' }}>
                      {agent.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{agent.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>{agent.role}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
                    {agent.task}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #edf2f7', paddingTop: '10px' }}>
                    <span>Room: {agent.roomId}</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>WhatsApp Active</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}
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
              <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }} onClick={() => handleCopyText(activeDocModal.content, activeDocModal.id)}>
                <Copy size={13} /> Copy Content
              </button>
              <button className="fl-banner-btn" onClick={() => setActiveDocModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
