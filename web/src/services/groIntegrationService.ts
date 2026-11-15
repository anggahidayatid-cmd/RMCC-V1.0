import {
  Customer,
  GOSGuest,
  GOSReservation,
  GOSVisitLog,
  GOSShiftClosing,
  GOSSyncedData
} from '../types';
import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY_CUSTOMERS = 'rmcc_customers';
const LOCAL_STORAGE_KEY_GOS_GUESTS = 'rmcc_gos_guests';
const LOCAL_STORAGE_KEY_GOS_RESERVATIONS = 'rmcc_gos_reservations';
const LOCAL_STORAGE_KEY_GOS_VISIT_LOGS = 'rmcc_gos_visit_logs';
const LOCAL_STORAGE_KEY_GOS_SHIFT_CLOSINGS = 'rmcc_gos_shift_closings';

export const INITIAL_GOS_GUESTS: GOSGuest[] = [
  {
    id: 'GOS-GUEST-001',
    name: 'Budi Santoso',
    phone: '+62 812-3456-7890',
    email: 'budi.santoso@gmail.com',
    birthday: '1990-05-14',
    customerType: 'VIP',
    totalVisits: 14,
    totalSpend: 4850000,
    averageSpend: 346428,
    lastVisitDate: '2026-10-18',
    dietaryPreferences: 'Gluten-free preference, prefers corner booth table',
    groNotes: 'Celebrated 5th wedding anniversary with champagne toast.',
    favoriteTable: 'Table 12 (VIP)',
    sourceApp: 'GRO_APP',
    createdAt: '2026-01-10'
  },
  {
    id: 'GOS-GUEST-002',
    name: 'Siti Rahmawati',
    phone: '+62 813-9876-5432',
    email: 'siti.rahma@yahoo.com',
    birthday: '1988-11-22',
    customerType: 'Repeat',
    totalVisits: 6,
    totalSpend: 1950000,
    averageSpend: 325000,
    lastVisitDate: '2026-10-22',
    dietaryPreferences: 'Loves spicy sambal, allergic to peanuts',
    groNotes: 'Frequent weekend brunch guest with family.',
    favoriteTable: 'Table 08',
    sourceApp: 'WHATSAPP',
    createdAt: '2026-03-15'
  },
  {
    id: 'GOS-GUEST-003',
    name: 'Dewi Lestari',
    phone: '+62 811-2233-4455',
    email: 'dewi.lestari@hotmail.com',
    birthday: '1995-07-30',
    customerType: 'New',
    totalVisits: 1,
    totalSpend: 420000,
    averageSpend: 420000,
    lastVisitDate: '2026-10-24',
    dietaryPreferences: 'Vegetarian options preferred',
    groNotes: 'First-time guest referred via Instagram Live Music campaign.',
    favoriteTable: 'Table 02',
    sourceApp: 'GRO_APP',
    createdAt: '2026-10-24'
  },
  {
    id: 'GOS-GUEST-004',
    name: 'Ahmad Wijaya',
    phone: '+62 856-7788-9900',
    email: 'ahmad.w@gmail.com',
    birthday: '1982-12-05',
    customerType: 'Corporate',
    totalVisits: 18,
    totalSpend: 6200000,
    averageSpend: 344444,
    lastVisitDate: '2026-10-15',
    dietaryPreferences: 'Prefers premium Wagyu cuts, medium rare',
    groNotes: 'Corporate account holder, hosts monthly client dinners.',
    favoriteTable: 'Private Room A',
    sourceApp: 'DIRECT',
    createdAt: '2025-11-20'
  },
  {
    id: 'GOS-GUEST-005',
    name: 'Maya Putri',
    phone: '+62 817-6543-2109',
    email: 'maya.putri@gmail.com',
    birthday: '1992-10-10',
    customerType: 'Birthday',
    totalVisits: 4,
    totalSpend: 1250000,
    averageSpend: 312500,
    lastVisitDate: '2026-10-10',
    dietaryPreferences: 'Loves chocolate desserts',
    groNotes: 'Birthday celebration month in October.',
    favoriteTable: 'Table 05',
    sourceApp: 'RESERVATION',
    createdAt: '2026-06-01'
  }
];

