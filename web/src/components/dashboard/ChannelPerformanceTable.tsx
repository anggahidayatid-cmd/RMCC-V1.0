import React from 'react';
import {
  Instagram,
  Video,
  Share2,
  Globe,
  MessageSquare,
  Users,
  TrendingUp,
  Layers
} from 'lucide-react';
import { ChannelPerformance } from '../../types';
import { useTranslation } from '../../i18n';

export interface ChannelPerformanceTableProps {
  channels?: ChannelPerformance[];
}

export const ChannelPerformanceTable: React.FC<ChannelPerformanceTableProps> = ({ channels }) => {
  const { t } = useTranslation();

  const channelData: ChannelPerformance[] = channels && channels.length > 0 ? channels : [
    { channel: 'Instagram', spend: 8000000, revenue: 42000000, roas: 5.25, reservations: 65, guests: 240 },
    { channel: 'TikTok', spend: 5200000, revenue: 31000000, roas: 5.96, reservations: 48, guests: 180 },
    { channel: 'Meta Ads', spend: 4400000, revenue: 22000000, roas: 5.00, reservations: 32, guests: 120 },
    { channel: 'Google', spend: 3000000, revenue: 15000000, roas: 5.00, reservations: 24, guests: 90 },
    { channel: 'WhatsApp', spend: 1200000, revenue: 8200000, roas: 6.83, reservations: 15, guests: 60 },
    { channel: 'CRM', spend: 800000, revenue: 2000000, roas: 2.50, reservations: 0, guests: 0 }
  ];

  const totalSpend = channelData.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = channelData.reduce((acc, c) => acc + c.revenue, 0);
  const totalReservations = channelData.reduce((acc, c) => acc + c.reservations, 0);
  const totalGuests = channelData.reduce((acc, c) => acc + c.guests, 0);
  const blendedRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const getChannelIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'tiktok':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'meta ads':
        return <Share2 className="w-4 h-4 text-blue-600" />;
      case 'google':
        return <Globe className="w-4 h-4 text-emerald-600" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'crm':
        return <Users className="w-4 h-4 text-amber-500" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  const getRoasBadgeClass = (roas: number) => {
    if (roas >= 5.5) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (roas >= 4.0) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-dark flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>{t('dashboard.channelBreakdownTitle')}</span>
          </h2>
          <p className="text-xs text-muted">{t('dashboard.channelBreakdownSubtitle')}</p>
        </div>
        <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 self-start sm:self-auto">
          {t('dashboard.activeChannelsCount', { count: 6 })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-xs">
          <thead className="bg-background text-muted uppercase font-bold text-[10px] tracking-wider border-b border-border">
            <tr>
              <th className="py-3.5 px-4">{t('dashboard.colChannel')}</th>
              <th className="py-3.5 px-4 text-right">{t('dashboard.colTotalSpend')}</th>
              <th className="py-3.5 px-4 text-right">{t('dashboard.colAttributedRevenue')}</th>
              <th className="py-3.5 px-4 text-center">{t('dashboard.colRoas')}</th>
              <th className="py-3.5 px-4 text-right">{t('dashboard.colReservations')}</th>
              <th className="py-3.5 px-4 text-right">{t('dashboard.colGuestCount')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-dark">
            {channelData.map((item, idx) => (
              <tr key={idx} className="hover:bg-background/80 transition-colors font-medium">
                <td className="py-3.5 px-4 flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-100 shrink-0">
                    {getChannelIcon(item.channel)}
                  </div>
                  <span className="font-bold text-dark">{item.channel}</span>
                </td>
                <td className="py-3.5 px-4 text-right font-semibold">{formatCurrency(item.spend)}</td>
                <td className="py-3.5 px-4 text-right font-bold text-dark">{formatCurrency(item.revenue)}</td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getRoasBadgeClass(
                      item.roas
                    )}`}
                  >
                    {item.roas.toFixed(2)}x
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-semibold">{t('dashboard.tables', { count: item.reservations })}</td>
                <td className="py-3.5 px-4 text-right font-semibold">{t('dashboard.covers', { count: item.guests })}</td>
              </tr>
            ))}
          </tbody>
          {/* Summary Row */}
          <tfoot className="bg-slate-900 text-white font-bold text-xs border-t-2 border-slate-800">
            <tr>
              <td className="py-3.5 px-4 font-black tracking-wide">{t('dashboard.totalBlended')}</td>
              <td className="py-3.5 px-4 text-right text-emerald-400">{formatCurrency(totalSpend)}</td>
              <td className="py-3.5 px-4 text-right text-emerald-400">{formatCurrency(totalRevenue)}</td>
              <td className="py-3.5 px-4 text-center">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm">
                  {blendedRoas.toFixed(2)}x
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">{t('dashboard.tables', { count: totalReservations })}</td>
              <td className="py-3.5 px-4 text-right">{t('dashboard.covers', { count: totalGuests })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ChannelPerformanceTable;
