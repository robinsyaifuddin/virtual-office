import React, { useState, useEffect } from 'react';
import Office3D from './Office3D';
import LoginPage from './pages/LoginPage';
import ManagementDashboard from './pages/ManagementDashboard';

function App() {
  // Routes: 'office3d' | 'login' | 'management'
  const [currentRoute, setCurrentRoute] = useState('office3d');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Deteksi path URL saat ini (misal dibuka langsung /manajemen)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('manajemen') || path.includes('admin')) {
      if (isAuthenticated) {
        setCurrentRoute('management');
      } else {
        setCurrentRoute('login');
      }
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentRoute('management');
    window.history.pushState({}, '', '/manajemen');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoute('office3d');
    window.history.pushState({}, '', '/');
  };

  const handleSwitchToManagement = () => {
    if (isAuthenticated) {
      setCurrentRoute('management');
      window.history.pushState({}, '', '/manajemen');
    } else {
      setCurrentRoute('login');
      window.history.pushState({}, '', '/manajemen');
    }
  };

  const handleSwitchTo3D = () => {
    setCurrentRoute('office3d');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="App" style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
      {/* Route 1: Denah 3D Interaktif */}
      {currentRoute === 'office3d' && (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
          <Office3D />
          
          {/* Tombol Akses Ruang Manajemen di Pojok Atas */}
          <button
            onClick={handleSwitchToManagement}
            className="btn-switch-management"
            style={{
              position: 'fixed',
              top: '12px',
              right: '12px',
              zIndex: 100,
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            🏢 <span className="btn-switch-text">Ruang Manajemen</span>
          </button>
        </div>
      )}

      {/* Route 2: Login Eksekutif */}
      {currentRoute === 'login' && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onCancel={handleSwitchTo3D}
        />
      )}

      {/* Route 3: Dashboard Manajemen Lengkap */}
      {currentRoute === 'management' && (
        <ManagementDashboard 
          onLogout={handleLogout}
          onSwitchTo3D={handleSwitchTo3D}
        />
      )}
    </div>
  );
}

export default App;

