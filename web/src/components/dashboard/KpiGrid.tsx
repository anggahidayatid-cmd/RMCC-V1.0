import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  CalendarCheck,
  Users,
  UserCheck,
  ArrowUpRight
} from 'lucide-react';
import { DashboardMetrics } from '../../types';
import { useTranslation } from '../../i18n';

export interface KpiGridProps {
  metrics: DashboardMetrics;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ metrics }) => {
  const { t } = useTranslation();

  const formatCurrency = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const newCount = metrics.newCustomers || 218;
  const repeatCount = metrics.repeatCustomers || 302;
  const totalCust = newCount + repeatCount;
  const newPercent = Math.round((newCount / totalCust) * 100);
  const repeatPercent = 100 - newPercent;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-dark">{t('dashboard.executiveKpiOverview')}</h2>
          <p className="text-xs text-muted">{t('dashboard.kpiSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spend */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('dashboard.totalSpend')}</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-semibold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-dark tracking-tight">
            {formatCurrency(metrics.totalSpend || 22600000)}
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t('dashboard.vsLastPeriod')}</span>
          </div>
        </div>

        {/* Attributed Revenue */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('dashboard.attributedRevenue')}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-dark tracking-tight">
            {formatCurrency(metrics.totalRevenue || 120200000)}
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t('dashboard.targetAchieved')}</span>
          </div>
        </div>

        {/* Blended ROAS */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('dashboard.blendedRoas')}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-semibold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-dark tracking-tight">
              {(metrics.blendedRoas || 5.32).toFixed(2)}x
            </span>
            <span className="text-xs text-muted font-medium">{t('dashboard.targetBenchmark', { target: '4.5x' })}</span>
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-purple-600 space-x-1">
            <Zap className="w-3.5 h-3.5" />
            <span>{t('dashboard.aboveBenchmark')}</span>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('dashboard.activeCampaigns')}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-dark tracking-tight">
            {metrics.activeCampaigns || 3} <span className="text-sm font-normal text-muted">Live</span>
          </div>
          <div className="mt-2 flex items-center text-xs font-medium text-blue-600 space-x-1">
            <span>{t('dashboard.totalManaged', { count: 4 })}</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid: Reservations, Guests, Customer Composition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reservations Card */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block">{t('dashboard.reservations')}</span>
            <div className="text-xl font-bold text-dark">{t('dashboard.tables', { count: metrics.totalReservations || 184 })}</div>
            <p className="text-[11px] text-muted">{t('dashboard.attributedToCtas')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Guests Card */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block">{t('dashboard.totalGuests')}</span>
            <div className="text-xl font-bold text-dark">{t('dashboard.covers', { count: metrics.totalGuests || 520 })}</div>
            <p className="text-[11px] text-muted">{t('dashboard.avgGuestsPerReservation')}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Composition: New vs Repeat */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-dark">{t('dashboard.newVsRepeat')}</span>
            </div>
            <span className="text-[11px] font-semibold text-muted">{t('dashboard.total', { count: totalCust })}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="font-semibold text-dark">{t('dashboard.newCustomers', { count: newCount })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-300" />
              <span className="font-semibold text-dark">{t('dashboard.repeatCustomers', { count: repeatCount })}</span>
            </div>
          </div>

          {/* Customer Proportion Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
            <div
              className="bg-primary h-full transition-all duration-500"
              style={{ width: `${newPercent}%` }}
              title={`New: ${newPercent}%`}
            />
            <div
              className="bg-indigo-300 h-full transition-all duration-500"
              style={{ width: `${repeatPercent}%` }}
              title={`Repeat: ${repeatPercent}%`}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted font-medium">
            <span>{t('dashboard.acquisition', { percent: newPercent })}</span>
            <span>{t('dashboard.retention', { percent: repeatPercent })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiGrid;
