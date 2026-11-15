import React from 'react';
import {
  Trophy,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { Campaign } from '../../types';
import { useTranslation } from '../../i18n';

export interface CampaignHighlightsProps {
  topCampaign?: Campaign | null;
  underperformingCampaign?: Campaign | null;
}

export const CampaignHighlights: React.FC<CampaignHighlightsProps> = ({
  topCampaign,
  underperformingCampaign
}) => {
  const { t } = useTranslation();

  // Default fallbacks matching spec if null
  const top: Campaign = topCampaign || {
    id: 'CAMP-003',
    restaurantId: 'REST-001',
    name: 'Live Music October',
    code: 'LIVE-OCT',
    objective: 'Promote Friday & Saturday live acoustic band sessions',
    type: 'Event',
    channel: 'Instagram + TikTok',
    startDate: '2026-10-05',
    endDate: '2026-10-28',
    budget: 9000000,
    dailyBudget: 300000,
    targetRoas: 5.0,
    targetRevenue: 45000000,
    reservationTarget: 150,
    guestTarget: 600,
    spend: 7200000,
    revenue: 41800000,
    status: 'Active',
    notes: 'Short video clips on TikTok showing crowd atmosphere driving high conversion'
  };

  const under: Campaign = underperformingCampaign || {
    id: 'CAMP-004',
    restaurantId: 'REST-001',
    name: 'Lunch Weekday',
    code: 'LUNCH-WD',
    objective: 'Increase lunch hour occupancy for nearby office workers',
    type: 'Traffic',
    channel: 'Google + Meta',
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    budget: 7000000,
    dailyBudget: 200000,
    targetRoas: 4.0,
    targetRevenue: 28000000,
    reservationTarget: 90,
    guestTarget: 270,
    spend: 5200000,
    revenue: 21800000,
    status: 'Paused',
    notes: 'Paused temporarily to refresh creative messaging and lunch menu options'
  };

  const topRoas = top.spend > 0 ? top.revenue / top.spend : 0;
  const topRevProgress = Math.min(100, Math.round((top.revenue / (top.targetRevenue || 45000000)) * 100));
  const topResProgress = Math.min(100, Math.round((145 / (top.reservationTarget || 150)) * 100));

  const underRoas = under.spend > 0 ? under.revenue / under.spend : 0;
  const underRevProgress = Math.min(100, Math.round((under.revenue / (under.targetRevenue || 28000000)) * 100));
  const underResProgress = Math.min(100, Math.round((68 / (under.reservationTarget || 90)) * 100));

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-dark">{t('dashboard.highlightsTitle')}</h2>
          <p className="text-xs text-muted">{t('dashboard.highlightsSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Campaign Card */}
        <div className="bg-surface rounded-2xl border border-emerald-200 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('dashboard.topPerformer')}</span>
              </div>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                {t('dashboard.code', { code: top.code })}
              </span>
            </div>

            {/* Title & Channel */}
            <h3 className="text-xl font-bold text-dark">{top.name}</h3>
            <p className="text-xs text-muted mt-0.5">{top.channel} • {t('dashboard.type', { type: top.type })}</p>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 my-5 p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
              <div>
                <div className="text-[10px] uppercase font-semibold text-emerald-800">{t('dashboard.actualRevenue')}</div>
                <div className="text-sm font-bold text-dark mt-0.5">{formatCurrency(top.revenue)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-emerald-800">{t('dashboard.spent')}</div>
                <div className="text-sm font-bold text-dark mt-0.5">{formatCurrency(top.spend)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-emerald-800">{t('dashboard.achievedRoas')}</div>
                <div className="text-sm font-extrabold text-emerald-700 mt-0.5 flex items-center space-x-1">
                  <span>{topRoas.toFixed(2)}x</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Target vs Actual Progress Meters */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{t('dashboard.revenueGoalProgress')}</span>
                  <span className="text-emerald-700">{topRevProgress}% ({formatCurrency(top.revenue)} / {formatCurrency(top.targetRevenue)})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${topRevProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{t('dashboard.reservationsTargetMeter')}</span>
                  <span className="text-emerald-700">{topResProgress}% (145 / {top.reservationTarget})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${topResProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-muted">
            <span className="italic">"{top.notes}"</span>
            <span className="font-semibold text-emerald-700 shrink-0 ml-2">{t('dashboard.highConversion')}</span>
          </div>
        </div>

        {/* Underperforming Campaign Card */}
        <div className="bg-surface rounded-2xl border border-amber-200 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('dashboard.needsOptimization')}</span>
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                {t('dashboard.status', { status: under.status })}
              </span>
            </div>

            {/* Title & Channel */}
            <h3 className="text-xl font-bold text-dark">{under.name}</h3>
            <p className="text-xs text-muted mt-0.5">{under.channel} • {t('dashboard.type', { type: under.type })}</p>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 my-5 p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
              <div>
                <div className="text-[10px] uppercase font-semibold text-amber-800">{t('dashboard.actualRevenue')}</div>
                <div className="text-sm font-bold text-dark mt-0.5">{formatCurrency(under.revenue)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-amber-800">{t('dashboard.spent')}</div>
                <div className="text-sm font-bold text-dark mt-0.5">{formatCurrency(under.spend)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-amber-800">{t('dashboard.achievedRoas')}</div>
                <div className="text-sm font-extrabold text-amber-700 mt-0.5 flex items-center space-x-1">
                  <span>{underRoas.toFixed(2)}x</span>
                  <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Target vs Actual Progress Meters */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{t('dashboard.revenueGoalProgress')}</span>
                  <span className="text-amber-700">{underRevProgress}% ({formatCurrency(under.revenue)} / {formatCurrency(under.targetRevenue)})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${underRevProgress}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{t('dashboard.reservationsTargetMeter')}</span>
                  <span className="text-amber-700">{underResProgress}% (68 / {under.reservationTarget})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${underResProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-muted">
            <span className="italic">"{under.notes}"</span>
            <span className="font-semibold text-amber-700 shrink-0 ml-2">{t('dashboard.actionRequired')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignHighlights;
