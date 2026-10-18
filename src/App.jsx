import React, { useState, useEffect } from 'react';
import Office3D from './Office3D';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import { useWorkspaceStore } from './store/workspaceStore';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  // Routes: 'office3d' | 'login' | 'dashboard'
  const [currentRoute, setCurrentRoute] = useState('office3d');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('digibooster_auth_session') === 'true';
    } catch {
      return false;
    }
  });
  const { setActiveModule, activeModule } = useWorkspaceStore();

  // Deteksi path URL saat ini (sinkron direct link browser)
  useEffect(() => {
    const path = window.location.pathname;
    
    // Cek apakah ada direct subpath dashboard, misal /dashboard/tugasdankalender
    const validModules = [
      'executivedashboard',
      'crmdanklien',
      'keuangandanprofit',
      'brandingdanmarketing',
      'tugasdankalender',
      'sasarandankpi',
      'rapatdancatatan',
      'laporandanevaluasi',
      'datadandarsip',
      'staffagent',
      'pengaturanworkspace'
    ];

    if (path.includes('dashboard') || path.includes('manajemen') || path.includes('admin')) {
      // Ekstrak nama submodul jika ada
      const matchedModule = validModules.find(m => path.toLowerCase().includes(m));
      if (matchedModule) {
        setActiveModule(matchedModule);
      }

      if (isAuthenticated) {
        setCurrentRoute('dashboard');
      } else {
        setCurrentRoute('login');
      }
    }
  }, [isAuthenticated, setActiveModule]);

  // Dengarkan pesan dari 3D Office iframe saat tombol manajemen diklik
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'OPEN_MANAGEMENT') {
        handleSwitchToDashboard();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    try {
      localStorage.setItem('digibooster_auth_session', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(true);
    setCurrentRoute('dashboard');
    const targetModule = activeModule && activeModule !== 'executivedashboard' ? activeModule : '';
    const currentSearch = window.location.search || '';
    window.history.pushState({}, '', targetModule ? `/dashboard/${targetModule}${currentSearch}` : `/dashboard${currentSearch}`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('digibooster_auth_session');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setCurrentRoute('office3d');
    window.history.pushState({}, '', '/');
  };

  const handleSwitchToDashboard = () => {
    if (isAuthenticated) {
      setCurrentRoute('dashboard');
      window.history.pushState({}, '', '/dashboard');
    } else {
      setCurrentRoute('login');
      window.history.pushState({}, '', '/dashboard');
    }
  };

  const handleSwitchTo3D = () => {
    setCurrentRoute('office3d');
    window.history.pushState({}, '', '/');
  };

  return (
    <ErrorBoundary title="Aplikasi DigiBooster Mengalami Kendala">
      <div className="App" style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
        {/* Route 1: Denah 3D Interaktif */}
        {currentRoute === 'office3d' && (
          <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            <Office3D onOpenDashboard={handleSwitchToDashboard} />
          </div>
        )}

        {/* Route 2: Login Eksekutif */}
        {currentRoute === 'login' && (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onCancel={handleSwitchTo3D}
          />
        )}

        {/* Route 3: Dashboard Manajemen Notion Lengkap (Modular) */}
        {currentRoute === 'dashboard' && (
          <DashboardLayout 
            onLogout={handleLogout}
            onSwitchTo3D={handleSwitchTo3D}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
