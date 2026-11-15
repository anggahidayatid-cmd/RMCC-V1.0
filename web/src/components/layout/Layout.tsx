import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export interface LayoutProps {
  activeNav: string;
  onNavSelect: (navId: string) => void;
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activeNav,
  onNavSelect,
  selectedWorkspace,
  onWorkspaceChange,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background font-sans antialiased text-dark">
      {/* Sidebar Component */}
      <Sidebar
        activeNav={activeNav}
        onNavSelect={onNavSelect}
        selectedWorkspace={selectedWorkspace}
        onWorkspaceChange={onWorkspaceChange}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader
          activeNav={activeNav}
          selectedWorkspace={selectedWorkspace}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
