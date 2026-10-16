import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Megaphone, 
  Calendar, 
  Target, 
  Mic, 
  FileBarChart, 
  FolderGit2, 
  UserCheck, 
  Settings, 
  LogOut, 
  Compass, 
  ChevronRight,
  Menu,
  ChevronDown
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import '../../styles/workspaceNotion.css';
import { Icon3DUser } from '../../components/ui/Modern3DIcons';

// Modules
import ExecutiveDashboard from './modules/ExecutiveDashboard';
import CrmKlien from './modules/CrmKlien';
import KeuanganProfit from './modules/KeuanganProfit';
import BrandingMarketing from './modules/BrandingMarketing';
import TugasKalender from './modules/TugasKalender';
import SasaranKpi from './modules/SasaranKpi';
import RapatCatatan from './modules/RapatCatatan';
import LaporanEvaluasi from './modules/LaporanEvaluasi';
import DataArsip from './modules/DataArsip';
import StaffAgent from './modules/StaffAgent';
import PengaturanWorkspace from './modules/PengaturanWorkspace';

export default function DashboardLayout({ onLogout, onSwitchTo3D }) {
  const { activeModule, setActiveModule, workspaceSettings } = useWorkspaceStore();
  
  // State: isSidebarCollapsed (true = hanya icon ~68px, false = penuh ~260px)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // State: Profile Dropdown Menu (kanan atas)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Deteksi ukuran layar mobile (< 768px)
  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(false);
      }
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Klik di luar dropdown profil untuk menutup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { key: 'executivedashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { key: 'crmdanklien', label: 'CRM & Klien', icon: Users },
    { key: 'keuangandanprofit', label: 'Keuangan & Profit', icon: DollarSign },
    { key: 'brandingdanmarketing', label: 'Branding & Marketing', icon: Megaphone },
    { key: 'tugasdankalender', label: 'Tugas & Kalender', icon: Calendar },
    { key: 'sasarandankpi', label: 'Sasaran & KPI', icon: Target },
    { key: 'rapatdancatatan', label: 'Rapat & Catatan', icon: Mic },
    { key: 'laporandanevaluasi', label: 'Laporan & Evaluasi', icon: FileBarChart },
    { key: 'datadandarsip', label: 'Data & Arsip', icon: FolderGit2 },
    { key: 'staffagent', label: 'Staff & AI Agents', icon: UserCheck },
    { key: 'pengaturanworkspace', label: 'Pengaturan', icon: Settings }
  ];

  const handleSelectMenu = (key) => {
    setActiveModule(key);
    window.history.pushState({}, '', `/dashboard/${key}`);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'executivedashboard':
        return <ExecutiveDashboard onNavigateModule={handleSelectMenu} />;
      case 'crmdanklien':
        return <CrmKlien />;
      case 'keuangandanprofit':
        return <KeuanganProfit />;
      case 'brandingdanmarketing':
        return <BrandingMarketing />;
      case 'tugasdankalender':
        return <TugasKalender />;
      case 'sasarandankpi':
        return <SasaranKpi />;
      case 'rapatdancatatan':
        return <RapatCatatan />;
      case 'laporandanevaluasi':
        return <LaporanEvaluasi />;
      case 'datadandarsip':
        return <DataArsip />;
      case 'staffagent':
        return <StaffAgent />;
      case 'pengaturanworkspace':
        return <PengaturanWorkspace />;
      default:
        return <ExecutiveDashboard onNavigateModule={handleSelectMenu} />;
    }
  };

  const currentMenu = menuItems.find(m => m.key === activeModule) || menuItems[0];

  // Hitung lebar sidebar
  const sidebarWidth = isMobile ? '270px' : (isSidebarCollapsed ? '68px' : '260px');

  return (
    <div className="ws-root" style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobile && mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 90
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className="ws-custom-scroll ws-sidebar-smooth"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          padding: isSidebarCollapsed && !isMobile ? '16px 8px' : '16px 14px',
          flexShrink: 0,
          height: '100vh',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 100,
          ...(isMobile ? {
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: mobileDrawerOpen ? '4px 0 24px rgba(15, 23, 42, 0.15)' : 'none'
          } : {
            position: 'relative'
          })
        }}
      >
        {/* Sidebar Header: Logo (saat buka) + Tombol Toggle Transparan Tanpa Background */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarCollapsed && !isMobile ? 'center' : 'space-between',
          padding: isSidebarCollapsed && !isMobile ? '0 0 14px 0' : '0 4px 14px 4px',
          borderBottom: '1px solid #f1f5f9',
          minHeight: '40px',
          overflow: 'hidden'
        }}>
          {(!isSidebarCollapsed || isMobile) && (
            <div style={{
              opacity: isSidebarCollapsed && !isMobile ? 0 : 1,
              transition: 'opacity 180ms ease',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img 
                src="/logo.webp" 
                alt="Logo" 
                style={{ maxHeight: '28px', maxWidth: '135px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/favicon.svg';
                }}
              />
            </div>
          )}

          {/* Tombol Toggle Bersih Murni Tanpa Background & Border */}
          <button
            onClick={handleToggleSidebar}
            title={isSidebarCollapsed ? "Buka Sidebar Penuh" : "Tutup Sidebar (Hanya Ikon)"}
            className="ws-btn-transition"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: '#475569',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div style={{ marginTop: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleSelectMenu(item.key)}
                title={isSidebarCollapsed && !isMobile ? item.label : undefined}
                className="ws-btn-transition"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  minHeight: '40px',
                  padding: isSidebarCollapsed && !isMobile ? '8px 15px' : '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isActive ? '#bfdbfe' : 'transparent',
                  backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                  color: isActive ? '#0284c7' : '#334155',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ minWidth: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={isActive ? '#0284c7' : '#64748b'} style={{ flexShrink: 0 }} />
                </div>
                
                {(!isSidebarCollapsed || isMobile) && (
                  <span 
                    className="ws-label-fade"
                    style={{
                      flex: 1,
                      opacity: isSidebarCollapsed && !isMobile ? 0 : 1,
                      transform: isSidebarCollapsed && !isMobile ? 'translateX(-6px)' : 'translateX(0)'
                    }}
                  >
                    {item.label}
                  </span>
                )}

                {(!isSidebarCollapsed || isMobile) && isActive && (
                  <ChevronRight size={14} color="#0284c7" style={{ flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: '60px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: '12px'
        }}>
          {/* Left: Mobile Toggle (hanya saat layar hp) & Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button
                onClick={handleToggleSidebar}
                className="ws-btn-transition"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <Menu size={18} />
              </button>
            )}

            <div className="ws-mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Workspace</span>
              <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>/</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>{currentMenu.label}</span>
            </div>
          </div>

          {/* Right: Profile Dropdown with 3D User Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Profile Avatar with Interactive Dropdown Menu */}
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="ws-btn-transition"
                title="Menu Profil & Sesi"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '10px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon3DUser size={20} />
                </div>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div 
                  className="ws-drawer-animate"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)',
                    padding: '6px',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>DigiBooster Studio</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Direksi / Eksekutif</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSwitchTo3D();
                    }}
                    className="ws-btn-transition"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#334155',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Compass size={16} color="#0284c7" />
                    <span>Denah Kantor 3D</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="ws-btn-transition"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#dc2626',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} color="#dc2626" />
                    <span>Keluar Sesi</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Canvas for Modules */}
        <main className="ws-custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {renderActiveModule()}
          </div>
        </main>
      </div>
    </div>
  );
}
