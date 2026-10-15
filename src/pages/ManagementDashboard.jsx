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
  X
} from 'lucide-react';
import { INITIAL_ARCHIVES, INITIAL_SUBMISSIONS } from '../data/managementData';
import { AGENTS } from '../data/agents';
import '../styles/donezoExact.css';

export default function ManagementDashboard({ onLogout }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [timerSeconds, setTimerSeconds] = useState(5048); // 01:24:08
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Modal Doc Viewer
  const [activeDocModal, setActiveDocModal] = useState(null);

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

  return (
    <div className="donezo-viewport-wrapper">
      <div className="donezo-app-container">
        
        {/* ==============================================================
            1. LEFT SIDEBAR (100% PERSIS GAMBAR 2)
            ============================================================== */}
        <aside className="dz-sidebar">
          {/* Logo Donezo */}
          <div className="dz-brand-row">
            <div className="dz-brand-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              </svg>
            </div>
            <span className="dz-brand-title">Donezo</span>
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
              <span className="dz-pill-badge">12+</span>
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
            <button className="dz-nav-item" onClick={() => alert('Settings window')}>
              <Settings size={17} />
              Settings
            </button>
            <button className="dz-nav-item" onClick={() => alert('Support Center')}>
              <HelpCircle size={17} />
              Help
            </button>
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
            <button className="dz-btn-download">Download</button>
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
              <input type="text" placeholder="Search task" />
              <span className="dz-search-kbd">⌘ F</span>
            </div>

            {/* Header Right Actions */}
            <div className="dz-header-right">
              <div className="dz-circle-btn">
                <Mail size={16} />
              </div>
              <div className="dz-circle-btn">
                <Bell size={16} />
              </div>
              <div className="dz-user-profile">
                <div className="dz-user-avatar">TM</div>
                <div className="dz-user-meta">
                  <span className="dz-user-name">Totok Michael</span>
                  <span className="dz-user-email">tmichael20@mail.com</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Body Canvas */}
          <div className="dz-content">
            {/* Title Section */}
            <div className="dz-title-section">
              <div className="dz-title-text">
                <h1>Dashboard</h1>
                <p>Plan, prioritize, and accomplish your tasks with ease.</p>
              </div>
              <div className="dz-actions-group">
                <button className="dz-btn-primary" onClick={() => setActiveMenu('tasks')}>
                  <Plus size={16} />
                  Add Project
                </button>
                <button className="dz-btn-outline" onClick={() => alert('Data imported successfully')}>
                  Import Data
                </button>
              </div>
            </div>

            {/* 4 Metrics Row (Persis Gambar 2) */}
            <div className="dz-metrics-row">
              {/* Card 1: Featured Blue */}
              <div className="dz-stat-card featured">
                <div className="dz-stat-header">
                  <span className="dz-stat-label">Total Projects</span>
                  <div className="dz-stat-icon-btn">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
                <div className="dz-stat-value">24</div>
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
                <div className="dz-stat-value">10</div>
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
                <div className="dz-stat-value">12</div>
                <div className="dz-stat-footer">
                  <span className="dz-badge-box">2▲</span>
                  <span>Increased from last month</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="dz-stat-card">
                <div className="dz-stat-header">
                  <span className="dz-stat-label">Pending Project</span>
                  <div className="dz-stat-icon-btn">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
                <div className="dz-stat-value">2</div>
                <div className="dz-stat-footer">
                  <span>On Discuss</span>
                </div>
              </div>
            </div>

            {/* Middle Grid (Project Analytics, Reminders, Project List) */}
            <div className="dz-middle-grid">
              {/* Widget 1: Project Analytics Bar Chart */}
              <div className="dz-card">
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
                <button className="dz-btn-start" onClick={() => alert('Starting Virtual Conference...')}>
                  <Video size={16} />
                  Start Meeting
                </button>
              </div>

              {/* Widget 3: Project List */}
              <div className="dz-card">
                <div className="dz-card-head">
                  <h3>Project</h3>
                  <button className="dz-btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '14px' }}>
                    + New
                  </button>
                </div>
                <div>
                  <div className="dz-project-item">
                    <div className="dz-project-left">
                      <div className="dz-project-bullet" style={{ background: '#3b82f6' }}></div>
                      <div>
                        <div className="dz-project-name">Develop API Endpoints</div>
                        <div className="dz-project-date">Due date: Nov 26, 2026</div>
                      </div>
                    </div>
                  </div>
                  <div className="dz-project-item">
                    <div className="dz-project-left">
                      <div className="dz-project-bullet" style={{ background: '#10b981' }}></div>
                      <div>
                        <div className="dz-project-name">Onboarding Flow</div>
                        <div className="dz-project-date">Due date: Nov 28, 2026</div>
                      </div>
                    </div>
                  </div>
                  <div className="dz-project-item">
                    <div className="dz-project-left">
                      <div className="dz-project-bullet" style={{ background: '#f59e0b' }}></div>
                      <div>
                        <div className="dz-project-name">Build Dashboard</div>
                        <div className="dz-project-date">Due date: Nov 30, 2026</div>
                      </div>
                    </div>
                  </div>
                  <div className="dz-project-item" style={{ borderBottom: 'none' }}>
                    <div className="dz-project-left">
                      <div className="dz-project-bullet" style={{ background: '#8b5cf6' }}></div>
                      <div>
                        <div className="dz-project-name">Optimize Page Load</div>
                        <div className="dz-project-date">Due date: Dec 5, 2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid (Team Collaboration, Project Progress Gauge, Time Tracker) */}
            <div className="dz-bottom-grid">
              {/* Widget 4: Team Collaboration */}
              <div className="dz-card">
                <div className="dz-card-head">
                  <h3>Team Collaboration</h3>
                  <button className="dz-btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '14px' }}>
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
                  {/* Semi circle SVG */}
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
                  >
                    {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button 
                    className="dz-timer-btn" 
                    onClick={() => { setIsTimerRunning(false); setTimerSeconds(0); }}
                  >
                    <Square size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
