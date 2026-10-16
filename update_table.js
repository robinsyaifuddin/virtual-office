const fs = require('fs');
const file = 'src/pages/dashboard/components/NotionTable.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add viewDropdown state and outside click
const stateMarker = '  const catDropdownRef = useRef(null);';
const newState = `  const catDropdownRef = useRef(null);

  // Dropdown Popover View Selector (Sebelah kiri kotak pencarian)
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isArchiveAccordionOpen, setIsArchiveAccordionOpen] = useState(false);
  const viewDropdownRef = useRef(null);`;

if (!content.includes('isViewDropdownOpen')) {
  content = content.replace(stateMarker, newState);
}

// Update outside click
const outsideMarker = `if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }`;
const newOutside = `if (catDropdownRef.current && !catDropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target)) {
        setIsViewDropdownOpen(false);
      }`;

if (!content.includes('viewDropdownRef.current.contains')) {
  content = content.replace(outsideMarker, newOutside);
}

// 2. Add View Selector Button & Popover before the Search Box
const searchMarker = `{/* Search Box */}`;
const viewDropdownMarkup = `{/* 0. Dropdown View Selector (Tabel, Kanban, Kalender, Aktif, Semua, Arsip) */}
          {(availableViewModes.length > 0 || onChangeLifecycleFilter) && (
            <div style={{ position: 'relative' }} ref={viewDropdownRef}>
              <button
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                title="Pilih Tampilan dan Periode Data"
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
                  fontWeight: 600
                }}
              >
                {currentViewMode === 'kanban' ? (
                  <LayoutGrid size={15} color="#0284c7" />
                ) : currentViewMode === 'calendar' ? (
                  <CalendarDays size={15} color="#0284c7" />
                ) : (
                  <TableIcon size={15} color="#0284c7" />
                )}
                <span>
                  {lifecycleFilter === 'active' ? 'Aktif' : lifecycleFilter === 'archive' ? (archiveMonth ? \`Arsip (\${archiveMonth})\` : 'Arsip') : 'Semua'}
                </span>
                <ChevronDown size={13} color="#94a3b8" />
              </button>

              {/* Popover Dropdown View & Status Periode */}
              {isViewDropdownOpen && (
                <div 
                  className="ws-cat-popover ws-custom-scroll"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: '240px',
                    maxHeight: '340px',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.14)',
                    padding: '6px',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Bagian 1: Status Periode (Aktif / Semua Bulan Ini / Arsip) */}
                  {onChangeLifecycleFilter && (
                    <>
                      <div style={{ padding: '6px 8px', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                        Filter Periode & Status
                      </div>

                      <button
                        onClick={() => {
                          onChangeLifecycleFilter('active');
                          setIsViewDropdownOpen(false);
                        }}
                        className="ws-btn-transition"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: lifecycleFilter === 'active' ? '#eff6ff' : 'transparent',
                          color: lifecycleFilter === 'active' ? '#0284c7' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: lifecycleFilter === 'active' ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Zap size={14} color={lifecycleFilter === 'active' ? '#0284c7' : '#64748b'} />
                          <span>Aktif (Sedang Berjalan)</span>
                        </div>
                        {lifecycleFilter === 'active' && <Check size={14} color="#0284c7" />}
                      </button>

                      <button
                        onClick={() => {
                          onChangeLifecycleFilter('all');
                          setIsViewDropdownOpen(false);
                        }}
                        className="ws-btn-transition"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: lifecycleFilter === 'all' ? '#eff6ff' : 'transparent',
                          color: lifecycleFilter === 'all' ? '#0284c7' : '#334155',
                          fontSize: '0.8rem',
                          fontWeight: lifecycleFilter === 'all' ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={14} color={lifecycleFilter === 'all' ? '#0284c7' : '#64748b'} />
                          <span>Semua Bulan Ini</span>
                        </div>
                        {lifecycleFilter === 'all' && <Check size={14} color="#0284c7" />}
                      </button>

                      {/* Item Arsip dengan Accordion Toggle Panah ke Bawah */}
                      <div>
                        <div
                          onClick={() => {
                            setIsArchiveAccordionOpen(!isArchiveAccordionOpen);
                            if (lifecycleFilter !== 'archive') {
                              onChangeLifecycleFilter('archive');
                            }
                          }}
                          className="ws-btn-transition"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            backgroundColor: lifecycleFilter === 'archive' ? '#eff6ff' : 'transparent',
                            color: lifecycleFilter === 'archive' ? '#0284c7' : '#334155',
                            fontSize: '0.8rem',
                            fontWeight: lifecycleFilter === 'archive' ? 700 : 500,
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Archive size={14} color={lifecycleFilter === 'archive' ? '#0284c7' : '#64748b'} />
                            <span>Arsip (Bulan Lalu)</span>
                          </div>
                          <ChevronDown 
                            size={14} 
                            style={{ 
                              transform: isArchiveAccordionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 200ms ease'
                            }} 
                          />
                        </div>

                        {/* Sub-menu Pilihan Bulan yang Telah Lewat */}
                        {isArchiveAccordionOpen && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '22px', marginTop: '2px', borderLeft: '2px solid #e2e8f0', marginLeft: '12px' }}>
                            {(availableArchiveMonths.length > 0 ? availableArchiveMonths : ['September 2026', 'Agustus 2026', 'Juli 2026']).map((m) => (
                              <button
                                key={m}
                                onClick={() => {
                                  onChangeLifecycleFilter('archive');
                                  if (onChangeArchiveMonth) onChangeArchiveMonth(m);
                                  setIsViewDropdownOpen(false);
                                }}
                                className="ws-btn-transition"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '5px 8px',
                                  borderRadius: '5px',
                                  border: 'none',
                                  backgroundColor: archiveMonth === m ? '#e0f2fe' : 'transparent',
                                  color: archiveMonth === m ? '#0284c7' : '#475569',
                                  fontSize: '0.75rem',
                                  fontWeight: archiveMonth === m ? 700 : 500,
                                  cursor: 'pointer',
                                  textAlign: 'left'
                                }}
                              >
                                <span>{m}</span>
                                {archiveMonth === m && <Check size={12} color="#0284c7" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Bagian 2: Mode Layout (Tabel / Kanban / Kalender) jika ada */}
                  {availableViewModes.length > 0 && onChangeViewMode && (
                    <>
                      <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '4px', paddingLeft: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                        Mode Tampilan
                      </div>

                      {availableViewModes.includes('table') && (
                        <button
                          onClick={() => {
                            onChangeViewMode('table');
                            setIsViewDropdownOpen(false);
                          }}
                          className="ws-btn-transition"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: currentViewMode === 'table' ? '#eff6ff' : 'transparent',
                            color: currentViewMode === 'table' ? '#0284c7' : '#334155',
                            fontSize: '0.8rem',
                            fontWeight: currentViewMode === 'table' ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <TableIcon size={14} color="#0284c7" />
                            <span>Tabel View</span>
                          </div>
                          {currentViewMode === 'table' && <Check size={14} color="#0284c7" />}
                        </button>
                      )}

                      {availableViewModes.includes('kanban') && (
                        <button
                          onClick={() => {
                            onChangeViewMode('kanban');
                            setIsViewDropdownOpen(false);
                          }}
                          className="ws-btn-transition"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: currentViewMode === 'kanban' ? '#eff6ff' : 'transparent',
                            color: currentViewMode === 'kanban' ? '#0284c7' : '#334155',
                            fontSize: '0.8rem',
                            fontWeight: currentViewMode === 'kanban' ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LayoutGrid size={14} color="#0284c7" />
                            <span>Sprint Kanban</span>
                          </div>
                          {currentViewMode === 'kanban' && <Check size={14} color="#0284c7" />}
                        </button>
                      )}

                      {availableViewModes.includes('calendar') && (
                        <button
                          onClick={() => {
                            onChangeViewMode('calendar');
                            setIsViewDropdownOpen(false);
                          }}
                          className="ws-btn-transition"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: currentViewMode === 'calendar' ? '#eff6ff' : 'transparent',
                            color: currentViewMode === 'calendar' ? '#0284c7' : '#334155',
                            fontSize: '0.8rem',
                            fontWeight: currentViewMode === 'calendar' ? 700 : 500,
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CalendarDays size={14} color="#0284c7" />
                            <span>Kalender View</span>
                          </div>
                          {currentViewMode === 'calendar' && <Check size={14} color="#0284c7" />}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          ` + searchMarker;

if (!content.includes('availableViewModes.length > 0')) {
  content = content.replace(searchMarker, viewDropdownMarkup);
}

fs.writeFileSync(file, content, 'utf8');
console.log('NotionTable updated with dropdown view successfully');
