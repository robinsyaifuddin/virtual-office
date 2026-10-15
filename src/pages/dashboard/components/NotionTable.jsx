import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Trash2, 
  ChevronDown, 
  Check, 
  X, 
  ExternalLink,
  Filter,
  MoreHorizontal,
  Edit2,
  CheckSquare,
  Square,
  MinusSquare,
  Settings2
} from 'lucide-react';
import CategoryManagerModal from './CategoryManagerModal';
import UniversalDetailModal from './UniversalDetailModal';

export default function NotionTable({
  title,
  data = [],
  columns = [],
  onAddRow,
  onEditRow,
  onDeleteRow,
  onBulkDelete,
  onOpenFullView,
  onUpdateCell,
  searchPlaceholder = 'Cari data...',
  exportFileName = 'data_export.csv',
  categories = [],
  activeCategory = 'ALL',
  onSelectCategory,
  categoryKey = 'category',
  enableStickyFreeze = true
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Kemas Konten default true
  const isWrapEnabled = true;

  // Selection Mode State (Fitur Tandai Tabel & Hapus Massal)
  const [isSelectModeActive, setIsSelectModeActive] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // Titik 3 Context Menu Action State
  const [activeMenuRowId, setActiveMenuRowId] = useState(null);
  const actionMenuRef = useRef(null);

  // Kotak Modal Lebar Notion (Universal Detail Modal)
  const [activeModalRow, setActiveModalRow] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Dropdown Popover Filter Kategori
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const catDropdownRef = useRef(null);

  // Ekstrak kategori unik
  const computedCategories = (categories && categories.length > 0)
    ? categories
    : Array.from(new Set(data.map(item => item[categoryKey] || item.category || item.pillar).filter(Boolean)));

  // Tutup dropdown/menu saat klik di luar
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActiveMenuRowId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter Search & Category
  const [localCategoryFilter, setLocalCategoryFilter] = useState('ALL');
  const currentCategoryFilter = onSelectCategory ? activeCategory : localCategoryFilter;

  const handleChooseCategory = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      setLocalCategoryFilter(cat);
    }
    setIsCatDropdownOpen(false);
  };

  const filteredData = data.filter((row) => {
    const matchesSearch = !searchTerm || Object.values(row).some(
      (val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const rowCategory = row[categoryKey] || row.category || row.pillar;
    const matchesCategory = currentCategoryFilter === 'ALL' || rowCategory === currentCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortCol) return 0;
    const aVal = a[sortCol] || '';
    const bVal = b[sortCol] || '';
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (colKey) => {
    if (sortCol === colKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colKey);
      setSortAsc(true);
    }
  };

  // Toggle Selection per Baris
  const handleToggleRowSelect = (id) => {
    setSelectedRowIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle Select All
  const isAllSelected = sortedData.length > 0 && selectedRowIds.length === sortedData.length;
  const isSomeSelected = selectedRowIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(sortedData.map(r => r.id));
    }
  };

  // Hapus Massal yang Ditandai
  const handleExecuteBulkDelete = () => {
    if (selectedRowIds.length === 0) return;
    if (window.confirm(`Yakin ingin menghapus ${selectedRowIds.length} data yang ditandai?`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedRowIds);
      } else if (onDeleteRow) {
        selectedRowIds.forEach(id => onDeleteRow(id));
      }
      setSelectedRowIds([]);
    }
  };

  // Buka Kotak Modal Lebar untuk Baris
  const handleOpenRowModal = (row) => {
    setActiveModalRow(row);
    setIsDetailModalOpen(true);
  };

  // Handler Tambah Baru (Membuka Modal Lebar Baru)
  const handleTriggerAdd = () => {
    if (onAddRow) {
      const createdRow = onAddRow();
      if (createdRow && typeof createdRow === 'object') {
        handleOpenRowModal(createdRow);
      }
    }
  };

  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.label).join(',');
    const rows = sortedData.map(row => {
      return columns.map(col => {
        let val = row[col.key];
        if (Array.isArray(val)) val = val.join('; ');
        return `"${String(val || '').replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const wrapClass = isWrapEnabled ? 'ws-cell-wrap' : 'ws-cell-nowrap';

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
      position: 'relative'
    }}>
      {/* Top Toolbar */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        backgroundColor: '#ffffff'
      }}>
        {/* Left Toolbar: Search, Icon Dropdown Kategori, & Tombol Tandai */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: '240px' }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: '220px'
          }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                outline: 'none',
                backgroundColor: '#f8fafc',
                color: '#0f172a'
              }}
            />
          </div>

          {/* 1. Tombol Kategori Dropdown Saja Berupa Icon */}
          <div style={{ position: 'relative' }} ref={catDropdownRef}>
            <button
              onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
              title={currentCategoryFilter !== 'ALL' ? `Filter Kategori: ${currentCategoryFilter}` : "Filter Kategori Dropdown"}
              className="ws-btn-transition"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '7px 10px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: currentCategoryFilter !== 'ALL' ? '#bfdbfe' : '#cbd5e1',
                backgroundColor: currentCategoryFilter !== 'ALL' ? '#eff6ff' : '#ffffff',
                color: currentCategoryFilter !== 'ALL' ? '#0284c7' : '#475569',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <Filter size={15} color={currentCategoryFilter !== 'ALL' ? '#0284c7' : '#64748b'} />
              <ChevronDown size={13} color="#94a3b8" />
              {currentCategoryFilter !== 'ALL' && (
                <span style={{
                  fontSize: '0.74rem',
                  maxWidth: '110px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#0284c7'
                }}>
                  {currentCategoryFilter}
                </span>
              )}
            </button>

            {/* Popover Dropdown Kategori */}
            {isCatDropdownOpen && (
              <div 
                className="ws-drawer-animate ws-custom-scroll"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  width: '240px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                  padding: '6px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ padding: '6px 8px', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Filter Kategori
                </div>

                <button
                  onClick={() => handleChooseCategory('ALL')}
                  className="ws-btn-transition"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: currentCategoryFilter === 'ALL' ? '#eff6ff' : 'transparent',
                    color: currentCategoryFilter === 'ALL' ? '#0284c7' : '#334155',
                    fontSize: '0.8rem',
                    fontWeight: currentCategoryFilter === 'ALL' ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (currentCategoryFilter !== 'ALL') e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (currentCategoryFilter !== 'ALL') e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>Semua Kategori</span>
                  {currentCategoryFilter === 'ALL' && <Check size={14} color="#0284c7" />}
                </button>

                {computedCategories.map((cat) => {
                  const isSelected = currentCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleChooseCategory(cat)}
                      className="ws-btn-transition"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                        color: isSelected ? '#0284c7' : '#334155',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span className="ws-notion-pill" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                        {cat}
                      </span>
                      {isSelected && <Check size={14} color="#0284c7" />}
                    </button>
                  );
                })}

                <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px' }}>
                  <button
                    onClick={() => {
                      setIsCatDropdownOpen(false);
                      setIsCatModalOpen(true);
                    }}
                    className="ws-btn-transition"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#0284c7',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Settings2 size={13} />
                    <span>Edit Opsi Kategori...</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Tombol Tandai (Selection Mode) disamping Kategori Dropdown */}
          <button
            onClick={() => {
              setIsSelectModeActive(!isSelectModeActive);
              if (isSelectModeActive) setSelectedRowIds([]);
            }}
            title={isSelectModeActive ? "Nonaktifkan Mode Tandai" : "Aktifkan Mode Tandai untuk Memilih & Hapus"}
            className="ws-btn-transition"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 11px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: isSelectModeActive ? '#bfdbfe' : '#cbd5e1',
              backgroundColor: isSelectModeActive ? '#eff6ff' : '#ffffff',
              color: isSelectModeActive ? '#0284c7' : '#475569',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            {isSelectModeActive ? <CheckSquare size={14} color="#0284c7" /> : <Square size={14} color="#64748b" />}
            <span>Tandai</span>
          </button>

          {/* Tombol Hapus Massal saat ada baris yang ditandai */}
          {isSelectModeActive && selectedRowIds.length > 0 && (
            <button
              onClick={handleExecuteBulkDelete}
              className="ws-btn-transition"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 700,
                boxShadow: '0 1px 3px rgba(220, 38, 38, 0.1)'
              }}
            >
              <Trash2 size={13} />
              <span>Hapus ({selectedRowIds.length})</span>
            </button>
          )}

          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, paddingLeft: '4px' }}>
            {sortedData.length} baris
          </span>
        </div>

        {/* Right Toolbar: Export & Add Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleExportCSV}
            className="ws-btn-transition"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={13} />
            Ekspor CSV
          </button>

          {onAddRow && (
            <button
              onClick={handleTriggerAdd}
              className="ws-btn-transition"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              Baru
            </button>
          )}
        </div>
      </div>

      {/* Table Canvas with Sticky Columns & Default Kemas Konten */}
      <div className="ws-custom-scroll" style={{ overflowX: 'auto', maxHeight: '620px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', position: 'sticky', top: 0, zIndex: 30 }}>
              
              {/* Checkbox Header saat mode Tandai aktif */}
              {isSelectModeActive && (
                <th style={{
                  padding: '10px 8px',
                  width: '38px',
                  minWidth: '38px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRight: '1px solid #e2e8f0'
                }}>
                  <div 
                    onClick={handleToggleSelectAll} 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    title={isAllSelected ? "Batal Tandai Semua" : "Tandai Semua Baris"}
                  >
                    {isAllSelected ? (
                      <CheckSquare size={16} color="#0284c7" />
                    ) : isSomeSelected ? (
                      <MinusSquare size={16} color="#0284c7" />
                    ) : (
                      <Square size={16} color="#94a3b8" />
                    )}
                  </div>
                </th>
              )}

              {/* Kolom 1 Membeku: Aksi (Buka Modal Lebar) */}
              {enableStickyFreeze && (
                <th className="ws-sticky-col-1" style={{
                  padding: '10px 12px',
                  width: '56px',
                  minWidth: '56px',
                  textAlign: 'center',
                  fontWeight: 700,
                  backgroundColor: '#f8fafc',
                  borderRight: '1px solid #e2e8f0',
                  left: isSelectModeActive ? '38px' : 0
                }}>
                  Aksi
                </th>
              )}

              {/* Kolom-kolom data */}
              {columns.map((col, index) => {
                const isStickyTitle = enableStickyFreeze && index === 0;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={isStickyTitle ? 'ws-sticky-col-2' : ''}
                    style={{
                      padding: '10px 14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      backgroundColor: '#f8fafc',
                      borderRight: '1px solid #e2e8f0',
                      minWidth: col.minWidth || '140px',
                      maxWidth: col.maxWidth || 'none',
                      ...(isStickyTitle && isSelectModeActive ? { left: '94px' } : {})
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {col.label}
                      {sortCol === col.key && (
                        <span style={{ fontSize: '0.72rem', color: '#0284c7' }}>{sortAsc ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                );
              })}

              {/* Kolom Titik 3 (Aksi Edit & Hapus) */}
              <th style={{
                padding: '10px 12px',
                width: '48px',
                minWidth: '48px',
                textAlign: 'center',
                fontWeight: 700,
                backgroundColor: '#f8fafc'
              }}>
                •••
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (isSelectModeActive ? 3 : 2)} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  Tidak ada data yang cocok dengan kriteria pencarian atau filter.
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => {
                const isRowSelected = selectedRowIds.includes(row.id);
                return (
                  <tr
                    key={row.id || idx}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isRowSelected ? '#f0f9ff' : (idx % 2 === 0 ? '#ffffff' : '#fcfcfd'),
                      transition: 'background-color 100ms ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isRowSelected) {
                        const rowEls = e.currentTarget.querySelectorAll('.ws-sticky-col-1, .ws-sticky-col-2');
                        rowEls.forEach(el => el.style.backgroundColor = '#f8fafc');
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isRowSelected) {
                        const rowEls = e.currentTarget.querySelectorAll('.ws-sticky-col-1, .ws-sticky-col-2');
                        rowEls.forEach(el => el.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fcfcfd');
                      }
                    }}
                  >
                    {/* Checkbox per Baris saat mode Tandai aktif */}
                    {isSelectModeActive && (
                      <td style={{
                        padding: '8px',
                        textAlign: 'center',
                        borderRight: '1px solid #e2e8f0',
                        backgroundColor: isRowSelected ? '#f0f9ff' : 'inherit'
                      }}>
                        <div 
                          onClick={() => handleToggleRowSelect(row.id)}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {isRowSelected ? (
                            <CheckSquare size={16} color="#0284c7" />
                          ) : (
                            <Square size={16} color="#94a3b8" />
                          )}
                        </div>
                      </td>
                    )}

                    {/* Kolom 1 Membeku: Tombol Buka (Membuka Kotak Modal Lebar) */}
                    {enableStickyFreeze && (
                      <td className="ws-sticky-col-1" style={{
                        padding: '8px 10px',
                        textAlign: 'center',
                        backgroundColor: isRowSelected ? '#f0f9ff' : (idx % 2 === 0 ? '#ffffff' : '#fcfcfd'),
                        borderRight: '1px solid #e2e8f0',
                        left: isSelectModeActive ? '38px' : 0
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <button
                            onClick={() => handleOpenRowModal(row)}
                            title="Buka Modal Lebar Detail"
                            className="ws-btn-transition"
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              border: '1px solid #bfdbfe',
                              backgroundColor: '#eff6ff',
                              color: '#0284c7',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Buka
                          </button>
                        </div>
                      </td>
                    )}

                    {/* Kolom-kolom Nilai Data */}
                    {columns.map((col, colIdx) => {
                      const isStickyTitle = enableStickyFreeze && colIdx === 0;
                      return (
                        <td
                          key={col.key}
                          className={`${isStickyTitle ? 'ws-sticky-col-2' : ''} ${wrapClass}`}
                          style={{
                            padding: '8px 14px',
                            verticalAlign: 'middle',
                            color: '#1e293b',
                            backgroundColor: isStickyTitle ? (isRowSelected ? '#f0f9ff' : (idx % 2 === 0 ? '#ffffff' : '#fcfcfd')) : 'transparent',
                            borderRight: '1px solid #f1f5f9',
                            minWidth: col.minWidth || '140px',
                            maxWidth: col.maxWidth || 'none',
                            ...(isStickyTitle && isSelectModeActive ? { left: '94px' } : {})
                          }}
                        >
                          {col.render ? (
                            col.render(row[col.key], row, (newVal) => onUpdateCell && onUpdateCell(row.id, col.key, newVal))
                          ) : (
                            onUpdateCell ? (
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => onUpdateCell(row.id, col.key, e.currentTarget.innerText)}
                                className="ws-cell-hover"
                                style={{
                                  padding: '4px 6px',
                                  borderRadius: '4px',
                                  outline: 'none',
                                  cursor: 'text',
                                  fontWeight: colIdx === 0 ? 600 : 400
                                }}
                              >
                                {String(row[col.key] || '')}
                              </div>
                            ) : (
                              String(row[col.key] || '-')
                            )
                          )}
                        </td>
                      );
                    })}

                    {/* Kolom Titik 3: Tab Aksi Edit & Hapus */}
                    <td style={{
                      padding: '8px 10px',
                      textAlign: 'center',
                      position: 'relative',
                      whiteSpace: 'nowrap'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuRowId(activeMenuRowId === row.id ? null : row.id);
                        }}
                        title="Opsi Baris"
                        className="ws-btn-transition"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {/* Popover Menu Aksi Titik 3 */}
                      {activeMenuRowId === row.id && (
                        <div
                          ref={actionMenuRef}
                          className="ws-drawer-animate"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: 'calc(100% - 2px)',
                            width: '150px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                            padding: '4px',
                            zIndex: 150,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                          }}
                        >
                          <button
                            onClick={() => {
                              setActiveMenuRowId(null);
                              handleOpenRowModal(row); // Buka kotak modal lebar pengeditan penuh
                            }}
                            className="ws-btn-transition"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#334155',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit2 size={13} color="#0284c7" />
                            <span>Edit Baris</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveMenuRowId(null);
                              if (window.confirm('Yakin ingin menghapus baris data ini?')) {
                                if (onDeleteRow) onDeleteRow(row.id);
                              }
                            }}
                            className="ws-btn-transition"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#dc2626',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={13} color="#dc2626" />
                            <span>Hapus Baris</span>
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Tips */}
      <div style={{
        padding: '10px 18px',
        backgroundColor: '#fafbfc',
        borderTop: '1px solid #e2e8f0',
        fontSize: '0.74rem',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>
          💡 <strong>Tip:</strong> Klik tombol <strong>Buka</strong> atau menu <strong>••• &gt; Edit</strong> untuk membuka kotak modal lebar pengeditan penuh.
        </span>
        {onAddRow && (
          <button
            onClick={handleTriggerAdd}
            style={{
              border: 'none',
              background: 'none',
              color: '#0284c7',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={13} /> Tambah Baris Baru
          </button>
        )}
      </div>

      {/* Modal Kelola Opsi Kategori */}
      <CategoryManagerModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
      />

      {/* Kotak Modal Lebar Detail & Pengeditan Penuh Notion-Style */}
      <UniversalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setActiveModalRow(null);
        }}
        data={activeModalRow}
        columns={columns}
        onUpdateField={(rowId, fieldKey, val) => {
          if (onUpdateCell) {
            onUpdateCell(rowId, fieldKey, val);
          }
          setActiveModalRow(prev => prev ? { ...prev, [fieldKey]: val } : null);
        }}
      />
    </div>
  );
}
