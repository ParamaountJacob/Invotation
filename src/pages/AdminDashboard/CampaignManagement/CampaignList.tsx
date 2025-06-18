import { Edit, Archive, Eye, TrendingUp, Users, DollarSign, Rocket, Play, CheckCircle, Trash2, ExternalLink } from 'lucide-react';
import CampaignCard from './CampaignCard';

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

interface CampaignListProps {
  campaigns: Campaign[];
  activeTab: 'live' | 'goal_reached' | 'kickstarter' | 'launched' | 'archived';
  onCampaignView: (campaignId: number) => void;
  onCampaignEdit: (campaign: Campaign) => void;
  onCampaignDelete: (campaign: Campaign) => void;
  onCampaignStatusChange?: (campaignId: number, status: string) => void;
  onKickstarterLaunch: (campaign: Campaign) => void;
  onLaunchedProduct: (campaign: Campaign) => void;
}

const CampaignList = ({ 
  campaigns, 
  activeTab, 
  onCampaignView, 
  onCampaignEdit, 
  onCampaignDelete,
  onCampaignStatusChange,
  onKickstarterLaunch,
  onLaunchedProduct
}: CampaignListProps) => {
  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const handleStatusChange = (campaignId: number, newStatus: string) => {
    if (onCampaignStatusChange) {
      onCampaignStatusChange(campaignId, newStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard 
          key={campaign.id}
          campaign={campaign}
          activeTab={activeTab}
          progressPercentage={getProgressPercentage(campaign.current_reservations, campaign.reservation_goal)}
          onView={() => onCampaignView(campaign.id)}
          onEdit={() => onCampaignEdit(campaign)}
          onDelete={() => onCampaignDelete(campaign)}
          onStatusChange={handleStatusChange}
          onKickstarterLaunch={() => onKickstarterLaunch(campaign)}
          onLaunchedProduct={() => onLaunchedProduct(campaign)}
        />
      ))}
    </div>
  );
};

export default CampaignList;