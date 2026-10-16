import React from 'react';
import { 
  Building2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Users, 
  CheckCircle2, 
  Clock, 
  Activity,
  Layers
} from 'lucide-react';
import { useOfficeStore } from '../../store/officeStore';

export function CommandHeader() {
  const rooms = useOfficeStore((state) => state.rooms);
  const agents = useOfficeStore((state) => state.agents);
  const selectedRoomId = useOfficeStore((state) => state.selectedRoomId);
  const selectRoom = useOfficeStore((state) => state.selectRoom);
  const labelsVisible = useOfficeStore((state) => state.labelsVisible);
  const toggleLabels = useOfficeStore((state) => state.toggleLabels);
  const resetCamera = useOfficeStore((state) => state.resetCamera);

  const activeAgentsCount = agents.filter((a) => a.status === 'Working').length;
  const totalTasks = agents.reduce((acc, a) => acc + (a.stats?.tasksDone || 0), 0);

  return (
    <header className="command-header">
      {/* Brand & Identity DigiBooster */}
      <div className="brand-badge">
        <div className="brand-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="brand-titles">
          <div className="brand-title">DIGIBOOSTER</div>
          <div className="brand-subtitle">3D VIRTUAL COMMAND CENTER</div>
        </div>
      </div>

      {/* Metrics / Statistik Pekerjaan & Proyek */}
      <div className="stats-strip">
        <div className="stat-pill">
          <Users size={14} className="text-cyan" />
          <span>Agents:</span>
          <strong>{activeAgentsCount}/{agents.length} Online</strong>
        </div>

        <div className="stat-pill">
          <CheckCircle2 size={14} className="text-emerald" />
          <span>Tasks Done:</span>
          <strong>{totalTasks}</strong>
        </div>

        <div className="stat-pill">
          <Activity size={14} className="text-amber" />
          <span>Efficiency:</span>
          <strong>98.7%</strong>
        </div>
      </div>

      {/* Navigation Tools & Actions */}
      <div className="header-actions">
        {/* Dropdown Navigasi Ruangan */}
        <div className="select-wrapper">
          <Layers size={14} className="select-icon text-cyan" />
          <select
            className="room-dropdown"
            value={selectedRoomId || ''}
            onChange={(e) => selectRoom(e.target.value || null)}
          >
            <option value="">Seluruh Kantor (Overview)</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Label */}
        <button
          className={`action-btn ${labelsVisible ? 'active' : ''}`}
          onClick={toggleLabels}
          title="Tampilkan / Sembunyikan Label Ruangan"
        >
          {labelsVisible ? <Eye size={15} /> : <EyeOff size={15} />}
          <span>{labelsVisible ? 'Label Aktif' : 'Label Nonaktif'}</span>
        </button>

        {/* Reset Camera */}
        <button className="action-btn" onClick={resetCamera} title="Reset Sudut & Posisi Kamera">
          <RotateCcw size={15} />
          <span>Reset Kamera</span>
        </button>
      </div>
    </header>
  );
}
