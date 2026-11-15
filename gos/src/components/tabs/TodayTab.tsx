import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';
import { GOSReservation, TableInfo, TableStatusCode } from '../../types';

interface TodayTabProps {
  reservations: GOSReservation[];
  tables: TableInfo[];
  onUpdateTableStatus: (tableId: string, status: TableStatusCode) => void;
  onOpenNewReservation: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  reservations,
  tables,
  onUpdateTableStatus,
  onOpenNewReservation,
}) => {
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter((r) => r.reservationDate === todayStr);

  const availableCount = tables.filter((t) => t.status === 'Available').length;
  const occupiedCount = tables.filter((t) => t.status === 'Occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'Reserved').length;
  const cleaningCount = tables.filter((t) => t.status === 'Cleaning').length;

  const filteredTables = tables.filter((t) => {
    if (selectedSection !== 'All' && t.section !== selectedSection) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: TableStatusCode) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Occupied':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'Reserved':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Cleaning':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
    }
  };

  const cycleStatus = (currentStatus: TableStatusCode): TableStatusCode => {
    switch (currentStatus) {
      case 'Available':
        return 'Reserved';
      case 'Reserved':
        return 'Occupied';
      case 'Occupied':
        return 'Cleaning';
      case 'Cleaning':
        return 'Available';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Welcome & KPI Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>GOS V1.1 Operational Command Center</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Restaurant Floor & Table Intelligence</h2>
          <p className="text-white/90 text-sm mt-1">
            Real-time table occupancy, active arrivals, and synchronized RMCC campaign tracking.
          </p>
        </div>
        <button
          onClick={onOpenNewReservation}
          className="bg-white text-primary px-5 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-white/90 transition flex items-center gap-2 min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>Quick Reservation</span>
        </button>
      </div>

      {/* Table Intelligence Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter(statusFilter === 'Available' ? 'All' : 'Available')}
          className={`bg-surface border p-4 rounded-2xl shadow-sm cursor-pointer transition hover:shadow-md ${
            statusFilter === 'Available' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">Available</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {availableCount}
          </div>
          <p className="text-xs text-muted mt-1">Tables ready for seating</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'Occupied' ? 'All' : 'Occupied')}
          className={`bg-surface border p-4 rounded-2xl shadow-sm cursor-pointer transition hover:shadow-md ${
            statusFilter === 'Occupied' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">Occupied</span>
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
            {occupiedCount}
          </div>
          <p className="text-xs text-muted mt-1">Guests dining right now</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'Reserved' ? 'All' : 'Reserved')}
          className={`bg-surface border p-4 rounded-2xl shadow-sm cursor-pointer transition hover:shadow-md ${
            statusFilter === 'Reserved' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">Reserved</span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {reservedCount}
          </div>
          <p className="text-xs text-muted mt-1">Upcoming arrivals today</p>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'Cleaning' ? 'All' : 'Cleaning')}
          className={`bg-surface border p-4 rounded-2xl shadow-sm cursor-pointer transition hover:shadow-md ${
            statusFilter === 'Cleaning' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-border'
          }`}
        >
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">Cleaning</span>
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
            {cleaningCount}
          </div>
          <p className="text-xs text-muted mt-1">Table resetting in progress</p>
        </div>
      </div>

      {/* Main Content Grid: Tables & Active Arrivals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floor Plan & Table Intelligence */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div>
              <h3 className="font-bold text-lg">Table Intelligence Status</h3>
              <p className="text-xs text-muted">Tap any table card to cycle status instantly</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {['All', 'Main Dining', 'Terrace', 'VIP Lounge'].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    selectedSection === sec
                      ? 'bg-primary text-white font-semibold'
                      : 'bg-border/40 text-muted hover:text-dark'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredTables.map((table) => (
              <div
                key={table.id}
                onClick={() => onUpdateTableStatus(table.id, cycleStatus(table.status))}
                className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-lg flex flex-col justify-between min-h-[120px] ${getStatusColor(
                  table.status
                )}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm tracking-tight">{table.number}</span>
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-surface/80">
                    {table.status}
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-xs font-medium text-muted">Capacity: {table.capacity} pax</div>
                  {table.currentGuest && (
                    <div className="text-xs font-bold truncate mt-0.5">👤 {table.currentGuest}</div>
                  )}
                  {table.reservationTime && (
                    <div className="text-xs font-mono mt-0.5">⏰ {table.reservationTime}</div>
                  )}
                </div>
                <div className="text-[10px] opacity-75 font-medium flex items-center justify-between pt-2 border-t border-current/10">
                  <span>{table.section}</span>
                  <span>Tap to update →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Arrivals & Shift Briefing */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base">Active Arrivals Today</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                {todayReservations.length}
              </span>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {todayReservations.length === 0 ? (
                <p className="text-sm text-muted text-center py-6">No arrivals scheduled for today.</p>
              ) : (
                todayReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-2xl border border-border bg-border/10 hover:border-primary/50 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{res.guestName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">
                        {res.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted mb-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {res.timeSlot}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <Users className="w-3.5 h-3.5" />
                        {res.guestCount} pax
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted pt-2 border-t border-border/60">
                      <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        Table: {res.tableAssigned}
                      </span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        🔗 {res.linkedCampaignId}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base">Shift Briefing Checklist</h3>
              </div>
            </div>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <input type="checkbox" defaultChecked className="mt-1 rounded text-primary" />
                <span className="text-muted line-through">Check POS printer roll and reservation terminal battery.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <input type="checkbox" defaultChecked className="mt-1 rounded text-primary" />
                <span className="text-muted line-through">Review VIP guest dietary notes for Budi Santoso (Gluten-free).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <input type="checkbox" className="mt-1 rounded text-primary" />
                <span className="text-dark font-medium">Brief floor captain on CAMP-001 Live Music VIP table allocations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <input type="checkbox" className="mt-1 rounded text-primary" />
                <span className="text-dark font-medium">Verify end-of-day rekap sync with RMCC executive dashboard.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
