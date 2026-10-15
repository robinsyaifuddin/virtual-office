import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';

export default function NotionKanban({
  columns = [], // Array of { id, title, color }
  items = [],
  statusKey = 'status',
  renderCard,
  onAddItem
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns.length}, minmax(280px, 1fr))`,
      gap: '16px',
      overflowX: 'auto',
      paddingBottom: '16px'
    }}>
      {columns.map((col) => {
        const columnItems = items.filter((item) => item[statusKey] === col.id || item[statusKey] === col.title);
        
        return (
          <div
            key={col.id}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '400px'
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: col.color || '#0284c7'
                  }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                  {col.title}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#64748b',
                  backgroundColor: '#e2e8f0',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  {columnItems.length}
                </span>
              </div>

              {onAddItem && (
                <button
                  onClick={() => onAddItem(col.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '4px',
                    borderRadius: '4px'
                  }}
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            {/* Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {columnItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  {renderCard ? renderCard(item) : (
                    <div>
                      <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                        {item.title || item.name}
                      </h5>
                      {item.assignee && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          PIC: {item.assignee}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
