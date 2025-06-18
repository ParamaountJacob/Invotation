import { useState } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import CampaignList from './CampaignList';
import CampaignFilters from './CampaignFilters';
import CampaignTabs from './CampaignTabs';
import EditCampaignModal from './EditCampaignModal';
import KickstarterModal from './KickstarterModal';
import LaunchedProductModal from './LaunchedProductModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Campaign {
  id: number;
  title: string;
  short_description?: string;
  description: string;
  image: string;
  reservation_goal: number;
  current_reservations: number;
  estimated_retail_price: number;
  category: string;
  days_old: number;
  is_archived: boolean;
  status?: string;
  goal_reached_at?: string;
  kickstarter_url?: string;
  amazon_url?: string;
  website_url?: string;
  video_url?: string;
}

interface CampaignManagementProps {
  campaigns: Campaign[];
  onCampaignEdit: (campaign: Campaign) => void;
  onCampaignView: (campaignId: number) => void;
  onCampaignArchive: (campaignId: number) => void;
  onCampaignCreate?: () => void;
  onCampaignDelete?: (campaignId: number) => void;
  onCampaignStatusChange?: (campaignId: number, status: string) => void;
}

const CampaignManagement = ({ 
  campaigns, 
  onCampaignEdit, 
  onCampaignView, 
  onCampaignArchive,
  onCampaignCreate,
  onCampaignDelete,
  onCampaignStatusChange
}: CampaignManagementProps) => {
  const [activeTab, setActiveTab] = useState<'live' | 'goal_reached' | 'kickstarter' | 'launched' | 'archived'>('live');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [kickstarterModal, setKickstarterModal] = useState<Campaign | null>(null);
  const [launchedModal, setLaunchedModal] = useState<Campaign | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<Campaign | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Categorize campaigns
  const liveCampaigns = campaigns.filter(c => !c.is_archived && c.status !== 'kickstarter' && c.status !== 'goal_reached' && !c.amazon_url && !c.website_url);
  const goalReachedCampaigns = campaigns.filter(c => c.status === 'goal_reached');
  const kickstarterCampaigns = campaigns.filter(c => c.status === 'kickstarter' || c.kickstarter_url);
  const launchedCampaigns = campaigns.filter(c => (c.amazon_url || c.website_url) && !c.is_archived);
  const archivedCampaigns = campaigns.filter(c => c.is_archived);

  const getCurrentCampaigns = () => {
    switch (activeTab) {
      case 'live':
        return liveCampaigns;
      case 'goal_reached':
        return goalReachedCampaigns;
      case 'kickstarter':
        return kickstarterCampaigns;
      case 'launched':
        return launchedCampaigns;
      case 'archived':
        return archivedCampaigns;
      default:
        return liveCampaigns;
    }
  };

  const filteredCampaigns = getCurrentCampaigns().filter(campaign => {
    const matchesCategory = filterCategory === 'all' || campaign.category === filterCategory;
    return matchesCategory;
  });

  const getTabCount = () => ({
    live: liveCampaigns.length,
    goal_reached: goalReachedCampaigns.length,
    kickstarter: kickstarterCampaigns.length,
    launched: launchedCampaigns.length,
    archived: archivedCampaigns.length
  });

  const handleEditClick = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleKickstarterLaunch = (campaign: Campaign) => {
    setKickstarterModal(campaign);
  };

  const handleLaunchedProduct = (campaign: Campaign) => {
    setLaunchedModal(campaign);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setDeleteConfirmModal(campaign);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
        
        <button
          onClick={onCampaignCreate}
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <CampaignTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabCounts={getTabCount()} 
      />

      {/* Filters */}
      <CampaignFilters 
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

      {/* Campaign List */}
      {filteredCampaigns.length > 0 ? (
        <CampaignList 
          campaigns={filteredCampaigns}
          activeTab={activeTab}
          onCampaignView={onCampaignView}
          onCampaignEdit={handleEditClick}
          onCampaignDelete={handleDeleteClick}
          onCampaignStatusChange={onCampaignStatusChange}
          onKickstarterLaunch={handleKickstarterLaunch}
          onLaunchedProduct={handleLaunchedProduct}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {activeTab} campaigns found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new campaign or check other tabs.
          </p>
        </div>
      )}

      {/* Modals */}
      <EditCampaignModal 
        campaign={editingCampaign}
        onClose={() => setEditingCampaign(null)}
        onSave={onCampaignEdit}
      />

      <KickstarterModal 
        campaign={kickstarterModal}
        onClose={() => setKickstarterModal(null)}
        onSave={(campaignId, kickstarterUrl) => {
          if (onCampaignStatusChange) {
            onCampaignStatusChange(campaignId, 'kickstarter');
          }
          setKickstarterModal(null);
        }}
      />

      <LaunchedProductModal 
        campaign={launchedModal}
        onClose={() => setLaunchedModal(null)}
        onSave={onCampaignEdit}
      />

      <DeleteConfirmModal 
        campaign={deleteConfirmModal}
        onClose={() => setDeleteConfirmModal(null)}
        onConfirm={(campaignId) => {
          if (onCampaignDelete) {
            onCampaignDelete(campaignId);
          }
          setDeleteConfirmModal(null);
        }}
      />
    </div>
  );
};

export default CampaignManagement;