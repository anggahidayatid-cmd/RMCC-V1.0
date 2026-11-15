import React, { useState, useEffect } from 'react';
import { Campaign, CampaignStatus, CampaignType } from '../../types';
import { X, Calculator, Calendar, DollarSign, Target, Megaphone, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface CampaignFormModalProps {
  isOpen: boolean;
  campaign: Campaign | null; // null if creating, populated if editing
  onClose: () => void;
  onSave: (campaignData: Partial<Campaign>) => void | Promise<void>;
}

const CAMPAIGN_TYPES: CampaignType[] = [
  'Promotion',
  'Event',
  'Brand Awareness',
  'Traffic',
  'CRM',
  'Seasonal',
  'Partnership',
  'Other'
];

const CAMPAIGN_STATUSES: CampaignStatus[] = [
  'Draft',
  'Scheduled',
  'Active',
  'Paused',
  'Completed'
];

const CHANNELS = [
  'Instagram',
  'TikTok',
  'Instagram + TikTok',
  'Instagram + WhatsApp',
  'Meta Ads',
  'Google',
  'Google + Meta',
  'WhatsApp',
  'CRM + WhatsApp',
  'CRM',
  'Offline / POS'
];

const sanitizeInteger = (val: string): string => val.replace(/[^0-9]/g, '');

const sanitizeDecimal = (val: string): string => {
  const cleaned = val.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 1) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  return cleaned;
};

