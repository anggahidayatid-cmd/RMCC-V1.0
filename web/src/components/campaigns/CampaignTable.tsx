import React from 'react';
import { Campaign } from '../../types';
import { Eye, Edit, Trash2, Calendar, Share2, Layers } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface CampaignTableProps {
  campaigns: Campaign[];
  onView: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  onView,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}) => {
  const { t } = useTranslation();

  if (campaigns.length === 0) {
    return (
      <div className="p-12 text-center bg-surface border border-border rounded-2xl space-y-3">
        <Layers className="w-12 h-12 text-muted mx-auto" />
        <h3 className="text-base font-bold text-dark">{t('campaigns.noCampaignsFound')}</h3>
        <p className="text-xs text-muted max-w-sm mx-auto">
          {t('campaigns.noCampaignsFoundSubtitle')}
        </p>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Paused':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Draft':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRoasPillClass = (roas: number) => {
    if (roas >= 4.0) return 'bg-emerald-100 text-emerald-800 font-bold border-emerald-300';
    if (roas >= 2.5) return 'bg-amber-100 text-amber-800 font-bold border-amber-300';
    return 'bg-rose-100 text-rose-800 font-bold border-rose-300';
  };

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background/80 border-b border-border text-[11px] font-bold text-muted uppercase tracking-wider">
              <th className="py-3.5 px-4">{t('campaigns.colNameCode')}</th>
              <th className="py-3.5 px-4">{t('campaigns.colChannel')}</th>
              <th className="py-3.5 px-4">{t('campaigns.colDateRange')}</th>
              <th className="py-3.5 px-4 text-right">{t('campaigns.colBudget')}</th>
              <th className="py-3.5 px-4 text-right">{t('campaigns.colSpend')}</th>
              <th className="py-3.5 px-4 text-right">{t('campaigns.colRevenue')}</th>
              <th className="py-3.5 px-4 text-center">{t('campaigns.colRoas')}</th>
              <th className="py-3.5 px-4 text-center">{t('campaigns.colStatus')}</th>
              <th className="py-3.5 px-4 text-center">{t('campaigns.colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {campaigns.map((camp) => {
              const spend = camp.spend || 0;
              const revenue = camp.revenue || 0;
              const roas = spend > 0 ? revenue / spend : 0;

              return (
                <tr
                  key={camp.id}
                  className="hover:bg-background/60 transition-colors group"
                >
                  {/* Campaign Name & Code */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="font-bold text-dark group-hover:text-primary transition-colors flex items-center space-x-1.5">
                        <span>{camp.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-muted bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                          {camp.code}
                        </span>
                        <span className="text-[10px] text-muted truncate max-w-[150px]">
                          {camp.type}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Channel Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                      <Share2 className="w-3 h-3 text-primary" />
                      <span>{camp.channel}</span>
                    </span>
                  </td>

                  {/* Date Range */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-muted text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-muted shrink-0" />
                      <span>{camp.startDate} ~ {camp.endDate}</span>
                    </div>
                  </td>

                  {/* Budget */}
                  <td className="py-3.5 px-4 text-right font-medium text-dark whitespace-nowrap">
                    Rp {camp.budget.toLocaleString('id-ID')}
                  </td>

                  {/* Spend */}
                  <td className="py-3.5 px-4 text-right font-medium text-slate-700 whitespace-nowrap">
                    Rp {spend.toLocaleString('id-ID')}
                  </td>

                  {/* Revenue */}
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                    Rp {revenue.toLocaleString('id-ID')}
                  </td>

                  {/* Color-Coded ROAS Pill */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs border ${getRoasPillClass(
                        roas
                      )}`}
                    >
                      {roas.toFixed(2)}x
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(
                        camp.status
                      )}`}
                    >
                      {camp.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        onClick={() => onView(camp)}
                        title={t('campaigns.viewDetails')}
                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => canEdit && onEdit(camp)}
                        disabled={!canEdit}
                        title={!canEdit ? "Permission 'Create & Edit Campaigns' required" : t('campaigns.editCampaign')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          canEdit
                            ? 'text-muted hover:text-dark hover:bg-slate-100 cursor-pointer'
                            : 'text-slate-300 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => canDelete && onDelete(camp)}
                        disabled={!canDelete}
                        title={!canDelete ? "Permission 'Delete Campaigns' required" : t('campaigns.deleteCampaign')}
                        className={`p-1.5 rounded-lg transition-colors ${
                          canDelete
                            ? 'text-muted hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                            : 'text-slate-300 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignTable;
