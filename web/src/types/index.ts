export type CampaignStatus = 'Draft' | 'Scheduled' | 'Active' | 'Paused' | 'Completed';
export type CampaignType = 'Promotion' | 'Event' | 'Brand Awareness' | 'Traffic' | 'CRM' | 'Seasonal' | 'Partnership' | 'Other' | string;
export type InsightType = 'Positive' | 'Warning' | 'Negative' | 'Recommendation';

// GOS V1.1 Types
export type GOSCustomerType = 'New' | 'Repeat' | 'VIP' | 'Corporate' | 'Birthday' | 'Inactive';
export type GOSSourceApp = 'GRO_APP' | 'DIRECT' | 'WHATSAPP' | 'RESERVATION';
export type GOSInquiryChannel = 'WhatsApp' | 'Instagram' | 'Phone' | 'Walk-in' | 'Meta Ads';
export type GOSReservationStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'No-Show';
export type GOSShiftName = 'Morning' | 'Evening';
export type GOSShiftStatus = 'LOCKED' | 'Draft';

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

export interface Campaign {
  id: string;
  restaurantId: string;
  name: string;
  code: string;
  objective: string;
  type: CampaignType;
  channel: string;
  startDate: string;
  endDate: string;
  budget: number;
  dailyBudget: number;
  targetRoas: number;
  targetRevenue: number;
  reservationTarget: number;
  guestTarget: number;
  spend: number;
  revenue: number;
  status: CampaignStatus;
  notes: string;
}

export interface Workspace {
  id: string;
  name: string;
  location: string;
  type: string;
  currency: string;
  timezone: string;
}

export interface DashboardMetrics {
  totalSpend: number;
  totalRevenue: number;
  blendedRoas: number;
  activeCampaigns: number;
  totalReservations: number;
  totalGuests: number;
  newCustomers: number;
  repeatCustomers: number;
  topCampaign: Campaign | null;
  underperformingCampaign: Campaign | null;
}

export interface ChannelPerformance {
  channel: string;
  spend: number;
  revenue: number;
  roas: number;
  reservations: number;
  guests: number;
}

export interface ManagementInsight {
  id: string;
  type: InsightType;
  message: string;
}

export interface CustomerVisit {
  date: string;
  table?: string;
  spend: number;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  totalSpend: number;
  lastVisitDate: string;
  segment: string;
  status: string;
  dietaryPreferences?: string;
  groNotes?: string;
  source?: string;
  visitHistory?: CustomerVisit[];
  birthday?: string;
  customerType?: GOSCustomerType;
  averageSpend?: number;
  favoriteTable?: string;
  sourceApp?: GOSSourceApp;
  createdAt?: string;
}

export interface EventItem {
  id: string;
  campaignId?: string;
  name: string;
  date: string;
  expectedGuests: number;
  actualGuests: number;
  status: string;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  lastGenerated: string;
}

export interface RolePermission {
  role: string;
  description: string;
  permissions: string[];
}

export type IntegrationStatus = 'Connected' | 'Disconnected';
export type SyncFrequency = 'Real-time' | 'Every 15 mins' | 'Hourly' | 'Daily';

export interface ApiIntegration {
  id: string;
  name: string;
  channel: string;
  status: IntegrationStatus;
  accountId: string;
  lastSynced: string;
  accessToken: string;
  webhookUrl: string;
  syncFrequency: SyncFrequency;
}

