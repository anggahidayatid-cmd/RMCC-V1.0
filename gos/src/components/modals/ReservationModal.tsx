import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Tag, Link2, FileText, User } from 'lucide-react';
import { GOSReservation, GOSInquiryChannel, GOSReservationStatus } from '../../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (res: GOSReservation) => void;
  initialReservation?: GOSReservation | null;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialReservation,
}) => {
  const [guestName, setGuestName] = useState(initialReservation?.guestName || '');
  const [inquiryChannel, setInquiryChannel] = useState<GOSInquiryChannel>(
    initialReservation?.inquiryChannel || 'WhatsApp'
  );
  const [status, setStatus] = useState<GOSReservationStatus>(
    initialReservation?.status || 'Confirmed'
  );
  const [reservationDate, setReservationDate] = useState(
    initialReservation?.reservationDate || new Date().toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState(initialReservation?.timeSlot || '19:00 - 21:00');
  const [guestCount, setGuestCount] = useState(initialReservation?.guestCount || 2);
  const [tableAssigned, setTableAssigned] = useState(initialReservation?.tableAssigned || 'Table 03');
  const [linkedCampaignId, setLinkedCampaignId] = useState(
    initialReservation?.linkedCampaignId || 'CAMP-001'
  );
  const [groNotes, setGroNotes] = useState(initialReservation?.groNotes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newRes: GOSReservation = {
      id: initialReservation?.id || `GOS-RES-${Date.now()}`,
      guestId: initialReservation?.guestId || `GOS-GUEST-${Date.now()}`,
      guestName,
      inquiryChannel,
      status,
      reservationDate,
      timeSlot,
      guestCount: Number(guestCount),
      tableAssigned,
      linkedCampaignId,
      groNotes,
      createdBy: initialReservation?.createdBy || 'GRO Staff Floor',
    };

    onSave(newRes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              📅
            </div>
            <h3 className="font-bold text-lg">
              {initialReservation ? 'Edit Reservation' : 'New Floor Reservation'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-border/50 transition text-muted hover:text-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Guest Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Budi Santoso"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Inquiry Channel
              </label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <select
                  value={inquiryChannel}
                  onChange={(e) => setInquiryChannel(e.target.value as GOSInquiryChannel)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Phone">Phone</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Meta Ads">Meta Ads</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Status Tracking
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GOSReservationStatus)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No-Show">No-Show</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Reservation Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="date"
                  required
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Time Slot
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="text"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="19:00 - 21:00"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Guest Count
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Assigned Table
              </label>
              <input
                type="text"
                value={tableAssigned}
                onChange={(e) => setTableAssigned(e.target.value)}
                placeholder="e.g. Table 12 (VIP)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              RMCC Campaign Source Mapping
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <select
                value={linkedCampaignId}
                onChange={(e) => setLinkedCampaignId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              >
                <option value="CAMP-001">CAMP-001: Weekend Live Music & Dine</option>
                <option value="CAMP-002">CAMP-002: Executive Lunch Promo</option>
                <option value="CAMP-003">CAMP-003: VIP Wine Tasting Gala</option>
                <option value="CAMP-004">CAMP-004: Instagram Reels Social Ad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              GRO & Service Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <textarea
                rows={3}
                value={groNotes}
                onChange={(e) => setGroNotes(e.target.value)}
                placeholder="Anniversary celebration, dietary preferences, special requests..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border text-muted hover:text-dark font-medium text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 transition"
            >
              Save Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
