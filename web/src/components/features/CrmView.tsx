import React, { useState, useEffect } from 'react';
import { Customer } from '../../types';
import { groIntegrationService } from '../../services/groIntegrationService';
import {
  Users,
  Search,
  MessageSquare,
  Crown,
  RotateCcw,
  X,
  Send,
  CheckCircle2,
  DollarSign,
  Smartphone,
  ExternalLink,
  Calendar,
  Sparkles,
  Utensils,
  Info,
  ShieldAlert
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useRbac } from '../../context/RbacContext';

export const CrmView: React.FC = () => {
  const { t } = useTranslation();
  const { hasPermission, userRole } = useRbac();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSegment, setSelectedSegment] = useState<string>('All');

  const canAccessProfiles = hasPermission('crm_access');
  const canDispatchWa = hasPermission('wa_dispatch');
  const [rbacWarning, setRbacWarning] = useState<string | null>(null);

  // WhatsApp modal state
  const [waModalOpen, setWaModalOpen] = useState<boolean>(false);
  const [targetCustomer, setTargetCustomer] = useState<Customer | null>(null);
  const [template, setTemplate] = useState<string>('birthday');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Customer Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [activeCustomerDetail, setActiveCustomerDetail] = useState<Customer | null>(null);

  // GRO Import Toast / Banner state
  const [importNotification, setImportNotification] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await groIntegrationService.getCustomers();
      setCustomers(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  // Simulate GRO Guest Sync
  const handleSimulateGroSync = async () => {
    const mockGroGuests = [
      {
        name: 'Jessica Iskandar',
        email: 'jessica.iskan@gmail.com',
        phone: '+62 811-9988-7766',
        segment: 'VIP',
        totalVisits: 3,
        totalSpend: 2400000,
        groNotes: 'Requested private terrace seating for birthday dinner next week.',
        dietaryPreferences: 'Gluten-free, loves sparkling mineral water'
      },
      {
        name: 'Dr. Hendra Gunawan',
        email: 'dr.hendra@gmail.com',
        phone: '+62 812-4433-2211',
        segment: 'Repeat',
        totalVisits: 7,
        totalSpend: 3150000,
        groNotes: 'Frequents Friday acoustic nights with colleagues.',
        dietaryPreferences: 'Prefers medium-well steak, no garlic'
      },
      {
        name: 'Sarah Wijaya',
        email: 'sarah.w@startup.id',
        phone: '+62 818-5566-7788',
        segment: 'New',
        totalVisits: 1,
        totalSpend: 550000,
        groNotes: 'Walk-in guest from GRO App table reservation.',
        dietaryPreferences: 'Vegetarian salad preference'
      }
    ];

    const randomGuest = mockGroGuests[Math.floor(Math.random() * mockGroGuests.length)];
    const imported = await groIntegrationService.importCustomerFromGro(randomGuest);
    const updatedList = await groIntegrationService.getCustomers();
    setCustomers(updatedList);

    setImportNotification(`Successfully synced guest "${imported.name}" from GRO App!`);
    setTimeout(() => {
      setImportNotification(null);
    }, 4000);
  };

  // Segment Filter options
  const segments = ['All', 'VIP', 'Repeat', 'New', 'Birthday', 'Corporate'];

  // Filtered customer list
  const filteredCustomers = customers.filter((cust) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === '' ||
      cust.name.toLowerCase().includes(q) ||
      cust.email.toLowerCase().includes(q) ||
      cust.phone.includes(q) ||
      (cust.groNotes && cust.groNotes.toLowerCase().includes(q)) ||
      (cust.dietaryPreferences && cust.dietaryPreferences.toLowerCase().includes(q)) ||
      cust.segment.toLowerCase().includes(q);

    const matchesSegment = selectedSegment === 'All' || cust.segment === selectedSegment;

    return matchesSearch && matchesSegment;
  });

  // Key CLV Metrics
  const totalCustomers = customers.length;
  const totalSpendAll = customers.reduce((acc, c) => acc + c.totalSpend, 0);
  const avgClv = totalCustomers > 0 ? totalSpendAll / totalCustomers : 0;
  const repeatCount = customers.filter((c) => c.segment === 'Repeat' || c.segment === 'VIP').length;
  const repeatRate = totalCustomers > 0 ? Math.round((repeatCount / totalCustomers) * 100) : 0;
  const vipCount = customers.filter((c) => c.segment === 'VIP').length;
  const birthdayCount = customers.filter((c) => c.segment === 'Birthday').length;

  const handleOpenWaModal = (customer?: Customer, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canDispatchWa) {
      setRbacWarning(`RBAC Restriction: Your role (${t(`settings.roles.${userRole}`)}) lacks 'Dispatch WhatsApp Broadcasts' permission.`);
      setTimeout(() => setRbacWarning(null), 3500);
      return;
    }
    setTargetCustomer(customer || null);
    if (customer?.segment === 'Birthday') {
      setTemplate('birthday');
      setCustomMessage(`Hi ${customer.name}, Happy Birthday month! 🎂 Enjoy a complimentary chef dessert & 15% discount on your table reservation at Gourmet Bistro this week. Reply 'RESERVE' to claim!`);
    } else if (customer?.segment === 'VIP') {
      setTemplate('vip');
      setCustomMessage(`Dear ${customer ? customer.name : 'VIP Guest'}, we have reserved a premium acoustic night table for you this Friday. Enjoy complimentary welcome cocktails!`);
    } else {
      setTemplate('general');
      setCustomMessage(`Hi ${customer ? customer.name : 'Valued Guest'}, check out our weekend family promo specials at Gourmet Bistro!`);
    }
    setSendSuccess(false);
    setWaModalOpen(true);
  };

  const handleOpenDetailModal = (cust: Customer) => {
    if (!canAccessProfiles) {
      setRbacWarning(`RBAC Restriction: Your role (${t(`settings.roles.${userRole}`)}) lacks 'Access CRM Guest Profiles' permission.`);
      setTimeout(() => setRbacWarning(null), 3500);
      return;
    }
    setActiveCustomerDetail(cust);
    setDetailModalOpen(true);
  };

  const handleTemplateChange = (tmpl: string) => {
    setTemplate(tmpl);
    const guestName = targetCustomer ? targetCustomer.name : 'Valued Guest';
    if (tmpl === 'birthday') {
      setCustomMessage(`Hi ${guestName}, Happy Birthday! 🎂 Enjoy a complimentary chef dessert & 15% discount on your table reservation at Gourmet Bistro this week. Reply 'RESERVE' to claim!`);
    } else if (tmpl === 'vip') {
      setCustomMessage(`Dear ${guestName}, as one of our VIP guests, we invite you to an exclusive Friday Live Acoustic Session with 1 complimentary bottle of house wine.`);
    } else if (tmpl === 'miss_you') {
      setCustomMessage(`Hi ${guestName}, we miss having you at Gourmet Bistro! Here is a 20% return voucher valid for your next weekend lunch dine-in.`);
    } else {
      setCustomMessage(`Hi ${guestName}, check out our new seasonal special menu at Gourmet Bistro!`);
    }
  };

  const handleDispatchWa = async () => {
    if (!canDispatchWa) return;
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSending(false);
    setSendSuccess(true);
    setTimeout(() => {
      setWaModalOpen(false);
      setSendSuccess(false);
    }, 1800);
  };

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Repeat':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Birthday':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Corporate':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'New':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSourceBadge = (source?: string) => {
    if (source === 'GRO App') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
          <Smartphone className="w-3 h-3 text-teal-600" />
          <span>GRO App</span>
        </span>
      );
    } else if (source === 'Corporate') {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <span>Corporate</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <span>POS / Walk-in</span>
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* RBAC Warning Toast Banner */}
      {rbacWarning && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-2xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{rbacWarning}</span>
          </div>
          <button onClick={() => setRbacWarning(null)} className="text-amber-600 hover:text-amber-800 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Import Notification Banner */}
      {importNotification && (
        <div className="bg-teal-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-teal-200 animate-pulse" />
            <span className="text-xs font-bold">{importNotification}</span>
          </div>
          <button onClick={() => setImportNotification(null)} className="text-teal-200 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-dark">{t('crm.title')}</h1>
          </div>
          <p className="text-xs text-muted mt-1 max-w-xl">
            {t('crm.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={handleSimulateGroSync}
            className="px-4 py-2.5 bg-teal-600 text-white font-semibold text-xs rounded-xl shadow-md hover:bg-teal-700 transition-all flex items-center space-x-1.5 shadow-teal-600/20 cursor-pointer"
            title="Simulate incoming guest data sync from GRO App service"
          >
            <Smartphone className="w-4 h-4" />
            <span>{t('crm.simulateGroImport')}</span>
          </button>

          <button
            onClick={() => handleOpenWaModal()}
            disabled={!canDispatchWa}
            title={!canDispatchWa ? "Permission 'Dispatch WhatsApp Broadcasts' required" : undefined}
            className={`px-4 py-2.5 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 ${
              canDispatchWa
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-emerald-600/20'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('crm.broadcastWa')}</span>
          </button>
        </div>
      </div>

      {/* CLV Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('crm.totalProfiles')}</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-dark">{totalCustomers}</div>
          <div className="text-[10px] text-muted font-medium">{t('crm.registeredGuests')}</div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('crm.avgClv')}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            Rp {(avgClv / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-muted">{t('crm.perCustomerSpend')}</div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('crm.repeatRate')}</span>
            <RotateCcw className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-primary">{repeatRate}%</div>
          <div className="text-[10px] text-muted">{t('crm.returningDiners', { count: repeatCount })}</div>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('crm.activeVipBirthdays')}</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{vipCount + birthdayCount}</div>
          <div className="text-[10px] text-muted">{vipCount} VIPs • {birthdayCount} Birthdays</div>
        </div>
      </div>

      {/* Database Search & Segment Filter Chips */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('crm.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold text-muted mr-1">{t('crm.segmentLabel')}</span>
            {segments.map((seg) => {
              const active = selectedSegment === seg;
              return (
                <button
                  key={seg}
                  onClick={() => setSelectedSegment(seg)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-background text-slate-600 border border-border hover:bg-slate-200/60'
                  }`}
                >
                  {seg === 'All' ? t('campaigns.statusAll') : seg}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Database Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border text-[11px] font-bold text-muted uppercase">
                <th className="py-3.5 px-4">{t('crm.colName')}</th>
                <th className="py-3.5 px-4">{t('crm.colSegment')}</th>
                <th className="py-3.5 px-4 text-center">{t('crm.colVisits')}</th>
                <th className="py-3.5 px-4 text-right">{t('crm.colSpend')}</th>
                <th className="py-3.5 px-4 text-right">{t('crm.colAverageSpend')}</th>
                <th className="py-3.5 px-4 text-center">{t('crm.colLastVisit')}</th>
                <th className="py-3.5 px-4">{t('crm.colPreferences')}</th>
                <th className="py-3.5 px-4 text-center">{t('crm.colSource')}</th>
                <th className="py-3.5 px-4 text-center">{t('crm.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted">
                    Loading guest directory...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const avgSpend = Math.round(cust.totalSpend / Math.max(1, cust.totalVisits));
                  return (
                    <tr
                      key={cust.id}
                      onClick={() => handleOpenDetailModal(cust)}
                      className="hover:bg-background/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-dark flex items-center space-x-2 group">
                          <span>{cust.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetailModal(cust);
                            }}
                            className="p-1 rounded-md text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                            title={t('crm.viewDetails')}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getSegmentBadge(
                            cust.segment
                          )}`}
                        >
                          {cust.segment}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-dark">
                        {cust.totalVisits}
                      </td>

                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                        Rp {cust.totalSpend.toLocaleString('id-ID')}
                      </td>

                      <td className="py-3.5 px-4 text-right text-dark font-medium">
                        Rp {avgSpend.toLocaleString('id-ID')}
                      </td>

                      <td className="py-3.5 px-4 text-center text-muted font-mono text-[11px]">
                        {cust.lastVisitDate}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-muted" title={cust.dietaryPreferences || cust.groNotes}>
                        <div className="font-medium text-dark truncate">{cust.dietaryPreferences || 'Standard'}</div>
                        <div className="truncate text-slate-500">{cust.groNotes || 'No notes'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {getSourceBadge(cust.source)}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={(e) => handleOpenWaModal(cust, e)}
                            disabled={!canDispatchWa}
                            title={!canDispatchWa ? "Permission 'Dispatch WhatsApp Broadcasts' required" : undefined}
                            className={`px-2.5 py-1 font-semibold rounded-lg text-xs border transition-colors inline-flex items-center space-x-1 ${
                              canDispatchWa
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{t('crm.sendWa')}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {detailModalOpen && activeCustomerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-surface border border-border rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                  {activeCustomerDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-dark flex items-center space-x-2">
                    <span>{activeCustomerDetail.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSegmentBadge(activeCustomerDetail.segment)}`}>
                      {activeCustomerDetail.segment}
                    </span>
                  </h3>
                  <p className="text-[11px] text-muted">{activeCustomerDetail.phone} • {activeCustomerDetail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-muted hover:text-dark p-1.5 rounded-lg hover:bg-background"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background p-3.5 rounded-xl border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted">Total Visits</div>
                <div className="text-lg font-extrabold text-dark mt-0.5">{activeCustomerDetail.totalVisits} visits</div>
              </div>
              <div className="bg-background p-3.5 rounded-xl border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted">Total Lifetime Spend</div>
                <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                  Rp {activeCustomerDetail.totalSpend.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="bg-background p-3.5 rounded-xl border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted">Source Channel</div>
                <div className="mt-1 flex justify-center">{getSourceBadge(activeCustomerDetail.source)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span>Dietary Preferences & GRO Notes</span>
                </div>
                <div className="text-xs text-dark space-y-1">
                  <p><strong className="text-slate-600">Dietary:</strong> {activeCustomerDetail.dietaryPreferences || 'None specified'}</p>
                  <p><strong className="text-slate-600">GRO Notes:</strong> {activeCustomerDetail.groNotes || 'No notes recorded'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-dark uppercase tracking-wider flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{t('crm.visitHistoryTitle')}</span>
                </h4>
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                  {activeCustomerDetail.visitHistory && activeCustomerDetail.visitHistory.length > 0 ? (
                    <div className="divide-y divide-border">
                      {activeCustomerDetail.visitHistory.map((visit, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-muted">{visit.date}</span>
                            <span className="font-bold text-dark">{visit.table || 'Table Dine-in'}</span>
                            <span className="text-muted text-[11px]">• {visit.notes || 'Dine-in visit'}</span>
                          </div>
                          <div className="font-bold text-emerald-600">
                            Rp {visit.spend.toLocaleString('id-ID')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-muted">No detailed visit logs available.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[10px] text-muted flex items-center space-x-1">
                <Info className="w-3 h-3 text-teal-600" />
                <span>Synced in real-time with GRO Application Service</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setDetailModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-dark hover:bg-background cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDetailModalOpen(false);
                    handleOpenWaModal(activeCustomerDetail);
                  }}
                  disabled={!canDispatchWa}
                  title={!canDispatchWa ? "Permission 'Dispatch WhatsApp Broadcasts' required" : undefined}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-md flex items-center space-x-1.5 ${
                    canDispatchWa
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('crm.sendWa')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Simulation Dispatch Modal */}
      {waModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-surface border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-dark">{t('crm.dispatchTitle')}</h3>
                  <p className="text-[11px] text-muted">{t('crm.dispatchSubtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setWaModalOpen(false)}
                className="text-muted hover:text-dark p-1.5 rounded-lg hover:bg-background"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sendSuccess ? (
              <div className="p-8 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-dark">{t('crm.sentSuccess')}</h4>
                <p className="text-xs text-muted">
                  Message queued and dispatched to {targetCustomer ? targetCustomer.name : 'Selected Segment Audience'}.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-dark mb-1">{t('crm.targetRecipient')}</label>
                  <div className="px-3 py-2 bg-background border border-border rounded-xl font-bold text-dark">
                    {targetCustomer
                      ? `${targetCustomer.name} (${targetCustomer.phone}) [Segment: ${targetCustomer.segment}]`
                      : `Broadcast to ${selectedSegment === 'All' ? `All Customers (${totalCustomers})` : `${selectedSegment} Segment Customers`}`}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-dark mb-1">{t('crm.messageTemplate')}</label>
                  <select
                    value={template}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="birthday" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Birthday Special Offer Voucher</option>
                    <option value="vip" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">VIP Acoustic Night Exclusive Reservation</option>
                    <option value="miss_you" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">We Miss You (20% Return Voucher)</option>
                    <option value="general" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">General Promotional Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-dark mb-1">{t('crm.messagePreview')}</label>
                  <textarea
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-3 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs font-sans focus:outline-none focus:border-emerald-600 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-muted">Simulated WhatsApp Business API Channel</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setWaModalOpen(false)}
                      className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-dark hover:bg-background cursor-pointer"
                    >
                      {t('crm.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleDispatchWa}
                      disabled={isSending || !canDispatchWa}
                      className={`px-4 py-2 font-semibold text-xs rounded-xl shadow-md flex items-center space-x-1.5 ${
                        canDispatchWa
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSending ? t('crm.sending') : t('crm.dispatchMessage')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmView;
