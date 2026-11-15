import React, { useState } from 'react';
import { Campaign } from '../../types';
import {
  X,
  Edit,
  TrendingUp,
  Target,
  FileText,
  DollarSign,
  Clock
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface CampaignDetailModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onEdit?: (campaign: Campaign) => void;
  canEdit?: boolean;
}

type TabType = 'overview' | 'performance' | 'budget' | 'targets' | 'activity';

export const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  isOpen,
  campaign,
  onClose,
  onEdit,
  canEdit = true,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!isOpen || !campaign) return null;

  // Key calculations
  const spend = campaign.spend || 0;
  const revenue = campaign.revenue || 0;
  const budget = campaign.budget || 1;
  const roas = spend > 0 ? revenue / spend : 0;
  const budgetUtilization = Math.min(100, Math.round((spend / budget) * 100));
  const remainingBudget = Math.max(0, budget - spend);

  // Target achievements %
  const revenueAchieved = campaign.targetRevenue > 0 ? Math.round((revenue / campaign.targetRevenue) * 100) : 0;
  const roasAchieved = campaign.targetRoas > 0 ? Math.round((roas / campaign.targetRoas) * 100) : 0;
  const reservationTarget = campaign.reservationTarget || 100;
  const actualReservations = Math.round((revenue / 300000)); // ~300k IDR avg per reservation
  const reservationAchieved = Math.round((actualReservations / reservationTarget) * 100);

  const guestTarget = campaign.guestTarget || 400;
  const actualGuests = Math.round(actualReservations * 3.2); // ~3.2 guests per reservation
  const guestAchieved = Math.round((actualGuests / guestTarget) * 100);

  // Date range duration
  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);
  const durationDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  const dailySpendAvg = Math.round(spend / Math.max(1, durationDays));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-dark/60 backdrop-blur-sm animate-fadeIn">
      {/* Slide-over Container */}
      <div
        className="bg-surface border-l border-border w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-background/50 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                {campaign.code}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  campaign.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : campaign.status === 'Paused'
                    ? 'bg-amber-100 text-amber-800'
                    : campaign.status === 'Completed'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {campaign.status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  onClick={() => {
                    if (canEdit) {
                      onEdit(campaign);
                      onClose();
                    }
                  }}
                  disabled={!canEdit}
                  title={!canEdit ? "Permission 'Create & Edit Campaigns' required" : undefined}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5 ${
                    canEdit
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-sm cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{t('campaigns.editCampaign')}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-muted hover:text-dark p-1.5 rounded-xl hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-dark">{campaign.name}</h2>
            <div className="flex items-center space-x-4 text-xs text-muted mt-1">
              <span>{t('campaigns.colChannel')}: <strong className="text-dark">{campaign.channel}</strong></span>
              <span>•</span>
              <span>{t('campaigns.colObjective')}: <strong className="text-dark">{campaign.objective}</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-dark">{durationDays} Days</strong></span>
            </div>
          </div>

          {/* Modal Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-background p-1 rounded-xl border border-border text-xs font-semibold overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'overview' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'performance' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Performance</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'budget' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Budget & Spend</span>
            </button>
            <button
              onClick={() => setActiveTab('targets')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'targets' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Targets & Variance</span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'activity' ? 'bg-primary text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-dark'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Activity Log</span>
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Highlight Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-background border border-border rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-muted uppercase">Attributed Revenue</div>
                  <div className="text-xl font-extrabold text-emerald-600">Rp {revenue.toLocaleString('id-ID')}</div>
                  <div className="text-[10px] text-muted">Generated from campaign conversions</div>
                </div>

                <div className="p-4 bg-background border border-border rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-muted uppercase">Campaign ROAS</div>
                  <div className="text-xl font-extrabold text-primary">{roas.toFixed(2)}x</div>
                  <div className="text-[10px] text-muted">Target: {campaign.targetRoas || 4.5}x</div>
                </div>
              </div>

              {/* Detailed Specs */}
              <div className="bg-background border border-border p-4 rounded-xl space-y-3 text-xs">
                <h4 className="font-bold text-dark uppercase tracking-wider text-[11px]">Campaign Attributes</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-muted block text-[11px]">Start Date</span>
                    <strong className="text-dark font-mono">{campaign.startDate}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">End Date</span>
                    <strong className="text-dark font-mono">{campaign.endDate}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Daily Budget Avg</span>
                    <strong className="text-dark">Rp {dailySpendAvg.toLocaleString('id-ID')}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[11px]">Type / Category</span>
                    <strong className="text-dark">{campaign.type}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERFORMANCE */}
          {activeTab === 'performance' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">ROAS</div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">{roas.toFixed(2)}x</div>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <div className="text-[10px] font-bold text-primary uppercase">Table Bookings</div>
                  <div className="text-2xl font-extrabold text-primary mt-1">{actualReservations}</div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-[10px] font-bold text-purple-800 uppercase">Dining Covers</div>
                  <div className="text-2xl font-extrabold text-purple-600 mt-1">{actualGuests}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUDGET */}
          {activeTab === 'budget' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 bg-background border border-border rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-dark">Budget Utilization ({budgetUtilization}%)</span>
                  <span className="font-mono text-muted">Spent Rp {spend.toLocaleString('id-ID')} of Rp {budget.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${budgetUtilization}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>Remaining Budget: Rp {remainingBudget.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TARGETS */}
          {activeTab === 'targets' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-dark">Attributed Revenue Target</span>
                  <span className="font-semibold text-emerald-600">
                    Rp {revenue.toLocaleString('id-ID')} / Target Rp {(campaign.targetRevenue || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, revenueAchieved)}%` }} />
                </div>
              </div>

              <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-dark">ROAS Target ({roasAchieved}% achieved)</span>
                  <span className="font-semibold text-primary">
                    {roas.toFixed(2)}x / Target {(campaign.targetRoas || 4.5).toFixed(2)}x
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(100, roasAchieved)}%` }} />
                </div>
              </div>

              <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-dark">Reservations Target ({reservationAchieved}% achieved)</span>
                  <span className="font-semibold text-dark">
                    {actualReservations} / Target {reservationTarget}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${Math.min(100, reservationAchieved)}%` }} />
                </div>
              </div>

              <div className="p-4 bg-surface border border-border rounded-xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-dark">Guest Covers Target ({guestAchieved}% achieved)</span>
                  <span className="font-semibold text-dark">
                    {actualGuests} / Target {guestTarget}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min(100, guestAchieved)}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-dark uppercase tracking-wider">{t('campaigns.marketingNotes')}</h4>
                <div className="p-4 bg-background border border-border rounded-xl text-xs text-dark whitespace-pre-line leading-relaxed">
                  {campaign.notes || 'No marketing notes recorded for this campaign.'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailModal;