export const INITIAL_GOS_RESERVATIONS: GOSReservation[] = [
  {
    id: 'GOS-RES-101',
    guestId: 'GOS-GUEST-001',
    guestName: 'Budi Santoso',
    inquiryChannel: 'WhatsApp',
    status: 'Confirmed',
    reservationDate: '2026-10-28',
    timeSlot: '19:00 - 21:00',
    guestCount: 4,
    tableAssigned: 'Table 12 (VIP)',
    linkedCampaignId: 'CAMP-001',
    groNotes: 'Anniversary celebration dinner with wine pairing request.',
    createdBy: 'Staff Agung'
  },
  {
    id: 'GOS-RES-102',
    guestId: 'GOS-GUEST-003',
    guestName: 'Dewi Lestari',
    inquiryChannel: 'Instagram',
    status: 'Confirmed',
    reservationDate: '2026-10-28',
    timeSlot: '12:30 - 14:00',
    guestCount: 2,
    tableAssigned: 'Table 02',
    linkedCampaignId: 'CAMP-002',
    groNotes: 'First-time diner via Live Music Campaign ad.',
    createdBy: 'Staff Rina'
  },
  {
    id: 'GOS-RES-103',
    guestId: 'GOS-GUEST-004',
    guestName: 'Ahmad Wijaya',
    inquiryChannel: 'Phone',
    status: 'Confirmed',
    reservationDate: '2026-10-29',
    timeSlot: '18:30 - 20:30',
    guestCount: 8,
    tableAssigned: 'Private Room A',
    linkedCampaignId: 'CAMP-003',
    groNotes: 'Corporate monthly dinner meeting.',
    createdBy: 'Manager Joko'
  }
];

export const INITIAL_GOS_VISIT_LOGS: GOSVisitLog[] = [
  {
    id: 'GOS-VISIT-301',
    guestId: 'GOS-GUEST-001',
    visitDate: '2026-10-18',
    tableNumber: 'Table 12 (VIP)',
    actualGuests: 4,
    spendAmount: 850000,
    serviceNotes: 'Served complimentary anniversary dessert.',
    matchedCampaignId: 'CAMP-001'
  },
  {
    id: 'GOS-VISIT-302',
    guestId: 'GOS-GUEST-002',
    visitDate: '2026-10-22',
    tableNumber: 'Table 08',
    actualGuests: 3,
    spendAmount: 350000,
    serviceNotes: 'Weekend brunch family gathering.',
    matchedCampaignId: 'CAMP-002'
  }
];

export const INITIAL_GOS_SHIFT_CLOSINGS: GOSShiftClosing[] = [
  {
    id: 'GOS-SHIFT-501',
    shiftDate: '2026-10-26',
    shiftName: 'Morning',
    totalReservations: 12,
    totalWalkIns: 8,
    totalRevenue: 4200000,
    handedOverBy: 'Captain Rian',
    status: 'LOCKED'
  },
  {
    id: 'GOS-SHIFT-502',
    shiftDate: '2026-10-26',
    shiftName: 'Evening',
    totalReservations: 18,
    totalWalkIns: 14,
    totalRevenue: 8900000,
    handedOverBy: 'Manager Siska',
    status: 'LOCKED'
  }
];

// Helper to convert GOSGuest to Customer model for CRM view compatibility
export function gosGuestToCustomer(g: GOSGuest): Customer {
  return {
    id: g.id,
    name: g.name,
    email: g.email,
    phone: g.phone,
    totalVisits: g.totalVisits,
    totalSpend: g.totalSpend,
    lastVisitDate: g.lastVisitDate,
    segment: g.customerType,
    status: 'Active',
    dietaryPreferences: g.dietaryPreferences,
    groNotes: g.groNotes,
    source: g.sourceApp === 'GRO_APP' ? 'GRO App' : g.sourceApp,
    birthday: g.birthday,
    customerType: g.customerType,
    averageSpend: g.averageSpend,
    favoriteTable: g.favoriteTable,
    sourceApp: g.sourceApp,
    createdAt: g.createdAt,
    visitHistory: [
      {
        date: g.lastVisitDate,
        table: g.favoriteTable || 'Table 01',
        spend: g.averageSpend || 450000,
        notes: g.groNotes || 'Synced from GOS V1.1 Floor Intelligence'
      }
    ]
  };
}

