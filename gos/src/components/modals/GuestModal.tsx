import React, { useState } from 'react';
import { X, User, Phone, Mail, Calendar, Award, Heart, FileText } from 'lucide-react';
import { GOSGuest, GOSCustomerType, GOSSourceApp } from '../../types';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: GOSGuest) => void;
  initialGuest?: GOSGuest | null;
}

export const GuestModal: React.FC<GuestModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGuest,
}) => {
  const [name, setName] = useState(initialGuest?.name || '');
  const [phone, setPhone] = useState(initialGuest?.phone || '+62 812-');
  const [email, setEmail] = useState(initialGuest?.email || '');
  const [birthday, setBirthday] = useState(initialGuest?.birthday || '1992-06-15');
  const [customerType, setCustomerType] = useState<GOSCustomerType>(
    initialGuest?.customerType || 'VIP'
  );
  const [dietaryPreferences, setDietaryPreferences] = useState(
    initialGuest?.dietaryPreferences || ''
  );
  const [groNotes, setGroNotes] = useState(initialGuest?.groNotes || '');
  const [favoriteTable, setFavoriteTable] = useState(initialGuest?.favoriteTable || 'Table 03');
  const [sourceApp, setSourceApp] = useState<GOSSourceApp>(initialGuest?.sourceApp || 'GRO_APP');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const savedGuest: GOSGuest = {
      id: initialGuest?.id || `GOS-GUEST-${Date.now()}`,
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@guest.id`,
      birthday,
      customerType,
      totalVisits: initialGuest?.totalVisits || 1,
      totalSpend: initialGuest?.totalSpend || 550000,
      averageSpend: initialGuest?.averageSpend || 550000,
      lastVisitDate: initialGuest?.lastVisitDate || new Date().toISOString().split('T')[0],
      dietaryPreferences,
      groNotes,
      favoriteTable,
      sourceApp,
      createdAt: initialGuest?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSave(savedGuest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              👤
            </div>
            <h3 className="font-bold text-lg">
              {initialGuest ? 'Edit Guest Identity' : 'New Guest Registration'}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Budi Santoso"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Classification / Tier
              </label>
              <div className="relative">
                <Award className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as GOSCustomerType)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                >
                  <option value="VIP">VIP</option>
                  <option value="Repeat">Repeat</option>
                  <option value="New">New</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Birthday Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Favorite Table
              </label>
              <input
                type="text"
                value={favoriteTable}
                onChange={(e) => setFavoriteTable(e.target.value)}
                placeholder="e.g. Table 12 (VIP)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                Source App / Channel
              </label>
              <select
                value={sourceApp}
                onChange={(e) => setSourceApp(e.target.value as GOSSourceApp)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              >
                <option value="GRO_APP">GRO App</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="RESERVATION">Reservation</option>
                <option value="DIRECT">Direct Walk-in</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              Dietary Preferences & Allergies
            </label>
            <div className="relative">
              <Heart className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <input
                type="text"
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
                placeholder="e.g. Gluten-free, peanut allergy, prefers corner booth"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
              GRO & Staff Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-muted" />
              <textarea
                rows={3}
                value={groNotes}
                onChange={(e) => setGroNotes(e.target.value)}
                placeholder="Anniversary notes, VIP preferences, seating habits..."
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
              Save Guest Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
