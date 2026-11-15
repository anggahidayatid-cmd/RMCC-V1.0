export type GOSCustomerType = 'New' | 'Repeat' | 'VIP' | 'Corporate' | 'Birthday' | 'Inactive';
export type GOSSourceApp = 'GRO_APP' | 'DIRECT' | 'WHATSAPP' | 'RESERVATION';
export type GOSInquiryChannel = 'WhatsApp' | 'Instagram' | 'Phone' | 'Walk-in' | 'Meta Ads';
export type GOSReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'No-Show';
export type GOSShiftName = 'Morning' | 'Evening';
export type GOSShiftStatus = 'LOCKED' | 'Draft';

export type TableStatusCode = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning';

export interface TableInfo {
  id: string;
  number: string;
  capacity: number;
  status: TableStatusCode;
  currentGuest?: string;
  reservationTime?: string;
  section: string;
}

export interface GOSGuest {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  customerType: GOSCustomerType;
  totalVisits: number;
  totalSpend: number;
  averageSpend: number;
  lastVisitDate: string;
  dietaryPreferences: string;
  groNotes: string;
  favoriteTable: string;
  sourceApp: GOSSourceApp;
  createdAt: string;
}

export interface GOSReservation {
  id: string;
  guestId: string;
  guestName: string;
  inquiryChannel: GOSInquiryChannel;
  status: GOSReservationStatus;
  reservationDate: string;
  timeSlot: string;
  guestCount: number;
  tableAssigned: string;
  linkedCampaignId: string;
  groNotes: string;
  createdBy: string;
}

export interface GOSVisitLog {
  id: string;
  guestId: string;
  visitDate: string;
  tableNumber: string;
  actualGuests: number;
  spendAmount: number;
  serviceNotes: string;
  matchedCampaignId: string;
}

export interface GOSShiftClosing {
  id: string;
  shiftDate: string;
  shiftName: GOSShiftName;
  totalReservations: number;
  totalWalkIns: number;
  totalRevenue: number;
  handedOverBy: string;
  status: GOSShiftStatus;
}

export interface GOSSyncedData {
  guests: GOSGuest[];
  reservations: GOSReservation[];
  visitLogs: GOSVisitLog[];
  shiftClosings: GOSShiftClosing[];
}

export interface OutletInfo {
  id: string;
  name: string;
  location: string;
  activeStaff: string;
  tablesCount: number;
}
