import React, { useState } from 'react';
import { Users, Plus, Search, Award, Phone, Mail, Heart, Edit3, Trash2, Calendar } from 'lucide-react';
import { GOSGuest } from '../../types';

interface GuestsTabProps {
  guests: GOSGuest[];
  onOpenNew: () => void;
  onEdit: (guest: GOSGuest) => void;
  onDelete: (id: string) => void;
}

export const GuestsTab: React.FC<GuestsTabProps> = ({ guests, onOpenNew, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.dietaryPreferences.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || g.customerType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'Repeat':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Corporate':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Birthday':
        return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Single Guest Identity Directory</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">CRM & Guest Intelligence</h2>
          <p className="text-muted text-sm mt-0.5">
            Synchronized seamlessly with RMCC Executive CRM & Guest Analytics.
          </p>
        </div>
        <button
          onClick={onOpenNew}
          className="bg-primary text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-primary/90 transition flex items-center gap-2 min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>Register Guest</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone, dietary..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['All', 'VIP', 'Repeat', 'Corporate', 'Birthday', 'New'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-border/40 text-muted hover:text-dark'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-surface border border-border rounded-3xl p-12 text-center text-muted">
            No guest records found.
          </div>
        ) : (
          filtered.map((guest) => (
            <div
              key={guest.id}
              className="bg-surface border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-dark">{guest.name}</h3>
                    <span className="text-xs text-muted font-mono">ID: {guest.id}</span>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${getBadgeColor(
                      guest.customerType
                    )}`}
                  >
                    {guest.customerType}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-muted mb-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium text-dark">{guest.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span>Birthday: {guest.birthday}</span>
                  </div>
                  {guest.dietaryPreferences && (
                    <div className="flex items-start gap-2 bg-amber-500/10 text-amber-700 dark:text-amber-300 p-2 rounded-xl">
                      <Heart className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{guest.dietaryPreferences}</span>
                    </div>
                  )}
                  {guest.groNotes && (
                    <div className="bg-border/30 p-2.5 rounded-xl text-dark italic">
                      "{guest.groNotes}"
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-2 bg-border/20 p-3 rounded-2xl text-center mb-4 text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Visits</span>
                    <span className="font-black text-dark text-sm">{guest.totalVisits}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Total Spend</span>
                    <span className="font-black text-primary text-sm">
                      Rp {(guest.totalSpend / 1000).toLocaleString()}k
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase">Avg/Visit</span>
                    <span className="font-black text-dark text-sm">
                      Rp {Math.round((guest.averageSpend || guest.totalSpend / guest.totalVisits) / 1000)}k
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[11px] text-muted">Favorite: {guest.favoriteTable}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(guest)}
                      className="p-2 rounded-xl border border-border hover:bg-border/40 text-muted hover:text-dark transition"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(guest.id)}
                      className="p-2 rounded-xl border border-border hover:bg-rose-500/10 text-muted hover:text-rose-500 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
