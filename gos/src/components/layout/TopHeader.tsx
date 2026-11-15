import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, Sun, Moon, MapPin, UserCheck } from 'lucide-react';

interface TopHeaderProps {
  outletName: string;
  activeStaff: string;
  onRefresh: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ outletName, activeStaff, onRefresh }) => {
  const [isDark, setIsDark] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          <span>{outletName}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-border/40 text-muted text-xs font-medium">
          <UserCheck className="w-3.5 h-3.5 text-primary" />
          <span>GRO: {activeStaff}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-border/20 rounded-lg text-xs font-mono text-muted">
          <span>{currentTime.toLocaleDateString()}</span>
          <span className="font-bold text-dark">{currentTime.toLocaleTimeString()}</span>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 rounded-xl border border-border hover:bg-border/40 transition text-muted hover:text-dark flex items-center gap-1.5 text-xs font-medium"
          title="Sync with RMCC"
        >
          <RefreshCw className="w-4 h-4 text-primary animate-spin-slow" />
          <span className="hidden sm:inline">Sync RMCC</span>
        </button>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden md:inline">V1.1 Secure</span>
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-border hover:bg-border/40 transition text-muted hover:text-dark"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>
      </div>
    </header>
  );
};