export function getSyncedGOSData(): GOSSyncedData {
  if (typeof window === 'undefined') {
    return {
      guests: INITIAL_GOS_GUESTS,
      reservations: INITIAL_GOS_RESERVATIONS,
      visitLogs: INITIAL_GOS_VISIT_LOGS,
      shiftClosings: INITIAL_GOS_SHIFT_CLOSINGS
    };
  }

  const guestsData = localStorage.getItem(LOCAL_STORAGE_KEY_GOS_GUESTS);
  const reservationsData = localStorage.getItem(LOCAL_STORAGE_KEY_GOS_RESERVATIONS);
  const visitLogsData = localStorage.getItem(LOCAL_STORAGE_KEY_GOS_VISIT_LOGS);
  const shiftClosingsData = localStorage.getItem(LOCAL_STORAGE_KEY_GOS_SHIFT_CLOSINGS);

  const guests = guestsData ? JSON.parse(guestsData) : INITIAL_GOS_GUESTS;
  const reservations = reservationsData ? JSON.parse(reservationsData) : INITIAL_GOS_RESERVATIONS;
  const visitLogs = visitLogsData ? JSON.parse(visitLogsData) : INITIAL_GOS_VISIT_LOGS;
  const shiftClosings = shiftClosingsData ? JSON.parse(shiftClosingsData) : INITIAL_GOS_SHIFT_CLOSINGS;

  if (!guestsData) localStorage.setItem(LOCAL_STORAGE_KEY_GOS_GUESTS, JSON.stringify(INITIAL_GOS_GUESTS));
  if (!reservationsData) localStorage.setItem(LOCAL_STORAGE_KEY_GOS_RESERVATIONS, JSON.stringify(INITIAL_GOS_RESERVATIONS));
  if (!visitLogsData) localStorage.setItem(LOCAL_STORAGE_KEY_GOS_VISIT_LOGS, JSON.stringify(INITIAL_GOS_VISIT_LOGS));
  if (!shiftClosingsData) localStorage.setItem(LOCAL_STORAGE_KEY_GOS_SHIFT_CLOSINGS, JSON.stringify(INITIAL_GOS_SHIFT_CLOSINGS));

  return { guests, reservations, visitLogs, shiftClosings };
}

export async function importGuestFromGro(guest: GOSGuest): Promise<GOSGuest> {
  const gosData = getSyncedGOSData();
  const existingIdx = gosData.guests.findIndex((g) => g.id === guest.id || g.phone === guest.phone);

  let savedGuest = {
    ...guest,
    averageSpend: guest.averageSpend || (guest.totalVisits > 0 ? Math.round(guest.totalSpend / guest.totalVisits) : guest.totalSpend),
    createdAt: guest.createdAt || new Date().toISOString().split('T')[0]
  };

  if (existingIdx >= 0) {
    gosData.guests[existingIdx] = {
      ...gosData.guests[existingIdx],
      ...savedGuest,
      totalVisits: gosData.guests[existingIdx].totalVisits + (guest.totalVisits || 1),
      totalSpend: gosData.guests[existingIdx].totalSpend + (guest.totalSpend || 500000)
    };
    savedGuest = gosData.guests[existingIdx];
  } else {
    gosData.guests.unshift(savedGuest);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_GUESTS, JSON.stringify(gosData.guests));
    // Also sync to customer store for CRM compatibility
    const customers = gosData.guests.map(gosGuestToCustomer);
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
  }

  if (supabase) {
    try {
      await supabase.from('gos_guests').upsert([savedGuest]);
    } catch {
      // offline fallback
    }
  }

  return savedGuest;
}

