import {
  Campaign,
  DashboardMetrics,
  ChannelPerformance,
  ManagementInsight,
  Workspace
} from '../types';
import { supabase } from './supabaseClient';

const LOCAL_STORAGE_KEY = 'rmcc_campaigns';

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'CAMP-001',
    restaurantId: 'REST-001',
    name: 'Weekend Family',
    code: 'WEEKEND-26',
    objective: 'Drive family dine-in traffic on weekends with bundle package',
    type: 'Promotion',
    channel: 'Instagram + WhatsApp',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    budget: 8000000,
    dailyBudget: 250000,
    targetRoas: 4.5,
    targetRevenue: 36000000,
    reservationTarget: 120,
    guestTarget: 480,
    spend: 6400000,
    revenue: 38200000,
    status: 'Active',
    notes: 'Family package promotion running strong on IG Stories and WA broadcast'
  },
  {
    id: 'CAMP-002',
    restaurantId: 'REST-001',
    name: 'Birthday Experience',
    code: 'BDAY-26',
    objective: 'Target birthday celebrants with complimentary dessert & group discount',
    type: 'CRM',
    channel: 'CRM + WhatsApp',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    budget: 5000000,
    dailyBudget: 150000,
    targetRoas: 4.5,
    targetRevenue: 22500000,
    reservationTarget: 80,
    guestTarget: 320,
    spend: 3800000,
    revenue: 18400000,
    status: 'Active',
    notes: 'Automated WA messages triggered 7 days before guest birthday'
  },
  {
    id: 'CAMP-003',
    restaurantId: 'REST-001',
    name: 'Live Music October',
    code: 'LIVE-OCT',
    objective: 'Promote Friday & Saturday live acoustic band sessions',
    type: 'Event',
    channel: 'Instagram + TikTok',
    startDate: '2026-10-05',
    endDate: '2026-10-28',
    budget: 9000000,
    dailyBudget: 300000,
    targetRoas: 5.0,
    targetRevenue: 45000000,
    reservationTarget: 150,
    guestTarget: 600,
    spend: 7200000,
    revenue: 41800000,
    status: 'Active',
    notes: 'Short video clips on TikTok showing crowd atmosphere driving high conversion'
  },
  {
    id: 'CAMP-004',
    restaurantId: 'REST-001',
    name: 'Lunch Weekday',
    code: 'LUNCH-WD',
    objective: 'Increase lunch hour occupancy for nearby office workers',
    type: 'Traffic',
    channel: 'Google + Meta',
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    budget: 7000000,
    dailyBudget: 200000,
    targetRoas: 4.0,
    targetRevenue: 28000000,
    reservationTarget: 90,
    guestTarget: 270,
    spend: 5200000,
    revenue: 21800000,
    status: 'Paused',
    notes: 'Paused temporarily to refresh creative messaging and lunch menu options'
  }
];

export const INITIAL_WORKSPACE: Workspace = {
  id: 'REST-001',
  name: 'Gourmet Bistro Cafe & Resto',
  location: 'Jakarta, Indonesia',
  type: 'Casual Dining & Resto',
  currency: 'Rp',
  timezone: 'Asia/Jakarta'
};

function getStoredCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return INITIAL_CAMPAIGNS;
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
    return INITIAL_CAMPAIGNS;
  }
  try {
    return JSON.parse(data) as Campaign[];
  } catch {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
    return INITIAL_CAMPAIGNS;
  }
}

function saveStoredCampaigns(campaigns: Campaign[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaigns));
  }
}

export async function getCampaigns(): Promise<Campaign[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('campaigns').select('*');
      if (!error && data && data.length > 0) {
        saveStoredCampaigns(data as Campaign[]);
        return data as Campaign[];
      }
    } catch {
      // Fallback to local storage on error
    }
  }
  return getStoredCampaigns();
}

export async function getCampaignById(id: string): Promise<Campaign | undefined> {
  const campaigns = await getCampaigns();
  return campaigns.find((c) => c.id === id || c.code === id);
}

export async function addCampaign(campaign: Omit<Campaign, 'id'> & { id?: string }): Promise<Campaign> {
  const newCampaign: Campaign = {
    ...campaign,
    id: campaign.id || `CAMP-${Date.now()}`
  };

  const campaigns = getStoredCampaigns();
  const updated = [newCampaign, ...campaigns];
  saveStoredCampaigns(updated);

  if (supabase) {
    try {
      await supabase.from('campaigns').insert([newCampaign]);
    } catch {
      // Ignore Supabase error if offline / demo mode
    }
  }

  return newCampaign;
}

