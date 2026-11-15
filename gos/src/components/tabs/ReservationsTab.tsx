import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Phone,
  Instagram,
  MessageSquare,
  UserCheck,
  Tag,
  Trash2,
  Edit3,
} from 'lucide-react';
import { GOSReservation, GOSReservationStatus } from '../../types';

interface ReservationsTabProps {
  reservations: GOSReservation[];
  onOpenNew: () => void;
  onEdit: (res: GOSReservation) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: GOSReservationStatus) => void;
}

export const ReservationsTab: React.FC<ReservationsTabProps> = ({
  reservations,
  onOpenNew,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tableAssigned.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.linkedCampaignId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'All' || r.inquiryChannel === channelFilter;
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'Phone':
        return <Phone className="w-4 h-4 text-blue-500" />;
      default:
        return <UserCheck className="w-4 h-4 text-purple-500" />;
    }
  };

  const getStatusBadge = (status: GOSReservationStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'No-Show':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Inquiry & Reservation Management</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Floor Reservations Directory</h2>
          <p className="text-muted text-sm mt-0.5">
            Track inquiries, manage table seating assignments, and link leads to RMCC campaigns.
          </p>
        </div>
        <button
          onClick={onOpenNew}
          className="bg-primary text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-primary/90 transition flex items-center gap-2 min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guest, table, campaign..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 bg-border/30 px-3 py-2 rounded-xl text-xs font-medium">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span>Channel:</span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-transparent font-bold focus:outline-none"
            >
              <option value="All">All Channels</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Phone">Phone</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Meta Ads">Meta Ads</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-border/30 px-3 py-2 rounded-xl text-xs font-medium">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-Show">No-Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Table / Grid */}
      <div className="bg-surface border border-border rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-border/30 border-b border-border text-xs uppercase font-semibold text-muted">
                <th className="p-4">Guest Info</th>
                <th className="p-4">Channel Tag</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Table / Pax</th>
                <th className="p-4">Campaign Source</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted">
                    No reservations matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-border/20 transition">
                    <td className="p-4">
                      <div className="font-bold text-dark">{res.guestName}</div>
                      <div className="text-xs text-muted">ID: {res.id}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-medium">
                        {getChannelIcon(res.inquiryChannel)}
                        <span>{res.inquiryChannel}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs">
                      <div>{res.reservationDate}</div>
                      <div className="text-muted">{res.timeSlot}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg text-xs">
                        {res.tableAssigned}
                      </span>
                      <div className="text-xs text-muted mt-1">{res.guestCount} guests</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg w-fit">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{res.linkedCampaignId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={res.status}
                        onChange={(e) => onUpdateStatus(res.id, e.target.value as GOSReservationStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${getStatusBadge(
                          res.status
                        )}`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="No-Show">No-Show</option>
                      </select>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onEdit(res)}
                        className="p-2 rounded-xl border border-border hover:bg-border/40 text-muted hover:text-dark transition"
                        title="Edit Reservation"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(res.id)}
                        className="p-2 rounded-xl border border-border hover:bg-rose-500/10 text-muted hover:text-rose-500 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
