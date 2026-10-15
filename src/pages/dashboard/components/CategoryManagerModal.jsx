import React, { useState } from 'react';
import { X, Plus, Trash2, GripVertical, Check } from 'lucide-react';
import { useWorkspaceStore } from '../../../store/workspaceStore';

export default function CategoryManagerModal({ isOpen, onClose }) {
  const { taskCategories, addCategoryOption, deleteCategoryOption } = useWorkspaceStore();
  const [newCatInput, setNewCatInput] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    addCategoryOption(newCatInput.trim());
    setNewCatInput('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div 
        className="ws-drawer-animate"
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.16)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
              Opsi Kategori
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Kelola daftar pilihan kategori tugas
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Input Ketik Opsi Baru (Persis Gambar 3 Notion) */}
        <form onSubmit={handleAdd} style={{ padding: '14px 18px 8px 18px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
            Opsi
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Ketik opsi baru..."
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid #0284c7',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: '#f8fafc'
              }}
              autoFocus
            />
            <button
              type="submit"
              className="ws-btn-transition"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        </form>

        {/* Daftar Opsi Kategori (Persis Gambar 2 Notion) */}
        <div className="ws-custom-scroll" style={{
          padding: '8px 14px 14px 14px',
          maxHeight: '320px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {taskCategories.map((cat) => (
            <div
              key={cat}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid transparent',
                transition: 'background-color 120ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GripVertical size={14} color="#94a3b8" style={{ cursor: 'grab' }} />
                <span className="ws-notion-pill" style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  border: '1px solid #bfdbfe'
                }}>
                  {cat}
                </span>
              </div>

              <button
                onClick={() => deleteCategoryOption(cat)}
                title="Hapus opsi"
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 18px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end',
          backgroundColor: '#fafbfc'
        }}>
          <button
            onClick={onClose}
            className="ws-btn-transition"
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
