import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  RefreshCw,
  Download,
  Smartphone,
  Utensils,
  Layers
} from 'lucide-react';
import KpiGrid from './KpiGrid';
import CampaignHighlights from './CampaignHighlights';
import ChannelPerformanceTable from './ChannelPerformanceTable';
import InsightCards from './InsightCards';
import { campaignService } from '../../services/campaignService';
import { groIntegrationService } from '../../services/groIntegrationService';
import {
  DashboardMetrics,
  ChannelPerformance,
  ManagementInsight,
  GOSSyncedData
} from '../../types';
import { useTranslation } from '../../i18n';

export interface DashboardViewProps {
  selectedWorkspace?: string;
  onNavigateTab?: (tabId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  selectedWorkspace = 'Gourmet Bistro',
  onNavigateTab
}) => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [channels, setChannels] = useState<ChannelPerformance[]>([]);
  const [insights, setInsights] = useState<ManagementInsight[]>([]);
  const [gosData, setGosData] = useState<GOSSyncedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<string>('Oct 1 - Oct 31, 2026');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [m, cData, iData] = await Promise.all([
        campaignService.getDashboardMetrics(),
        campaignService.getChannelPerformance(),
        campaignService.getInsights()
      ]);
      setMetrics(m);
      setChannels(cData);
      setInsights(iData);
      setGosData(groIntegrationService.getSyncedGOSData());
    } catch (err) {
      console.error('Failed loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedWorkspace]);

  return (
    <div className="space-y-6">
      {/* Dashboard View Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-dark to-slate-900 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary-light text-xs font-semibold border border-primary/30">
              {t('dashboard.executiveOverview')}
            </span>
            <span className="text-slate-400 text-xs">• {selectedWorkspace}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-xs text-slate-300">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Action Controls & Date Picker */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          {/* Date Selector */}
          <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-xl text-xs font-medium text-slate-200">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none text-white focus:ring-0 text-xs font-medium cursor-pointer"
            >
              <option value="Oct 1 - Oct 31, 2026" className="bg-slate-900 text-white">{t('dashboard.octoberMtd')}</option>
              <option value="Sep 1 - Sep 30, 2026" className="bg-slate-900 text-white">{t('dashboard.september2026')}</option>
              <option value="Q4 2026" className="bg-slate-900 text-white">{t('dashboard.q4Forecast')}</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="p-2.5 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl transition-colors hover:text-white"
            title={t('dashboard.refreshData')}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>

          {/* Export Report Button */}
          <button
            onClick={() => onNavigateTab && onNavigateTab('reports')}
            className="px-3.5 py-2 bg-primary hover:bg-primary/90 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('dashboard.exportReport')}</span>
          </button>
        </div>
      </div>

      {loading && !metrics ? (
        <div className="bg-surface rounded-2xl p-12 text-center border border-border">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted font-medium">{t('dashboard.loadingOverview')}</p>
        </div>
      ) : (
        <>
          {/* 1. Executive Management Insights */}
          <InsightCards
            insights={insights}
            onActionClick={() => {
              if (onNavigateTab) onNavigateTab('campaigns');
            }}
          />

          {/* 2. KPI Metrics Grid */}
          {metrics && <KpiGrid metrics={metrics} />}

          {/* 3. Campaign Performance Highlights (Top vs Underperforming) */}
          <CampaignHighlights
            topCampaign={metrics?.topCampaign}
            underperformingCampaign={metrics?.underperformingCampaign}
          />

          {/* 4. Channel Performance Table */}
          <ChannelPerformanceTable channels={channels} />

          {/* 5. GOS V1.1 Floor Intelligence & Campaign Attribution */}
          {gosData && (
            <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-dark flex items-center space-x-2">
                    <Smartphone className="w-5 h-5 text-teal-600" />
                    <span>GOS V1.1 Floor Intelligence & Campaign Attribution</span>
                  </h2>
                  <p className="text-xs text-muted">Real-time floor sync across reservations, table logs, and marketing campaign ROI</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full border border-teal-200">
                    {gosData.reservations.length} Active Reservations
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-200">
                    {gosData.shiftClosings.filter(s => s.status === 'LOCKED').length} Shifts Locked
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Synced Reservations & Table Logs */}
                <div className="bg-background rounded-xl p-4 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-dark uppercase tracking-wider flex items-center space-x-1.5">
                    <Utensils className="w-4 h-4 text-primary" />
                    <span>Recent Floor Reservations & Table Assignments</span>
                  </h3>
                  <div className="space-y-2">
                    {gosData.reservations.slice(0, 3).map((res) => (
                      <div key={res.id} className="p-3 bg-surface rounded-lg border border-border flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-dark flex items-center space-x-2">
                            <span>{res.guestName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {res.tableAssigned}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">
                            Channel: <strong className="text-dark">{res.inquiryChannel}</strong> • Date: {res.reservationDate} ({res.timeSlot})
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {res.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Attribution & Shift Closings */}
                <div className="bg-background rounded-xl p-4 border border-border space-y-3">
                  <h3 className="text-xs font-bold text-dark uppercase tracking-wider flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Shift Closings & Campaign Attribution</span>
                  </h3>
                  <div className="space-y-2">
                    {gosData.shiftClosings.map((shift) => (
                      <div key={shift.id} className="p-3 bg-surface rounded-lg border border-border flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-dark">
                            {shift.shiftName} Shift ({shift.shiftDate})
                          </div>
                          <div className="text-[11px] text-muted mt-0.5">
                            Handed over by: <strong className="text-dark">{shift.handedOverBy}</strong> • {shift.totalReservations} Res, {shift.totalWalkIns} Walk-ins
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-emerald-600">
                            Rp {shift.totalRevenue.toLocaleString('id-ID')}
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800">
                            {shift.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardView;
