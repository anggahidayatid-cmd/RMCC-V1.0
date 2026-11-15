import React from 'react';
import { CalendarDays, Users, BookOpen, FileText, Menu } from 'lucide-react';

interface NavbarProps {
  activeTab: 'today' | 'reservations' | 'guests' | 'closing' | 'more';
  setActiveTab: (tab: 'today' | 'reservations' | 'guests' | 'closing' | 'more') => void;
  reservationsCount: number;
  guestsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  reservationsCount,
  guestsCount,
}) => {
  const navItems = [
    { id: 'today', label: 'TODAY', icon: BookOpen },
    { id: 'reservations', label: 'RESERVATIONS', icon: CalendarDays, badge: reservationsCount },
    { id: 'guests', label: 'GUESTS', icon: Users, badge: guestsCount },
    { id: 'closing', label: 'CLOSING', icon: FileText },
    { id: 'more', label: 'MORE', icon: Menu },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border shrink-0 p-4">
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-border">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shadow-sm">
            🍽️
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight">GOS V1.1</h1>
            <p className="text-xs text-muted">Guest Operations System</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 min-h-[48px] ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/25 font-semibold'
                    : 'text-muted hover:text-dark hover:bg-border/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 bg-border/30 rounded-2xl border border-border/50 text-xs space-y-1 mt-auto">
          <div className="flex items-center justify-between text-muted">
            <span>RMCC Sync</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Connected
            </span>
          </div>
          <p className="text-[11px] text-muted truncate">Shared DB: rmcc_gos_*</p>
        </div>
      </aside>

      {/* Mobile / Tablet Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[56px] min-h-[48px] relative ${
                isActive ? 'text-primary font-bold' : 'text-muted hover:text-dark'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary stroke-[2.5]' : 'text-muted'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
