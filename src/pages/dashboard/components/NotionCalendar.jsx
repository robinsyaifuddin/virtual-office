import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function NotionCalendar({
  events = [],
  dateKey = 'dueDate',
  titleKey = 'title',
  categoryKey = 'project'
}) {
  const [currentMonth, setCurrentMonth] = useState('Oktober 2026');

  // Days of Week
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // 31 days representation for Oct 2026 (Starts on Thursday)
  // Day 1 to 31
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOffset = 4; // Thursday offset

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)'
    }}>
      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={18} color="#0284c7" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{currentMonth}</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {daysOfWeek.map((day, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', paddingBottom: '6px' }}>
            {day}
          </div>
        ))}

        {/* Empty offset days */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} style={{ minHeight: '80px', backgroundColor: '#f8fafc', borderRadius: '8px', opacity: 0.5 }} />
        ))}

        {/* Month days */}
        {daysInMonth.map((day) => {
          const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter((ev) => {
            const evDate = ev[dateKey];
            return evDate && evDate.startsWith(dateStr);
          });

          const isToday = day === 16;

          return (
            <div
              key={day}
              style={{
                minHeight: '80px',
                border: isToday ? '2px solid #0284c7' : '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px',
                backgroundColor: isToday ? '#f0f9ff' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: isToday ? 800 : 600, color: isToday ? '#0284c7' : '#334155' }}>
                {day}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
                {dayEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    title={ev[titleKey]}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {ev[titleKey]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
