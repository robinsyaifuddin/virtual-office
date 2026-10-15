import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, trend = 'up', subtitle }) {
  return (
    <div 
      className="ws-metric-card ws-btn-transition"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px 16px',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <span 
        className="ws-metric-title"
        style={{ 
          fontSize: '0.84rem', 
          fontWeight: 600, 
          color: '#64748b',
          textAlign: 'center'
        }}
      >
        {title}
      </span>

      <div 
        className="ws-metric-val"
        style={{ 
          fontSize: '1.65rem', 
          fontWeight: 800, 
          color: '#0f172a', 
          letterSpacing: '-0.02em', 
          lineHeight: 1.15,
          textAlign: 'center'
        }}
      >
        {value}
      </div>

      {(change || subtitle) && (
        <div 
          className="ws-metric-sub"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            fontSize: '0.78rem',
            flexWrap: 'wrap',
            textAlign: 'center'
          }}
        >
          {change && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontWeight: 700,
              color: '#0284c7',
              backgroundColor: '#eff6ff',
              padding: '2px 6px',
              borderRadius: '6px'
            }}>
              <TrendingUp size={12} />
              {change}
            </span>
          )}
          {subtitle && (
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
