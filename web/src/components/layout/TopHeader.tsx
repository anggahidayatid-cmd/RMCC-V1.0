import React, { useState } from 'react';
import {
  Bell,
  ChevronRight,
  Menu,
  Building2,
  User,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  LogOut
} from 'lucide-react';
import { NAV_ITEMS_BASE } from './Sidebar';
import { useTranslation } from '../../i18n';
import LanguageSelector from './LanguageSelector';
import { useRbac } from '../../context/RbacContext';
import { useAuth } from '../../context/AuthContext';

export interface TopHeaderProps {
  activeNav: string;
  selectedWorkspace: string;
  onToggleMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeNav,
  selectedWorkspace,
  onToggleMobileSidebar,
}) => {
  const { t } = useTranslation();
  const { userRole: rbacRole } = useRbac();
  const { currentUser, logout } = useAuth();
  const activeRole = currentUser?.role || rbacRole;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeNavItem = NAV_ITEMS_BASE.find((n) => n.id === activeNav) || NAV_ITEMS_BASE[0];
  const activeNavLabel = t(`nav.${activeNavItem.key}`);

  const notifications = [
    {
      id: 1,
      title: 'Campaign ROAS Alert',
      message: 'Live Music October exceeded target ROAS (5.81x).',
      time: '10m ago',
      type: 'success'
    },
    {
      id: 2,
      title: 'Budget Allocation Warning',
      message: 'Lunch Weekday performance is below target threshold.',
      time: '1h ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Monthly Goal Update',
      message: 'Attributed revenue reached 85% of monthly target.',
      time: '3h ago',
      type: 'info'
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border shadow-xs px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left side: Hamburger & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-dark/70 hover:text-dark hover:bg-background rounded-lg transition-colors"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-medium text-muted">
          <span className="hover:text-dark transition-colors">{t('nav.brandName')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-dark font-semibold">{activeNavLabel}</span>
        </nav>
      </div>

      {/* Right side: Workspace Pill, Language Selector, Notifications, Profile Avatar */}
      <div className="flex items-center space-x-3">
        {/* Active Workspace Pill */}
        <div className="hidden sm:flex items-center space-x-2 bg-background border border-border px-3 py-1.5 rounded-full text-xs font-medium text-dark">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span>{selectedWorkspace}</span>
        </div>

        {/* Language Selector Dropdown */}
        <LanguageSelector variant="dropdown" />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="p-2 rounded-xl text-slate-600 hover:text-dark hover:bg-background border border-transparent hover:border-border transition-all relative"
            aria-label={t('header.notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-surface">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-2xl shadow-xl z-50 py-2 animate-fadeIn">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                <h4 className="text-xs font-bold text-dark uppercase tracking-wider">{t('header.notifications')}</h4>
                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {t('header.newNotifications', { count: 3 })}
                </span>
              </div>
              <div className="divide-y divide-border/60 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-background transition-colors flex space-x-3">
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {n.type === 'info' && <TrendingUp className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-semibold text-dark truncate">{n.title}</span>
                        <span className="text-[10px] text-muted ml-2">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border text-center">
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  {t('header.markAllRead')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-semibold flex items-center justify-center text-xs ring-2 ring-primary/30">
              {currentUser?.avatar || 'AM'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-dark leading-tight">
                {currentUser?.name || 'Alex Morgan'}
              </div>
              <div className="text-[10px] text-muted leading-tight">
                {currentUser?.title || t(`settings.roles.${activeRole}`)}
              </div>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-2xl shadow-xl z-50 py-2 text-xs text-dark animate-fadeIn">
              <div className="px-4 py-3 border-b border-border">
                <div className="font-bold text-dark">{currentUser?.name || 'Alex Morgan'}</div>
                <div className="text-[11px] text-muted">{currentUser?.title || t(`settings.roles.${activeRole}`)}</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-background text-slate-700 dark:text-slate-300 flex items-center space-x-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-muted" />
                  <span>{t('header.profileSettings')}</span>
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-4 py-2 hover:bg-background text-slate-700 dark:text-slate-300 flex items-center space-x-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-muted" />
                  <span>{t('header.workspacePreferences')}</span>
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center space-x-2 font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
