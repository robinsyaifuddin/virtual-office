import React from 'react';

// Bar Chart Sederhana & Ringan murni CSS/SVG (Anti-crash, zero dependency)
export function SimpleBarChart({ title, data = [] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{title}</h4>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '140px', paddingTop: '20px' }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.value / maxValue) * 100);
          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>{item.displayVal || item.value}</span>
              <div 
                style={{
                  width: '100%',
                  maxWidth: '42px',
                  height: `${Math.max(heightPercent, 8)}%`,
                  backgroundColor: item.color || '#0284c7',
                  borderRadius: '6px 6px 2px 2px',
                  transition: 'height 0.4s ease'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Progress / Gauge Widget
export function ProgressBarWidget({ title, percentage, statusLabel, targetText }) {
  const getFillColor = (p) => {
    return '#0284c7';
  };

  return (
    <div 
      className="ws-widget-mobile-compact ws-btn-transition"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{title}</span>
        {statusLabel && (
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: '#eff6ff',
            color: '#1d4ed8'
          }}>
            {statusLabel}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{percentage}%</span>
        {targetText && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{targetText}</span>}
      </div>

      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#f1f5f9',
        borderRadius: '999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min(percentage, 100)}%`,
          height: '100%',
          backgroundColor: getFillColor(percentage),
          borderRadius: '999px',
          transition: 'width 0.5s ease-out'
        }} />
      </div>
    </div>
  );
}