export async function updateCampaign(campaign: Campaign): Promise<Campaign> {
  const campaigns = getStoredCampaigns();
  const updated = campaigns.map((c) => (c.id === campaign.id ? campaign : c));
  saveStoredCampaigns(updated);

  if (supabase) {
    try {
      await supabase.from('campaigns').update(campaign).eq('id', campaign.id);
    } catch {
      // Ignore Supabase error if offline / demo mode
    }
  }

  return campaign;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const campaigns = getStoredCampaigns();
  const updated = campaigns.filter((c) => c.id !== id);
  saveStoredCampaigns(updated);

  if (supabase) {
    try {
      await supabase.from('campaigns').delete().eq('id', id);
    } catch {
      // Ignore Supabase error if offline / demo mode
    }
  }

  return true;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const campaignList = await getCampaigns();
  const totalSpend = campaignList.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = campaignList.reduce((acc, c) => acc + c.revenue, 0);
  const blendedRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const activeCampaignsCount = campaignList.filter((c) => c.status === 'Active').length;

  const topCampaign = campaignList.length > 0
    ? [...campaignList].sort((a, b) => {
        const roasA = a.spend > 0 ? a.revenue / a.spend : 0;
        const roasB = b.spend > 0 ? b.revenue / b.spend : 0;
        return roasB - roasA;
      })[0]
    : null;

  const activeOrPaused = campaignList.filter((c) => c.status === 'Active' || c.status === 'Paused');
  const underperformingCampaign = activeOrPaused.length > 0
    ? [...activeOrPaused].sort((a, b) => {
        const roasA = a.spend > 0 ? a.revenue / a.spend : 0;
        const roasB = b.spend > 0 ? b.revenue / b.spend : 0;
        return roasA - roasB;
      })[0]
    : null;

  return {
    totalSpend,
    totalRevenue,
    blendedRoas,
    activeCampaigns: activeCampaignsCount,
    totalReservations: 184,
    totalGuests: 520,
    newCustomers: 218,
    repeatCustomers: 302,
    topCampaign,
    underperformingCampaign
  };
}

export async function getChannelPerformance(): Promise<ChannelPerformance[]> {
  return [
    { channel: 'Instagram', spend: 8000000, revenue: 42000000, roas: 5.25, reservations: 65, guests: 240 },
    { channel: 'TikTok', spend: 5200000, revenue: 31000000, roas: 5.96, reservations: 48, guests: 180 },
    { channel: 'Meta Ads', spend: 4400000, revenue: 22000000, roas: 5.00, reservations: 32, guests: 120 },
    { channel: 'Google', spend: 3000000, revenue: 15000000, roas: 5.00, reservations: 24, guests: 90 },
    { channel: 'WhatsApp', spend: 1200000, revenue: 8200000, roas: 6.83, reservations: 15, guests: 60 },
    { channel: 'CRM', spend: 800000, revenue: 2000000, roas: 2.50, reservations: 0, guests: 0 }
  ];
}

export async function getInsights(): Promise<ManagementInsight[]> {
  const campaignList = await getCampaigns();
  const insights: ManagementInsight[] = [];

  const liveOct = campaignList.find((c) => c.code === 'LIVE-OCT');
  if (liveOct) {
    insights.push({
      id: 'INS-001',
      type: 'Positive',
      message: `${liveOct.name} generates highest attributed revenue (Rp41.800.000).`
    });
  }

  const lunchWd = campaignList.find((c) => c.code === 'LUNCH-WD');
  if (lunchWd) {
    insights.push({
      id: 'INS-002',
      type: 'Warning',
      message: `${lunchWd.name} is currently below its 4x target ROAS.`
    });
  }

  const weekend26 = campaignList.find((c) => c.code === 'WEEKEND-26');
  if (weekend26) {
    insights.push({
      id: 'INS-003',
      type: 'Recommendation',
      message: `${weekend26.name} has consumed 80% of budget and remains above target ROAS (5.97x).`
    });
  }

  return insights;
}

export const campaignService = {
  getCampaigns,
  getCampaignById,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  getDashboardMetrics,
  getChannelPerformance,
  getInsights
};

export default campaignService;
