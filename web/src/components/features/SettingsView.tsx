import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  ShieldCheck,
  Share2,
  Check,
  RefreshCw,
  Save,
  CheckCircle2,
  Globe,
  Moon,
  Sun,
  Radio,
  Lock,
  Key
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import LanguageSelector from '../layout/LanguageSelector';
import { useTheme } from '../../context/ThemeContext';
import { useRbac, ALL_ROLES, ALL_PERMISSIONS } from '../../context/RbacContext';
import { ApiConfigModal, IntegrationConfig } from './ApiConfigModal';

const LOCAL_STORAGE_KEY = 'rmcc_api_integrations';

const defaultIntegrations: IntegrationConfig[] = [
  {
    id: 'meta',
    name: 'Meta Ads (Facebook & Instagram API)',
    channel: 'Instagram / Meta',
    status: 'Connected',
    accountId: 'act_8492049120',
    lastSynced: '5 mins ago',
    enabled: true,
    accessToken: 'rmcc_meta_sec_98419284',
    webhookUrl: 'https://api.rmcc.commandcenter.io/v1/webhook/meta',
    autoSyncFrequency: 'realtime',
  },
  {
    id: 'google',
    name: 'Google Ads API',
    channel: 'Google Search & Maps',
    status: 'Connected',
    accountId: '839-204-1928',
    lastSynced: '12 mins ago',
    enabled: true,
    accessToken: 'rmcc_google_sec_38291028',
    webhookUrl: 'https://api.rmcc.commandcenter.io/v1/webhook/google',
    autoSyncFrequency: 'realtime',
  },
  {
    id: 'pos',
    name: 'POS Integration (StoreHub / Moka / ESB)',
    channel: 'Point of Sale Sync',
    status: 'Connected',
    accountId: 'STORE-JKT-001',
    lastSynced: '1 min ago',
    enabled: true,
    accessToken: 'rmcc_pos_sec_19283948',
    webhookUrl: 'https://api.rmcc.commandcenter.io/v1/webhook/pos',
    autoSyncFrequency: '15mins',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API (WATI)',
    channel: 'WhatsApp CRM',
    status: 'Connected',
    accountId: '+62 812-3456-7890',
    lastSynced: 'Just now',
    enabled: true,
    accessToken: 'rmcc_wati_sec_84920491',
    webhookUrl: 'https://api.rmcc.commandcenter.io/v1/webhook/whatsapp',
    autoSyncFrequency: 'realtime',
  },
  {
    id: 'gos',
    name: 'GOS App System',
    channel: 'Floor & Table Management',
    status: 'Connected',
    accountId: 'GOS-JKT-HQ',
    lastSynced: '2 mins ago',
    enabled: true,
    accessToken: 'rmcc_gos_sec_58492049',
    webhookUrl: 'https://api.rmcc.commandcenter.io/v1/webhook/gos',
    autoSyncFrequency: 'realtime',
  }
];