export async function importReservationFromGro(reservation: GOSReservation): Promise<GOSReservation> {
  const gosData = getSyncedGOSData();
  const existingIdx = gosData.reservations.findIndex((r) => r.id === reservation.id);

  let savedRes = { ...reservation };
  if (existingIdx >= 0) {
    gosData.reservations[existingIdx] = savedRes;
  } else {
    gosData.reservations.unshift(savedRes);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_RESERVATIONS, JSON.stringify(gosData.reservations));
  }

  if (supabase) {
    try {
      await supabase.from('gos_reservations').upsert([savedRes]);
    } catch {
      // offline fallback
    }
  }

  return savedRes;
}

export async function importVisitLogFromGro(visit: GOSVisitLog): Promise<GOSVisitLog> {
  const gosData = getSyncedGOSData();
  const existingIdx = gosData.visitLogs.findIndex((v) => v.id === visit.id);

  let savedVisit = { ...visit };
  if (existingIdx >= 0) {
    gosData.visitLogs[existingIdx] = savedVisit;
  } else {
    gosData.visitLogs.unshift(savedVisit);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_VISIT_LOGS, JSON.stringify(gosData.visitLogs));
  }

  if (supabase) {
    try {
      await supabase.from('gos_visit_logs').upsert([savedVisit]);
    } catch {
      // offline fallback
    }
  }

  return savedVisit;
}

export async function importShiftClosingFromGro(closing: GOSShiftClosing): Promise<GOSShiftClosing> {
  const gosData = getSyncedGOSData();
  const existingIdx = gosData.shiftClosings.findIndex((s) => s.id === closing.id);

  let savedClosing = { ...closing };
  if (existingIdx >= 0) {
    gosData.shiftClosings[existingIdx] = savedClosing;
  } else {
    gosData.shiftClosings.unshift(savedClosing);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_SHIFT_CLOSINGS, JSON.stringify(gosData.shiftClosings));
  }

  if (supabase) {
    try {
      await supabase.from('gos_shift_closings').upsert([savedClosing]);
    } catch {
      // offline fallback
    }
  }

  return savedClosing;
}

// Backwards compatibility methods for legacy Customer integration
export async function getCustomers(): Promise<Customer[]> {
  const gosData = getSyncedGOSData();
  return gosData.guests.map(gosGuestToCustomer);
}

export async function importCustomerFromGro(payload: {
  name: string;
  email?: string;
  phone: string;
  segment?: string;
  totalVisits?: number;
  totalSpend?: number;
  lastVisitDate?: string;
  groNotes?: string;
  dietaryPreferences?: string;
  source?: string;
}): Promise<Customer> {
  const gosGuest: GOSGuest = {
    id: `GOS-GUEST-${Date.now()}`,
    name: payload.name,
    phone: payload.phone,
    email: payload.email || `${payload.name.toLowerCase().replace(/\s+/g, '')}@guest.id`,
    birthday: '1993-08-20',
    customerType: (payload.segment as any) || 'New',
    totalVisits: payload.totalVisits || 1,
    totalSpend: payload.totalSpend || 550000,
    averageSpend: payload.totalSpend ? Math.round(payload.totalSpend / (payload.totalVisits || 1)) : 550000,
    lastVisitDate: payload.lastVisitDate || new Date().toISOString().split('T')[0],
    dietaryPreferences: payload.dietaryPreferences || 'Chef recommendation set',
    groNotes: payload.groNotes || 'Imported live from GOS V1.1 Integration Service.',
    favoriteTable: 'Table 03 (Floor Sync)',
    sourceApp: 'GRO_APP',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const saved = await importGuestFromGro(gosGuest);
  return gosGuestToCustomer(saved);
}

export const groIntegrationService = {
  getSyncedGOSData,
  importGuestFromGro,
  importReservationFromGro,
  importVisitLogFromGro,
  importShiftClosingFromGro,
  getCustomers,
  importCustomerFromGro
};

export default groIntegrationService;
