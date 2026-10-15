import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, trend = 'up', subtitle, icon: Icon }) {
  const isUp = trend === 'up';

  // Desain selaras murni nuansa biru profesional enterprise (Digital Blue)
  const iconStyle = {
    bg: '#f0f9ff',
    text: '#0284c7',
    border: '#bae6fd'
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: iconStyle.bg,
            border: `1px solid ${iconStyle.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconStyle.text
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {value}
        </div>

        {(change || subtitle) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '0.8rem' }}>
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
    </div>
  );
}
