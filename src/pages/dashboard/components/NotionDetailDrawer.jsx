import React from 'react';
import { X, CheckCircle2, Calendar, User, Tag, FileText } from 'lucide-react';

export default function NotionDetailDrawer({
  isOpen,
  onClose,
  title = 'Detail Properti',
  data = {},
  fields = [],
  onSave
}) {
  if (!isOpen || !data) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '480px',
      backgroundColor: '#ffffff',
      boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #e2e8f0',
      animation: 'slideInRight 0.25s ease-out'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
            Notion Slide-Over
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
            {data.name || data.title || title}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            color: '#64748b'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Body Properties */}
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {fields.map((field) => (
          <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
              {field.label}
            </label>
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#1e293b'
            }}>
              {Array.isArray(data[field.key]) 
                ? data[field.key].join(', ') 
                : String(data[field.key] || '-')}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        backgroundColor: '#ffffff'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#475569',
            cursor: 'pointer'
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