export const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  isOpen,
  campaign,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    name: '',
    code: '',
    objective: '',
    type: 'Promotion',
    channel: 'Instagram',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    budget: '5000000',
    dailyBudget: '200000',
    targetRoas: '4.5',
    targetRevenue: '22500000',
    reservationTarget: '50',
    guestTarget: '200',
    spend: '0',
    revenue: '0',
    status: 'Active',
    notes: '',
  });

  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaign) {
      setFormData({
        id: campaign.id,
        restaurantId: campaign.restaurantId || 'REST-001',
        name: campaign.name || '',
        code: campaign.code || '',
        objective: campaign.objective || '',
        type: campaign.type || 'Promotion',
        channel: campaign.channel || 'Instagram',
        startDate: campaign.startDate || new Date().toISOString().split('T')[0],
        endDate: campaign.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        budget: (campaign.budget ?? 0).toString(),
        dailyBudget: (campaign.dailyBudget ?? 0).toString(),
        targetRoas: (campaign.targetRoas ?? 4.0).toString(),
        targetRevenue: (campaign.targetRevenue ?? 0).toString(),
        reservationTarget: (campaign.reservationTarget ?? 0).toString(),
        guestTarget: (campaign.guestTarget ?? 0).toString(),
        spend: (campaign.spend ?? 0).toString(),
        revenue: (campaign.revenue ?? 0).toString(),
        status: campaign.status || 'Active',
        notes: campaign.notes || '',
      });
    } else {
      // Create mode defaults
      const randomCode = `CAMP-${Math.floor(100 + Math.random() * 900)}`;
      setFormData({
        name: '',
        code: randomCode,
        objective: '',
        type: 'Promotion',
        channel: 'Instagram + WhatsApp',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        budget: '5000000',
        dailyBudget: '200000',
        targetRoas: '4.5',
        targetRevenue: '22500000',
        reservationTarget: '50',
        guestTarget: '200',
        spend: '0',
        revenue: '0',
        status: 'Active',
        notes: '',
      });
    }
    setDateError(null);
  }, [campaign, isOpen]);

  // Date validation effect
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        setDateError(t('campaigns.dateError'));
      } else {
        setDateError(null);
      }
    }
  }, [formData.startDate, formData.endDate, t]);

  // Auto-calculated read-only ROAS
  const spendVal = Number(formData.spend || 0);
  const revenueVal = Number(formData.revenue || 0);
  const calculatedRoas = spendVal > 0 ? (revenueVal / spendVal).toFixed(2) : '0.00';

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };

      // Auto-recalculate target revenue if budget or targetRoas changes
      if (field === 'budget' || field === 'targetRoas') {
        const b = field === 'budget' ? Number(value || 0) : Number(prev.budget || 0);
        const r = field === 'targetRoas' ? Number(value || 0) : Number(prev.targetRoas || 0);
        updated.targetRevenue = Math.round(b * r).toString();
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) return;
    if (!formData.name?.trim()) return;

    try {
      setIsSubmitting(true);
      const campaignData: Partial<Campaign> = {
        ...formData,
        budget: Number(formData.budget || 0),
        dailyBudget: Number(formData.dailyBudget || 0),
        targetRoas: Number(formData.targetRoas || 0),
        targetRevenue: Number(formData.targetRevenue || 0),
        reservationTarget: Number(formData.reservationTarget || 0),
        guestTarget: Number(formData.guestTarget || 0),
        spend: Number(formData.spend || 0),
        revenue: Number(formData.revenue || 0),
      };
      await onSave(campaignData);
      onClose();
    } catch (err) {
      console.error('Error saving campaign:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateCode = () => {
    if (formData.name) {
      const prefix = formData.name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 5);
      const num = Math.floor(10 + Math.random() * 90);
      handleChange('code', `${prefix}-${num}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm overflow-y-auto custom-scrollbar animate-fadeIn">
      <div
        className="bg-surface border border-border rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background/50 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-dark">
                {campaign ? t('campaigns.editTitle', { name: campaign.name }) : t('campaigns.createTitle')}
              </h2>
              <p className="text-xs text-muted">
                Configure campaign basic details, target metrics, schedule, and manual performance.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-dark p-2 rounded-xl hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form id="campaign-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-dark uppercase tracking-wider border-b border-border pb-2">
              <Info className="w-4 h-4 text-primary" />
              <span>{t('campaigns.basicInfo')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">
                  {t('campaigns.campaignName')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Family Dine-In Special"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1 flex items-center justify-between">
                  <span>{t('campaigns.campaignCode')}</span>
                  <button
                    type="button"
                    onClick={generateCode}
                    className="text-[10px] text-primary hover:underline font-normal"
                  >
                    {t('campaigns.autoGenerate')}
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="e.g. WEEKEND-26"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.objective')}</label>
              <input
                type="text"
                placeholder="e.g. Drive weekend family reservations with bundle menu offer"
                value={formData.objective || ''}
                onChange={(e) => handleChange('objective', e.target.value)}
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.campaignType')}</label>
                <select
                  value={formData.type || 'Promotion'}
                  onChange={(e) => handleChange('type', e.target.value as CampaignType)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary cursor-pointer"
                >
                  {CAMPAIGN_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.channel')}</label>
                <select
                  value={formData.channel || 'Instagram'}
                  onChange={(e) => handleChange('channel', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary cursor-pointer"
                >
                  {CHANNELS.map((ch) => (
                    <option key={ch} value={ch} className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">{ch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.colStatus')}</label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => handleChange('status', e.target.value as CampaignStatus)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary cursor-pointer"
                >
                  {CAMPAIGN_STATUSES.map((st) => (
                    <option key={st} value={st} className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">{st}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Schedule & Validation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-dark uppercase tracking-wider border-b border-border pb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{t('campaigns.scheduleTimeline')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.startDate')}</label>
                <input
                  type="date"
                  required
                  value={formData.startDate || ''}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.endDate')}</label>
                <input
                  type="date"
                  required
                  value={formData.endDate || ''}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none [color-scheme:light] dark:[color-scheme:dark] ${
                    dateError ? 'border border-rose-500 bg-rose-50/30 text-rose-900 dark:bg-rose-950/30 dark:text-rose-200 dark:border-rose-500' : 'bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] focus:border-primary'
                  }`}
                />
              </div>
            </div>

            {/* Date Validation Alert */}
            {dateError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span className="font-semibold">{dateError}</span>
              </div>
            )}
          </div>

          {/* Section 3: Budget & Target Goals */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-dark uppercase tracking-wider border-b border-border pb-2">
              <Target className="w-4 h-4 text-primary" />
              <span>{t('campaigns.budgetAllocations')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.totalBudget')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.budget === '' || formData.budget === null || formData.budget === undefined ? '' : Number(formData.budget).toLocaleString('id-ID')}
                  onChange={(e) => handleChange('budget', sanitizeInteger(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.dailyBudget')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.dailyBudget === '' || formData.dailyBudget === null || formData.dailyBudget === undefined ? '' : Number(formData.dailyBudget).toLocaleString('id-ID')}
                  onChange={(e) => handleChange('dailyBudget', sanitizeInteger(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.targetRoas')}</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.targetRoas ?? ''}
                  onChange={(e) => handleChange('targetRoas', sanitizeDecimal(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.targetRevenue')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.targetRevenue === '' || formData.targetRevenue === null || formData.targetRevenue === undefined ? '' : Number(formData.targetRevenue).toLocaleString('id-ID')}
                  onChange={(e) => handleChange('targetRevenue', sanitizeInteger(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.reservationTarget')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.reservationTarget ?? ''}
                  onChange={(e) => handleChange('reservationTarget', sanitizeInteger(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.guestCoverTarget')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.guestTarget ?? ''}
                  onChange={(e) => handleChange('guestTarget', sanitizeInteger(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Manual Performance Entry & Auto-calculated ROAS */}
          <div className="space-y-4 bg-slate-50 dark:bg-[#1E2230] p-4 rounded-xl border border-slate-200 dark:border-[#2D3248]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2D3248] pb-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-dark uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>{t('campaigns.manualEntry')}</span>
              </div>
              <span className="text-[10px] text-muted font-medium bg-white dark:bg-[#25283A] px-2 py-0.5 rounded border border-slate-200 dark:border-[#3E4562]">
                Tracking Logs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.colSpend')} (Rp)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={formData.spend === '' || formData.spend === null || formData.spend === undefined ? '' : Number(formData.spend).toLocaleString('id-ID')}
                  onChange={(e) => handleChange('spend', sanitizeInteger(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.colRevenue')} (Rp)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={formData.revenue === '' || formData.revenue === null || formData.revenue === undefined ? '' : Number(formData.revenue).toLocaleString('id-ID')}
                  onChange={(e) => handleChange('revenue', sanitizeInteger(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark mb-1 flex items-center space-x-1">
                  <Calculator className="w-3.5 h-3.5 text-primary" />
                  <span>{t('campaigns.autoCalculatedRoas')}</span>
                </label>
                <div className="px-3 py-2 bg-slate-100 dark:bg-[#25283A] border border-slate-300 dark:border-[#3E4562] rounded-xl text-xs font-bold text-primary flex items-center justify-between">
                  <span>{calculatedRoas}x</span>
                  <span className="text-[10px] text-muted font-normal">
                    {spendVal > 0 ? `(${revenueVal.toLocaleString()} / ${spendVal.toLocaleString()})` : 'Spend = 0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Marketing Notes */}
          <div>
            <label className="block text-xs font-semibold text-dark mb-1">{t('campaigns.marketingNotes')}</label>
            <textarea
              rows={3}
              placeholder="Add campaign strategy notes, audience targeting details, promo terms & conditions..."
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border bg-background/50 flex items-center justify-between shrink-0">
          <div className="text-xs text-muted">
            {dateError ? (
              <span className="text-rose-600 font-semibold">{dateError}</span>
            ) : (
              <span>All changes will be saved to your active workspace.</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-dark hover:bg-background transition-colors"
            >
              {t('campaigns.cancel')}
            </button>
            <button
              type="submit"
              form="campaign-form"
              disabled={!!dateError || isSubmitting}
              className={`px-5 py-2 bg-primary text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5 ${
                dateError || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? t('campaigns.saving') : t('campaigns.saveCampaign')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignFormModal;
