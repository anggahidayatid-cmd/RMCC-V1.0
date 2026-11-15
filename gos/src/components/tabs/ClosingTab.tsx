import React, { useState } from 'react';
import { FileText, ShieldCheck, Lock, Plus, DollarSign, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { GOSShiftClosing, GOSShiftName } from '../../types';

interface ClosingTabProps {
  shiftClosings: GOSShiftClosing[];
  onAddClosing: (closing: GOSShiftClosing) => void;
}

export const ClosingTab: React.FC<ClosingTabProps> = ({ shiftClosings, onAddClosing }) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);
  const [shiftName, setShiftName] = useState<GOSShiftName>('Evening');
  const [totalReservations, setTotalReservations] = useState(15);
  const [totalWalkIns, setTotalWalkIns] = useState(12);
  const [totalRevenue, setTotalRevenue] = useState(7500000);
  const [handedOverBy, setHandedOverBy] = useState('Manager Siska');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newClosing: GOSShiftClosing = {
      id: `GOS-SHIFT-${Date.now()}`,
      shiftDate,
      shiftName,
      totalReservations: Number(totalReservations),
      totalWalkIns: Number(totalWalkIns),
      totalRevenue: Number(totalRevenue),
      handedOverBy,
      status: 'LOCKED',
    };
    onAddClosing(newClosing);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>End-of-Day Operational Rekap & Handover</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Shift Closing & Audit Logs</h2>
          <p className="text-muted text-sm mt-0.5">
            Locked immutable audit trails for restaurant shift financial and guest count reconciliation.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-primary text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-primary/90 transition flex items-center gap-2 min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>New Shift Closing</span>
        </button>
      </div>

      {/* Shift Closings List */}
      <div className="space-y-4">
        {shiftClosings.map((closing) => (
          <div
            key={closing.id}
            className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-black text-lg text-dark">
                  {closing.shiftName} Shift Closing
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {closing.status} Audit Trail
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {closing.shiftDate}
                </span>
                <span>ID: {closing.id}</span>
                <span>Handed Over By: <strong className="text-dark">{closing.handedOverBy}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full lg:w-auto bg-border/20 p-4 rounded-2xl text-center">
              <div>
                <span className="text-muted block text-[10px] uppercase font-semibold">Reservations</span>
                <span className="font-black text-dark text-base">{closing.totalReservations}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-semibold">Walk-Ins</span>
                <span className="font-black text-dark text-base">{closing.totalWalkIns}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-semibold">Total Revenue</span>
                <span className="font-black text-primary text-base">
                  Rp {(closing.totalRevenue / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for New Shift Closing */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-lg">Lock Shift Closing & Handover</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-muted hover:text-dark font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Shift Date
                </label>
                <input
                  type="date"
                  required
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Shift Name
                </label>
                <select
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value as GOSShiftName)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="Morning">Morning Shift</option>
                  <option value="Evening">Evening Shift</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                    Total Reservations
                  </label>
                  <input
                    type="number"
                    required
                    value={totalReservations}
                    onChange={(e) => setTotalReservations(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                    Total Walk-Ins
                  </label>
                  <input
                    type="number"
                    required
                    value={totalWalkIns}
                    onChange={(e) => setTotalWalkIns(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Total Revenue (IDR)
                </label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={totalRevenue}
                  onChange={(e) => setTotalRevenue(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                  Handed Over By (Manager / Captain)
                </label>
                <input
                  type="text"
                  required
                  value={handedOverBy}
                  onChange={(e) => setHandedOverBy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted hover:text-dark text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock & Submit Rekap</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
