import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { RbacProvider } from './context/RbacContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginView from './components/auth/LoginView';
import Layout from './components/layout/Layout';
import DashboardView from './components/dashboard/DashboardView';
import CampaignsView from './components/campaigns/CampaignsView';
import PerformanceView from './components/features/PerformanceView';
import CrmView from './components/features/CrmView';
import CalendarView from './components/features/CalendarView';
import ReportsView from './components/features/ReportsView';
import SettingsView from './components/features/SettingsView';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeNav, setActiveNav] = useState<string>('overview');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('Gourmet Bistro');

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <Layout
      activeNav={activeNav}
      onNavSelect={(navId) => setActiveNav(navId)}
      selectedWorkspace={selectedWorkspace}
      onWorkspaceChange={(ws) => setSelectedWorkspace(ws)}
    >
      {activeNav === 'overview' && (
        <DashboardView
          selectedWorkspace={selectedWorkspace}
          onNavigateTab={(tabId) => setActiveNav(tabId)}
        />
      )}

      {activeNav === 'campaigns' && (
        <CampaignsView selectedWorkspace={selectedWorkspace} />
      )}

      {activeNav === 'performance' && (
        <PerformanceView />
      )}

      {activeNav === 'audience' && (
        <CrmView />
      )}

      {activeNav === 'calendar' && (
        <CalendarView />
      )}

      {activeNav === 'reports' && (
        <ReportsView />
      )}

      {activeNav === 'settings' && (
        <SettingsView />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RbacProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RbacProvider>
    </ThemeProvider>
  );
}
