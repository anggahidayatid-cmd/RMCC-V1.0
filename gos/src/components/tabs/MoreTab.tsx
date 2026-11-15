import React, { useState } from 'react';
import { Menu, MapPin, User, Settings, ShieldCheck, RefreshCw, Database, Check } from 'lucide-react';
import { OutletInfo } from '../../types';

interface MoreTabProps {
  outletName: string;
  setOutletName: (name: string) => void;
  activeStaff: string;
  setActiveStaff: (staff: string) => void;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  outletName,
  setOutletName,
  activeStaff,
  setActiveStaff,
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState(outletName);
  const [staffName, setStaffName] = useState(activeStaff);
  const [savedMessage, setSavedMessage] = useState(false);

  const outlets: OutletInfo[] = [
    { id: 'O-01', name: 'Jakarta Flagship Dining', location: 'Senopati, SCBD', activeStaff: 'Manager Joko', tablesCount: 12 },
    { id: 'O-02', name: 'Bali Beach Club & Grill', location: 'Seminyak Beach', activeStaff: 'Captain Rian', tablesCount: 18 },
    { id: 'O-03', name: 'Surabaya Sky Lounge', location: 'Tunjungan Plaza', activeStaff: 'GRO Siska', tablesCount: 15 },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setOutletName(selectedOutlet);
    setActiveStaff(staffName);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
          <Menu className="w-4 h-4" />
          <span>GOS V1.1 System Configuration & More</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight">Outlet, Profile & RMCC Sync Settings</h2>
        <p className="text-muted text-sm mt-0.5">
          Configure restaurant floor location, active GRO user, and inspect cross-app synchronization stores.
        </p>
      </div>

      {savedMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl font-semibold flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Settings saved and applied across GOS floor devices successfully!</span>
        </div>
      )}

      {/* Outlet & Profile Form */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <span>Active Outlet & GRO Profile</span>
        </h3>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Select Active Restaurant Outlet
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {outlets.map((o) => (
                <div
                  key={o.id}
                  onClick={() => setSelectedOutlet(o.name)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedOutlet === o.name
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 font-bold'
                      : 'border-border hover:bg-border/30'
                  }`}
                >
                  <div className="text-sm text-dark font-bold">{o.name}</div>
                  <div className="text-xs text-muted mt-1">{o.location}</div>
                  <div className="text-[11px] text-primary mt-2 font-mono">Tables: {o.tablesCount}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Active GRO / Floor Manager Name
            </label>
            <div className="relative max-w-md">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary text-sm font-medium"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

      {/* RMCC Cross-App Synchronization Diagnostics */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-500" />
          <span>RMCC Cross-App Data Synchronization Diagnostics</span>
        </h3>
        <p className="text-sm text-muted">
          GOS V1.1 shares real-time data storage with RMCC Marketing Command Center (`rmcc_gos_guests`, `rmcc_gos_reservations`, `rmcc_customers`). Actions taken here instantly flow into RMCC CRM and Executive Dashboards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-border bg-border/20 space-y-1">
            <span className="text-xs font-semibold uppercase text-muted">Shared Storage Keys</span>
            <div className="font-mono text-xs text-dark space-y-0.5">
              <div>rmcc_gos_guests</div>
              <div>rmcc_gos_reservations</div>
              <div>rmcc_gos_visit_logs</div>
              <div>rmcc_customers</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-border/20 space-y-1">
            <span className="text-xs font-semibold uppercase text-muted">Real-Time Sync Protocol</span>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              BroadcastChannel & Storage Event Active
            </div>
            <p className="text-[11px] text-muted pt-1">
              Cross-tab synchronization enabled for multi-device tablet floor operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
