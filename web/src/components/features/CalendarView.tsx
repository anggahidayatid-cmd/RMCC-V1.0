import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Plus,
  Trash2,
  Edit,
  ShieldAlert
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useRbac, UserRole } from '../../context/RbacContext';

export interface CalendarViewProps {
  userRole?: UserRole;
}

export const MOCK_OCTOBER_EVENTS: (EventItem & { type?: string; channel?: string; notes?: string; budget?: number; time?: string })[] = [
  {
    id: 'EVT-001',
    campaignId: 'CAMP-001',
    name: 'Weekend Family Bundle Promo',
    date: '2026-10-03',
    time: '12:00',
    expectedGuests: 120,
    actualGuests: 115,
    status: 'Completed',
    type: 'Promotion',
    channel: 'Instagram + WhatsApp',
    notes: 'Special family roast bundle menu with complimentary gelato',
    budget: 2500000
  },
  {
    id: 'EVT-002',
    campaignId: 'CAMP-003',
    name: 'Friday Acoustic Night',
    date: '2026-10-09',
    time: '19:30',
    expectedGuests: 150,
    actualGuests: 162,
    status: 'Completed',
    type: 'Event',
    channel: 'Instagram + TikTok',
    notes: 'Live acoustic band performance featuring popular local artists',
    budget: 3000000
  },
  {
    id: 'EVT-003',
    campaignId: 'CAMP-004',
    name: 'Mid-Month Lunch Special',
    date: '2026-10-15',
    time: '12:30',
    expectedGuests: 90,
    actualGuests: 84,
    status: 'Completed',
    type: 'Traffic',
    channel: 'Google + Meta',
    notes: 'Targeting nearby office towers with express lunch set menus',
    budget: 1800000
  },
  {
    id: 'EVT-004',
    campaignId: 'CAMP-003',
    name: 'Friday Acoustic Night',
    date: '2026-10-16',
    time: '19:30',
    expectedGuests: 150,
    actualGuests: 158,
    status: 'Completed',
    type: 'Event',
    channel: 'Instagram + TikTok',
    notes: 'Live acoustic sessions with table booking reservation push',
    budget: 3000000
  },
  {
    id: 'EVT-005',
    campaignId: 'CAMP-002',
    name: 'Birthday Celebrant Gala',
    date: '2026-10-20',
    time: '18:00',
    expectedGuests: 80,
    actualGuests: 78,
    status: 'Active',
    type: 'CRM',
    channel: 'WhatsApp CRM',
    notes: 'VIP birthday month celebrants private table dinner',
    budget: 2000000
  },
  {
    id: 'EVT-006',
    campaignId: 'CAMP-003',
    name: 'Youth Day Acoustic Showcase',
    date: '2026-10-28',
    time: '20:00',
    expectedGuests: 180,
    actualGuests: 0,
    status: 'Scheduled',
    type: 'Event',
    channel: 'TikTok Live',
    notes: 'Special Youth Pledge Day musical tribute & chef tasting menu',
    budget: 4500000
  },
  {
    id: 'EVT-007',
    campaignId: 'CAMP-001',
    name: 'Halloween Dinner Spooktacular',
    date: '2026-10-31',
    time: '19:00',
    expectedGuests: 200,
    actualGuests: 0,
    status: 'Scheduled',
    type: 'Event',
    channel: 'Instagram + TikTok',
    notes: 'Themed Halloween decor, costume contest, and signature mocktails',
    budget: 5000000
  }
];

