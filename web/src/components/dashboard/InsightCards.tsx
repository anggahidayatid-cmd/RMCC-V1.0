import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ManagementInsight, InsightType } from '../../types';
import { useTranslation } from '../../i18n';

export interface InsightCardsProps {
  insights?: ManagementInsight[];
  onActionClick?: (insight: ManagementInsight) => void;
}

export const InsightCards: React.FC<InsightCardsProps> = ({ insights, onActionClick }) => {
  const { t } = useTranslation();

  const defaultInsights: ManagementInsight[] = [
    {
      id: 'INS-001',
      type: 'Positive',
      message: 'Live Music October generates highest attributed revenue (Rp41.800.000).'
    },
    {
      id: 'INS-002',
      type: 'Warning',
      message: 'Lunch Weekday is currently below its 4x target ROAS.'
    },
    {
      id: 'INS-003',
      type: 'Recommendation',
      message: 'Weekend Family package has consumed 80% of budget and remains above target ROAS (5.97x).'
    }
  ];

  const list = insights && insights.length > 0 ? insights : defaultInsights;

  const getInsightConfig = (type: InsightType) => {
    switch (type) {
      case 'Positive':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-emerald-50/70',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-900',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          iconColor: 'text-emerald-600',
          actionText: t('dashboard.optimizeCreative'),
          buttonClass: 'text-emerald-700 hover:text-emerald-900 bg-emerald-100/60 hover:bg-emerald-100'
        };
      case 'Warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-50/70',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-900',
          badgeBg: 'bg-amber-100 text-amber-800',
          iconColor: 'text-amber-600',
          actionText: t('dashboard.reviewCampaign'),
          buttonClass: 'text-amber-700 hover:text-amber-900 bg-amber-100/60 hover:bg-amber-100'
        };
      case 'Recommendation':
        return {
          icon: Sparkles,
          bgColor: 'bg-purple-50/70',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-900',
          badgeBg: 'bg-purple-100 text-purple-800',
          iconColor: 'text-purple-600',
          actionText: t('dashboard.expandBudget'),
          buttonClass: 'text-purple-700 hover:text-purple-900 bg-purple-100/60 hover:bg-purple-100'
        };
      default:
        return {
          icon: ShieldAlert,
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          textColor: 'text-slate-900',
          badgeBg: 'bg-slate-200 text-slate-800',
          iconColor: 'text-slate-600',
          actionText: t('dashboard.details'),
          buttonClass: 'text-slate-700 hover:text-slate-900 bg-slate-200/60 hover:bg-slate-200'
        };
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-dark flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span>{t('dashboard.insightsTitle')}</span>
          </h2>
          <p className="text-xs text-muted">{t('dashboard.insightsSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((item) => {
          const config = getInsightConfig(item.type);
          const Icon = config.icon;
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border ${config.bgColor} ${config.borderColor} flex flex-col justify-between space-y-3 transition-transform hover:-translate-y-0.5 duration-200`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.badgeBg}`}>
                    {item.type}
                  </span>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <p className={`text-xs font-semibold leading-relaxed ${config.textColor}`}>
                  {item.message}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 flex justify-end">
                <button
                  onClick={() => onActionClick && onActionClick(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${config.buttonClass}`}
                >
                  <span>{config.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightCards;
