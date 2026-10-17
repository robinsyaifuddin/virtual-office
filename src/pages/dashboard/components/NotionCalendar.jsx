import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_NAMES_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

// Warna event berdasarkan prioritas / kategori
const EVENT_COLORS = [
  { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
  { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
  { bg: '#fef9c3', text: '#92400e', border: '#fde68a' },
];

function getEventColor(ev, idx) {
  if (ev.priority === 'P1' || ev.priority === 'Urgent') return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
  if (ev.status === 'Selesai') return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
  if (ev.status === 'Menunggu Review') return { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' };
  return EVENT_COLORS[idx % EVENT_COLORS.length];
}

export default function NotionCalendar({
  events = [],
  dateKey = 'dueDate',
  titleKey = 'title',
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  // Hari pertama bulan ini (0=Min, 1=Sen, ..., 6=Sab)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Hari terakhir bulan lalu (untuk mengisi sel kosong di awal)
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Navigasi
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(null);
  };

  // Cari event per tanggal
  const getEventsForDay = (day) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    return events.filter((ev) => {
      const evDate = ev[dateKey];
      return evDate && evDate.startsWith(dateStr);
    });
  };

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (day) => selectedDay === day;

  // Header hari (Min–Sab), mulai Minggu
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Total sel grid = 6 baris × 7 kolom = 42 sel
  const totalCells = 42;
  const cells = [];

  // Isi sel hari-hari bulan sebelumnya (greyed out)
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({ day: daysInPrevMonth - firstDayOfMonth + 1 + i, type: 'prev' });
  }
  // Isi sel hari bulan ini
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }
  // Isi sel hari-hari bulan berikutnya (greyed out)
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay++, type: 'next' });
  }

  // Panel detail hari yang dipilih
  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 8px rgba(15,23,42,0.06)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* ── Header Kalender ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid #f1f5f9',
        flexShrink: 0,
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarIcon size={18} color="#0284c7" />
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            {MONTH_NAMES_ID[month]} {year}
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={goToday}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            Hari Ini
          </button>
          <button
            onClick={prevMonth}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={nextMonth}
            style={{
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Bulan berikutnya"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Body Kalender ── */}
      <div style={{ padding: '0', overflowX: 'auto', flexShrink: 0 }}>
        <div style={{ minWidth: '560px' }}>
          {/* Label Hari */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid #f1f5f9',
          }}>
            {daysOfWeek.map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: i === 0 ? '#ef4444' : i === 6 ? '#3b82f6' : '#64748b',
                  padding: '8px 4px 6px',
                  letterSpacing: '0.02em',
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid Tanggal */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}>
            {cells.map((cell, idx) => {
              const dayEvents = cell.type === 'current' ? getEventsForDay(cell.day) : [];
              const today_ = cell.type === 'current' && isToday(cell.day);
              const selected_ = cell.type === 'current' && isSelected(cell.day);
              const colIdx = idx % 7;
              const isSun = colIdx === 0;
              const isSat = colIdx === 6;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.type === 'current') {
                      setSelectedDay(selected_ ? null : cell.day);
                    }
                  }}
                  style={{
                    minHeight: '90px',
                    borderRight: colIdx < 6 ? '1px solid #f1f5f9' : 'none',
                    borderBottom: '1px solid #f1f5f9',
                    padding: '6px 6px 4px',
                    backgroundColor:
                      selected_ ? '#eff6ff'
                      : today_ ? '#f0f9ff'
                      : cell.type !== 'current' ? '#f8fafc'
                      : '#ffffff',
                    cursor: cell.type === 'current' ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    transition: 'background-color 0.12s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (cell.type === 'current' && !today_ && !selected_) {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={e => {
                    if (cell.type === 'current' && !today_ && !selected_) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }
                  }}
                >
                  {/* Nomor Hari */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    fontSize: '0.76rem',
                    fontWeight: today_ ? 800 : 500,
                    color:
                      today_ ? '#ffffff'
                      : cell.type !== 'current' ? '#cbd5e1'
                      : isSun ? '#ef4444'
                      : isSat ? '#3b82f6'
                      : '#334155',
                    backgroundColor: today_ ? '#0284c7' : 'transparent',
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                  }}>
                    {cell.day}
                  </span>

                  {/* Daftar Event */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                    {dayEvents.slice(0, 3).map((ev, i) => {
                      const clr = getEventColor(ev, i);
                      return (
                        <div
                          key={i}
                          title={ev[titleKey]}
                          style={{
                            fontSize: '0.67rem',
                            fontWeight: 600,
                            backgroundColor: clr.bg,
                            color: clr.text,
                            border: `1px solid ${clr.border}`,
                            padding: '1px 5px',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '1.6',
                          }}
                        >
                          {ev[titleKey]}
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div style={{
                        fontSize: '0.63rem',
                        color: '#64748b',
                        fontWeight: 600,
                        paddingLeft: '2px',
                      }}>
                        +{dayEvents.length - 3} lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Panel Detail Hari Dipilih ── */}
      {selectedDay && (
        <div style={{
          borderTop: '1px solid #e2e8f0',
          padding: '14px 20px',
          backgroundColor: '#f8fafc',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              {String(selectedDay).padStart(2, '0')} {MONTH_NAMES_SHORT_ID[month]} {year}
            </span>
            <button
              onClick={() => setSelectedDay(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#94a3b8',
                lineHeight: 1,
                padding: '2px 6px',
              }}
              aria-label="Tutup detail"
            >
              ✕
            </button>
          </div>

          {selectedEvents.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Tidak ada tugas pada hari ini.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedEvents.map((ev, i) => {
                const clr = getEventColor(ev, i);
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    backgroundColor: '#ffffff',
                    border: `1px solid ${clr.border}`,
                    borderLeft: `3px solid ${clr.text}`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {ev[titleKey]}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                        {ev.status && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: clr.text,
                            backgroundColor: clr.bg,
                            padding: '1px 7px',
                            borderRadius: '999px',
                          }}>
                            {ev.status}
                          </span>
                        )}
                        {ev.priority && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: ev.priority === 'P1' || ev.priority === 'Urgent' ? '#dc2626' : '#0284c7',
                          }}>
                            {ev.priority}
                          </span>
                        )}
                        {ev.assignee && (
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            👤 {ev.assignee}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