export const CalendarView: React.FC<CalendarViewProps> = () => {
  const { t } = useTranslation();
  const { hasPermission } = useRbac();
  const canCreateEdit = hasPermission('campaign_create');
  const canDelete = hasPermission('campaign_delete');

  // Current year & month state
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0 - 11

  // Events state stored in localStorage
  const [events, setEvents] = useState<any[]>(() => {
    const saved = localStorage.getItem('rmcc_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_OCTOBER_EVENTS;
      }
    }
    return MOCK_OCTOBER_EVENTS;
  });

  useEffect(() => {
    localStorage.setItem('rmcc_events', JSON.stringify(events));
  }, [events]);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [targetDateForNew, setTargetDateForNew] = useState<string>('');
  const [rbacWarning, setRbacWarning] = useState<string | null>(null);

  // Form state for new/edit event
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('Event');
  const [formTime, setFormTime] = useState('19:00');
  const [formGuests, setFormGuests] = useState(100);
  const [formBudget, setFormBudget] = useState(2500000);
  const [formNotes, setFormNotes] = useState('');

  const monthsList = [
    { value: 0, key: 'calendar.january' },
    { value: 1, key: 'calendar.february' },
    { value: 2, key: 'calendar.march' },
    { value: 3, key: 'calendar.april' },
    { value: 4, key: 'calendar.may' },
    { value: 5, key: 'calendar.june' },
    { value: 6, key: 'calendar.july' },
    { value: 7, key: 'calendar.august' },
    { value: 8, key: 'calendar.september' },
    { value: 9, key: 'calendar.october' },
    { value: 10, key: 'calendar.november' },
    { value: 11, key: 'calendar.december' },
  ];

  const yearsList = [2025, 2026, 2027, 2028];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calculate calendar grid
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const gridCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dNum = daysInPrevMonth - i;
    const prevMonthVal = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYearVal = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevYearVal}-${String(prevMonthVal + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`;
    gridCells.push({ dayNumber: dNum, dateStr, isCurrentMonth: false, events: [] });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = events.filter((e) => e.date === dateStr);
    gridCells.push({ dayNumber: d, dateStr, isCurrentMonth: true, events: dayEvents });
  }

  // Next month leading days to complete full grid rows (multiple of 7, up to 35 or 42)
  const totalCellsSoFar = gridCells.length;
  const targetCells = totalCellsSoFar > 35 ? 42 : 35;
  const remainingCells = targetCells - totalCellsSoFar;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthVal = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYearVal = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextYearVal}-${String(nextMonthVal + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    gridCells.push({ dayNumber: d, dateStr, isCurrentMonth: false, events: [] });
  }

  const handleCellClick = (dateStr: string) => {
    if (!canCreateEdit) {
      setRbacWarning(t('calendar.rbacReadOnlyTooltip'));
      setTimeout(() => setRbacWarning(null), 3500);
      return;
    }
    setTargetDateForNew(dateStr);
    setEditingEvent(null);
    setFormName('');
    setFormType('Event');
    setFormTime('19:00');
    setFormGuests(100);
    setFormBudget(2500000);
    setFormNotes('');
    setIsFormOpen(true);
  };

  const handleEditClick = (evt: any) => {
    if (!canCreateEdit) {
      setRbacWarning(t('calendar.rbacReadOnlyTooltip'));
      setTimeout(() => setRbacWarning(null), 3500);
      return;
    }
    setSelectedEvent(null);
    setEditingEvent(evt);
    setTargetDateForNew(evt.date);
    setFormName(evt.name);
    setFormType(evt.type || 'Event');
    setFormTime(evt.time || '19:00');
    setFormGuests(evt.expectedGuests || 100);
    setFormBudget(evt.budget || 2500000);
    setFormNotes(evt.notes || '');
    setIsFormOpen(true);
  };

  const handleDeleteClick = (evtId: string) => {
    if (!canDelete) {
      setRbacWarning(t('calendar.rbacReadOnlyTooltip'));
      setTimeout(() => setRbacWarning(null), 3500);
      return;
    }
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents((prev) => prev.filter((e) => e.id !== evtId));
      setSelectedEvent(null);
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((item) =>
          item.id === editingEvent.id
            ? {
                ...item,
                name: formName,
                type: formType,
                time: formTime,
                expectedGuests: Number(formGuests),
                budget: Number(formBudget),
                notes: formNotes
              }
            : item
        )
      );
    } else {
      const newEvt = {
        id: `EVT-CUSTOM-${Date.now()}`,
        campaignId: 'CAMP-CUSTOM',
        name: formName,
        date: targetDateForNew,
        time: formTime,
        expectedGuests: Number(formGuests),
        actualGuests: 0,
        status: 'Scheduled',
        type: formType,
        channel: 'Manual / On-Site',
        notes: formNotes,
        budget: Number(formBudget)
      };
      setEvents((prev) => [...prev, newEvt]);
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const getPillColor = (type?: string) => {
    switch (type) {
      case 'Event':
      case 'Live Music':
        return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200';
      case 'Promotion':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200';
      case 'CRM':
      case 'Private Event':
        return 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
      case 'Seasonal':
        return 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200';
      case 'Traffic':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* RBAC Warning Banner if triggered */}
      {rbacWarning && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs font-bold flex items-center space-x-2 shadow-md animate-fadeIn">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>{rbacWarning}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-dark">{t('calendar.title')}</h1>
          </div>
          <p className="text-xs text-muted mt-1 max-w-xl">
            {t('calendar.subtitle')}
          </p>
        </div>

        {/* Dynamic Month & Year Selectors and Navigation */}
        <div className="flex items-center space-x-3 self-start sm:self-auto flex-wrap gap-2">
          {/* Month Dropdown */}
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] px-3 py-1.5 rounded-xl font-semibold text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            {monthsList.map((m) => (
              <option key={m.value} value={m.value} className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">
                {t(m.key)}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] px-3 py-1.5 rounded-xl font-semibold text-xs focus:outline-none focus:border-primary cursor-pointer"
          >
            {yearsList.map((y) => (
              <option key={y} value={y} className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">
                {y}
              </option>
            ))}
          </select>

          {/* Arrow Navigation */}
          <div className="flex items-center space-x-1 bg-background border border-border px-2 py-1.5 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-surface rounded-lg text-muted hover:text-dark transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs px-2 text-dark">
              {t(monthsList[currentMonth].key)} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-surface rounded-lg text-muted hover:text-dark transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden p-4 space-y-4">
        {/* Days Header */}
        <div className="grid grid-cols-7 text-center border-b border-border pb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-bold text-muted uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {gridCells.map((cell, idx) => {
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[110px] p-2 bg-background/20 rounded-xl border border-dashed border-border/40 text-muted/30 text-xs"
                />
              );
            }

            const isToday =
              cell.dayNumber === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={cell.dateStr}
                onClick={() => handleCellClick(cell.dateStr)}
                className={`min-h-[115px] p-2 rounded-xl border text-xs transition-all flex flex-col justify-between cursor-pointer group ${
                  isToday
                    ? 'border-primary bg-primary/5 shadow-xs'
                    : 'border-border bg-surface hover:border-slate-400 hover:bg-background/40'
                }`}
                title={canCreateEdit ? 'Click to add event for this date' : t('calendar.rbacReadOnlyTooltip')}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`font-bold text-xs ${
                      isToday
                        ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center'
                        : 'text-dark'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {canCreateEdit && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-[10px] font-bold flex items-center">
                      <Plus className="w-3 h-3" />
                    </span>
                  )}

                  {cell.events && cell.events.length > 0 && (
                    <span className="text-[10px] text-muted font-semibold">
                      {cell.events.length} evt
                    </span>
                  )}
                </div>

                {/* Event Pills list */}
                <div className="space-y-1 my-1 overflow-y-auto max-h-[70px] custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                  {cell.events?.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(evt);
                      }}
                      className={`w-full text-left p-1 rounded-lg text-[10px] font-bold truncate border transition-all ${getPillColor(
                        evt.type
                      )}`}
                    >
                      {evt.time ? `${evt.time} ` : ''}{evt.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-surface border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider">
                  {selectedEvent.type} • {selectedEvent.channel || 'Manual Event'}
                </span>
                <h3 className="text-base font-bold text-dark">{selectedEvent.name}</h3>
                <p className="text-xs text-muted flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  <span>{selectedEvent.date} {selectedEvent.time ? `at ${selectedEvent.time}` : ''}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-muted hover:text-dark p-1 rounded-lg hover:bg-background"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-background p-3 rounded-xl border border-border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted">{t('calendar.targetGuests')}</span>
                  <span className="font-bold text-dark">{selectedEvent.expectedGuests} guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('calendar.actualCovers')}</span>
                  <span className="font-bold text-emerald-600">
                    {selectedEvent.actualGuests > 0 ? `${selectedEvent.actualGuests} guests` : 'Scheduled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('calendar.eventBudget')}</span>
                  <span className="font-bold text-dark">
                    Rp {(selectedEvent.budget || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-dark">{t('calendar.descriptionNotes')}</span>
                <p className="text-muted mt-1 bg-surface p-2.5 rounded-lg border border-border leading-relaxed">
                  {selectedEvent.notes || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border">
              {/* RBAC Protected Edit & Delete */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditClick(selectedEvent)}
                  disabled={!canCreateEdit}
                  title={canCreateEdit ? 'Edit Event' : t('calendar.rbacReadOnlyTooltip')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                    canCreateEdit
                      ? 'bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 opacity-60'
                  }`}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>{t('calendar.editEvent')}</span>
                </button>

                <button
                  onClick={() => handleDeleteClick(selectedEvent.id)}
                  disabled={!canDelete}
                  title={canDelete ? 'Delete Event' : t('calendar.rbacReadOnlyTooltip')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
                    canDelete
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 opacity-60'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('calendar.deleteEvent')}</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-dark text-white text-xs font-semibold rounded-xl hover:bg-dark/90 shadow-sm"
              >
                {t('calendar.closeDetails')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal (Add / Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSaveEvent}
            className="bg-surface border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-dark">
                {editingEvent ? t('calendar.editEvent') : t('calendar.addEvent')} ({targetDateForNew})
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-muted hover:text-dark p-1 rounded-lg hover:bg-background"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-dark mb-1">{t('calendar.eventTitle')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saturday Jazz Night & Wine Tasting"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-dark mb-1">{t('calendar.categoryType')}</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="Live Music" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Live Music</option>
                    <option value="Promotion" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Promotion</option>
                    <option value="Private Event" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Private Event</option>
                    <option value="Seasonal" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Seasonal</option>
                    <option value="Event" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Event</option>
                    <option value="CRM" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">CRM</option>
                    <option value="Traffic" className="bg-white text-gray-900 dark:bg-[#25283A] dark:text-white">Traffic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-dark mb-1">{t('calendar.time')}</label>
                  <input
                    type="text"
                    placeholder="19:00"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-dark mb-1">{t('calendar.expectedGuests')}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formGuests === 0 ? '' : formGuests}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setFormGuests(raw === '' ? 0 : Number(raw));
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-dark mb-1">{t('calendar.targetRevenue')}</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formBudget === 0 ? '' : Number(formBudget).toLocaleString('id-ID')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setFormBudget(raw === '' ? 0 : Number(raw));
                    }}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-dark mb-1">{t('calendar.notes')}</label>
                <textarea
                  rows={3}
                  placeholder="Enter event marketing notes, menu details, or channel promotions..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary resize-none placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 border border-border bg-surface text-xs font-semibold text-dark hover:bg-background rounded-xl"
              >
                {t('calendar.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 shadow-sm"
              >
                {t('calendar.saveEvent')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
