import React, { useState } from 'react';
import {
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  Sparkles,
  Building2,
  X,
  Check,
  User
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useRbac } from '../../context/RbacContext';

export interface SidebarProps {
  activeNav: string;
  onNavSelect: (navId: string) => void;
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const WORKSPACES = [
  { id: 'ws-1', name: 'Gourmet Bistro', location: 'Jakarta Pusat', type: 'Casual Dining' },
  { id: 'ws-2', name: 'YourName Cafe & Resto', location: 'South Jakarta', type: 'Cafe & Dining' },
  { id: 'ws-3', name: 'Urban Eats', location: 'Bandung', type: 'Fast Casual' }
];

export const NAV_ITEMS_BASE = [
  { id: 'overview', key: 'overview', icon: LayoutDashboard },
  { id: 'campaigns', key: 'campaigns', icon: Megaphone },
  { id: 'performance', key: 'performance', icon: TrendingUp },
  { id: 'audience', key: 'audience', icon: Users },
  { id: 'calendar', key: 'calendar', icon: Calendar },
  { id: 'reports', key: 'reports', icon: FileText },
  { id: 'settings', key: 'settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onNavSelect,
  selectedWorkspace,
  onWorkspaceChange,
  mobileOpen = false,
  onCloseMobile
}) => {
  const { t } = useTranslation();
  const { userRole } = useRbac();
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);

  const currentWorkspaceObj = WORKSPACES.find((w) => w.name === selectedWorkspace) || WORKSPACES[0];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 w-72 bg-white dark:bg-[#1A1D29] text-dark dark:text-[#F8FAFC] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-border dark:border-[#2D3248] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-4 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border dark:border-[#2D3248]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-light flex items-center justify-center font-bold text-white shadow-md text-lg tracking-wider">
                {t('nav.brandName')}
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-dark dark:text-white">{t('nav.brandName')}</h1>
                <p className="text-[11px] text-muted dark:text-slate-400 leading-none mt-0.5">{t('nav.brandSubtitle')}</p>
              </div>
            </div>
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden text-muted hover:text-dark dark:hover:text-white p-1 rounded-lg hover:bg-background dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Workspace Switcher Selector */}
          <div className="relative">
            <label className="text-[10px] font-semibold text-muted dark:text-slate-400 uppercase tracking-wider mb-1.5 block px-1">
              {t('nav.activeWorkspace')}
            </label>
            <button
              onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
              className="w-full bg-background dark:bg-[#25283A] hover:bg-background/80 dark:hover:bg-[#2A2E43] border border-border dark:border-[#2D3248] rounded-xl p-3 flex items-center justify-between text-left transition-colors group"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-dark dark:text-white truncate">{currentWorkspaceObj.name}</div>
                  <div className="text-[10px] text-muted dark:text-slate-400 truncate">{currentWorkspaceObj.location}</div>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted dark:text-slate-400 group-hover:text-dark dark:group-hover:text-white transition-transform ${
                  workspaceDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Workspace Dropdown Menu */}
            {workspaceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface dark:bg-[#1A1D29] border border-border dark:border-[#2D3248] rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-fadeIn">
                <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-muted dark:text-slate-400 border-b border-border dark:border-[#2D3248]">
                  {t('nav.switchRestaurant')}
                </div>
                {WORKSPACES.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onWorkspaceChange(ws.name);
                      setWorkspaceDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-background dark:hover:bg-slate-800 text-xs transition-colors ${
                      ws.name === selectedWorkspace ? 'text-primary bg-primary/10 font-semibold' : 'text-dark dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div>{ws.name}</div>
                      <div className="text-[10px] text-muted dark:text-slate-400 font-normal">{ws.location} • {ws.type}</div>
                    </div>
                    {ws.name === selectedWorkspace && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-semibold text-muted dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
              {t('nav.navigation')}
            </div>
            {NAV_ITEMS_BASE.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              const label = t(`nav.${item.key}`);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavSelect(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20 font-semibold'
                      : 'text-dark/80 dark:text-slate-300 hover:bg-background dark:hover:bg-slate-800 hover:text-dark dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted dark:text-slate-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Contextual Insight Card */}
          <div className="mt-auto pt-4">
            <div className="bg-background dark:bg-[#25283A] border border-border dark:border-[#2D3248] rounded-xl p-3.5 space-y-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl -mr-4 -mt-4" />
              <div className="flex items-center space-x-2 text-amber-500 dark:text-amber-400">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold text-dark dark:text-white">{t('nav.aiInsightTitle')}</span>
              </div>
              <p className="text-[11px] text-muted dark:text-slate-300 leading-relaxed">
                {t('nav.aiInsightText', { roas: '5.81x' })}
              </p>
              <button
                onClick={() => onNavSelect('campaigns')}
                className="text-[11px] font-medium text-primary hover:text-primary-light transition-colors inline-flex items-center space-x-1"
              >
                <span>{t('nav.viewCampaign')}</span>
              </button>
            </div>
          </div>

          {/* User Profile Badge */}
          <div className="pt-2 border-t border-border dark:border-[#2D3248]">
            <div className="flex items-center space-x-3 p-2 rounded-xl bg-background dark:bg-[#25283A] border border-border dark:border-[#2D3248]">
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-dark dark:text-white font-bold text-xs ring-2 ring-primary/40">
                <User className="w-5 h-5 text-muted dark:text-slate-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-dark dark:text-white truncate">Alex Morgan</div>
                <div className="text-[10px] text-muted dark:text-slate-400 truncate">{t(`settings.roles.${userRole}`)}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
