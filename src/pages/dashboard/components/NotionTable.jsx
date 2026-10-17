import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Info,
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
    Settings2,
  Table as TableIcon,
  LayoutGrid,
  CalendarDays,
  Archive,
  Clock,
  Zap,
  Calendar,
  ChevronRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Bookmark
} from 'lucide-react';
import CategoryManagerModal from './CategoryManagerModal';
import UniversalDetailModal from './UniversalDetailModal';
import { exportRowAsPdf, exportTableAsPdf } from '../../../utils/exportPdf';
import { exportTableAsExcel } from '../../../utils/exportExcel';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import { DEFAULT_PRESET_TEMPLATES } from '../../../data/defaultTemplates';
import { formatDateID } from '../../../utils/dateFormatter';

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
  onAddCategory,
  onDeleteCategory,
  categoryKey = 'category',
  enableStickyFreeze = true,
  // View Switcher Props (Tabel, Kanban, Kalender)
  currentViewMode,
  onChangeViewMode,
  availableViewModes = [], // e.g. ['table', 'kanban', 'calendar']
  // Status Filter Props
  statusFilter,
  onChangeStatusFilter,
  statusOptions,
  // Lifecycle Filter Props (Aktif, Semua, Arsip Bulan - backwards compatibility)
  lifecycleFilter,
  onChangeLifecycleFilter,
  archiveMonth,
  onChangeArchiveMonth,
  availableArchiveMonths = [],
  // Render function atau children saat mode selain table aktif (e.g. kanban, calendar)
  renderCustomView,
  children
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
  const [menuPosition, setMenuPosition] = useState(null);
  const actionMenuRef = useRef(null);

  // Kotak Modal Lebar Notion (Universal Detail Modal)
  const [activeModalRow, setActiveModalRow] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Dropdown Popover Filter Kategori
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const catDropdownRef = useRef(null);

  // Dropdown Popover View Selector (Sebelah kiri kotak pencarian)
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
  const [isArchiveAccordionOpen, setIsArchiveAccordionOpen] = useState(false);
  const viewDropdownRef = useRef(null);
  const layoutDropdownRef = useRef(null);

  // Template Dropdown States & Ref
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [templateSearchTerm, setTemplateSearchTerm] = useState('');
  const [expandedTemplateCategory, setExpandedTemplateCategory] = useState(null);
  const templateDropdownRef = useRef(null);
  const templateMobileRef = useRef(null);

  // Workspace Store untuk Custom Templates
  const { customTemplates, deleteCustomTemplate } = useWorkspaceStore();

  // In-table Accordion State: bulan mana saja yang sedang terbuka di dalam tabel saat mode Arsip
  const [expandedArchiveMonths, setExpandedArchiveMonths] = useState(
    archiveMonth ? [archiveMonth] : ['September 2026', 'Agustus 2026', 'Juli 2026']
  );

  const toggleArchiveMonthInTable = (monthName) => {
    setExpandedArchiveMonths((prev) =>
      prev.includes(monthName) ? prev.filter((m) => m !== monthName) : [...prev, monthName]
    );
  };

  // Ekstrak kategori unik
  const computedCategories = (categories && categories.length > 0)
    ? categories
    : Array.from(new Set(data.map(item => item[categoryKey] || item.category || item.pillar).filter(Boolean)));

  // Tutup dropdown/menu saat klik di luar atau saat scroll/resize jendela
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target)) {
        setIsViewDropdownOpen(false);
      }
      if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(e.target)) {
        setIsLayoutDropdownOpen(false);
      }
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target) &&
          templateMobileRef.current && !templateMobileRef.current.contains(e.target)) {
        setIsTemplateDropdownOpen(false);
      }
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActiveMenuRowId(null);
        setMenuPosition(null);
      }
    };

    const handleWindowChange = () => {
      setActiveMenuRowId(null);
      setMenuPosition(null);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('scroll', handleWindowChange, true);
    window.addEventListener('resize', handleWindowChange);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('scroll', handleWindowChange, true);
      window.removeEventListener('resize', handleWindowChange);
    };
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

  // Helper untuk menentukan bulan dari baris data (dueDate, date, dateTime, updatedAt, publishDate)
  const getRowMonthName = (row) => {
    const rawDate = row.dueDate || row.date || row.dateTime || row.publishDate || row.updatedAt || row.createdAt;
    if (!rawDate) return 'Lainnya';
    const dateStr = String(rawDate);
    if (dateStr.startsWith('2026-10') || dateStr.includes('-10-') || /Okt/i.test(dateStr)) return 'Oktober 2026';
    if (dateStr.startsWith('2026-09') || dateStr.includes('-09-') || /Sep/i.test(dateStr)) return 'September 2026';
    if (dateStr.startsWith('2026-08') || dateStr.includes('-08-') || /Agu/i.test(dateStr)) return 'Agustus 2026';
    if (dateStr.startsWith('2026-07') || dateStr.includes('-07-') || /Jul/i.test(dateStr)) return 'Juli 2026';
    if (dateStr.startsWith('2026-06') || dateStr.includes('-06-') || /Jun/i.test(dateStr)) return 'Juni 2026';
    return 'Bulan Lainnya';
  };

  // Status & Lifecycle Filter resolution
  const activeStatusFilter = statusFilter !== undefined ? statusFilter : lifecycleFilter;
  const onStatusFilterChange = onChangeStatusFilter || onChangeLifecycleFilter;

  const resolvedStatusOptions = React.useMemo(() => {
    if (statusOptions && statusOptions.length > 0) {
      return statusOptions.map((opt) => {
        if (typeof opt === 'string') {
          return { value: opt, label: opt };
        }
        return opt;
      });
    }

    // Auto-detect unique statuses if data has status or stage property
    const sampleStatuses = Array.from(
      new Set(data.map((d) => d.status || d.stage).filter(Boolean))
    );
    if (sampleStatuses.length > 0) {
      return [
        { value: 'Semua Status', label: 'Semua Status' },
        ...sampleStatuses.map((s) => ({ value: s, label: s }))
      ];
    }

    // Fallback default lifecycle options
    return [
      { value: 'all', label: 'Semua (Bulan Ini)' },
      { value: 'active', label: 'Berjalan (Bulan Ini)' },
      { value: 'completed', label: 'Selesai (Bulan Ini)' },
      { value: 'archive', label: 'Arsip (Bulan Lalu)' }
    ];
  }, [statusOptions, data]);

  // Pengelompokan baris arsip per bulan saat mode Arsip aktif
  const archiveMonthOrder = (availableArchiveMonths && availableArchiveMonths.length > 0)
    ? availableArchiveMonths
    : ['September 2026', 'Agustus 2026', 'Juli 2026'];

  const archiveGroupedData = React.useMemo(() => {
    if (lifecycleFilter !== 'archive' && activeStatusFilter !== 'Arsip') return null;
    const groups = {};
    archiveMonthOrder.forEach((m) => {
      groups[m] = [];
    });

    sortedData.forEach((row) => {
      const monthName = getRowMonthName(row);
      if (groups[monthName]) {
        groups[monthName].push(row);
      } else {
        if (!groups[monthName]) groups[monthName] = [];
        groups[monthName].push(row);
      }
    });

    return groups;
  }, [sortedData, lifecycleFilter, activeStatusFilter, archiveMonthOrder]);

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

  // Ambil Template Presets & Custom untuk Modul Ini (dengan fallback matching fleksibel)
  const modulePresetTemplates = React.useMemo(() => {
    if (DEFAULT_PRESET_TEMPLATES[title]) return DEFAULT_PRESET_TEMPLATES[title];
    // Fallback pencarian case-insensitive atau partial matching
    const foundKey = Object.keys(DEFAULT_PRESET_TEMPLATES).find(k => 
      k.toLowerCase().includes((title || '').toLowerCase()) || 
      (title || '').toLowerCase().includes(k.toLowerCase())
    );
    return foundKey ? DEFAULT_PRESET_TEMPLATES[foundKey] : {};
  }, [title]);

  const moduleCustomTemplates = React.useMemo(() => {
    if (customTemplates && customTemplates[title]) return customTemplates[title];
    const foundKey = Object.keys(customTemplates || {}).find(k => 
      k.toLowerCase().includes((title || '').toLowerCase()) || 
      (title || '').toLowerCase().includes(k.toLowerCase())
    );
    return foundKey ? customTemplates[foundKey] : {};
  }, [customTemplates, title]);

  // Handler Terapkan Template Terpilih (Langsung buat baris dan buka modal detail isian)
  const handleApplyTemplate = (tpl) => {
    if (!onAddRow) return;
    setIsTemplateDropdownOpen(false);

    // Kloning template dan siapkan nilai atributnya
    const targetCat = tpl[categoryKey] || tpl.category || tpl.pillar || (currentCategoryFilter !== 'ALL' ? currentCategoryFilter : undefined);
    const baseNewRow = onAddRow(targetCat);

    // Merge template data ke dalam created row
    if (baseNewRow && typeof baseNewRow === 'object') {
      const mergedRow = {
        ...baseNewRow,
        ...tpl,
        id: baseNewRow.id || `ROW-${Date.now().toString().slice(-4)}`,
        [categoryKey]: targetCat || baseNewRow[categoryKey] || 'General'
      };

      // Pastikan properti title/objective terisi sesuai objek
      if (!mergedRow.title && (tpl.objective || tpl.name || tpl.period)) {
        mergedRow.title = tpl.objective || tpl.name || tpl.period;
      }

      // Update seluruh field yang dibawa template ke store
      if (onUpdateCell) {
        Object.entries(mergedRow).forEach(([fKey, fVal]) => {
          if (fKey !== 'isCustom' && fKey !== 'savedAt' && fVal !== undefined) {
            onUpdateCell(mergedRow.id, fKey, fVal);
          }
        });
      }

      // Otomatis buka kotak modal lebar isian data
      setTimeout(() => {
        handleOpenRowModal(mergedRow);
      }, 50);
    }
  };

  const handleExportExcel = () => {
    if (!sortedData || sortedData.length === 0) {
      alert('Tidak ada data tabel untuk diekspor ke Excel.');
      return;
    }
    const cleanFileName = exportFileName
      ? (exportFileName.endsWith('.xlsx') ? exportFileName : `${exportFileName.replace(/\.[^/.]+$/, '')}.xlsx`)
      : `${(title || 'Data_Export').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    exportTableAsExcel(sortedData, columns, {
      title: title || 'Laporan Data',
      fileName: cleanFileName
    });
  };

  // Handler Unduh Dokumen PDF Resmi untuk Satu Baris Data
  const handleExportRowPdf = (row) => {
    if (!row) return;
    exportRowAsPdf(row, columns, { title });
  };

  // Handler Unduh Seluruh Tabel Data sebagai Matriks PDF
  const handleExportTablePdf = () => {
    if (!sortedData || sortedData.length === 0) {
      alert('Tidak ada data tabel untuk diekspor ke PDF.');
      return;
    }
    exportTableAsPdf(sortedData, columns, { title: title || 'Laporan Data Operasional' });
  };

  // Helper untuk merender Menu Popover Dropdown Pilihan Template
  const renderTemplatePopover = (alignRight = true) => {
    if (!isTemplateDropdownOpen) return null;

    // Kumpulkan semua kategori yang ada template-nya (gabungan preset + custom)
    const allCatKeys = Array.from(new Set([
      ...Object.keys(modulePresetTemplates),
      ...Object.keys(moduleCustomTemplates)
    ]));

    // Prioritaskan kategori aktif bila sedang difilter
    const targetCats = (currentCategoryFilter && currentCategoryFilter !== 'ALL')
      ? [
          ...allCatKeys.filter(c => c.toLowerCase() === currentCategoryFilter.toLowerCase()),
          ...allCatKeys.filter(c => c.toLowerCase() !== currentCategoryFilter.toLowerCase())
        ]
      : allCatKeys;

    return (
      <div
        className="ws-template-popover ws-custom-scroll"
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          ...(alignRight ? { right: 0 } : { left: 0 }),
          width: '330px',
          maxWidth: '92vw',
          maxHeight: '440px',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          boxShadow: '0 15px 35px -5px rgba(15, 23, 42, 0.2), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
          zIndex: 200,
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {/* Header Popover & Info Kategori Aktif */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px 4px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#0284c7" />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pilih Template
            </span>
          </div>
          {currentCategoryFilter !== 'ALL' && (
            <span className="ws-notion-pill" style={{ backgroundColor: '#eff6ff', color: '#0284c7', fontSize: '0.68rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentCategoryFilter}
            </span>
          )}
        </div>

        {/* Filter Search Input */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={13} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder={currentCategoryFilter !== 'ALL' ? `Cari template (${currentCategoryFilter})...` : "Cari contoh template..."}
            value={templateSearchTerm}
            onChange={(e) => setTemplateSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px 6px 26px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.74rem',
              outline: 'none',
              backgroundColor: '#f8fafc'
            }}
          />
          {templateSearchTerm && (
            <button
              onClick={() => setTemplateSearchTerm('')}
              style={{ position: 'absolute', right: '6px', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* List Template Berdasarkan Kategori */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
          {(() => {
            let hasAnyMatch = false;

            const renderedCategories = targetCats.map((catName) => {
              const presets = modulePresetTemplates[catName] || [];
              const customs = moduleCustomTemplates[catName] || [];
              const combined = [...customs, ...presets];

              const filtered = combined.filter((tpl) => {
                if (!templateSearchTerm.trim()) return true;
                const q = templateSearchTerm.toLowerCase();
                const tTitle = (tpl.title || tpl.name || tpl.period || tpl.objective || '').toLowerCase();
                const tDesc = (tpl.description || tpl.notes || '').toLowerCase();
                return tTitle.includes(q) || tDesc.includes(q);
              });

              if (filtered.length === 0) return null;
              hasAnyMatch = true;

              const isExpanded = (expandedTemplateCategory === catName) || (Boolean(templateSearchTerm.trim()));

              return (
                <div key={catName} style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderRadius: '8px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                  <div 
                    onClick={() => setExpandedTemplateCategory(prev => prev === catName ? null : catName)}
                    className="ws-btn-transition"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: isExpanded ? '#0284c7' : '#334155',
                      padding: '7px 9px',
                      backgroundColor: isExpanded ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem' }}>📁</span>
                      <span>{catName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '0.64rem', color: isExpanded ? '#0284c7' : '#94a3b8', backgroundColor: isExpanded ? '#dbeafe' : '#e2e8f0', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                        {filtered.length} contoh
                      </span>
                      <ChevronDown 
                        size={12} 
                        color={isExpanded ? '#0284c7' : '#94a3b8'} 
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} 
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '5px 6px 7px 6px', backgroundColor: '#ffffff' }}>
                      {filtered.map((tpl, tIdx) => {
                        const tplTitle = tpl.title || tpl.name || tpl.period || tpl.objective || 'Template Tanpa Judul';
                        return (
                          <div
                            key={tpl.id || tIdx}
                            onClick={() => handleApplyTemplate(tpl)}
                            className="ws-btn-transition"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '3px',
                              padding: '7px 9px',
                              borderRadius: '6px',
                              border: '1px solid #f1f5f9',
                              backgroundColor: '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'left',
                              position: 'relative'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f0f9ff';
                              e.currentTarget.style.borderColor = '#bae6fd';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                              e.currentTarget.style.borderColor = '#f1f5f9';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                                {tpl.isCustom && <Bookmark size={11} color="#ea580c" style={{ marginRight: '4px', display: 'inline' }} />}
                                {tplTitle}
                              </span>
                              {tpl.isCustom ? (
                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#ea580c', backgroundColor: '#fff7ed', padding: '1px 5px', borderRadius: '4px' }}>
                                  Kustom
                                </span>
                              ) : (
                                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#0284c7', backgroundColor: '#eff6ff', padding: '1px 5px', borderRadius: '4px' }}>
                                  Preset
                                </span>
                              )}
                            </div>

                            {(tpl.description || tpl.notes || tpl.services) && (
                              <span style={{
                                fontSize: '0.7rem',
                                color: '#64748b',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {tpl.description || tpl.notes || (Array.isArray(tpl.services) ? tpl.services.join(', ') : '')}
                              </span>
                            )}

                            {/* Badges metadata template */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '0.66rem', color: '#94a3b8' }}>
                              {tpl.priority && (
                                <span style={{ fontWeight: 700, color: tpl.priority === 'P1' ? '#dc2626' : '#0284c7' }}>
                                  {tpl.priority}
                                </span>
                              )}
                              {tpl.assignee && (
                                <span>• PIC: {tpl.assignee}</span>
                              )}
                              {tpl.stage && (
                                <span>• Tahap: {tpl.stage}</span>
                              )}
                              {tpl.dealValue !== undefined && (
                                <span style={{ fontWeight: 700, color: '#0284c7' }}>
                                  • Rp {(tpl.dealValue || 0).toLocaleString('id-ID')}
                                </span>
                              )}
                              {tpl.amount !== undefined && (
                                <span style={{ fontWeight: 700, color: tpl.type === 'Pemasukan' ? '#16a34a' : '#dc2626' }}>
                                  • Rp {(tpl.amount || 0).toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            });

            if (!hasAnyMatch) {
              return (
                <div style={{ padding: '16px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.74rem' }}>
                  <p style={{ margin: '0 0 4px 0' }}>Tidak ada template yang cocok.</p>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    Buka baris data mana saja &amp; klik tombol <b>"Simpan sbg Template"</b> untuk menambah template baru.
                  </span>
                </div>
              );
            }

            return renderedCategories;
          })()}
        </div>

        {/* Petunjuk Bawah Popover */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', paddingLeft: '4px', paddingRight: '4px' }}>
          <span>💡 Klik untuk mengisi baris otomatis</span>
          <button
            type="button"
            onClick={() => handleTriggerAdd()}
            style={{
              border: 'none',
              background: 'none',
              color: '#0284c7',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.68rem'
            }}
          >
            + Baris Kosong
          </button>
        </div>
      </div>
    );
  };

  const wrapClass = isWrapEnabled ? 'ws-cell-wrap' : 'ws-cell-nowrap';

  // Helper untuk merender satu baris data (dipakai di mode biasa maupun di dalam accordion arsip)
  const renderRow = (row, idx) => {
    const isRowSelected = selectedRowIds.includes(row.id);
    return (
      <tr
        key={row.id || idx}
        style={{
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: isRowSelected ? '#f0f9ff' : (idx % 2 === 0 ? '#ffffff' : '#fcfcfd'),
          transition: 'background-color 100ms ease',
          position: activeMenuRowId === row.id ? 'relative' : 'static',
          zIndex: activeMenuRowId === row.id ? 40 : 'auto'
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

        {/* Kolom 1 Membeku: Tombol Buka & Tombol Aksi Titik 3 Kecil */}
        {enableStickyFreeze && (
          <td className="ws-sticky-col-1 ws-table-action-col" style={{
            padding: '4px 3px',
            width: '42px',
            minWidth: '42px',
            maxWidth: '42px',
            textAlign: 'center',
            backgroundColor: isRowSelected ? '#f0f9ff' : (idx % 2 === 0 ? '#ffffff' : '#fcfcfd'),
            borderRight: '1px solid #e2e8f0',
            left: isSelectModeActive ? '38px' : 0,
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
              {/* Tombol Icon Buka */}
              <button
                onClick={() => handleOpenRowModal(row)}
                title="Buka Detail Data"
                className="ws-table-open-btn ws-btn-transition"
                style={{
                  padding: '4px',
                  width: '26px',
                  height: '24px',
                  borderRadius: '6px',
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#eff6ff',
                  color: '#0284c7',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ExternalLink size={13} className="ws-open-icon" />
              </button>

              {/* Tombol Aksi Titik 3 Berukuran Kecil di Bawah Tombol Icon Buka */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeMenuRowId === row.id) {
                    setActiveMenuRowId(null);
                    setMenuPosition(null);
                  } else {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const menuHeight = 130;
                    let topPos = rect.top + rect.height / 2;

                    // Pastikan posisi popover tetap berada di dalam layar tanpa terpotong
                    if (topPos + menuHeight / 2 > window.innerHeight - 12) {
                      topPos = window.innerHeight - 12 - menuHeight / 2;
                    }
                    if (topPos - menuHeight / 2 < 12) {
                      topPos = 12 + menuHeight / 2;
                    }

                    setMenuPosition({
                      top: Math.round(topPos),
                      left: Math.round(rect.right + 6)
                    });
                    setActiveMenuRowId(row.id);
                  }
                }}
                title="Opsi Aksi Baris"
                className="ws-btn-transition"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '1px 3px',
                  height: '16px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <MoreHorizontal size={12} />
              </button>

              {/* Popover Menu Aksi Titik 3 via Portal (Lapisan mengambang penuh di atas tabel) */}
              {activeMenuRowId === row.id && menuPosition && createPortal(
                <div
                  ref={actionMenuRef}
                  className="ws-row-action-menu"
                  style={{
                    position: 'fixed',
                    ...(menuPosition.left !== undefined ? { left: `${menuPosition.left}px` } : { right: `${menuPosition.right}px` }),
                    top: `${menuPosition.top}px`,
                    transform: 'translateY(-50%)',
                    width: '145px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.16), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                    padding: '4px',
                    zIndex: 99999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  {/* Opsi Unduh PDF Paling Atas di Tab Menu Aksi */}
                  <button
                    onClick={() => {
                      setActiveMenuRowId(null);
                      setMenuPosition(null);
                      handleExportRowPdf(row);
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
                      color: '#0284c7',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FileText size={13} color="#0284c7" />
                    <span>Unduh PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenuRowId(null);
                      setMenuPosition(null);
                      handleOpenRowModal(row);
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
                    <Edit2 size={13} color="#64748b" />
                    <span>Edit Baris</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenuRowId(null);
                      setMenuPosition(null);
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
                </div>,
                document.body
              )}
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
                ...(isStickyTitle ? { left: isSelectModeActive ? '80px' : '42px' } : {})
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

      </tr>
    );
  };

  return (
    <div 
      className="ws-table-wrapper"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
        position: 'relative'
      }}
    >
      {/* Top Toolbar */}
      <div 
        className="ws-table-toolbar"
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Left Toolbar: View Selector Dropdown, Search, Icon Dropdown Kategori, & Tombol Tandai */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1, minWidth: '240px' }}>
          {/* Dropdown 1: Filter Status (Disesuaikan per modul) */}
          {onStatusFilterChange && (
            <div style={{ position: 'relative' }} ref={viewDropdownRef}>
              <button
                type="button"
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                className="ws-btn-transition"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 11px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                }}
                title="Pilih Status Data"
              >
                {activeStatusFilter === 'archive' || activeStatusFilter === 'Arsip' ? (
                  <Archive size={15} color="#0284c7" />
                ) : (
                  <CheckCircle2 size={15} color="#0284c7" />
                )}
                <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(() => {
                    const currentOption = resolvedStatusOptions.find(
                      (opt) => opt.value === activeStatusFilter || opt.label === activeStatusFilter
                    );
                    if (currentOption) return currentOption.label;
                    if (activeStatusFilter === 'all' || activeStatusFilter === 'ALL' || !activeStatusFilter || activeStatusFilter === 'Semua Status') {
                      return 'Semua Status';
                    }
                    if (activeStatusFilter === 'active') return 'Berjalan';
                    if (activeStatusFilter === 'completed') return 'Selesai';
                    if (activeStatusFilter === 'archive') return 'Arsip';
                    return String(activeStatusFilter);
                  })()}
                </span>
                <ChevronDown
                  size={13}
                  color="#64748b"
                  style={{
                    transform: isViewDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>

              {/* Popover Menu Status */}
              {isViewDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    zIndex: 100,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                    minWidth: '220px',
                    padding: '8px',
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#94a3b8',
                      padding: '4px 8px 6px 8px'
                    }}
                  >
                    Filter Status
                  </div>

                  {resolvedStatusOptions.map((opt) => {
                    const isSelected = activeStatusFilter === opt.value || activeStatusFilter === opt.label;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onStatusFilterChange(opt.value);
                          setIsViewDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isSelected ? '#f0f9ff' : 'transparent',
                          color: isSelected ? '#0284c7' : '#334155',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? 700 : 500,
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={14} color={isSelected ? '#0284c7' : '#94a3b8'} />
                          <span>{opt.label}</span>
                        </span>
                        {isSelected && <Check size={14} color="#0284c7" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Dropdown 2: Mode Tata Letak (Tabel View, Sprint Kanban, Kalender View) */}
          {availableViewModes.length > 0 && (
            <div style={{ position: 'relative' }} ref={layoutDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
                className="ws-btn-transition"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 11px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                }}
                title="Pilih Mode Tata Letak Tampilan"
              >
                {currentViewMode === 'kanban' ? (
                  <LayoutGrid size={15} color="#0284c7" />
                ) : currentViewMode === 'calendar' ? (
                  <CalendarDays size={15} color="#0284c7" />
                ) : (
                  <TableIcon size={15} color="#0284c7" />
                )}
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentViewMode === 'kanban'
                    ? 'Sprint Kanban'
                    : currentViewMode === 'calendar'
                    ? 'Kalender'
                    : 'Tabel View'}
                </span>
                <ChevronDown
                  size={13}
                  color="#64748b"
                  style={{
                    transform: isLayoutDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>

              {/* Popover Menu Mode Tata Letak */}
              {isLayoutDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    zIndex: 100,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
                    width: '190px',
                    padding: '8px',
                    animation: 'fadeIn 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#94a3b8',
                      padding: '4px 8px 6px 8px'
                    }}
                  >
                    Mode Tata Letak
                  </div>

                  {availableViewModes.includes('table') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onChangeViewMode) onChangeViewMode('table');
                        setIsLayoutDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: currentViewMode === 'table' ? '#eff6ff' : 'transparent',
                        color: currentViewMode === 'table' ? '#0284c7' : '#334155',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: currentViewMode === 'table' ? 700 : 500,
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TableIcon size={14} color={currentViewMode === 'table' ? '#0284c7' : '#64748b'} />
                        <span>Tabel View</span>
                      </span>
                      {currentViewMode === 'table' && <Check size={14} color="#0284c7" />}
                    </button>
                  )}

                  {availableViewModes.includes('kanban') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onChangeViewMode) onChangeViewMode('kanban');
                        setIsLayoutDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: currentViewMode === 'kanban' ? '#eff6ff' : 'transparent',
                        color: currentViewMode === 'kanban' ? '#0284c7' : '#334155',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: currentViewMode === 'kanban' ? 700 : 500,
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LayoutGrid size={14} color={currentViewMode === 'kanban' ? '#0284c7' : '#64748b'} />
                        <span>Sprint Kanban</span>
                      </span>
                      {currentViewMode === 'kanban' && <Check size={14} color="#0284c7" />}
                    </button>
                  )}

                  {availableViewModes.includes('calendar') && (
                    <button
                      type="button"
                      onClick={() => {
                        if (onChangeViewMode) onChangeViewMode('calendar');
                        setIsLayoutDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: currentViewMode === 'calendar' ? '#eff6ff' : 'transparent',
                        color: currentViewMode === 'calendar' ? '#0284c7' : '#334155',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: currentViewMode === 'calendar' ? 700 : 500,
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarDays size={14} color={currentViewMode === 'calendar' ? '#0284c7' : '#64748b'} />
                        <span>Kalender View</span>
                      </span>
                      {currentViewMode === 'calendar' && <Check size={14} color="#0284c7" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

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
                className="ws-cat-popover ws-custom-scroll"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  width: '220px',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                  padding: '6px',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  boxSizing: 'border-box'
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
              padding: '6px 8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: isSelectModeActive ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = isSelectModeActive ? '#0369a1' : '#0f172a'}
            onMouseLeave={(e) => e.currentTarget.style.color = isSelectModeActive ? '#0284c7' : '#64748b'}
          >
            {isSelectModeActive ? <CheckSquare size={15} color="#0284c7" /> : <Square size={15} color="#64748b" />}
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
                padding: '6px 8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#b91c1c'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#dc2626'}
            >
              <Trash2 size={14} color="#dc2626" />
              <span>Hapus ({selectedRowIds.length})</span>
            </button>
          )}

          {/* Mobile-Only Action Icons disamping tombol Tandai */}
          <div className="ws-mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

            <button
              onClick={handleExportExcel}
              className="ws-btn-transition"
              title="Export Data ke Excel (.xlsx)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <Download size={14} color="#ffffff" />
            </button>

            {onAddRow && (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={templateMobileRef}>
                <div style={{ display: 'inline-flex', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(2, 132, 199, 0.2)' }}>
                  <button
                    onClick={handleTriggerAdd}
                    className="ws-btn-transition"
                    title="Tambah Baru (Kosong)"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '30px',
                      height: '34px',
                      border: 'none',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                    className="ws-btn-transition"
                    title="Pilih Template Kategori"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '22px',
                      height: '34px',
                      border: 'none',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: isTemplateDropdownOpen ? '#0369a1' : '#0284c7',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    <ChevronDown size={12} style={{ transform: isTemplateDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />
                  </button>
                </div>
                {renderTemplatePopover(false)}
              </div>
            )}
          </div>
        </div>

        {/* Right Toolbar: Export & Add Row (Desktop Only) */}
        <div className="ws-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleExportExcel}
            className="ws-btn-transition"
            title="Export Data ke Excel (.xlsx)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(2, 132, 199, 0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0369a1'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
          >
            <Download size={14} color="#ffffff" />
            Export
          </button>

          {onAddRow && (
            <div style={{ position: 'relative', display: 'inline-flex' }} ref={templateDropdownRef}>
              <div 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'stretch',
                  borderRadius: '8px', 
                  backgroundColor: '#0284c7',
                  boxShadow: '0 1px 2px rgba(2, 132, 199, 0.25)',
                  overflow: 'hidden'
                }}
              >
                {/* Tombol Utama Tambah Baru */}
                <button
                  onClick={handleTriggerAdd}
                  className="ws-btn-transition"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.parentElement.style.backgroundColor = '#0369a1'}
                  onMouseLeave={(e) => e.currentTarget.parentElement.style.backgroundColor = '#0284c7'}
                >
                  <Plus size={14} />
                  Baru
                </button>

                {/* Tombol Panah Bawah Dropdown Template */}
                <button
                  onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                  className="ws-btn-transition"
                  title="Pilih Template Berdasarkan Kategori"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 9px',
                    border: 'none',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
                    backgroundColor: isTemplateDropdownOpen ? 'rgba(0,0,0,0.15)' : 'transparent',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.parentElement.style.backgroundColor = '#0369a1'}
                  onMouseLeave={(e) => e.currentTarget.parentElement.style.backgroundColor = '#0284c7'}
                >
                  <ChevronDown
                    size={13}
                    style={{
                      transform: isTemplateDropdownOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 150ms ease'
                    }}
                  />
                </button>
              </div>

              {/* Popover Menu Dropdown Pilihan Template */}
              {renderTemplatePopover(true)}
            </div>
          )}
        </div>
      </div>


      {/* Content Area: Custom View (Kanban / Calendar) atau Table Canvas dengan Sticky Columns */}
      {currentViewMode && currentViewMode !== 'table' && (renderCustomView || children) ? (
        <div style={{ padding: '18px' }}>
          {renderCustomView ? renderCustomView({ filteredData: sortedData, data: sortedData }) : children}
        </div>
      ) : (
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
                  <th className="ws-sticky-col-1 ws-table-action-th" style={{
                    padding: '10px 6px',
                    width: '42px',
                    minWidth: '42px',
                    maxWidth: '42px',
                    textAlign: 'center',
                    fontWeight: 700,
                    backgroundColor: '#f8fafc',
                    borderRight: '1px solid #e2e8f0',
                    left: isSelectModeActive ? '38px' : 0,
                    boxSizing: 'border-box'
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
                        ...(isStickyTitle ? { left: isSelectModeActive ? '80px' : '42px' } : {})
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
              </tr>
            </thead>

            <tbody>
              {/* Render Data: Mode Arsip (Accordion Bulan di Dalam Tabel) vs Mode Standar */}
              {lifecycleFilter === 'archive' && archiveGroupedData ? (
                // Tampilan Arsip: Grup per Bulan dengan Toggle Panah Bawah langsung di dalam tabel data
                Object.keys(archiveGroupedData).length === 0 || Object.values(archiveGroupedData).every(arr => arr.length === 0) ? (
                  <tr>
                    <td colSpan={columns.length + (enableStickyFreeze ? 1 : 0) + (isSelectModeActive ? 1 : 0)} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      Belum ada data arsip yang tercatat pada periode ini.
                    </td>
                  </tr>
                ) : (
                  Object.entries(archiveGroupedData).map(([monthName, monthRows]) => {
                    const isMonthExpanded = expandedArchiveMonths.includes(monthName);
                    const totalCols = columns.length + (enableStickyFreeze ? 1 : 0) + (isSelectModeActive ? 1 : 0);

                    return (
                      <React.Fragment key={monthName}>
                        {/* Baris Header Bulan dengan Toggle Panah ke Bawah */}
                        <tr
                          style={{
                            backgroundColor: isMonthExpanded ? '#f0f9ff' : '#f8fafc',
                            borderTop: '2px solid #bae6fd',
                            borderBottom: '1px solid #e2e8f0',
                            userSelect: 'none'
                          }}
                        >
                          <td
                            colSpan={totalCols}
                            onClick={() => toggleArchiveMonthInTable(monthName)}
                            className="ws-btn-transition"
                            style={{
                              padding: '10px 16px',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {/* Icon Panah Toggle Bawah / Kanan */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '6px',
                                    backgroundColor: isMonthExpanded ? '#0284c7' : '#e2e8f0',
                                    color: isMonthExpanded ? '#ffffff' : '#64748b',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  <ChevronDown
                                    size={15}
                                    style={{
                                      transform: isMonthExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                                      transition: 'transform 0.2s ease'
                                    }}
                                  />
                                </div>

                                {/* Label Bulan Arsip & Badge Jumlah */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Archive size={16} color="#0284c7" />
                                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                                    Arsip Periode {monthName}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      backgroundColor: isMonthExpanded ? '#e0f2fe' : '#e2e8f0',
                                      color: isMonthExpanded ? '#0369a1' : '#475569',
                                      padding: '2px 8px',
                                      borderRadius: '999px'
                                    }}
                                  >
                                    {monthRows.length} data arsip
                                  </span>
                                </div>
                              </div>

                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7' }}>
                                {isMonthExpanded ? 'Klik untuk ciutkan ▲' : 'Klik untuk buka arsip bulan ini ▼'}
                              </span>
                            </div>
                          </td>
                        </tr>

                        {/* Baris-baris Data Bulan Tersebut (Tampil jika Accordion Bulan Terbuka) */}
                        {isMonthExpanded && (
                          monthRows.length === 0 ? (
                            <tr>
                              <td colSpan={totalCols} style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', backgroundColor: '#f0f9ff', fontSize: '0.78rem' }}>
                                Tidak ada data pada arsip {monthName}.
                              </td>
                            </tr>
                          ) : (
                            monthRows.map((row, rIdx) => renderRow(row, rIdx))
                          )
                        )}
                      </React.Fragment>
                    );
                  })
                )
              ) : sortedData.length === 0 ? (
                // Mode Biasa: Kosong
                <tr>
                  <td colSpan={columns.length + (enableStickyFreeze ? 1 : 0) + (isSelectModeActive ? 1 : 0)} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                    Tidak ada data yang cocok dengan kriteria pencarian atau filter.
                  </td>
                </tr>
              ) : (
                // Mode Biasa: Render Baris Standar
                sortedData.map((row, idx) => renderRow(row, idx))
              )}
            </tbody>
          </table>
        </div>
      )}

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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Info size={13} color="#0284c7" />
          <span><strong>Tip:</strong> Klik tombol <strong>Buka</strong> atau menu <strong>••• &gt; Edit</strong> untuk membuka kotak modal lebar pengeditan penuh.</span>
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
        categories={computedCategories}
        onAddCategory={onAddCategory}
        onDeleteCategory={onDeleteCategory}
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
        title={title}
        categoryKey={categoryKey}
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
