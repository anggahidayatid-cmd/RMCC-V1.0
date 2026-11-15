import {
  GOSGuest,
  GOSReservation,
  GOSVisitLog,
  GOSShiftClosing,
  GOSSyncedData,
  TableInfo
} from '../types';
import { emitSyncEvent } from './syncService';

const LOCAL_STORAGE_KEY_GOS_GUESTS = 'rmcc_gos_guests';
const LOCAL_STORAGE_KEY_GOS_RESERVATIONS = 'rmcc_gos_reservations';
const LOCAL_STORAGE_KEY_GOS_VISIT_LOGS = 'rmcc_gos_visit_logs';
const LOCAL_STORAGE_KEY_GOS_SHIFT_CLOSINGS = 'rmcc_gos_shift_closings';
const LOCAL_STORAGE_KEY_CUSTOMERS = 'rmcc_customers';
const LOCAL_STORAGE_KEY_TABLES = 'gos_tables_state';

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
    reservationDate: new Date().toISOString().split('T')[0],
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
    reservationDate: new Date().toISOString().split('T')[0],
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
    status: 'Pending',
    reservationDate: new Date().toISOString().split('T')[0],
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

export const INITIAL_TABLES: TableInfo[] = [
  { id: 'T01', number: 'Table 01', capacity: 2, status: 'Available', section: 'Main Dining' },
  { id: 'T02', number: 'Table 02', capacity: 2, status: 'Reserved', currentGuest: 'Dewi Lestari', reservationTime: '12:30', section: 'Main Dining' },
  { id: 'T03', number: 'Table 03', capacity: 4, status: 'Available', section: 'Main Dining' },
  { id: 'T04', number: 'Table 04', capacity: 4, status: 'Occupied', currentGuest: 'Siti Rahmawati', section: 'Main Dining' },
  { id: 'T05', number: 'Table 05', capacity: 4, status: 'Cleaning', section: 'Main Dining' },
  { id: 'T06', number: 'Table 06', capacity: 6, status: 'Available', section: 'Terrace' },
  { id: 'T07', number: 'Table 07', capacity: 6, status: 'Occupied', currentGuest: 'Group Dinner', section: 'Terrace' },
  { id: 'T08', number: 'Table 08', capacity: 2, status: 'Available', section: 'Terrace' },
  { id: 'T09', number: 'Table 09', capacity: 4, status: 'Reserved', currentGuest: 'Pending Check-in', reservationTime: '20:00', section: 'Terrace' },
  { id: 'T10', number: 'Table 10', capacity: 8, status: 'Cleaning', section: 'VIP Lounge' },
  { id: 'T11', number: 'Private Room A', capacity: 12, status: 'Reserved', currentGuest: 'Ahmad Wijaya', reservationTime: '18:30', section: 'VIP Lounge' },
  { id: 'T12', number: 'Table 12 (VIP)', capacity: 4, status: 'Reserved', currentGuest: 'Budi Santoso', reservationTime: '19:00', section: 'VIP Lounge' }
];

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

export function getTablesState(): TableInfo[] {
  if (typeof window === 'undefined') return INITIAL_TABLES;
  const t = localStorage.getItem(LOCAL_STORAGE_KEY_TABLES);
  if (!t) {
    localStorage.setItem(LOCAL_STORAGE_KEY_TABLES, JSON.stringify(INITIAL_TABLES));
    return INITIAL_TABLES;
  }
  return JSON.parse(t);
}

export function saveTablesState(tables: TableInfo[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_TABLES, JSON.stringify(tables));
    emitSyncEvent('GOS_UPDATED', { type: 'TABLES_UPDATED', tables });
  }
}

export function saveGOSData(data: GOSSyncedData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_GUESTS, JSON.stringify(data.guests));
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_RESERVATIONS, JSON.stringify(data.reservations));
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_VISIT_LOGS, JSON.stringify(data.visitLogs));
    localStorage.setItem(LOCAL_STORAGE_KEY_GOS_SHIFT_CLOSINGS, JSON.stringify(data.shiftClosings));

    // Also sync to rmcc_customers for Executive CRM integration
    const customersMapped = data.guests.map((g) => ({
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
      source: g.sourceApp,
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
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOMERS, JSON.stringify(customersMapped));

    emitSyncEvent('GOS_UPDATED', data);
    emitSyncEvent('CRM_UPDATED', customersMapped);
  }
}

export function addGuest(guest: GOSGuest) {
  const data = getSyncedGOSData();
  data.guests.unshift(guest);
  saveGOSData(data);
  return guest;
}

export function updateGuest(guest: GOSGuest) {
  const data = getSyncedGOSData();
  data.guests = data.guests.map((g) => (g.id === guest.id ? guest : g));
  saveGOSData(data);
  return guest;
}

export function deleteGuest(id: string) {
  const data = getSyncedGOSData();
  data.guests = data.guests.filter((g) => g.id !== id);
  saveGOSData(data);
}

export function addReservation(res: GOSReservation) {
  const data = getSyncedGOSData();
  data.reservations.unshift(res);
  saveGOSData(data);
  return res;
}

export function updateReservation(res: GOSReservation) {
  const data = getSyncedGOSData();
  data.reservations = data.reservations.map((r) => (r.id === res.id ? res : r));
  saveGOSData(data);
  return res;
}

export function deleteReservation(id: string) {
  const data = getSyncedGOSData();
  data.reservations = data.reservations.filter((r) => r.id !== id);
  saveGOSData(data);
}

export function addShiftClosing(closing: GOSShiftClosing) {
  const data = getSyncedGOSData();
  data.shiftClosings.unshift(closing);
  saveGOSData(data);
  return closing;
}
