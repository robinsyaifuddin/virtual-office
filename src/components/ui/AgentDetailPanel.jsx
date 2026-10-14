import React from 'react';
import { 
  X, 
  Cpu, 
  Sparkles, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';
import { STATUS_COLORS } from '../../data/agents';

export function AgentDetailPanel() {
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const isDetailOpen = useOfficeStore((state) => state.isDetailOpen);
  const closeDetail = useOfficeStore((state) => state.closeDetail);
  const agents = useOfficeStore((state) => state.agents);
  const rooms = useOfficeStore((state) => state.rooms);
  const updateAgentStatus = useOfficeStore((state) => state.updateAgentStatus);

  if (!isDetailOpen || !selectedAgentId) return null;

  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  const room = rooms.find((r) => r.id === agent.roomId);
  const statusColor = STATUS_COLORS[agent.status] || '#10b981';

  return (
    <aside className="agent-detail-panel glassmorphism animate-slide-left">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="agent-avatar-badge">{agent.avatar}</span>
          <div>
            <h2 className="agent-name">{agent.name}</h2>
            <div className="agent-role">{agent.role}</div>
          </div>
        </div>
        <button className="panel-close-btn" onClick={closeDetail} title="Tutup Panel">
          <X size={18} />
        </button>
      </div>

      {/* Portrait / Voxel Character Showcase */}
      <div className="portrait-container">
        <img
          src={agent.portrait || '/assets/agents/kevin.jpg'}
          alt={agent.name}
          className="portrait-image"
          onError={(e) => {
            // Fallback jika foto belum ada
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="portrait-badge">
          <span>{agent.gender.toUpperCase()}</span>
          <span>•</span>
          <span>{room ? room.shortName.toUpperCase() : 'OFFICE'}</span>
        </div>
      </div>

      {/* Status Bar & Interactive Status Selector */}
      <div className="status-selector-box">
        <div className="status-label-row">
          <span className="label-text">STATUS SAAT INI:</span>
          <span className="status-indicator-pill" style={{ backgroundColor: `${statusColor}22`, color: statusColor, borderColor: statusColor }}>
            <span className="status-dot" style={{ backgroundColor: statusColor }} />
            {agent.status}
          </span>
        </div>
        <div className="status-buttons-row">
          {['Working', 'Idle', 'Awaiting Approval', 'Offline'].map((st) => (
            <button
              key={st}
              className={`status-chip ${agent.status === st ? 'active' : ''}`}
              onClick={() => updateAgentStatus(agent.id, st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment / Holding item */}
      <div className="panel-section holding-card">
        <div className="section-title">
          <Zap size={14} className="text-cyan" />
          <span>PERALATAN / INSTRUMEN AKTIF</span>
        </div>
        <div className="holding-value">{agent.holding}</div>
      </div>

      {/* Active Task */}
      <div className="panel-section task-card">
        <div className="section-title">
          <Sparkles size={14} className="text-cyan" />
          <span>TUGAS & OPERASIONAL SAAT INI</span>
        </div>
        <p className="task-description">{agent.task}</p>
        <div className="simulation-note">
          Simulasi visual mandiri (Data-driven mode). Integrasi backend API dapat disambungkan secara seamless.
        </div>
      </div>

      {/* Agent Metrics & Performance Stats */}
      <div className="panel-section">
        <div className="section-title">
          <Cpu size={14} className="text-cyan" />
          <span>STATISTIK PERFORMA</span>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Tasks Done</span>
            <span className="stat-number text-cyan">{agent.stats?.tasksDone || 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Efficiency</span>
            <span className="stat-number text-emerald">{agent.stats?.efficiency || '99%'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Uptime</span>
            <span className="stat-number text-amber">{agent.stats?.uptime || '100h'}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Latency</span>
            <span className="stat-number text-purple">{agent.stats?.latency || '20ms'}</span>
          </div>
        </div>
      </div>

      {/* Room Information */}
      {room && (
        <div className="panel-section room-info-card">
          <div className="section-title">
            <ShieldCheck size={14} className="text-cyan" />
            <span>RUANGAN: {room.name}</span>
          </div>
          <p className="room-desc">{room.description}</p>
          <div className="room-features">
            {room.features.map((feat, i) => (
              <span key={i} className="feature-tag">
                {feat}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
