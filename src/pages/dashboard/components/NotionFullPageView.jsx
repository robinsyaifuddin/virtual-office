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
  AlertCircle,
  Folder,
  Layers,
  Sparkles,
  FileText,
  AlignLeft,
  Flag,
  Target,
  CheckCircle
} from 'lucide-react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import { formatDateID, toInputDateFormat } from '../../../utils/dateFormatter';

export default function NotionFullPageView({ taskId, onClose }) {
  const store = useWorkspaceStore();
  const tasks = Array.isArray(store?.tasks) ? store.tasks : [];
  const updateTask = store?.updateTask || (() => {});
  const addTaskComment = store?.addTaskComment || (() => {});
  const taskCategories = Array.isArray(store?.taskCategories) ? store.taskCategories : ['Website & Tracking'];
  const addCategoryOption = store?.addCategoryOption || (() => {});
  const staffAgents = Array.isArray(store?.staffAgents) ? store.staffAgents : [];

  const [commentInput, setCommentInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const task = tasks.find((t) => t && t.id === taskId);
  if (!task) return null;

  const currentAssigneeData = staffAgents.find(s => s && s.name === task.assignee) || null;
  const isCurrentAssigneeAI = currentAssigneeData && typeof currentAssigneeData.type === 'string' && currentAssigneeData.type.includes('AI');

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 1400);
  };

  const handleFieldChange = (field, value) => {
    updateTask(task.id, { [field]: value });
    triggerToast();
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addTaskComment(task.id, commentInput.trim(), 'Executive Owner');
    setCommentInput('');
    triggerToast();
  };

  const priorityOptions = ['P1', 'P2', 'P3', 'Urgent'];
  const statusOptions = ['Backlog', 'Sedang Dikerjakan', 'Menunggu Review', 'Selesai'];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      maxWidth: '920px',
      margin: '0 auto',
      boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
      overflow: 'hidden'
    }}>
      {/* Top Header & Breadcrumbs */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fafbfc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
          <button
            onClick={onClose}
            className="ws-btn-transition"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              color: '#0284c7',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Tabel</span>
          </button>
          <span>/</span>
          <span>Tugas Operasional</span>
          <span>/</span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{task.title || 'Tanpa Judul'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          <button
            onClick={onClose}
            className="ws-btn-transition"
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            Tutup Halaman
          </button>
        </div>
      </div>

      <div style={{ padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Title Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileText size={32} color="#0284c7" />
          </div>
          <input
            type="text"
            value={task.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            placeholder="Judul Tugas Operasional..."
            style={{
              width: '100%',
              fontSize: '1.65rem',
              fontWeight: 800,
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

        {/* Properties Grid (Vertical Notion Property Form) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '16px'
        }}>
          {/* Keterangan / Deskripsi */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'flex-start', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlignLeft size={14} color="#0284c7" /> Keterangan
            </span>
            <textarea
              rows={3}
              value={task.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Tambahkan keterangan rincian tugas..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                fontSize: '0.85rem',
                color: '#1e293b',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5
              }}
            />
          </div>

          {/* Jadwal Tugas */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={14} /> Jadwal Tugas
            </span>
            <input
              type="date"
              value={toInputDateFormat(task.dueDate)}
              onChange={(e) => handleFieldChange('dueDate', e.target.value)}
              style={{
                width: '180px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: 'inherit',
                color: '#0f172a'
              }}
            />
          </div>

          {/* Kategori Tugas (Notion Dropdown) */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={14} /> Kategori Tugas
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                value={task.category || taskCategories[0]}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {taskCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Prioritas */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flag size={14} color="#0284c7" /> Prioritas
            </span>
            <select
              value={task.priority || 'P2'}
              onChange={(e) => handleFieldChange('priority', e.target.value)}
              style={{
                width: '180px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                color: task.priority === 'P1' || task.priority === 'Urgent' ? '#dc2626' : '#0f172a'
              }}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* PIC & AI Agent Trigger */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={14} /> PIC Penugasan
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={task.assignee || (staffAgents && staffAgents[0] ? staffAgents[0].name : '')}
                onChange={(e) => handleFieldChange('assignee', e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: isCurrentAssigneeAI ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                  backgroundColor: isCurrentAssigneeAI ? '#f0f9ff' : '#ffffff',
                  color: isCurrentAssigneeAI ? '#0284c7' : '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <optgroup label="🤖 Autonomous AI Agents (Auto-Executor)">
                  {staffAgents.filter(s => (s.type || '').includes('AI')).map((staff) => (
                    <option key={staff.id || staff.name} value={staff.name}>
                      ✨ {staff.name} ({staff.aiEngine || 'Groq Engine'})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="👤 Staf Manusia (Tim Internal)">
                  {staffAgents.filter(s => !(s.type || '').includes('AI')).map((staff) => (
                    <option key={staff.id || staff.name} value={staff.name}>
                      👤 {staff.name}
                    </option>
                  ))}
                </optgroup>
              </select>

              {isCurrentAssigneeAI && (
                <button
                  type="button"
                  onClick={() => {
                    const agent = currentAssigneeData;
                    const generatedDeliverable = `[Output Eksekusi AI - ${agent.name}]
Hasil otomatis untuk "${task.title}":
- Ringkasan Solusi: Tugas telah diproses oleh persona ${agent.name}.
- Deliverable: Draft checklist dan output siap di-review.
- Waktu: ${new Date().toLocaleString('id-ID')}`;
                    
                    updateTask(task.id, {
                      status: 'Menunggu Review',
                      outputResult: generatedDeliverable,
                      completedDate: new Date().toISOString().split('T')[0]
                    });

                    addTaskComment(task.id, `🤖 [Autonomous Run] AI Agent ${agent.name} menyelesaikan eksekusi tugas.`, agent.name);
                    triggerToast();
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  title="Jalankan otomatis AI Agent untuk menghasilkan deliverable tugas ini"
                >
                  <Sparkles size={13} /> Jalankan AI Agent Sekarang
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} /> Status
            </span>
            <select
              value={task.status || 'Backlog'}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              style={{
                width: '180px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {statusOptions.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Output / Hasil */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={14} color="#0284c7" /> Output / Hasil
            </span>
            <input
              type="text"
              value={task.outputResult || ''}
              onChange={(e) => handleFieldChange('outputResult', e.target.value)}
              placeholder="Kosong (klik untuk isi output/deliverable)..."
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Tanggal Selesai */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', padding: '6px 0' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={14} color="#0284c7" /> Tanggal Selesai
            </span>
            <input
              type="date"
              value={toInputDateFormat(task.completedDate)}
              onChange={(e) => handleFieldChange('completedDate', e.target.value)}
              style={{
                width: '180px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Audit Trail Metadata (Sesuai Gambar 1 Notion) */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
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
            Riwayat Perubahan &amp; Audit Trail
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Dibuat Oleh</span>
              <span style={{ fontWeight: 600, color: '#0f172a', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="#64748b" /> {task.createdBy || 'Executive Owner'}
              </span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Waktu Dibuat</span>
              <span style={{ fontFamily: 'monospace', color: '#334155' }}>{task.createdAt ? formatDateID(task.createdAt, true) : '08 Sep 2026 14:23'}</span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Terakhir Diedit Oleh</span>
              <span style={{ fontWeight: 600, color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="#0284c7" /> {task.updatedBy || 'Executive Owner'}
              </span>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Waktu Terakhir Diedit</span>
              <span style={{ fontFamily: 'monospace', color: '#334155' }}>{task.updatedAt ? formatDateID(task.updatedAt, true) : '15 Okt 2026 11:20'}</span>
            </div>
          </div>
        </div>

        {/* Diskusi & Komentar Realtime */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} color="#0284c7" />
              Komentar &amp; Diskusi Tim ({task.comments ? task.comments.length : 0})
            </h4>
          </div>

          {/* Daftar Komentar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(!task.comments || task.comments.length === 0) ? (
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', padding: '10px 0' }}>
                Belum ada komentar pada tugas ini. Tulis komentar pertama di bawah.
              </div>
            ) : (
              task.comments.map((comm) => (
                <div key={comm.id} style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{comm.author}</span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{formatDateID(comm.createdAt, true)}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                    {comm.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Form Tambah Komentar */}
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <input
              type="text"
              placeholder="Tambahkan komentar atau mention rekan tim..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              className="ws-btn-transition"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Send size={14} />
              Kirim
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
