import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';
import { useWorkspaceStore } from '../../../store/workspaceStore';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';

export default function UniversalDetailModal({
  isOpen,
  onClose,
  data = {},
  columns = [],
  title = 'Detail Data',
  onUpdateField,
  onSaveNew
}) {
  if (!isOpen || !data) return null;

  const { taskCategories, addTaskComment, staffAgents } = useWorkspaceStore();
  const [commentInput, setCommentInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1400);
  };

  const handleFieldChange = (fieldKey, value) => {
    if (onUpdateField) {
      onUpdateField(data.id, fieldKey, value);
      triggerToast();
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    if (addTaskComment && data.id) {
      addTaskComment(data.id, commentInput.trim(), 'Executive Owner');
      setCommentInput('');
      triggerToast();
    }
  };

  // Label nama / judul utama
  const mainTitle = data.title || data.name || data.uraian || 'Tanpa Judul';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px 16px',
      overflowY: 'auto'
    }}>
      <div 
        className="ws-drawer-animate"
        style={{
          width: '100%',
          maxWidth: isFullWidth ? '96vw' : '880px',
          minHeight: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'max-width 200ms ease',
          margin: 'auto 0'
        }}
      >
        {/* Top Header & Breadcrumbs (Sesuai Gambar Notion User) */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fafbfc',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ fontWeight: 600 }}>Workspace</span>
            <span>/</span>
            <span>Daftar Operasional</span>
            <span>/</span>
            <span style={{ fontWeight: 600, color: '#0f172a', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mainTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {saveToast && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#16a34a',
                fontWeight: 700
              }}>
                <CheckCircle2 size={14} /> Tersimpan
              </span>
            )}

            {/* Toggle Full Width Modal */}
            <button
              onClick={() => setIsFullWidth(!isFullWidth)}
              title={isFullWidth ? "Kecilkan Modal" : "Perlebar Penuh"}
              style={{
                border: 'none',
                background: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px'
              }}
            >
              {isFullWidth ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

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
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container (Persis Halaman Penuh Notion di Screenshot) */}
        <div style={{ padding: '36px 44px', display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
          
          {/* Judul Besar Tugas / Transaksi */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Icon3DClipboard size={38} />
            <input
              type="text"
              value={data.title || data.name || ''}
              onChange={(e) => {
                const key = data.title !== undefined ? 'title' : 'name';
                handleFieldChange(key, e.target.value);
              }}
              placeholder="Ketik judul di sini..."
              style={{
                width: '100%',
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#0f172a',
                border: 'none',
                borderBottom: '2px solid transparent',
                outline: 'none',
                padding: '4px 0',
                backgroundColor: 'transparent',
                transition: 'border-color 150ms ease'
              }}
              onFocus={(e) => e.target.style.borderBottomColor = '#0284c7'}
              onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
            />
          </div>

          {/* Properties Vertikal Notion-Style (Persis Screenshot) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px'
          }}>
            {columns.map((col) => {
              // Lewati kolom nama/judul karena sudah jadi header besar di atas
              if (col.key === 'title' || col.key === 'name') return null;

              const val = data[col.key];

              return (
                <div key={col.key} style={{ display: 'grid', gridTemplateColumns: '190px 1fr', alignItems: 'center', minHeight: '34px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {col.label}
                  </span>

                  <div>
                    {/* Render khusus untuk PIC / Assignee (Dropdown Staff & AI Agent) */}
                    {(col.key === 'pic' || col.key === 'assignee' || col.key === 'owner' || col.key === 'author') ? (
                      <select
                        value={val || (staffAgents && staffAgents[0] ? staffAgents[0].name : '')}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        className="ws-notion-pill"
                        style={{
                          border: '1px solid #bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#0284c7',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          fontFamily: 'inherit'
                        }}
                      >
                        {(staffAgents || []).map((staff) => (
                          <option key={staff.id || staff.name} value={staff.name}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    ) : (col.key === 'category' || col.key === 'kategori') ? (
                      <select
                        value={val || (taskCategories ? taskCategories[0] : 'General')}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        className="ws-notion-pill"
                        style={{
                          border: '1px solid #bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#0284c7',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          fontFamily: 'inherit'
                        }}
                      >
                        {(taskCategories || []).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (col.key === 'dueDate' || col.key === 'date' || col.key === 'completedDate' || col.key === 'tanggalSelesai') ? (
                      <input
                        type="date"
                        value={val || ''}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        style={{
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          outline: 'none',
                          fontFamily: 'inherit'
                        }}
                      />
                    ) : (col.key === 'status') ? (
                      <select
                        value={val || 'Backlog'}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        className="ws-notion-pill"
                        style={{
                          border: '1px solid #bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#0284c7',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="Backlog">Backlog / Belum Mulai</option>
                        <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                        <option value="Menunggu Review">Menunggu Review</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Lunas">Lunas</option>
                        <option value="Pending">Pending</option>
                        <option value="Online / Bertugas">Online / Bertugas</option>
                        <option value="Standby">Standby</option>
                        <option value="Istirahat">Istirahat</option>
                      </select>
                    ) : (col.key === 'stage') ? (
                      <select
                        value={val || 'Lead Masuk'}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        className="ws-notion-pill"
                        style={{
                          border: '1px solid #bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#0284c7',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="Lead Masuk">Lead Masuk</option>
                        <option value="Discovery Call">Discovery Call</option>
                        <option value="Proposal Terkirim">Proposal Terkirim</option>
                        <option value="Negosiasi">Negosiasi</option>
                        <option value="Deal Won 🎉">Deal Won 🎉</option>
                        <option value="Ide">Ide Konten</option>
                        <option value="Design/Video">Design/Video</option>
                        <option value="Review">Review</option>
                        <option value="Siap Tayang">Siap Tayang</option>
                        <option value="Selesai Tayang">Selesai Tayang</option>
                      </select>
                    ) : (col.key === 'priority') ? (
                      <select
                        value={val || 'P2'}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        className="ws-notion-pill"
                        style={{
                          border: '1px solid #bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#0284c7',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="P1">P1 (Tinggi)</option>
                        <option value="P2">P2 (Sedang)</option>
                        <option value="P3">P3 (Rendah)</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    ) : (col.key === 'type' || col.key === 'tipe') ? (
                      <select
                        value={val || 'Pemasukan'}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        className="ws-notion-pill"
                        style={{
                          border: '1px solid #bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#0284c7',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value="Pemasukan">Pemasukan</option>
                        <option value="Pengeluaran">Pengeluaran</option>
                        <option value="Staf Manusia">Staf Manusia</option>
                        <option value="AI Agent DigiBooster">AI Agent DigiBooster</option>
                        <option value="Internal Weekly Sync">Internal Weekly Sync</option>
                        <option value="Client Kick-off">Client Kick-off</option>
                      </select>
                    ) : (col.key === 'description' || col.key === 'keterangan') ? (
                      <textarea
                        value={typeof val === 'object' ? JSON.stringify(val) : (val || '')}
                        onChange={(e) => {
                          handleFieldChange(col.key, e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.max(68, e.target.scrollHeight)}px`;
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.max(68, e.target.scrollHeight)}px`;
                        }}
                        ref={(el) => {
                          if (el) {
                            el.style.height = 'auto';
                            el.style.height = `${Math.max(68, el.scrollHeight)}px`;
                          }
                        }}
                        placeholder="Klik untuk menambah keterangan..."
                        style={{
                          width: '100%',
                          minHeight: '68px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          fontSize: '0.84rem',
                          color: '#1e293b',
                          outline: 'none',
                          lineHeight: 1.5,
                          fontFamily: 'inherit',
                          resize: 'none',
                          overflowY: 'hidden',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.borderColor = '#0284c7';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8fafc';
                          e.target.style.borderColor = '#cbd5e1';
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={
                          typeof val === 'object' && val !== null
                            ? (val.reach !== undefined ? `${val.reach} reach (${val.leads || 0} leads)` : Array.isArray(val) ? val.join(', ') : JSON.stringify(val))
                            : (val ?? '')
                        }
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        placeholder="Klik untuk mengedit..."
                        style={{
                          width: '100%',
                          maxWidth: '420px',
                          border: '1px solid #cbd5e1',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          outline: 'none',
                          backgroundColor: '#f8fafc',
                          fontFamily: 'inherit',
                          transition: 'border-color 150ms ease, background-color 150ms ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.borderColor = '#0284c7';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8fafc';
                          e.target.style.borderColor = '#cbd5e1';
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit Trail Metadata (Dibuat Oleh diatas Terakhir Diedit Oleh, Waktu Dibuat diatas Waktu Terakhir Diedit) */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} color="#0284c7" />
              Riwayat Perubahan (Audit Trail)
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '16px', 
              fontSize: '0.8rem' 
            }}>
              {/* Kolom 1: Dibuat Oleh & Terakhir Diedit Oleh tepat dibawahnya */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', marginBottom: '2px' }}>Dibuat Oleh</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Icon3DUser size={13} /> {data.createdBy || 'Executive Owner'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', marginBottom: '2px' }}>Terakhir Diedit Oleh</span>
                  <span style={{ fontWeight: 600, color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <Icon3DUser size={13} /> {data.updatedBy || 'Executive Owner'}
                  </span>
                </div>
              </div>

              {/* Kolom 2: Waktu Dibuat & Waktu Terakhir Diedit tepat dibawahnya */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', marginBottom: '2px' }}>Waktu Dibuat</span>
                  <span style={{ fontFamily: 'monospace', color: '#334155' }}>{data.createdAt || '8 September 2026 14.23'}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem', marginBottom: '2px' }}>Waktu Terakhir Diedit</span>
                  <span style={{ fontFamily: 'monospace', color: '#334155' }}>{data.updatedAt || '15 Oktober 2026 11.20'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Komentar & Diskusi Realtime (Sesuai Gambar Screenshot Notion) */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#0284c7" />
                Komentar ({data.comments ? data.comments.length : 0})
              </h4>
            </div>

            {/* List Komentar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(!data.comments || data.comments.length === 0) ? (
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
                  Belum ada komentar pada data ini.
                </div>
              ) : (
                data.comments.map((comm) => (
                  <div key={comm.id} style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{comm.author}</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{comm.createdAt}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                      {comm.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Input Komentar Baru */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Tambahkan komentar..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
              <button
                type="submit"
                className="ws-btn-transition"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Send size={14} /> Kirim
              </button>
            </form>
          </div>

        </div>

        {/* Footer Modal */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          backgroundColor: '#fafbfc'
        }}>
          <button
            onClick={onClose}
            className="ws-btn-transition"
            style={{
              padding: '7px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.82rem',
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
