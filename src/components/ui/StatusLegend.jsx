import React from 'react';
import { STATUS_COLORS } from '../../data/agents';

export function StatusLegend() {
  const statuses = [
    { label: 'Working', desc: 'Sedang memproses tugas', color: STATUS_COLORS.Working },
    { label: 'Idle', desc: 'Siap menerima instruksi', color: STATUS_COLORS.Idle },
    { label: 'Awaiting Approval', desc: 'Menunggu review / approval', color: STATUS_COLORS['Awaiting Approval'] },
    { label: 'Offline', desc: 'Sistem stand by', color: STATUS_COLORS.Offline }
  ];

  return (
    <footer className="status-legend glassmorphism">
      <div className="legend-hints">
        <span className="live-pulse" />
        <span className="hint-strong">24/7 DigiBooster Autonomous Floor</span>
        <span className="hint-sep">•</span>
        <span className="hint-muted">Klik Ruangan / Agent untuk inspeksi • Drag mouse untuk orbit • Scroll untuk zoom</span>
      </div>

      <div className="legend-items">
        {statuses.map((item) => (
          <div key={item.label} className="legend-item" title={item.desc}>
            <span className="legend-dot" style={{ backgroundColor: item.color }} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}
