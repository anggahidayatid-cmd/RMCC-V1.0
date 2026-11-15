import React from 'react';
import { Campaign } from '../../types';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface DeleteCampaignModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isDeleting?: boolean;
}

export const DeleteCampaignModal: React.FC<DeleteCampaignModalProps> = ({
  isOpen,
  campaign,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-surface border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-dark p-1.5 rounded-xl hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-dark">
            {t('campaigns.deleteConfirmTitle', { name: campaign.name })}
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            {t('campaigns.deleteConfirmMessage', { name: campaign.name, code: campaign.code })}
          </p>
        </div>

        {/* Campaign Info Card */}
        <div className="bg-background border border-border p-3.5 rounded-xl text-xs space-y-1">
          <div className="flex justify-between text-muted">
            <span>{t('campaigns.colChannel')}:</span>
            <span className="font-medium text-dark">{campaign.channel}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>{t('campaigns.colBudget')}:</span>
            <span className="font-medium text-dark">Rp {campaign.budget.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>{t('campaigns.colStatus')}:</span>
            <span className="font-semibold text-rose-600">{campaign.status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 border border-border rounded-xl text-xs font-semibold text-dark hover:bg-background transition-colors"
          >
            {t('campaigns.cancel')}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(campaign.id)}
            disabled={isDeleting}
            className="px-4 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 flex items-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? t('campaigns.deleting') : t('campaigns.deleteCampaign')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCampaignModal;