export const SettingsView: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { rolePermissions, togglePermission, hasPermission, userRole } = useRbac();
  const [activeTab, setActiveTab] = useState<'workspace' | 'rbac' | 'integrations'>('workspace');

  const canManageWorkspace = hasPermission('workspace_settings');

  // Workspace form state
  const [workspaceName, setWorkspaceName] = useState('Gourmet Bistro Cafe & Resto');
  const [location, setLocation] = useState('Jakarta Pusat, Indonesia');
  const [category, setCategory] = useState('Casual Dining & Resto');
  const [currency, setCurrency] = useState('Rp');
  const [timezone, setTimezone] = useState('Asia/Jakarta');
  const [roasBenchmark, setRoasBenchmark] = useState(4.5);
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState(30000000);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Integrations state with localStorage persistence
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load integrations from localStorage', e);
    }
    return defaultIntegrations;
  });

  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [selectedIntegrationForConfig, setSelectedIntegrationForConfig] = useState<IntegrationConfig | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(integrations));
    } catch (e) {
      console.error('Failed to save integrations to localStorage', e);
    }
  }, [integrations]);

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageWorkspace) return;
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleIntegration = (id: string) => {
    if (!canManageWorkspace) return;
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextEnabled = item.enabled === false ? true : false;
          return {
            ...item,
            enabled: nextEnabled,
            status: nextEnabled ? 'Connected' : 'Disconnected',
          };
        }
        return item;
      })
    );
  };

  const handleSyncIntegration = async (id: string) => {
    if (!canManageWorkspace) return;
    const target = integrations.find((i) => i.id === id);
    if (!target || target.enabled === false) return;

    setSyncingId(id);
    await new Promise((r) => setTimeout(r, 1200));
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, lastSynced: 'Just now' } : item))
    );
    setSyncingId(null);

    const translated = t('settings.apiSyncCompleted', { name: target.name });
    const msg = translated !== 'settings.apiSyncCompleted' ? translated : `API Sync Completed for ${target.name}`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveIntegrationConfig = (updated: IntegrationConfig) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
    const translated = t('settings.configSavedSuccess', { name: updated.name });
    const msg = translated !== 'settings.configSavedSuccess' ? translated : `API configuration saved successfully for ${updated.name}`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-dark">{t('settings.title')}</h1>
          </div>
          <p className="text-xs text-muted mt-1 max-w-xl">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-1 bg-background p-1.5 rounded-xl border border-border self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'workspace' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
            }`}
          >
            {t('settings.tabWorkspace')}
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'rbac' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
            }`}
          >
            {t('settings.tabRbac')}
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'integrations' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
            }`}
          >
            {t('settings.tabIntegrations')}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t('settings.saveSuccess')}</span>
        </div>
      )}

      {toastMessage && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-2xl text-primary text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TAB 1: WORKSPACE CONFIGURATION & DARK MODE & LANGUAGE */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {!canManageWorkspace && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Read-only Mode: Your current role ({t(`settings.roles.${userRole}`)}) lacks 'Manage Workspace & Integrations' permission to modify workspace settings.</span>
            </div>
          )}

          {/* Appearance & Dark Mode Toggle Switch (STRICTLY & EXCLUSIVELY INSIDE SETTINGSVIEW) */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              <div>
                <h2 className="text-base font-bold text-dark">{t('settings.darkModeTitle')}</h2>
                <p className="text-xs text-muted">{t('settings.darkModeSubtitle')}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-amber-100 text-amber-700'}`}>
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-dark">{t('settings.darkModeLabel')}</div>
                  <div className="text-[11px] text-muted">
                    {theme === 'dark' ? t('settings.darkModeActive') : t('settings.lightModeActive')}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Toggle Dark Mode"
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  theme === 'dark' ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Real-Time Sync Status Banner */}
          <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-dark">{t('settings.syncStatus')}</div>
                <div className="text-[11px] text-muted">BroadcastChannel & localStorage active across tabs and components.</div>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Connected
            </span>
          </div>

          {/* Language Selector Section */}
          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-border pb-3">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-base font-bold text-dark">{t('settings.languageLabel')}</h2>
                <p className="text-xs text-muted">{t('settings.languageDesc')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector variant="buttons" />
            </div>
          </div>

          {/* Workspace Settings Form */}
          <form onSubmit={handleSaveWorkspace} className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-border pb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-dark">{t('settings.workspaceConfig')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-dark mb-1">{t('settings.restaurantName')}</label>
                <input
                  type="text"
                  required
                  disabled={!canManageWorkspace}
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark mb-1">{t('settings.location')}</label>
                <input
                  type="text"
                  disabled={!canManageWorkspace}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark mb-1">{t('settings.category')}</label>
                <select
                  disabled={!canManageWorkspace}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary cursor-pointer disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800"
                >
                  <option value="Casual Dining & Resto" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Casual Dining & Resto</option>
                  <option value="Fine Dining" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Fine Dining</option>
                  <option value="Cafe & Bistro" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Cafe & Bistro</option>
                  <option value="Fast Casual" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Fast Casual</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-dark mb-1">{t('settings.currency')}</label>
                <input
                  type="text"
                  disabled={!canManageWorkspace}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary font-mono disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark mb-1">{t('settings.timezone')}</label>
                <input
                  type="text"
                  disabled={!canManageWorkspace}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary font-mono disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark mb-1">{t('settings.targetRoasBenchmark')}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  disabled={!canManageWorkspace}
                  value={roasBenchmark}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setRoasBenchmark(val === '' ? 0 : Number(val));
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark mb-1">{t('settings.monthlyBudgetLimit')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  disabled={!canManageWorkspace}
                  value={monthlyBudgetLimit === 0 ? '' : Number(monthlyBudgetLimit).toLocaleString('id-ID')}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setMonthlyBudgetLimit(raw === '' ? 0 : Number(raw));
                  }}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary disabled:opacity-60 disabled:bg-slate-100 dark:disabled:bg-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-4">
              <button
                type="submit"
                disabled={!canManageWorkspace}
                title={!canManageWorkspace ? "Permission 'Manage Workspace & Integrations' required" : undefined}
                className={`px-5 py-2.5 font-semibold text-xs rounded-xl shadow-md flex items-center space-x-1.5 ${
                  canManageWorkspace
                    ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{t('settings.saveSettings')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: RBAC PERMISSIONS MATRIX */}
      {activeTab === 'rbac' && (
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-bold text-dark">{t('settings.rbacTitle')}</h2>
              <p className="text-xs text-muted">{t('settings.rbacSubtitle')}</p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background border-b border-border text-[11px] font-bold text-muted uppercase">
                  <th className="py-3 px-4">{t('settings.permModule')}</th>
                  {ALL_ROLES.map((role) => (
                    <th key={role.id} className="py-3 px-4 text-center">
                      {t(`settings.roles.${role.key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm.id} className="hover:bg-background/50">
                    <td className="py-3 px-4 font-semibold text-dark">{t(`settings.permissions.${perm.key}`)}</td>
                    {ALL_ROLES.map((role) => {
                      const isChecked = (rolePermissions[role.id] || []).includes(perm.id);
                      return (
                        <td key={`${role.id}-${perm.id}`} className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(role.id, perm.id)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CHANNEL API INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-6">
          {!canManageWorkspace && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Read-only Mode: Your current role ({t(`settings.roles.${userRole}`)}) lacks 'Manage Workspace & Integrations' permission to modify integration connections or settings.</span>
            </div>
          )}

          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <Share2 className="w-5 h-5 text-primary" />
            <div>
              <h2 className="text-base font-bold text-dark">{t('settings.apiTitle')}</h2>
              <p className="text-xs text-muted">{t('settings.apiSubtitle')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => {
              const isEnabled = item.enabled !== false;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-border bg-background/40 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-dark">{item.name}</h3>
                      <div className="text-[10px] text-muted">{item.channel}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isEnabled && item.status === 'Connected'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}>
                        {isEnabled && item.status === 'Connected' ? t('settings.connected') : t('settings.disabled')}
                      </span>
                      <button
                        onClick={() => handleToggleIntegration(item.id)}
                        disabled={!canManageWorkspace}
                        aria-label={`Toggle ${item.name}`}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          !canManageWorkspace ? 'opacity-60 cursor-not-allowed' : ''
                        } ${isEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface p-3 rounded-xl border border-border text-xs space-y-1">
                    <div className="flex justify-between text-muted text-[11px]">
                      <span>Account ID / Channel:</span>
                      <span className="font-mono text-dark font-medium">{item.accountId || 'Not configured'}</span>
                    </div>
                    <div className="flex justify-between text-muted text-[11px]">
                      <span>Last Synced:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {isEnabled ? t('settings.lastSynced', { time: item.lastSynced }) : 'Paused'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSyncIntegration(item.id)}
                        disabled={syncingId === item.id || !canManageWorkspace || !isEnabled}
                        title={!canManageWorkspace ? "Permission 'Manage Workspace & Integrations' required" : undefined}
                        className={`px-3 py-1.5 border border-border bg-surface text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-colors ${
                          canManageWorkspace && isEnabled
                            ? 'text-dark hover:bg-background cursor-pointer'
                            : 'text-slate-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-primary ${syncingId === item.id ? 'animate-spin' : ''}`} />
                        <span>{syncingId === item.id ? t('settings.syncing') : t('settings.syncNow')}</span>
                      </button>

                      <button
                        onClick={() => setSelectedIntegrationForConfig(item)}
                        disabled={!canManageWorkspace}
                        title={!canManageWorkspace ? "Permission 'Manage Workspace & Integrations' required" : undefined}
                        className={`px-3 py-1.5 border border-border bg-surface text-xs font-medium rounded-xl flex items-center space-x-1.5 transition-colors ${
                          canManageWorkspace
                            ? 'text-dark hover:bg-background cursor-pointer'
                            : 'text-slate-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <Key className="w-3.5 h-3.5 text-primary" />
                        <span>{t('settings.configureKeys') || 'Configure / Edit Keys'}</span>
                      </button>
                    </div>

                    <span className={`text-[10px] font-semibold flex items-center space-x-1 ${
                      isEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEnabled ? t('settings.healthyFeed') : 'Disabled'}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* API Config Modal */}
      <ApiConfigModal
        isOpen={selectedIntegrationForConfig !== null}
        integration={selectedIntegrationForConfig}
        onClose={() => setSelectedIntegrationForConfig(null)}
        onSave={handleSaveIntegrationConfig}
      />
    </div>
  );
};

export default SettingsView;
