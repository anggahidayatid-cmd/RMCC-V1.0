import React, { useState, useEffect } from 'react';
import { Campaign, CampaignStatus } from '../../types';
import {
  getCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign
} from '../../services/campaignService';
import CampaignTable from './CampaignTable';
import CampaignDetailModal from './CampaignDetailModal';
import CampaignFormModal from './CampaignFormModal';
import DeleteCampaignModal from './DeleteCampaignModal';
import { useTranslation } from '../../i18n';
import { useRbac } from '../../context/RbacContext';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  PieChart,
  ShieldAlert
} from 'lucide-react';

export interface CampaignsViewProps {
  selectedWorkspace?: string;
}

const STATUS_FILTERS: (CampaignStatus | 'All')[] = [
  'All',
  'Draft',
  'Scheduled',
  'Active',
  'Paused',
  'Completed'
];

const CHANNEL_FILTERS = [
  'All',
  'Instagram',
  'TikTok',
  'Meta Ads',
  'Google',
  'WhatsApp',
  'CRM'
];

export const CampaignsView: React.FC<CampaignsViewProps> = ({ selectedWorkspace }) => {
  const { t } = useTranslation();
  const { hasPermission, userRole } = useRbac();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const canView = hasPermission('campaign_view');
  const canCreateEdit = hasPermission('campaign_create');
  const canDelete = hasPermission('campaign_delete');

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<CampaignStatus | 'All'>('All');
  const [selectedChannel, setSelectedChannel] = useState<string>('All');

  // Modal states
  const [viewModalCampaign, setViewModalCampaign] = useState<Campaign | null>(null);
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deleteModalCampaign, setDeleteModalCampaign] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load campaigns
  const loadData = async () => {
    setLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Modals
  const handleOpenCreateModal = () => {
    if (!canCreateEdit) return;
    setEditingCampaign(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (camp: Campaign) => {
    if (!canCreateEdit) return;
    setEditingCampaign(camp);
    setFormModalOpen(true);
  };

  const handleOpenDeleteModal = (camp: Campaign) => {
    if (!canDelete) return;
    setDeleteModalCampaign(camp);
  };

  const handleSaveCampaign = async (formData: Partial<Campaign>) => {
    if (!canCreateEdit) return;
    if (editingCampaign) {
      const updated: Campaign = {
        ...editingCampaign,
        ...formData
      } as Campaign;
      await updateCampaign(updated);
    } else {
      await addCampaign(formData as Omit<Campaign, 'id'>);
    }
    await loadData();
    setFormModalOpen(false);
    setEditingCampaign(null);
  };

  const handleConfirmDelete = async (id: string) => {
    if (!canDelete) return;
    setIsDeleting(true);
    await deleteCampaign(id);
    await loadData();
    setIsDeleting(false);
    setDeleteModalCampaign(null);
  };

  if (!canView) {
    return (
      <div className="p-8 bg-surface rounded-2xl border border-border shadow-sm text-center space-y-4 my-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-dark">Access Restricted: View Campaigns & Performance</h2>
          <p className="text-xs text-muted max-w-md mx-auto mt-1">
            Your current role ({t(`settings.roles.${userRole}`)}) does not have permission to view marketing campaigns or performance data. Please update permissions in Settings (RBAC Matrix).
          </p>
        </div>
      </div>
    );
  }

  // Filter logic
  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesSearch =
      searchQuery === '' ||
      camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.channel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || camp.status === selectedStatus;
    const matchesChannel =
      selectedChannel === 'All' ||
      camp.channel.toLowerCase().includes(selectedChannel.toLowerCase());

    return matchesSearch && matchesStatus && matchesChannel;
  });

  // KPI Calculations
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'Active').length;
  const totalPlannedBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalActualSpend = campaigns.reduce((acc, c) => acc + (c.spend || 0), 0);
  const totalAttributedRevenue = campaigns.reduce((acc, c) => acc + (c.revenue || 0), 0);
  const blendedRoas = totalActualSpend > 0 ? totalAttributedRevenue / totalActualSpend : 0;

  const getStatusLabel = (st: string) => {
    switch (st) {
      case 'All': return t('campaigns.statusAll');
      case 'Draft': return t('campaigns.statusDraft');
      case 'Scheduled': return t('campaigns.statusScheduled');
      case 'Active': return t('campaigns.statusActive');
      case 'Paused': return t('campaigns.statusPaused');
      case 'Completed': return t('campaigns.statusCompleted');
      default: return st;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-dark">{t('campaigns.title')}</h1>
          </div>
          <p className="text-xs text-muted mt-1 max-w-xl">
            {t('campaigns.subtitle', { workspace: selectedWorkspace || 'your restaurant workspace' })}
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          disabled={!canCreateEdit}
          title={!canCreateEdit ? "Permission 'Create & Edit Campaigns' required" : undefined}
          className={`px-4 py-2.5 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-start sm:self-auto ${
            canCreateEdit
              ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer shadow-primary/20'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{t('campaigns.newCampaign')}</span>
        </button>
      </div>

      {/* 2. Top KPI Banner Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Campaigns */}
        <div className="bg-surface border border-border p-4 rounded-2xl space-y-1 shadow-2xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('campaigns.totalCampaigns')}</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-extrabold text-dark">{totalCampaigns}</div>
          <div className="text-[10px] text-muted font-medium">{t('campaigns.recorded')}</div>
        </div>

        {/* Card 2: Active Campaigns */}
        <div className="bg-surface border border-border p-4 rounded-2xl space-y-1 shadow-2xs hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('campaigns.activeCampaigns')}</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600">{activeCampaigns}</div>
          <div className="text-[10px] text-emerald-700 font-semibold">{t('campaigns.runningNow')}</div>
        </div>

        {/* Card 3: Planned Budget */}
        <div className="bg-surface border border-border p-4 rounded-2xl space-y-1 shadow-2xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('campaigns.plannedBudget')}</span>
            <DollarSign className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-lg font-extrabold text-dark">
            Rp {(totalPlannedBudget / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-muted">Rp {totalPlannedBudget.toLocaleString('id-ID')}</div>
        </div>

        {/* Card 4: Actual Spend */}
        <div className="bg-surface border border-border p-4 rounded-2xl space-y-1 shadow-2xs hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('campaigns.actualSpend')}</span>
            <PieChart className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-extrabold text-slate-800">
            Rp {(totalActualSpend / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-muted">
            {totalPlannedBudget > 0 ? `${((totalActualSpend / totalPlannedBudget) * 100).toFixed(1)}% utilized` : '0%'}
          </div>
        </div>

        {/* Card 5: Attributed Revenue */}
        <div className="bg-surface border border-border p-4 rounded-2xl space-y-1 shadow-2xs hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted uppercase">{t('campaigns.attributedRev')}</span>
            <Award className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-extrabold text-emerald-600">
            Rp {(totalAttributedRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="text-[10px] text-muted">{t('campaigns.totalSalesGenerated')}</div>
        </div>

        {/* Card 6: Blended ROAS */}
        <div className="bg-gradient-to-br from-primary to-primary-light border border-primary/20 p-4 rounded-2xl text-white space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-white/80 uppercase">{t('campaigns.blendedRoas')}</span>
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="text-xl font-extrabold text-white">{blendedRoas.toFixed(2)}x</div>
          <div className="text-[10px] text-white/90 font-medium">{t('campaigns.target', { target: '4.50x' })}</div>
        </div>
      </div>

      {/* 3. Search Bar and Filter Controls */}
      <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('campaigns.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white text-gray-900 border border-gray-300 dark:bg-[#25283A] dark:text-white dark:border-[#3E4562] rounded-xl text-xs focus:outline-none focus:border-primary placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Filter Status Badge Count summary */}
          <div className="text-xs text-muted flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-primary" />
            <span>{t('campaigns.showingCount', { filtered: filteredCampaigns.length, total: campaigns.length })}</span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-t border-border pt-3">
          {/* Status Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-[10px] uppercase font-bold text-muted mr-1">{t('campaigns.statusLabel')}</span>
            {STATUS_FILTERS.map((st) => {
              const active = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-background text-slate-600 hover:bg-slate-200/70 border border-border'
                  }`}
                >
                  {getStatusLabel(st)}
                </button>
              );
            })}
          </div>

          {/* Channel Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-[10px] uppercase font-bold text-muted mr-1">{t('campaigns.channelLabel')}</span>
            {CHANNEL_FILTERS.map((ch) => {
              const active = selectedChannel === ch;
              return (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-brand-dark text-white shadow-xs'
                      : 'bg-background text-slate-600 hover:bg-slate-200/70 border border-border'
                  }`}
                >
                  {ch === 'All' ? t('campaigns.channelAll') : ch}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Campaign Database Table */}
      {loading ? (
        <div className="p-12 text-center bg-surface border border-border rounded-2xl text-xs text-muted">
          Loading campaign data...
        </div>
      ) : (
        <CampaignTable
          campaigns={filteredCampaigns}
          onView={(camp) => setViewModalCampaign(camp)}
          onEdit={(camp) => handleOpenEditModal(camp)}
          onDelete={(camp) => handleOpenDeleteModal(camp)}
          canEdit={canCreateEdit}
          canDelete={canDelete}
        />
      )}

      {/* 5. Modals */}
      <CampaignDetailModal
        isOpen={!!viewModalCampaign}
        campaign={viewModalCampaign}
        onClose={() => setViewModalCampaign(null)}
        onEdit={(camp) => handleOpenEditModal(camp)}
        canEdit={canCreateEdit}
      />

      <CampaignFormModal
        isOpen={formModalOpen}
        campaign={editingCampaign}
        onClose={() => {
          setFormModalOpen(false);
          setEditingCampaign(null);
        }}
        onSave={handleSaveCampaign}
      />

      <DeleteCampaignModal
        isOpen={!!deleteModalCampaign}
        campaign={deleteModalCampaign}
        onClose={() => setDeleteModalCampaign(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default CampaignsView;
