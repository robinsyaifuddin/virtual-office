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
  AlertCircle,
  Bot,
  Cpu
} from 'lucide-react';
import { INITIAL_ARCHIVES, INITIAL_SUBMISSIONS } from '../data/managementData';
import { AGENTS } from '../data/agents';
import AgentPerformanceWorkspace from './AgentPerformanceWorkspace';
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
            className={`fl-nav-btn ${activeTab === 'agent-performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent-performance')}
            style={{
              background: activeTab === 'agent-performance' ? '#e0f2fe' : undefined,
              color: activeTab === 'agent-performance' ? '#0284c7' : undefined,
              fontWeight: activeTab === 'agent-performance' ? 800 : undefined
            }}
          >
            <Bot size={18} color={activeTab === 'agent-performance' ? '#0284c7' : '#64748b'} />
            Kinerja Agent
            <span className="fl-nav-badge" style={{ background: '#0284c7', color: '#ffffff' }}>AI</span>
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
            className={`fl-nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={18} />
            Calendar
          </button>
          <button 
            className={`fl-nav-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            <Target size={18} />
            Goals
          </button>
          <button 
            className={`fl-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
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
                    <div className="fl-metric-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
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
                    <div className="fl-project-icon-sq" style={{ background: '#0284c7' }}>
                      <Folder size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>MediLink</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Doctor Appointment</div>
                    </div>
                    <div className="fl-progress-track">
                      <div className="fl-progress-fill" style={{ width: '45%', background: '#0284c7' }}></div>
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
                      <FolderGit2 size={18} color="#0284c7" />
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f9ff', padding: '16px 20px', borderRadius: '18px', color: '#0284c7' }}>
                    <FileText size={36} color="#0284c7" />
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

        {/* ==============================================================
            TAB 5: CALENDAR & AVAILABILITY (PERSIS REFERENSI GAMBAR 1)
            ============================================================== */}
        {activeTab === 'calendar' && (
          <main className="fl-canvas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Availability</h1>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Manage slots, meetings and agent schedules.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }}>Consultant ▾</button>
                <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }}>Client ▾</button>
                <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }}>Status ▾</button>
                <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#ffffff', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  London, UK (GMT +0)
                </span>
              </div>
            </div>

            <div className="cal-grid-layout">
              {/* Left Column: Mini Calendar & Categories */}
              <div className="fl-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>October, 2026</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="fl-banner-btn" style={{ padding: '4px 8px' }}>‹</button>
                    <button className="fl-banner-btn" style={{ padding: '4px 8px' }}>›</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '0.75rem', marginBottom: '24px' }}>
                  <span style={{ color: '#94a3b8' }}>SU</span><span style={{ color: '#94a3b8' }}>MO</span><span style={{ color: '#94a3b8' }}>TU</span><span style={{ color: '#94a3b8' }}>WE</span><span style={{ color: '#94a3b8' }}>TH</span><span style={{ color: '#94a3b8' }}>FR</span><span style={{ color: '#94a3b8' }}>SA</span>
                  <span>5</span><span>6</span><span style={{ background: '#f87171', color: '#fff', borderRadius: '50%' }}>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                  <span>12</span><span>13</span><span>14</span><span style={{ background: '#0284c7', color: '#fff', borderRadius: '50%' }}>15</span><span>16</span><span>17</span><span>18</span>
                  <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '10px' }}>Categories</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#475569' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked /> Publicity</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked /> Technology</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked /> Finance</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><input type="checkbox" defaultChecked /> Advertising</label>
                  </div>
                </div>
              </div>

              {/* Middle Timeline Stream */}
              <div className="cal-timeline-col">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '12px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Day View • Oct 15, 2026</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="fl-banner-btn" style={{ padding: '4px 8px' }}>‹</button>
                    <button className="fl-banner-btn" style={{ padding: '4px 8px' }}>›</button>
                  </div>
                </div>

                <div className="cal-slot-card cal-slot-cyan">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800 }}>
                    <span>8:00 am</span><span>45 min</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Public Relations Expert</div>
                  <span style={{ fontSize: '0.75rem' }}>Publicity Division</span>
                </div>

                {/* Floating Big Focus Meeting */}
                <div className="cal-slot-card cal-slot-blue-solid">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, opacity: 0.9 }}>
                    <span>9:45 am</span><span>1h 45 min</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', margin: '4px 0' }}>Growing a passive income</div>
                  <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>Public Webinar & AI Agent Review</span>
                </div>

                <div className="cal-slot-card cal-slot-amber">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800 }}>
                    <span>11:00 am</span><span>1h 15 min</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Ruby/Rails Web Development</div>
                  <span style={{ fontSize: '0.75rem' }}>Technology Architecture</span>
                </div>

                <div className="cal-slot-card cal-slot-pink">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 800 }}>
                    <span>12:30 pm</span><span>30 min</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Marketing Strategy & Content Sync</div>
                  <span style={{ fontSize: '0.75rem' }}>Creative Division</span>
                </div>
              </div>

              {/* Right Detail Card */}
              <div className="fl-card">
                <div style={{ display: 'inline-block', background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', marginBottom: '12px' }}>
                  Scheduled
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800 }}>Growing a passive income</h3>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>Public Event</span>
                
                <div style={{ fontSize: '1.5rem', fontWeight: 800, margin: '14px 0 10px', color: '#0f172a' }}>$ 25.00</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '18px' }}>
                  <div>12:30 pm - 1:00 pm (30m)</div>
                  <div>Wed, Oct 15, 2026</div>
                </div>

                <button className="fl-banner-btn" style={{ width: '100%', padding: '10px', marginBottom: '20px' }} onClick={() => showToast('Jadwal meeting diatur ulang')}>
                  Reschedule
                </button>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>Consultant</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>LV</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Lucy Vaughn</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Finance Guru of Sales</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ==============================================================
            TAB 6: GOALS & FINANCIAL SAVINGS (PERSIS REFERENSI GAMBAR 2)
            ============================================================== */}
        {activeTab === 'goals' && (
          <main className="fl-canvas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Goals & Targets</h1>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Track strategic company targets, milestones, and savings.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }}>This year ▾</button>
                <button className="fl-banner-btn" style={{ background: '#f1f5f9', color: '#334155' }}>Sort by: Name A-Z ▾</button>
                <button className="fl-banner-btn" onClick={() => showToast('Target baru ditambahkan')}>+ Add new goal</button>
              </div>
            </div>

            {/* 4 Cards (MacBook Pro, New Car, New House, Vacation) */}
            <div className="goals-four-grid">
              <div className="goal-card-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>MacBook Pro M4 Max</div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Due: 7 Oct 2026</span>
                </div>
                <div className="goal-amount-big">$412<span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>.50 / $1,650</span></div>
                <div className="goal-progress-pill">
                  <div className="goal-pill-fill" style={{ width: '25%' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>25% Complete</span>
                  <b>$1,237.50 left</b>
                </div>
              </div>

              <div className="goal-card-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Company EV Fleet</div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Due: 25 Sep 2027</span>
                </div>
                <div className="goal-amount-big">$25,000<span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>.00 / $60,000</span></div>
                <div className="goal-progress-pill">
                  <div className="goal-pill-fill" style={{ width: '42%', background: '#0284c7' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>42% Complete</span>
                  <b>$35,000 left</b>
                </div>
              </div>

              <div className="goal-card-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Digital HQ Hub</div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Due: 20 Apr 2028</span>
                </div>
                <div className="goal-amount-big">$5,000<span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>.00 / $150,000</span></div>
                <div className="goal-progress-pill">
                  <div className="goal-pill-fill" style={{ width: '3%', background: '#059669' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>3% Complete</span>
                  <b>$145,000 left</b>
                </div>
              </div>

              <div className="goal-card-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Team Retreat Bali</div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Left 18 days</span>
                </div>
                <div className="goal-amount-big">$2,500<span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>.00 / $3,500</span></div>
                <div className="goal-progress-pill">
                  <div className="goal-pill-fill" style={{ width: '71%', background: '#ea580c' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>71% Complete</span>
                  <b>$1,000 left</b>
                </div>
              </div>
            </div>

            {/* Bottom Row: Total Goals Breakdown + Savings Overview Curve */}
            <div className="goals-bottom-split">
              {/* Total Goals Mini Breakdown */}
              <div className="fl-card">
                <div className="fl-card-head">
                  <span className="fl-card-title">Total Goals</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>This year ▾</span>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>25</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#b45309' }}>Not started</div>
                    <b style={{ fontSize: '1.2rem', color: '#92400e' }}>3</b>
                  </div>
                  <div style={{ background: '#dcfce7', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#15803d' }}>In progress</div>
                    <b style={{ fontSize: '1.2rem', color: '#166534' }}>4</b>
                  </div>
                  <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>Canceled</div>
                    <b style={{ fontSize: '1.2rem', color: '#991b1b' }}>2</b>
                  </div>
                  <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>Finished</div>
                    <b style={{ fontSize: '1.2rem', color: '#0284c7' }}>16</b>
                  </div>
                </div>
              </div>

              {/* Savings Overview Multi-Wave Chart */}
              <div className="fl-card">
                <div className="fl-card-head">
                  <span className="fl-card-title">Savings Overview</span>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#64748b' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7', display: 'inline-block' }}></span> This year
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#cbd5e1', display: 'inline-block' }}></span> Last year
                    </span>
                  </div>
                </div>
                <div style={{ padding: '10px 0' }}>
                  <svg width="100%" height="150" viewBox="0 0 500 150">
                    <path d="M 0 120 Q 80 40 160 100 T 320 60 T 500 40" fill="none" stroke="#0284c7" strokeWidth="3" />
                    <path d="M 0 140 Q 80 80 160 130 T 320 100 T 500 80" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
                    <circle cx="280" cy="80" r="5" fill="#0284c7" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px' }}>
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ==============================================================
            TAB 7: SOCIAL MEDIA ANALYTICS & REPORTS (PERSIS REFERENSI GAMBAR 3)
            ============================================================== */}
        {activeTab === 'reports' && (
          <main className="fl-canvas">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>Social Media Analytics</h1>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Monitor reach, engagement, and audience health across all platforms.</p>
              </div>
              <button className="fl-banner-btn" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={() => showToast('File CSV laporan berhasil diekspor')}>
                Export CSV
              </button>
            </div>

            {/* 4 Analytics Top Metrics (Followers, Engagement, Reach, Impressions) */}
            <div className="rep-four-metrics">
              <div className="rep-stat-card">
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>Total Followers</span>
                <div className="rep-stat-num">241,870</div>
                <div className="rep-stat-sub">
                  <span>↑ +11% vs last month</span>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '18px' }}>
                    <div style={{ width: 4, height: 8, background: '#0284c7' }}></div>
                    <div style={{ width: 4, height: 14, background: '#0284c7' }}></div>
                    <div style={{ width: 4, height: 18, background: '#0284c7' }}></div>
                  </div>
                </div>
              </div>

              <div className="rep-stat-card">
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>Total Engagement</span>
                <div className="rep-stat-num">63,410</div>
                <div className="rep-stat-sub">
                  <span>↑ +7% vs last month</span>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '18px' }}>
                    <div style={{ width: 4, height: 10, background: '#0284c7' }}></div>
                    <div style={{ width: 4, height: 16, background: '#0284c7' }}></div>
                    <div style={{ width: 4, height: 12, background: '#0284c7' }}></div>
                  </div>
                </div>
              </div>

              <div className="rep-stat-card">
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>Total Reach</span>
                <div className="rep-stat-num">2.4M</div>
                <div className="rep-stat-sub">
                  <span>↑ +14% vs last month</span>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '18px' }}>
                    <div style={{ width: 4, height: 6, background: '#059669' }}></div>
                    <div style={{ width: 4, height: 12, background: '#059669' }}></div>
                    <div style={{ width: 4, height: 18, background: '#059669' }}></div>
                  </div>
                </div>
              </div>

              <div className="rep-stat-card">
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>Total Impressions</span>
                <div className="rep-stat-num">5.1M</div>
                <div className="rep-stat-sub">
                  <span>↑ +9% vs last month</span>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '18px' }}>
                    <div style={{ width: 4, height: 8, background: '#ea580c' }}></div>
                    <div style={{ width: 4, height: 15, background: '#ea580c' }}></div>
                    <div style={{ width: 4, height: 18, background: '#ea580c' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Row (Follower Growth Chart + Age Demographics + Audience Sentiment) */}
            <div className="rep-middle-split">
              {/* Follower Growth Chart */}
              <div className="fl-card">
                <div className="fl-card-head">
                  <span className="fl-card-title">Follower Growth</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>6 Months ▾</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '130px', padding: '10px 0' }}>
                  <div style={{ width: 28, height: 50, background: '#f1f5f9', borderRadius: 8 }}></div>
                  <div style={{ width: 28, height: 75, background: '#f1f5f9', borderRadius: 8 }}></div>
                  <div style={{ width: 28, height: 110, background: '#0284c7', borderRadius: 8, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: -14, left: 10, width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }}></div>
                  </div>
                  <div style={{ width: 28, height: 65, background: '#f1f5f9', borderRadius: 8 }}></div>
                  <div style={{ width: 28, height: 85, background: '#f1f5f9', borderRadius: 8 }}></div>
                  <div style={{ width: 28, height: 95, background: '#f1f5f9', borderRadius: 8 }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>
                  <span>Jan</span><span>Feb</span><span style={{ color: '#0284c7', fontWeight: 800 }}>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>

              {/* Age Demographics */}
              <div className="fl-card">
                <div className="fl-card-head">
                  <span className="fl-card-title">Age Demographics</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>This Week ▾</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '130px', padding: '10px 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>22%</div>
                    <div style={{ width: 34, height: 60, background: '#38bdf8', borderRadius: 10 }}></div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>18-24</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', marginBottom: 4 }}>50%</div>
                    <div style={{ width: 34, height: 105, background: '#0284c7', borderRadius: 10 }}></div>
                    <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 800, marginTop: 4 }}>25-34</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>24%</div>
                    <div style={{ width: 34, height: 70, background: '#ea580c', borderRadius: 10 }}></div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>35-44</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>13%</div>
                    <div style={{ width: 34, height: 35, background: '#ec4899', borderRadius: 10 }}></div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>45+</div>
                  </div>
                </div>
              </div>

              {/* Audience Sentiment Gauge */}
              <div className="fl-card">
                <div className="fl-card-head">
                  <span className="fl-card-title">Audience Sentiment</span>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <svg width="160" height="90" viewBox="0 0 200 110">
                    <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="22" strokeLinecap="round" />
                    <path d="M 20 100 A 80 80 0 0 1 145 35" fill="none" stroke="#0284c7" strokeWidth="22" strokeLinecap="round" />
                  </svg>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>68%</div>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>Positive Sentiment</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.72rem', color: '#64748b', marginTop: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0284c7' }}></span> 68% Pos</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }}></span> 21% Neu</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}></span> 11% Neg</span>
                </div>
              </div>
            </div>

            {/* Platform Breakdown Table */}
            <div className="fl-card">
              <div className="fl-card-head">
                <span className="fl-card-title">Platform Breakdown</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>This Month ▾</span>
              </div>
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Followers</th>
                    <th>Engagement</th>
                    <th>Reach</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 800, color: '#ec4899' }}>Instagram</td>
                    <td>94k</td>
                    <td>27.3k</td>
                    <td>680k</td>
                    <td><span className="doc-tag-valid">+13%</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800, color: '#0f172a' }}>TikTok</td>
                    <td>71k</td>
                    <td>19.8k</td>
                    <td>910k</td>
                    <td><span className="doc-tag-valid">+18%</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800, color: '#0284c7' }}>LinkedIn</td>
                    <td>48k</td>
                    <td>9.1k</td>
                    <td>910k</td>
                    <td><span className="doc-tag-valid">+5%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
        )}

        {/* ==============================================================
            TAB 8: KINERJA AGENT AI STUDIO (RAKA, SILVI, RETA, ARGA)
            ============================================================== */}
        {activeTab === 'agent-performance' && (
          <AgentPerformanceWorkspace 
            showToast={showToast}
            onAddSubmission={(newSub) => setSubmissions(prev => [newSub, ...prev])}
            onAddArchive={(newDoc) => setArchives(prev => [newDoc, ...prev])}
          />
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
