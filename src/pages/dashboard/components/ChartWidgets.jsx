import React from 'react';

// Bar Chart Sederhana & Ringan murni CSS/SVG (Anti-crash, zero dependency)
export function SimpleBarChart({ title, subtitle, data = [] }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div 
      className="ws-chart-card ws-btn-transition"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <h4 className="ws-chart-title" style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h4>
        {subtitle && <p className="ws-chart-subtitle" style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p>}
      </div>
      <div className="ws-barchart-track-container" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', paddingTop: '12px', width: '100%', boxSizing: 'border-box' }}>
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.value / maxValue) * 100);
          return (
            <div key={idx} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end', overflow: 'hidden' }}>
              <span className="ws-barchart-val" style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', lineHeight: 1 }}>{item.displayVal || item.value}</span>
              <div 
                style={{
                  width: '100%',
                  maxWidth: '34px',
                  height: `${Math.max(heightPercent, 8)}%`,
                  backgroundColor: item.color || '#0284c7',
                  borderRadius: '5px 5px 2px 2px',
                  transition: 'height 0.4s ease'
                }}
              />
              <span className="ws-barchart-label" style={{ fontSize: '0.68rem', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100%', textAlign: 'center', display: 'block' }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Donut Chart Interaktif Berbasis SVG (Tanpa library luar, 100% responsif)
export function DonutChart({ title, subtitle, data = [], centerLabel, centerValue }) {
  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0) || 1;
  const radius = 42;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div 
      className="ws-chart-card ws-btn-transition"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
        height: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <h4 className="ws-chart-title" style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h4>
        {subtitle && <p className="ws-chart-subtitle" style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</p>}
      </div>

      <div className="ws-donut-content-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'nowrap', minHeight: '120px', width: '100%', boxSizing: 'border-box' }}>
        {/* SVG Donut */}
        <div className="ws-donut-svg-box" style={{ position: 'relative', width: '105px', height: '105px', flexShrink: 0 }}>
          <svg width="105" height="105" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />
            {data.map((item, idx) => {
              const slicePercent = item.value / total;
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += slicePercent;

              return (
                <circle
                  key={idx}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={item.color || '#0284c7'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              );
            })}
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <span className="ws-donut-center-val" style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {centerValue || total}
            </span>
            <span className="ws-donut-center-lbl" style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600 }}>
              {centerLabel || 'Total'}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="ws-donut-legend-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
          {data.map((item, idx) => {
            const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: item.color || '#0284c7', flexShrink: 0 }} />
                  <span className="ws-donut-legend-text" style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.displayVal || item.value}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>({percent}%)</span>
                </div>
              </div>
            );
          })}
        </div>
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
