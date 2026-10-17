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
  FileText,
  UploadCloud,
  Download,
  Bookmark
} from 'lucide-react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import { exportRowAsPdf } from '../../../utils/exportPdf';

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
  onSaveNew,
  categoryKey = 'category'
}) {
  if (!isOpen || !data) return null;

  const { taskCategories, addTaskComment, staffAgents, addCustomTemplate } = useWorkspaceStore();
  const [commentInput, setCommentInput] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [templateSavedToast, setTemplateSavedToast] = useState(false);
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
  const mainTitle = data.title || data.name || data.period || data.objective || data.uraian || 'Tanpa Judul';

  return (
    <div 
      className="ws-modal-backdrop-mobile"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px 16px'
      }}
    >
      <div 
        className="ws-drawer-animate ws-modal-drawer-mobile"
        style={{
          width: '100%',
          maxWidth: isFullWidth ? '96vw' : '880px',
          maxHeight: '92vh',
          height: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'max-width 200ms ease',
          overflow: 'hidden'
        }}
      >
        {/* Top Header & Breadcrumbs (Sticky di atas) */}
        <div 
          className="ws-modal-header-mobile"
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafbfc',
            flexShrink: 0,
            zIndex: 40
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#0284c7',
              backgroundColor: '#eff6ff',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #bfdbfe'
            }}>
              <FileText size={13} />
              <span>Detail &amp; Isian Data</span>
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

            {templateSavedToast && (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#0284c7',
                fontWeight: 700,
                backgroundColor: '#eff6ff',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                <Bookmark size={14} /> Template Tersimpan!
              </span>
            )}

            {/* Tombol Simpan Baris Ini Sebagai Template Baru */}
            <button
              onClick={() => {
                const targetCat = data[categoryKey] || data.category || data.pillar || 'Umum';
                const templatePayload = {
                  ...data,
                  title: data.title || data.name || data.period || data.objective || 'Template Kustom'
                };
                delete templatePayload.id; // Agar template di-generate ID baru saat di-apply
                addCustomTemplate(title, targetCat, templatePayload);
                setTemplateSavedToast(true);
                setTimeout(() => setTemplateSavedToast(false), 2000);
              }}
              title="Simpan baris ini sebagai Template baru di kategori ini"
              className="ws-btn-transition"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #fed7aa',
                backgroundColor: '#fff7ed',
                color: '#ea580c',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Bookmark size={14} />
              <span className="ws-mobile-hidden">Simpan sbg Template</span>
            </button>

            {/* Tombol Unduh PDF Dokumen Resmi */}
            <button
              onClick={() => exportRowAsPdf(data, columns, { title })}
              title="Unduh Dokumen PDF Resmi"
              className="ws-btn-transition"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #bae6fd',
                backgroundColor: '#f0f9ff',
                color: '#0284c7',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <FileText size={14} />
              <span className="ws-mobile-hidden">Unduh PDF</span>
            </button>

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

        {/* Modal Main Content Container (Scrollable internal body) */}
        <div 
          className="ws-modal-body-mobile ws-custom-scroll"
          style={{ 
            padding: '36px 44px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '28px', 
            flex: 1,
            overflowY: 'auto'
          }}
        >
          
          {/* Judul Besar Tugas / Transaksi / Periode / Objective */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Icon3DClipboard size={38} />
            <input
              type="text"
              value={data.title || data.name || data.period || data.objective || data.uraian || ''}
              onChange={(e) => {
                const key = data.title !== undefined ? 'title' 
                  : data.name !== undefined ? 'name' 
                  : data.period !== undefined ? 'period' 
                  : data.objective !== undefined ? 'objective' 
                  : 'title';
                handleFieldChange(key, e.target.value);
              }}
              placeholder="Ketik judul di sini..."
              className="ws-modal-title-input"
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
              // Lewati kolom nama/judul/periode/objective karena sudah jadi header besar di atas
              if (col.key === 'title' || col.key === 'name' || col.key === 'period' || col.key === 'objective') return null;

              const val = data[col.key];

              return (
                <div 
                  key={col.key} 
                  className="ws-modal-property-row"
                  style={{ display: 'grid', gridTemplateColumns: '190px 1fr', alignItems: 'center', minHeight: '34px' }}
                >
                  <span 
                    className="ws-modal-property-label"
                    style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {col.label}
                  </span>

                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    {Array.isArray(col.options) && col.options.length > 0 ? (
                      <select
                        value={val || col.options[0]}
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
                        {col.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (col.key === 'pic' || col.key === 'assignee' || col.key === 'owner' || col.key === 'author') ? (
                      <select
                        value={val || ''}
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
                        <option value="">Pilih Penanggung Jawab...</option>
                        {(staffAgents || []).map((staff) => (
                          <option key={staff.id || staff.name} value={staff.name}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    ) : (col.key === 'category' || col.key === 'kategori') ? (
                      <select
                        value={val || (col.options ? col.options[0] : (taskCategories ? taskCategories[0] : 'General'))}
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
                        {(col.options || taskCategories || [
                          'Pembayaran Klien',
                          'Server & Tools',
                          'Marketing Ads',
                          'Operasional Kantor',
                          'Gaji & Tim',
                          'Lain-lain'
                        ]).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    ) : (col.key === 'channel') ? (
                      <select
                        value={Array.isArray(val) ? val[0] : (val || 'Instagram')}
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
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Website">Website</option>
                        <option value="Meta Ads">Meta Ads</option>
                        <option value="Email">Email</option>
                      </select>
                    ) : (col.key === 'pillar') ? (
                      <select
                        value={val || 'Edukasi'}
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
                        <option value="Edukasi">Edukasi</option>
                        <option value="Case Study">Case Study</option>
                        <option value="Promo/Hard Sell">Promo/Hard Sell</option>
                        <option value="Branding">Branding</option>
                        <option value="Behind The Scenes">Behind The Scenes</option>
                        <option value="Tips & Trick">Tips & Trick</option>
                      </select>
                    ) : (col.key === 'services') ? (
                      <select
                        value={Array.isArray(val) ? val[0] : (val || 'Custom AI')}
                        onChange={(e) => handleFieldChange(col.key, [e.target.value])}
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
                        <option value="Custom AI">Custom AI</option>
                        <option value="Web Dev">Web Dev</option>
                        <option value="Branding">Branding</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Digital Ads">Digital Ads</option>
                        <option value="Full Retainer">Full Retainer</option>
                      </select>
                    ) : (col.key === 'division') ? (
                      <select
                        value={val || 'Sales & Marketing'}
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
                        <option value="Sales & Marketing">Sales & Marketing</option>
                        <option value="Operasional/Produksi">Operasional/Produksi</option>
                        <option value="Kreatif">Kreatif</option>
                        <option value="Teknologi">Teknologi</option>
                        <option value="Manajemen & Legal">Manajemen & Legal</option>
                      </select>
                    ) : (col.key === 'quarter') ? (
                      <select
                        value={val || 'Q4'}
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
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    ) : (col.key === 'department') ? (
                      <select
                        value={val || 'Manajemen'}
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
                        <option value="Manajemen">Manajemen</option>
                        <option value="Tech">Tech</option>
                        <option value="Kreatif">Kreatif</option>
                        <option value="Sales & Marketing">Sales & Marketing</option>
                      </select>
                    ) : (col.key === 'accessLevel') ? (
                      <select
                        value={val || 'Publik Semua Tim'}
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
                        <option value="Publik Semua Tim">Publik Semua Tim</option>
                        <option value="Hanya Manager">Hanya Manager</option>
                        <option value="Rahasia/Direksi">Rahasia/Direksi</option>
                      </select>
                    ) : (col.key === 'rating') ? (
                      <select
                        value={val || 5}
                        onChange={(e) => handleFieldChange(col.key, Number(e.target.value))}
                        className="ws-notion-pill"
                        style={{
                          border: '1px solid #fef08a',
                          backgroundColor: '#fefce8',
                          color: '#ca8a04',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          fontFamily: 'inherit'
                        }}
                      >
                        <option value={5}>Skor 5/5 (Mutu Terbaik)</option>
                        <option value={4}>Skor 4/5 (Sangat Baik)</option>
                        <option value={3}>Skor 3/5 (Cukup Baik)</option>
                        <option value={2}>Skor 2/5 (Perlu Perbaikan)</option>
                      </select>
                    ) : (col.key === 'progress') ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '420px', width: '100%' }}>
                        {/* Progress Bar & Percentage */}
                        {(() => {
                          const target = Number(data.targetNum) || 100;
                          const current = Number(data.currentNum) || 0;
                          let pct = Math.round((current / target) * 100);
                          if (data.unit === 'Detik' && current > 0) {
                            pct = Math.round((target / current) * 100);
                          }
                          const displayPct = Math.max(0, isNaN(pct) ? 0 : pct);

                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                                  <div 
                                    style={{ 
                                      width: `${Math.min(displayPct, 100)}%`, 
                                      height: '100%', 
                                      backgroundColor: displayPct >= 100 ? '#16a34a' : displayPct >= 50 ? '#0284c7' : '#eab308',
                                      transition: 'width 200ms ease'
                                    }} 
                                  />
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: displayPct >= 100 ? '#16a34a' : '#0284c7', minWidth: '45px', textAlign: 'right' }}>
                                  {displayPct}%
                                </span>
                              </div>

                              {/* Input Capaian & Target */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: '8px', alignItems: 'center' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '3px' }}>
                                    Capaian Realisasi ({data.unit || '%'})
                                  </label>
                                  <input
                                    type="number"
                                    value={data.currentNum !== undefined ? data.currentNum : 0}
                                    onChange={(e) => {
                                      const num = parseFloat(e.target.value) || 0;
                                      handleFieldChange('currentNum', num);
                                      // Auto update status bila tercapai
                                      const tgt = Number(data.targetNum) || 100;
                                      let p = Math.round((num / tgt) * 100);
                                      if (data.unit === 'Detik' && num > 0) p = Math.round((tgt / num) * 100);
                                      if (p >= 100) {
                                        handleFieldChange('status', 'Tercapai');
                                      } else if (p > 0) {
                                        handleFieldChange('status', 'On Track');
                                      }
                                    }}
                                    placeholder="0"
                                    style={{
                                      width: '100%',
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: '1px solid #0284c7',
                                      backgroundColor: '#ffffff',
                                      fontSize: '0.82rem',
                                      fontWeight: 700,
                                      color: '#0f172a',
                                      outline: 'none',
                                      fontFamily: 'inherit',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '3px' }}>
                                    Target Akhir ({data.unit || '%'})
                                  </label>
                                  <input
                                    type="number"
                                    value={data.targetNum !== undefined ? data.targetNum : 100}
                                    onChange={(e) => {
                                      const num = parseFloat(e.target.value) || 1;
                                      handleFieldChange('targetNum', num);
                                    }}
                                    placeholder="100"
                                    style={{
                                      width: '100%',
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: '1px solid #cbd5e1',
                                      backgroundColor: '#f8fafc',
                                      fontSize: '0.82rem',
                                      fontWeight: 600,
                                      color: '#0f172a',
                                      outline: 'none',
                                      fontFamily: 'inherit',
                                      boxSizing: 'border-box'
                                    }}
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '3px' }}>
                                    Satuan
                                  </label>
                                  <select
                                    value={data.unit || '%'}
                                    onChange={(e) => handleFieldChange('unit', e.target.value)}
                                    className="ws-notion-pill"
                                    style={{
                                      width: '100%',
                                      padding: '5px 8px',
                                      borderRadius: '6px',
                                      border: '1px solid #cbd5e1',
                                      backgroundColor: '#ffffff',
                                      fontSize: '0.78rem',
                                      fontWeight: 600,
                                      color: '#0f172a',
                                      outline: 'none',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <option value="%">%</option>
                                    <option value="IDR">IDR</option>
                                    <option value="Detik">Detik</option>
                                    <option value="Leads">Leads</option>
                                    <option value="User">User</option>
                                    <option value="Klien">Klien</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (col.key === 'targetNum' || col.key === 'currentNum') ? (
                      <input
                        type="number"
                        value={val !== undefined ? val : 0}
                        onChange={(e) => handleFieldChange(col.key, parseFloat(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          maxWidth: '180px',
                          border: '1px solid #cbd5e1',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.84rem',
                          outline: 'none',
                          backgroundColor: '#f8fafc',
                          fontFamily: 'inherit'
                        }}
                      />
                    ) : (col.key === 'unit') ? (
                      <select
                        value={val || '%'}
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
                        <option value="%">% (Persen)</option>
                        <option value="IDR">IDR (Rupiah)</option>
                        <option value="Detik">Detik (Kecepatan)</option>
                        <option value="Leads">Leads</option>
                        <option value="User">User</option>
                        <option value="Klien">Klien</option>
                      </select>
                    ) : (
                      col.key === 'dueDate' || 
                      col.key === 'date' || 
                      col.key === 'completedDate' || 
                      col.key === 'publishDate' || 
                      col.key === 'updatedAt' || 
                      col.key === 'dateTime' || 
                      col.key === 'targetDeadline' ||
                      col.key === 'tanggalSelesai'
                    ) ? (
                      <input
                        type="date"
                        value={val ? String(val).split(' ')[0] : ''}
                        onChange={(e) => handleFieldChange(col.key, e.target.value)}
                        style={{
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          outline: 'none',
                          fontFamily: 'inherit',
                          color: '#0f172a',
                          fontWeight: 500,
                          cursor: 'pointer'
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
                        <option value="Cuti / Off">Cuti / Off</option>
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
                        <option value="Deal Won">Deal Won</option>
                        <option value="Deal Lost">Deal Lost</option>
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
                        <option value="Review Sprint">Review Sprint</option>
                        <option value="Evaluasi Klien">Evaluasi Klien</option>
                        <option value="Strategi Bisnis">Strategi Bisnis</option>
                      </select>
                    ) : (
                      col.key === 'description' || 
                      col.key === 'keterangan' || 
                      col.key === 'summaryNotes' || 
                      col.key === 'whatWentWell' || 
                      col.key === 'bottlenecks' || 
                      col.key === 'actionPlan' ||
                      col.key === 'outputResult'
                    ) ? (
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
                    ) : (col.key === 'fileFormat' || col.key === 'format') ? (
                      <select
                        value={val || 'PDF'}
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
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                        <option value="ZIP">ZIP</option>
                        <option value="RAR">RAR</option>
                        <option value="PNG">PNG</option>
                        <option value="JPG">JPG</option>
                        <option value="MP4">MP4</option>
                        <option value="JSON">JSON</option>
                      </select>
                    ) : (col.key === 'downloadUrl' || col.key === 'receiptDoc' || col.key === 'contractDoc' || col.key === 'attachmentDoc' || col.key === 'mediaLink') ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {/* Nama File */}
                        <div style={{ 
                          padding: '5px 10px', 
                          borderRadius: '6px', 
                          backgroundColor: '#f8fafc', 
                          border: '1px solid #e2e8f0', 
                          fontSize: '0.78rem',
                          color: '#334155',
                          maxWidth: '220px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {data.fileName || (val ? `${mainTitle}.${(data.fileFormat || 'pdf').toLowerCase()}` : 'Belum ada berkas')}
                        </div>

                        {/* Tombol Icon Unduh */}
                        {val ? (
                          <a
                            href={val}
                            download={data.fileName || `${mainTitle}.${(data.fileFormat || 'pdf').toLowerCase()}`}
                            title="Unduh Berkas"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: '#0284c7',
                              color: '#ffffff',
                              textDecoration: 'none',
                              boxShadow: '0 1px 2px rgba(2, 132, 199, 0.2)',
                              cursor: 'pointer'
                            }}
                          >
                            <Download size={15} />
                          </a>
                        ) : null}

                        {/* Tombol Icon Upload / Ganti Berkas */}
                        <label
                          htmlFor={`modal-upload-${col.key}`}
                          title={val ? 'Ganti Berkas' : 'Upload Berkas'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#0284c7',
                            cursor: 'pointer',
                            border: '1px solid #cbd5e1'
                          }}
                        >
                          <UploadCloud size={16} />
                        </label>
                        <input
                          id={`modal-upload-${col.key}`}
                          type="file"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target.result;
                              const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
                              const size = file.size > 1024 * 1024 
                                ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
                                : `${Math.round(file.size / 1024)} KB`;

                              handleFieldChange(col.key, dataUrl);
                              handleFieldChange('fileName', file.name);
                              handleFieldChange('fileFormat', ext);
                              handleFieldChange('fileSize', size);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </div>
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

          {/* Catatan / Notes Tambahan (Bisa ditulis memanjang ke bawah) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.86rem',
              fontWeight: 700,
              color: '#0f172a'
            }}>
              <Icon3DNotes size={16} />
              <span>Catatan Dokumen / Notulensi</span>
            </div>
            <textarea
              value={data.notes || data.summaryNotes || data.keterangan || data.description || ''}
              onChange={(e) => {
                handleFieldChange('notes', e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.max(90, e.target.scrollHeight)}px`;
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.max(90, e.target.scrollHeight)}px`;
              }}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${Math.max(90, el.scrollHeight)}px`;
                }
              }}
              placeholder="Tuliskan catatan, ringkasan, atau instruksi kerja di sini (akan otomatis memanjang ke bawah)..."
              style={{
                width: '100%',
                minHeight: '90px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.84rem',
                color: '#1e293b',
                outline: 'none',
                lineHeight: 1.55,
                fontFamily: 'inherit',
                resize: 'none',
                overflowY: 'hidden',
                boxSizing: 'border-box',
                transition: 'border-color 150ms ease, box-shadow 150ms ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0284c7';
                e.target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.12)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
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

        {/* Footer Modal (Sticky di bawah) */}
        <div 
          className="ws-modal-footer-mobile"
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            backgroundColor: '#fafbfc',
            flexShrink: 0,
            zIndex: 40
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Data tersimpan otomatis
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onClose}
              className="ws-btn-transition"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 22px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
            >
              <CheckCircle2 size={15} />
              Simpan &amp; Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
