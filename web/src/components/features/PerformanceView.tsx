import React, { useState } from 'react';
import {
  TrendingUp,
  Share2,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useRbac } from '../../context/RbacContext';

export type AttributionModel = 'Position-Based' | 'Last-Touch' | 'First-Touch' | 'Linear';

interface ChannelMetric {
  channel: string;
  spend: number;
  revenue: number;
  roas: number;
  reservations: number;
  guests: number;
  sharePercent: number;
  targetRoas: number;
}

export const PerformanceView: React.FC = () => {
  const { t } = useTranslation();
  const { hasPermission, userRole } = useRbac();
  const [selectedModel, setSelectedModel] = useState<AttributionModel>('Position-Based');

  const canView = hasPermission('campaign_view');

  // Base raw channel data
  const channelData: Record<AttributionModel, ChannelMetric[]> = {
    'Position-Based': [
      { channel: 'Instagram', spend: 8000000, revenue: 42000000, roas: 5.25, reservations: 65, guests: 240, sharePercent: 34.9, targetRoas: 4.5 },
      { channel: 'TikTok', spend: 5200000, revenue: 31000000, roas: 5.96, reservations: 48, guests: 180, sharePercent: 25.8, targetRoas: 4.5 },
      { channel: 'Meta Ads', spend: 4400000, revenue: 22000000, roas: 5.00, reservations: 32, guests: 120, sharePercent: 18.3, targetRoas: 4.0 },
      { channel: 'Google', spend: 3000000, revenue: 15000000, roas: 5.00, reservations: 24, guests: 90, sharePercent: 12.5, targetRoas: 4.0 },
      { channel: 'WhatsApp', spend: 1200000, revenue: 8200000, roas: 6.83, reservations: 15, guests: 60, sharePercent: 6.8, targetRoas: 5.0 },
      { channel: 'CRM', spend: 800000, revenue: 2000000, roas: 2.50, reservations: 0, guests: 0, sharePercent: 1.7, targetRoas: 3.5 },
    ],
    'Last-Touch': [
      { channel: 'WhatsApp', spend: 1200000, revenue: 24000000, roas: 20.00, reservations: 72, guests: 270, sharePercent: 20.0, targetRoas: 5.0 },
      { channel: 'Instagram', spend: 8000000, revenue: 38000000, roas: 4.75, reservations: 55, guests: 210, sharePercent: 31.6, targetRoas: 4.5 },
      { channel: 'Google', spend: 3000000, revenue: 25000000, roas: 8.33, reservations: 38, guests: 140, sharePercent: 20.8, targetRoas: 4.0 },
      { channel: 'TikTok', spend: 5200000, revenue: 21000000, roas: 4.04, reservations: 30, guests: 110, sharePercent: 17.5, targetRoas: 4.5 },
      { channel: 'Meta Ads', spend: 4400000, revenue: 10000000, roas: 2.27, reservations: 15, guests: 50, sharePercent: 8.3, targetRoas: 4.0 },
      { channel: 'CRM', spend: 800000, revenue: 2200000, roas: 2.75, reservations: 5, guests: 15, sharePercent: 1.8, targetRoas: 3.5 },
    ],
    'First-Touch': [
      { channel: 'TikTok', spend: 5200000, revenue: 45000000, roas: 8.65, reservations: 70, guests: 260, sharePercent: 37.4, targetRoas: 4.5 },
      { channel: 'Instagram', spend: 8000000, revenue: 36000000, roas: 4.50, reservations: 52, guests: 190, sharePercent: 30.0, targetRoas: 4.5 },
      { channel: 'Meta Ads', spend: 4400000, revenue: 24000000, roas: 5.45, reservations: 36, guests: 130, sharePercent: 20.0, targetRoas: 4.0 },
      { channel: 'Google', spend: 3000000, revenue: 11000000, roas: 3.67, reservations: 18, guests: 70, sharePercent: 9.2, targetRoas: 4.0 },
      { channel: 'WhatsApp', spend: 1200000, revenue: 3000000, roas: 2.50, reservations: 6, guests: 20, sharePercent: 2.5, targetRoas: 5.0 },
      { channel: 'CRM', spend: 800000, revenue: 1200000, roas: 1.50, reservations: 2, guests: 10, sharePercent: 0.9, targetRoas: 3.5 },
    ],
    'Linear': [
      { channel: 'Instagram', spend: 8000000, revenue: 39500000, roas: 4.94, reservations: 60, guests: 220, sharePercent: 32.9, targetRoas: 4.5 },
      { channel: 'TikTok', spend: 5200000, revenue: 32500000, roas: 6.25, reservations: 50, guests: 185, sharePercent: 27.0, targetRoas: 4.5 },
      { channel: 'Meta Ads', spend: 4400000, revenue: 20500000, roas: 4.66, reservations: 30, guests: 115, sharePercent: 17.1, targetRoas: 4.0 },
      { channel: 'Google', spend: 3000000, revenue: 16000000, roas: 5.33, reservations: 25, guests: 95, sharePercent: 13.3, targetRoas: 4.0 },
      { channel: 'WhatsApp', spend: 1200000, revenue: 9500000, roas: 7.92, reservations: 16, guests: 65, sharePercent: 7.9, targetRoas: 5.0 },
      { channel: 'CRM', spend: 800000, revenue: 2200000, roas: 2.75, reservations: 3, guests: 10, sharePercent: 1.8, targetRoas: 3.5 },
    ]
  };

  const currentChannels = channelData[selectedModel];
  const totalRevenue = currentChannels.reduce((sum, c) => sum + c.revenue, 0);
  const totalSpend = currentChannels.reduce((sum, c) => sum + c.spend, 0);
  const overallRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const modelDescriptions: Record<AttributionModel, string> = {
    'Position-Based': '40% credit to first discovery, 40% to final booking action, 20% distributed evenly across middle nurture touches.',
    'Last-Touch': '100% credit assigned to the final marketing touchpoint immediately prior to customer reservation.',
    'First-Touch': '100% credit assigned to the initial channel where the customer first discovered the restaurant brand.',
    'Linear': 'Equal revenue credit split uniformly across all recorded digital marketing touchpoints in the customer journey.'
  };

  if (!canView) {
    return (
      <div className="p-8 bg-surface rounded-2xl border border-border shadow-sm text-center space-y-4 my-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-dark">Access Restricted: View Campaigns & Performance</h2>
          <p className="text-xs text-muted max-w-md mx-auto mt-1">
            Your current role ({t(`settings.roles.${userRole}`)}) does not have permission to view performance metrics. Please update permissions in Settings (RBAC Matrix).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-dark">{t('nav.performance')}</h1>
          </div>
          <p className="text-xs text-muted mt-1 max-w-xl">
            Evaluate revenue distribution models, channel conversion efficiency, and target variances across marketing spend.
          </p>
        </div>

        <div className="bg-background border border-border px-4 py-2.5 rounded-xl flex items-center space-x-4 self-start sm:self-auto">
          <div>
            <div className="text-[10px] text-muted font-semibold uppercase">{t('dashboard.colAttributedRevenue')}</div>
            <div className="text-base font-extrabold text-emerald-600">Rp {(totalRevenue / 1000000).toFixed(1)}M</div>
          </div>
          <div className="h-6 w-px bg-border" />
          <div>
            <div className="text-[10px] text-muted font-semibold uppercase">{t('dashboard.blendedRoas')}</div>
            <div className="text-base font-extrabold text-primary">{overallRoas.toFixed(2)}x</div>
          </div>
        </div>
      </div>

      {/* 1. Revenue Attribution Model Selector */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-dark">Revenue Attribution Model Selector</h2>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Select rules for multi-channel sales weighting</span>
          </div>
        </div>

        {/* Model Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['Position-Based', 'Last-Touch', 'First-Touch', 'Linear'] as AttributionModel[]).map((model) => {
            const isSelected = selectedModel === model;
            return (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 ring-2 ring-primary/20'
                    : 'border-border bg-background/50 hover:bg-background hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-dark'}`}>
                    {model}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-[11px] text-muted mt-1 line-clamp-2">
                  {modelDescriptions[model]}
                </p>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Active Attribution Rule: <span className="font-bold text-dark">{selectedModel}</span> — {modelDescriptions[selectedModel]}
          </span>
        </div>
      </div>

      {/* 2. Channel Performance Metrics & Database Table */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-dark">{t('dashboard.channelBreakdownTitle')}</h2>
          </div>
          <span className="text-xs text-muted font-mono">{currentChannels.length} Channels Analyzed</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border text-[11px] font-bold text-muted uppercase">
                <th className="py-3 px-4">{t('dashboard.colChannel')}</th>
                <th className="py-3 px-4 text-right">{t('dashboard.colTotalSpend')}</th>
                <th className="py-3 px-4 text-right">{t('dashboard.colAttributedRevenue')}</th>
                <th className="py-3 px-4 text-center">{t('dashboard.colRoas')}</th>
                <th className="py-3 px-4 text-center">{t('campaigns.targetRoas')}</th>
                <th className="py-3 px-4 text-center">{t('dashboard.colReservations')}</th>
                <th className="py-3 px-4 text-center">{t('dashboard.colGuestCount')}</th>
                <th className="py-3 px-4 text-right">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {currentChannels.map((ch) => {
                return (
                  <tr key={ch.channel} className="hover:bg-background/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-dark flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{ch.channel}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-dark">
                      Rp {ch.spend.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      Rp {ch.revenue.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
                          ch.roas >= 5.0
                            ? 'bg-emerald-100 text-emerald-800'
                            : ch.roas >= 3.5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {ch.roas.toFixed(2)}x
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-muted">
                      {ch.targetRoas.toFixed(2)}x
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-dark">
                      {ch.reservations}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-dark">
                      {ch.guests}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-dark">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden hidden sm:block">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, ch.sharePercent * 2)}%` }}
                          />
                        </div>
                        <span>{ch.sharePercent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Target Variance Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Variance Card 1: Revenue */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark uppercase tracking-wider">Revenue Target Variance</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">+18.4%</div>
          <p className="text-xs text-muted">
            Attributed revenue of Rp {(totalRevenue / 1000000).toFixed(1)}M exceeds cumulative goal target Rp 101.5M.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Variance Card 2: ROAS */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark uppercase tracking-wider">ROAS Target Variance</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-primary">+0.82x</div>
          <p className="text-xs text-muted">
            Blended ROAS of {overallRoas.toFixed(2)}x is performing strongly above target benchmark (4.50x).
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-2 rounded-full" style={{ width: '88%' }} />
          </div>
        </div>

        {/* Variance Card 3: Reservations */}
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-dark uppercase tracking-wider">Reservation Volume</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-dark">184 Bookings</div>
          <p className="text-xs text-muted">
            Total attributed table bookings outperform monthly target quota by +12.5%.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-accent h-2 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceView;
