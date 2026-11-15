import React, { useState } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Calendar,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  AlertTriangle,
  Sparkles,
  Target,
  Zap,
  PieChart,
  ShieldCheck,
  Calculator,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useRbac } from '../../context/RbacContext';

export type ReportTypeId = 'monthly_marketing' | 'campaign_performance' | 'audience_crm' | 'executive_board';
export type PeriodId = 'oct_2026' | 'q4_2026' | 'ytd_2026' | 'custom';

export const ReportsView: React.FC = () => {
  const { t } = useTranslation();
  const { hasPermission, userRole } = useRbac();
  const canExportReports = hasPermission('export_reports');

  // Selected Controls State
  const [reportType, setReportType] = useState<ReportTypeId>('monthly_marketing');
  const [period, setPeriod] = useState<PeriodId>('oct_2026');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-10-31');

  // Action Loading & Toast State
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper currency formatter
  const formatIdr = (val: number): string => {
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  // 1. Dynamic Financial Metrics Based on Period
  const getFinancialMetrics = () => {
    switch (period) {
      case 'q4_2026':
        return {
          spend: 68400000,
          revenue: 378500000,
          netContribution: 310100000,
          roas: 5.53,
          reservations: 1020,
          guests: 2860,
          cpa: 23916,
        };
      case 'ytd_2026':
        return {
          spend: 210000000,
          revenue: 1150000000,
          netContribution: 940000000,
          roas: 5.48,
          reservations: 3150,
          guests: 8820,
          cpa: 23810,
        };
      case 'custom': {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        const diffMs = end.getTime() - start.getTime();
        const diffDays = Math.max(1, Math.round(diffMs / (1000 * 3600 * 24)) + 1);
        const factor = diffDays / 31;
        const spend = Math.round(22600000 * factor);
        const revenue = Math.round(120200000 * factor);
        const guests = Math.max(1, Math.round(958 * factor));
        return {
          spend,
          revenue,
          netContribution: revenue - spend,
          roas: spend > 0 ? Number((revenue / spend).toFixed(2)) : 0,
          reservations: Math.round(342 * factor),
          guests,
          cpa: Math.round(spend / guests),
        };
      }
      case 'oct_2026':
      default:
        return {
          spend: 22600000,
          revenue: 120200000,
          netContribution: 97600000,
          roas: 5.32,
          reservations: 342,
          guests: 958,
          cpa: 23590,
        };
    }
  };

  const metrics = getFinancialMetrics();

  // 2. Campaign & Channel Detailed Table Data
  const getCampaignTableData = () => {
    const mult = period === 'q4_2026' ? 3.0 : period === 'ytd_2026' ? 9.2 : period === 'custom' ? 1.0 : 1.0;
    return [
      {
        code: 'CMP-2026-001',
        name: 'Live Music Acoustic Weekend',
        channel: 'Instagram + TikTok',
        plannedBudget: Math.round(9000000 * mult),
        actualSpend: Math.round(7200000 * mult),
        attributedRevenue: Math.round(41800000 * mult),
        roas: 5.81,
        targetAchievement: 105,
        status: 'Active',
      },
      {
        code: 'CMP-2026-002',
        name: 'Weekend Family Dining Package',
        channel: 'Instagram + WhatsApp',
        plannedBudget: Math.round(8000000 * mult),
        actualSpend: Math.round(6400000 * mult),
        attributedRevenue: Math.round(38200000 * mult),
        roas: 5.97,
        targetAchievement: 106,
        status: 'Active',
      },
      {
        code: 'CMP-2026-003',
        name: 'Birthday VIP Experience Trigger',
        channel: 'CRM + WhatsApp',
        plannedBudget: Math.round(5000000 * mult),
        actualSpend: Math.round(3800000 * mult),
        attributedRevenue: Math.round(18400000 * mult),
        roas: 4.84,
        targetAchievement: 92,
        status: 'Active',
      },
      {
        code: 'CMP-2026-004',
        name: 'Office Lunch Weekday Promo',
        channel: 'Google + Meta Ads',
        plannedBudget: Math.round(7000000 * mult),
        actualSpend: Math.round(5200000 * mult),
        attributedRevenue: Math.round(21800000 * mult),
        roas: 4.19,
        targetAchievement: 78,
        status: 'Paused',
      },
      {
        code: 'CMP-2026-005',
        name: 'Q4 Holiday Dining Pre-Sale',
        channel: 'TikTok + Influencers',
        plannedBudget: Math.round(6000000 * mult),
        actualSpend: 0,
        attributedRevenue: 0,
        roas: 0.0,
        targetAchievement: 0,
        status: 'Scheduled',
      },
    ];
  };

  const campaignRows = getCampaignTableData();

  // Calculate Footnote Summary Totals
  const totalPlannedBudget = campaignRows.reduce((acc, r) => acc + r.plannedBudget, 0);
  const totalActualSpend = campaignRows.reduce((acc, r) => acc + r.actualSpend, 0);
  const totalAttributedRevenue = campaignRows.reduce((acc, r) => acc + r.attributedRevenue, 0);
  const blendedRoasVal = totalActualSpend > 0 ? (totalAttributedRevenue / totalActualSpend).toFixed(2) : '0.00';
  const avgTargetAchievement = Math.round(
    campaignRows.filter((r) => r.actualSpend > 0).reduce((acc, r) => acc + r.targetAchievement, 0) /
      Math.max(1, campaignRows.filter((r) => r.actualSpend > 0).length)
  );

  // 3. Audience & GRO App Intelligence Data
  const audienceIntel = {
    newGuestsPercent: 35,
    repeatGuestsPercent: 65,
    newGuestsCount: Math.round(metrics.guests * 0.35),
    repeatGuestsCount: Math.round(metrics.guests * 0.65),
    groSyncedProfiles: 1248,
    groActiveReservations: Math.round(metrics.reservations * 0.25),
    avgClv: 1480000,
    clvGrowthYoY: 15.8,
    avgVisitFreq: 2.6,
  };

  // 4. Strategic Recommendations Data
  const recommendationsData = {
    positive: [
      'Live Music Acoustic Weekend campaign delivered peak 5.81x ROAS, attributing Rp 41.8M directly to Friday-Saturday dinner seatings.',
      'WhatsApp CRM birthday triggers achieved zero ad-waste conversion, yielding Rp 18.4M in high-margin party bookings.',
      'Customer Lifetime Value (CLV) grew by +15.8% YoY to Rp 1.480.000, backed by 65% repeat guest retention.',
    ],
    warnings: [
      'Office Lunch Weekday campaign on Google/Meta is under-pacing at 78% target achievement; daily ad burn rate exceeds return.',
      'TikTok video creative frequency on Ad Set B shows early fatigue with CTR dipping by -1.2% over the last 7 days.',
      'Q4 Year-End Holiday promo budget is reserved but unspent; requires early deployment to capture November advance table bookings.',
    ],
    actions: [
      'Reallocate Rp 1.800.000 from underperforming Office Lunch Google ads to boost viral Acoustic Night TikTok Reels.',
      'Expand automated WhatsApp broadcast to target guests with no visits in the past 45 days with a complimentary dessert incentive.',
      'Partner with local corporate office admins to launch a dedicated Q4 corporate dining pass.',
    ],
  };

  // Get localized label for report type & period
  const getReportTypeLabel = (type: ReportTypeId) => {
    return t(`reports.reportTypes.${type}`);
  };

  const getPeriodLabel = (p: PeriodId) => {
    if (p === 'custom') {
      return `${t('reports.periods.custom')} (${customStartDate} - ${customEndDate})`;
    }
    return t(`reports.periods.${p}`);
  };

  // Action 1: Copy Executive Summary to Clipboard
  const handleCopySummary = async () => {
    const summaryText = `====================================================
Gourmet Bistro Cafe & Resto • Executive Report
${getReportTypeLabel(reportType).toUpperCase()}
Period: ${getPeriodLabel(period)}
Generated: ${new Date().toISOString().split('T')[0]}
====================================================

[EXECUTIVE FINANCIAL SUMMARY]
• Total Marketing Spend: ${formatIdr(metrics.spend)}
• Total Attributed Revenue: ${formatIdr(metrics.revenue)}
• Net Contribution: ${formatIdr(metrics.netContribution)}
• Blended ROAS: ${metrics.roas}x
• Total Reservations: ${metrics.reservations} Tables
• Total Guests: ${metrics.guests} Covers
• Cost Per Guest (CPA): ${formatIdr(metrics.cpa)} / cover

[CAMPAIGN PERFORMANCE FOOTNOTE SUMMARY]
• Total Planned Budget: ${formatIdr(totalPlannedBudget)}
• Total Actual Spend: ${formatIdr(totalActualSpend)}
• Total Attributed Revenue: ${formatIdr(totalAttributedRevenue)}
• Blended ROAS: ${blendedRoasVal}x
• Target Achievement Average: ${avgTargetAchievement}%

[AUDIENCE & GRO APP INTELLIGENCE]
• Guest Breakdown: ${audienceIntel.newGuestsPercent}% New (${audienceIntel.newGuestsCount} guests) | ${audienceIntel.repeatGuestsPercent}% Repeat (${audienceIntel.repeatGuestsCount} guests)
• GRO App Synced Guest Profiles: ${audienceIntel.groSyncedProfiles}
• Average Customer Lifetime Value (CLV): ${formatIdr(audienceIntel.avgClv)} (+${audienceIntel.clvGrowthYoY}% YoY)
• Average Visit Frequency: ${audienceIntel.avgVisitFreq}x / month

[EXECUTIVE STRATEGIC RECOMMENDATIONS]
1. ${recommendationsData.actions[0]}
2. ${recommendationsData.actions[1]}
3. ${recommendationsData.actions[2]}

====================================================
Marketing Command Center (RMCC) • Confidential
====================================================`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setToastMessage(t('reports.copiedSuccess'));
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setToastMessage('Failed to copy to clipboard.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Action 2: Export Structured CSV File
  const handleExportCsv = () => {
    if (!canExportReports) {
      setToastMessage(`RBAC Restriction: Role '${t(`settings.roles.${userRole}`)}' lacks 'Export Executive Reports' permission.`);
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    setIsExportingCsv(true);
    setTimeout(() => {
      const csvRows = [
        ['Gourmet Bistro Cafe & Resto - Enterprise Executive Report Suite'],
        ['Report Type', getReportTypeLabel(reportType)],
        ['Reporting Period', getPeriodLabel(period)],
        ['Export Date', new Date().toISOString().split('T')[0]],
        [],
        ['--- EXECUTIVE FINANCIAL SUMMARY ---'],
        ['Metric Name', 'Value'],
        ['Total Marketing Spend', metrics.spend],
        ['Total Attributed Revenue', metrics.revenue],
        ['Net Contribution', metrics.netContribution],
        ['Blended ROAS', `${metrics.roas}x`],
        ['Total Reservations', metrics.reservations],
        ['Total Guests', metrics.guests],
        ['Cost Per Guest (CPA)', metrics.cpa],
        [],
        ['--- DETAILED CAMPAIGN & SALURAN PERFORMANCE ---'],
        [
          'Campaign Code',
          'Campaign Name',
          'Saluran / Channel',
          'Planned Budget (IDR)',
          'Actual Spend (IDR)',
          'Attributed Revenue (IDR)',
          'ROAS',
          'Target Achievement %',
          'Status',
        ],
        ...campaignRows.map((r) => [
          r.code,
          `"${r.name}"`,
          `"${r.channel}"`,
          r.plannedBudget,
          r.actualSpend,
          r.attributedRevenue,
          `${r.roas}x`,
          `${r.targetAchievement}%`,
          r.status,
        ]),
        [
          'TOTALS',
          'FOOTNOTE SUMMARY',
          'ALL CHANNELS',
          totalPlannedBudget,
          totalActualSpend,
          totalAttributedRevenue,
          `${blendedRoasVal}x`,
          `${avgTargetAchievement}%`,
          'SUMMARY',
        ],
        [],
        ['--- AUDIENCE & GRO APP INTELLIGENCE ---'],
        ['New Guests %', `${audienceIntel.newGuestsPercent}%`],
        ['Repeat Guests %', `${audienceIntel.repeatGuestsPercent}%`],
        ['GRO Synced Profiles', audienceIntel.groSyncedProfiles],
        ['Avg CLV (IDR)', audienceIntel.avgClv],
        ['CLV YoY Growth', `+${audienceIntel.clvGrowthYoY}%`],
        [],
        ['--- ACTIONABLE STRATEGIC RECOMMENDATIONS ---'],
        ...recommendationsData.actions.map((act, i) => [`Rec #${i + 1}`, `"${act}"`]),
      ];

      const csvContent = csvRows.map((e) => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}_${period}_Executive_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExportingCsv(false);
      setToastMessage(`CSV Report exported successfully.`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 800);
  };

  // Action 3: Download Formatted Printable PDF Executive Memo
  const handleExportPdf = () => {
    if (!canExportReports) {
      setToastMessage(`RBAC Restriction: Role '${t(`settings.roles.${userRole}`)}' lacks 'Export Executive Reports' permission.`);
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }
    setIsExportingPdf(true);
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${getReportTypeLabel(reportType)} - Gourmet Bistro Resto</title>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0f172a; padding: 40px; line-height: 1.5; background: #ffffff; }
                .brand-bar { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #4f46e5; padding-bottom: 20px; margin-bottom: 25px; }
                .brand-title { font-size: 13px; font-weight: 800; color: #4f46e5; text-transform: uppercase; tracking: 1px; }
                h1 { font-size: 22px; margin: 6px 0 2px 0; color: #0f172a; font-weight: 800; }
                .sub-text { font-size: 12px; color: #64748b; }
                .badge { font-size: 10px; font-weight: 800; background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; }
                .grid-7 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 25px; }
                .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 8px; }
                .card-title { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
                .card-val { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 4px; }
                .card-sub { font-size: 10px; color: #16a34a; font-weight: 600; margin-top: 2px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
                th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
                th { background: #f1f5f9; color: #334155; font-weight: 700; font-size: 11px; text-transform: uppercase; }
                .summary-row { background: #e2e8f0; font-weight: 800; color: #0f172a; }
                .section-header { font-size: 14px; font-weight: 800; color: #1e293b; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
                .intel-box { background: #faf5ff; border: 1px solid #e9d5ff; padding: 14px; border-radius: 8px; margin-top: 15px; font-size: 12px; }
                .recs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 15px; }
                .rec-card { border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 11px; background: #fafafa; }
                .rec-card h4 { margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; font-weight: 800; }
                ul { margin: 0; padding-left: 16px; }
                li { margin-bottom: 6px; }
                .signatures { display: flex; justify-content: space-between; margin-top: 40px; pt-20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #475569; }
                .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
              </style>
            </head>
            <body>
              <div class="brand-bar">
                <div>
                  <div class="brand-title">Gourmet Bistro Cafe & Resto • Marketing Command Center</div>
                  <h1>${getReportTypeLabel(reportType)}</h1>
                  <div class="sub-text">Reporting Period: <b>${getPeriodLabel(period)}</b> • Generated on ${new Date().toLocaleDateString()}</div>
                </div>
                <div style="text-align: right;">
                  <span class="badge">VERIFIED EXECUTIVE REPORT</span>
                  <div class="sub-text" style="margin-top: 6px;">Doc ID: MCC-RPT-2026-X8</div>
                </div>
              </div>

              <div class="section-header">1. Executive Financial Summary</div>
              <div class="grid-7">
                <div class="card">
                  <div class="card-title">Total Spend</div>
                  <div class="card-val">${formatIdr(metrics.spend)}</div>
                  <div class="card-sub">Budget Pacing: Optimal</div>
                </div>
                <div class="card">
                  <div class="card-title">Attributed Revenue</div>
                  <div class="card-val" style="color: #15803d;">${formatIdr(metrics.revenue)}</div>
                  <div class="card-sub">+18.2% vs target</div>
                </div>
                <div class="card">
                  <div class="card-title">Net Contribution</div>
                  <div class="card-val" style="color: #4f46e5;">${formatIdr(metrics.netContribution)}</div>
                  <div class="card-sub">Net Profit Margin 81%</div>
                </div>
                <div class="card">
                  <div class="card-title">Blended ROAS</div>
                  <div class="card-val" style="color: #4f46e5;">${metrics.roas}x</div>
                  <div class="card-sub">Target: 4.50x</div>
                </div>
                <div class="card">
                  <div class="card-title">Total Reservations</div>
                  <div class="card-val">${metrics.reservations} Tables</div>
                  <div class="card-sub">+12.4% MoM</div>
                </div>
                <div class="card">
                  <div class="card-title">Total Guests</div>
                  <div class="card-val">${metrics.guests} Covers</div>
                  <div class="card-sub">Avg ~2.8 guests/table</div>
                </div>
                <div class="card" style="grid-column: span 2;">
                  <div class="card-title">Cost Per Guest (CPA)</div>
                  <div class="card-val" style="color: #0369a1;">${formatIdr(metrics.cpa)} / cover</div>
                  <div class="card-sub">Highly Efficient Acquisition Cost</div>
                </div>
              </div>

              <div class="section-header">2. Detailed Campaign & Saluran Performance Table</div>
              <table>
                <thead>
                  <tr>
                    <th>Campaign & Code</th>
                    <th>Saluran / Channel</th>
                    <th style="text-align: right;">Planned Budget</th>
                    <th style="text-align: right;">Actual Spend</th>
                    <th style="text-align: right;">Attributed Revenue</th>
                    <th style="text-align: center;">ROAS</th>
                    <th style="text-align: center;">Target %</th>
                    <th style="text-align: center;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${campaignRows
                    .map(
                      (r) => `
                    <tr>
                      <td><b>${r.name}</b><br><span style="font-size: 10px; color: #64748b;">${r.code}</span></td>
                      <td>${r.channel}</td>
                      <td style="text-align: right;">${formatIdr(r.plannedBudget)}</td>
                      <td style="text-align: right;">${formatIdr(r.actualSpend)}</td>
                      <td style="text-align: right; color: #15803d; font-weight: bold;">${formatIdr(r.attributedRevenue)}</td>
                      <td style="text-align: center; color: #4f46e5; font-weight: bold;">${r.roas}x</td>
                      <td style="text-align: center; font-weight: bold;">${r.targetAchievement}%</td>
                      <td style="text-align: center;">${r.status}</td>
                    </tr>
                  `
                    )
                    .join('')}
                  <tr class="summary-row">
                    <td>FOOTNOTE TOTALS</td>
                    <td>ALL SALURAN</td>
                    <td style="text-align: right;">${formatIdr(totalPlannedBudget)}</td>
                    <td style="text-align: right;">${formatIdr(totalActualSpend)}</td>
                    <td style="text-align: right;">${formatIdr(totalAttributedRevenue)}</td>
                    <td style="text-align: center;">${blendedRoasVal}x</td>
                    <td style="text-align: center;">${avgTargetAchievement}%</td>
                    <td style="text-align: center;">SUMMARY</td>
                  </tr>
                </tbody>
              </table>

              <div class="section-header">3. Audience & GRO App Integration Intelligence</div>
              <div class="intel-box">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <div><b>Guest Ratio:</b> ${audienceIntel.newGuestsPercent}% New Customers (${audienceIntel.newGuestsCount} covers) vs ${audienceIntel.repeatGuestsPercent}% Repeat Customers (${audienceIntel.repeatGuestsCount} covers)</div>
                  <div><b>GRO Synced Profiles:</b> ${audienceIntel.groSyncedProfiles} Guests</div>
                </div>
                <div><b>Customer Lifetime Value (CLV):</b> Average ${formatIdr(audienceIntel.avgClv)} per guest (+${audienceIntel.clvGrowthYoY}% YoY Growth) • Avg Visit Frequency: ${audienceIntel.avgVisitFreq}x / month</div>
              </div>

              <div class="section-header">4. Executive Strategic Recommendations</div>
              <div class="recs">
                <div class="rec-card" style="border-left: 4px solid #16a34a;">
                  <h4 style="color: #16a34a;">Positive Performance Highlights</h4>
                  <ul>
                    ${recommendationsData.positive.map((item) => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="rec-card" style="border-left: 4px solid #d97706;">
                  <h4 style="color: #d97706;">Budget Pacing Warnings</h4>
                  <ul>
                    ${recommendationsData.warnings.map((item) => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="rec-card" style="border-left: 4px solid #4f46e5;">
                  <h4 style="color: #4f46e5;">Actionable Strategic Recommendations</h4>
                  <ul>
                    ${recommendationsData.actions.map((item) => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              </div>

              <div class="signatures">
                <div>
                  <br><br>
                  ____________________________________<br>
                  <b>Marketing Director</b><br>
                  Marketing Command Center (RMCC)
                </div>
                <div>
                  <br><br>
                  ____________________________________<br>
                  <b>General Manager / Board Owner</b><br>
                  Gourmet Bistro Cafe & Resto
                </div>
              </div>

              <div class="footer">
                Confidential Executive Report • Marketing Command Center (RMCC) Web Application
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }

      setIsExportingPdf(false);
      setToastMessage(`PDF Memo generated successfully.`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card & Executive Controls Bar */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark tracking-tight">{t('reports.title')}</h1>
                <p className="text-xs text-muted mt-0.5 max-w-2xl">{t('reports.subtitle')}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 border border-border bg-surface text-dark hover:bg-background font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              title="Copy formatted markdown text summary to clipboard"
            >
              <Copy className="w-4 h-4 text-primary" />
              <span>{t('reports.copySummary')}</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={isExportingCsv || !canExportReports}
              title={!canExportReports ? "Permission 'Export Executive Reports' required" : undefined}
              className={`px-3.5 py-2 border border-border font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 ${
                canExportReports
                  ? 'bg-surface text-dark hover:bg-background cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{isExportingCsv ? t('reports.exportingCsv') : t('reports.exportCsv')}</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf || !canExportReports}
              title={!canExportReports ? "Permission 'Export Executive Reports' required" : undefined}
              className={`px-4 py-2 font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5 ${
                canExportReports
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPdf ? t('reports.exportingPdf') : t('reports.downloadPdf')}</span>
            </button>
          </div>
        </div>

        {/* Controls Bar: Report Type Selector & Period Selector */}
        <div className="pt-4 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* 1. Report Type Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-dark/70 uppercase tracking-wider flex items-center space-x-1">
              <Filter className="w-3 h-3 text-primary" />
              <span>{t('reports.reportType')}</span>
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportTypeId)}
                className="w-full bg-background border border-border text-dark text-xs rounded-xl px-3 py-2 pr-8 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="monthly_marketing">{t('reports.reportTypes.monthly_marketing')}</option>
                <option value="campaign_performance">{t('reports.reportTypes.campaign_performance')}</option>
                <option value="audience_crm">{t('reports.reportTypes.audience_crm')}</option>
                <option value="executive_board">{t('reports.reportTypes.executive_board')}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Period Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-dark/70 uppercase tracking-wider flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-primary" />
              <span>{t('reports.period')}</span>
            </label>
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodId)}
                className="w-full bg-background border border-border text-dark text-xs rounded-xl px-3 py-2 pr-8 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="oct_2026">{t('reports.periods.oct_2026')}</option>
                <option value="q4_2026">{t('reports.periods.q4_2026')}</option>
                <option value="ytd_2026">{t('reports.periods.ytd_2026')}</option>
                <option value="custom">{t('reports.periods.custom')}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Custom Date Pickers (Shown when Period === 'custom') */}
          {period === 'custom' && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-dark/70 uppercase tracking-wider">
                  {t('reports.startDate')}
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full bg-background border border-border text-dark text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-dark/70 uppercase tracking-wider">
                  {t('reports.endDate')}
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full bg-background border border-border text-dark text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          )}

          {/* Active Period Context Badge */}
          {period !== 'custom' && (
            <div className="sm:col-span-2 lg:col-span-2 flex items-center justify-end">
              <span className="text-xs text-muted font-medium bg-background px-3 py-1.5 rounded-xl border border-border flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Active Context: <b>{getReportTypeLabel(reportType)}</b> • <b>{getPeriodLabel(period)}</b>
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: Executive Financial Summary Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold text-dark uppercase tracking-wider">
              {t('reports.financialSummaryTitle')}
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-muted bg-surface px-2.5 py-0.5 rounded-lg border border-border">
            {getPeriodLabel(period)}
          </span>
        </div>

        {/* 7 Core Financial Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Marketing Spend */}
          <div className="p-4 bg-surface rounded-2xl border border-border shadow-2xs hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('reports.totalSpend')}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-dark mt-2">{formatIdr(metrics.spend)}</div>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Optimal Budget Pacing</span>
            </div>
          </div>

          {/* Card 2: Total Attributed Revenue */}
          <div className="p-4 bg-surface rounded-2xl border border-border shadow-2xs hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('reports.attributedRevenue')}
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-emerald-600 mt-2">{formatIdr(metrics.revenue)}</div>
            <div className="text-[10px] text-muted font-medium mt-1">
              +18.2% {t('reports.vsTarget')}
            </div>
          </div>

          {/* Card 3: Net Contribution */}
          <div className="p-4 bg-surface rounded-2xl border border-border shadow-2xs hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('reports.netContribution')}
              </span>
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-primary mt-2">
              {formatIdr(metrics.netContribution)}
            </div>
            <div className="text-[10px] text-primary/80 font-medium mt-1">
              Revenue minus Spend (81% Net ROI)
            </div>
          </div>

          {/* Card 4: Blended ROAS */}
          <div className="p-4 bg-surface rounded-2xl border border-border shadow-2xs hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('reports.blendedRoas')}
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-indigo-600 mt-2">{metrics.roas}x</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">
              +0.82x {t('reports.aboveBenchmark')}
            </div>
          </div>

          {/* Card 5: Total Reservations */}
          <div className="p-4 bg-surface rounded-2xl border border-border shadow-2xs hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('reports.totalReservations')}
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-dark mt-2">
              {metrics.reservations.toLocaleString()} {t('reports.tables')}
            </div>
            <div className="text-[10px] text-muted font-medium mt-1">Attributed to Campaign CTAs</div>
          </div>

          {/* Card 6: Total Guests */}
          <div className="p-4 bg-surface rounded-2xl border border-border shadow-2xs hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('reports.totalGuests')}
              </span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg font-black text-dark mt-2">
              {metrics.guests.toLocaleString()} {t('reports.covers')}
            </div>
            <div className="text-[10px] text-muted font-medium mt-1">
              Avg ~2.8 guests per table
            </div>
          </div>

          {/* Card 7: Cost Per Guest (CPA) */}
          <div className="p-4 bg-surface rounded-2xl border border-border shadow-2xs sm:col-span-2 lg:col-span-2 hover:border-sky-500/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {t('reports.costPerGuest')}
              </span>
              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                Acquisition CPA Metric
              </span>
            </div>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-lg font-black text-sky-700">{formatIdr(metrics.cpa)}</span>
              <span className="text-xs text-muted font-medium">{t('reports.perCover')}</span>
            </div>
            <p className="text-[10px] text-muted mt-1">
              Total Marketing Spend divided by total verified dining guests cover volume.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Detailed Campaign & Saluran Performance Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="text-xs font-bold text-dark uppercase tracking-wider">
              {t('reports.campaignTableTitle')}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Breakdown of active promotional campaigns, channel attribution, budget pacing & ROAS target achievement.
            </p>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            {campaignRows.length} Campaign Records
          </span>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold text-muted uppercase bg-background">
                <th className="py-3 px-3">{t('reports.colCampaignName')}</th>
                <th className="py-3 px-3">{t('reports.colChannel')}</th>
                <th className="py-3 px-3 text-right">{t('reports.colPlannedBudget')}</th>
                <th className="py-3 px-3 text-right">{t('reports.colActualSpend')}</th>
                <th className="py-3 px-3 text-right">{t('reports.colAttributedRevenue')}</th>
                <th className="py-3 px-3 text-center">{t('reports.colRoas')}</th>
                <th className="py-3 px-3 text-center">{t('reports.colTargetAchievement')}</th>
                <th className="py-3 px-3 text-center">{t('reports.colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-dark">
              {campaignRows.map((row) => (
                <tr key={row.code} className="hover:bg-background/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-dark">{row.name}</div>
                    <div className="text-[10px] text-muted font-mono">{row.code}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{row.channel}</td>
                  <td className="py-3 px-3 text-right font-medium">{formatIdr(row.plannedBudget)}</td>
                  <td className="py-3 px-3 text-right font-medium">{formatIdr(row.actualSpend)}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600">
                    {formatIdr(row.attributedRevenue)}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-primary">
                    {row.roas > 0 ? `${row.roas}x` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            row.targetAchievement >= 100
                              ? 'bg-emerald-500'
                              : row.targetAchievement >= 70
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${Math.min(100, row.targetAchievement)}%` }}
                        />
                      </div>
                      <span className="font-bold text-[11px]">{row.targetAchievement}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : row.status === 'Paused'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}

              {/* FOOTNOTE SUMMARY ROW */}
              <tr className="bg-primary/5 font-extrabold text-dark border-t-2 border-primary/20 text-xs">
                <td className="py-3 px-3 tracking-wider text-primary">
                  {t('reports.tableSummaryRow')}
                </td>
                <td className="py-3 px-3 text-muted uppercase text-[10px]">All Channels</td>
                <td className="py-3 px-3 text-right">{formatIdr(totalPlannedBudget)}</td>
                <td className="py-3 px-3 text-right">{formatIdr(totalActualSpend)}</td>
                <td className="py-3 px-3 text-right text-emerald-700">
                  {formatIdr(totalAttributedRevenue)}
                </td>
                <td className="py-3 px-3 text-center text-primary">{blendedRoasVal}x</td>
                <td className="py-3 px-3 text-center text-emerald-700">{avgTargetAchievement}%</td>
                <td className="py-3 px-3 text-center text-[10px] text-muted">Aggregated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Audience & GRO App Integration Intelligence */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-dark uppercase tracking-wider">
            {t('reports.audienceSectionTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Guest Composition (New vs Repeat) */}
          <div className="p-5 bg-surface rounded-2xl border border-border shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-dark">{t('reports.guestComposition')}</span>
              <PieChart className="w-4 h-4 text-primary" />
            </div>

            {/* Split Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
                <div
                  className="bg-primary h-full rounded-l-full transition-all"
                  style={{ width: `${audienceIntel.newGuestsPercent}%` }}
                  title={`New Customers (${audienceIntel.newGuestsPercent}%)`}
                />
                <div
                  className="bg-emerald-500 h-full rounded-r-full transition-all"
                  style={{ width: `${audienceIntel.repeatGuestsPercent}%` }}
                  title={`Repeat Customers (${audienceIntel.repeatGuestsPercent}%)`}
                />
              </div>

              <div className="flex justify-between text-[11px] font-semibold pt-1">
                <span className="text-primary">
                  {t('reports.newGuests', { percent: audienceIntel.newGuestsPercent })}
                </span>
                <span className="text-emerald-700">
                  {t('reports.repeatGuests', { percent: audienceIntel.repeatGuestsPercent })}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted pt-1 border-t border-border/60">
              Acquisition ratio driven by social media video campaigns and event promotions.
            </p>
          </div>

          {/* Card 2: GRO App Integration Sync */}
          <div className="p-5 bg-surface rounded-2xl border border-border shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-dark">{t('reports.groAppSync')}</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>GRO V1.1 Sync</span>
              </span>
            </div>

            <div>
              <div className="text-xl font-black text-dark">
                {audienceIntel.groSyncedProfiles.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-muted mt-0.5">
                {t('reports.syncedProfiles')}
              </div>
            </div>

            <p className="text-[11px] text-muted border-t border-border/60 pt-2">
              {t('reports.groSyncDescription')} ({audienceIntel.groActiveReservations} active floor table reservations matched).
            </p>
          </div>

          {/* Card 3: CLV Growth Metrics */}
          <div className="p-5 bg-surface rounded-2xl border border-border shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-dark">{t('reports.clvMetrics')}</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>

            <div>
              <div className="text-xl font-black text-dark">
                {formatIdr(audienceIntel.avgClv)}
              </div>
              <div className="text-xs font-bold text-emerald-600 flex items-center space-x-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('reports.yoyGrowth')}</span>
              </div>
            </div>

            <p className="text-[11px] text-muted border-t border-border/60 pt-2">
              {t('reports.avgVisitFrequency', { freq: audienceIntel.avgVisitFreq })}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: Executive Recommendations Panel */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 border-b border-border pb-3">
          <Zap className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold text-dark uppercase tracking-wider">
            {t('reports.recommendationsTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card A: Positive Performance Highlights */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('reports.positiveHighlights')}</span>
            </div>
            <ul className="text-xs text-emerald-900 space-y-2 list-disc pl-4 leading-relaxed font-medium">
              {recommendationsData.positive.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Card B: Budget Pacing Warnings */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t('reports.budgetPacingWarnings')}</span>
            </div>
            <ul className="text-xs text-amber-900 space-y-2 list-disc pl-4 leading-relaxed font-medium">
              {recommendationsData.warnings.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Card C: Actionable Strategic Recommendations */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
              <Target className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{t('reports.actionableRecommendations')}</span>
            </div>
            <ul className="text-xs text-indigo-950 space-y-2 list-disc pl-4 leading-relaxed font-medium">
              {recommendationsData.actions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 5: On-Screen Live Executive Memo Preview Paper */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-dark uppercase tracking-wider">
              {t('reports.previewTitle')}
            </span>
          </div>
          <span className="text-xs font-mono text-muted">{getReportTypeLabel(reportType)}</span>
        </div>

        {/* Paper Executive Memo Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-inner space-y-6 text-slate-900 font-sans max-w-3xl mx-auto">
          {/* Header Block */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-black tracking-widest text-primary uppercase">
                Gourmet Bistro Cafe & Resto
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {getReportTypeLabel(reportType)}
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                Reporting Period: <b>{getPeriodLabel(period)}</b> • Prepared by Marketing Command Center
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                {t('reports.verifiedReport')}
              </span>
              <div className="text-[10px] text-slate-400 mt-2">
                Date: {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>

          {/* Paper Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[9px] text-slate-500 font-bold uppercase">
                {t('reports.totalSpend')}
              </div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">
                {formatIdr(metrics.spend)}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[9px] text-slate-500 font-bold uppercase">
                {t('reports.attributedRevenue')}
              </div>
              <div className="text-xs font-bold text-emerald-600 mt-0.5">
                {formatIdr(metrics.revenue)}
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[9px] text-slate-500 font-bold uppercase">
                {t('reports.blendedRoas')}
              </div>
              <div className="text-xs font-bold text-primary mt-0.5">{metrics.roas}x</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="text-[9px] text-slate-500 font-bold uppercase">
                {t('reports.costPerGuest')}
              </div>
              <div className="text-xs font-bold text-sky-700 mt-0.5">
                {formatIdr(metrics.cpa)}
              </div>
            </div>
          </div>

          {/* Strategic Recommendations Snippet */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('reports.actionableRecommendations')}
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              {recommendationsData.actions.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* Executive Footer */}
          <div className="text-[10px] text-slate-400 pt-4 border-t border-slate-100 text-center">
            {t('reports.confidentialNotice')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
