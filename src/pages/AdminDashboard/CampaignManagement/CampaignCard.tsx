import { Edit, Archive, Eye, TrendingUp, Users, DollarSign, Rocket, Play, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

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

interface CampaignCardProps {
  campaign: Campaign;
  activeTab: 'live' | 'goal_reached' | 'kickstarter' | 'launched' | 'archived';
  progressPercentage: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (campaignId: number, status: string) => void;
  onKickstarterLaunch: () => void;
  onLaunchedProduct: () => void;
}

const CampaignCard = ({ 
  campaign, 
  activeTab, 
  progressPercentage, 
  onView, 
  onEdit, 
  onDelete,
  onStatusChange,
  onKickstarterLaunch,
  onLaunchedProduct
}: CampaignCardProps) => {
  // Extract plain text from rich description for display
  const getPlainTextDescription = (description: string): string => {
    try {
      const parsed = JSON.parse(description);
      if (parsed && typeof parsed === 'object' && parsed.text !== undefined) {
        return parsed.text;
      }
    } catch (e) {
      // Not JSON
    }
    return description;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            activeTab === 'live' ? 'bg-green-500 text-white' :
            activeTab === 'goal_reached' ? 'bg-blue-500 text-white' :
            activeTab === 'kickstarter' ? 'bg-orange-500 text-white' :
            activeTab === 'launched' ? 'bg-purple-500 text-white' :
            'bg-gray-800 text-white'
          }`}>
            {activeTab === 'live' ? 'LIVE' :
             activeTab === 'goal_reached' ? 'GOAL REACHED' :
             activeTab === 'kickstarter' ? 'KICKSTARTER' :
             activeTab === 'launched' ? 'LAUNCHED' :
             'ARCHIVED'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {campaign.short_description || getPlainTextDescription(campaign.description)}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-primary mr-1" />
              <span className="text-lg font-bold text-primary">{campaign.current_reservations}</span>
            </div>
            <div className="text-xs text-gray-500">Supporters</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-primary mr-1" />
              <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
            </div>
            <div className="text-xs text-gray-500">Progress</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-primary mr-1" />
              <span className="text-lg font-bold text-primary">${campaign.estimated_retail_price}</span>
            </div>
            <div className="text-xs text-gray-500">Price</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{campaign.current_reservations} {campaign.current_reservations === 1 ? 'coin' : 'coins'}</span>
            <span>Goal: {campaign.reservation_goal} {campaign.reservation_goal === 1 ? 'coin' : 'coins'}</span>
          </div>
        </div>
        
        {/* Status Change Actions */}
        {activeTab === 'live' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Move Campaign To:</h4>
            <div className="flex gap-2 flex-wrap">
              {campaign.current_reservations >= campaign.reservation_goal && (
                <button
                  onClick={() => onStatusChange(campaign.id, 'goal_reached')}
                  className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-md border border-green-200 transition-colors text-sm"
                >
                  <CheckCircle size={14} />
                  <span>Mark Goal Reached</span>
                </button>
              )}
              <button
                onClick={onKickstarterLaunch}
                className="flex items-center space-x-1 px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-200 transition-colors text-sm"
              >
                <Rocket size={14} />
                <span>Launch on Kickstarter</span>
              </button>
              <button
                onClick={() => onStatusChange(campaign.id, 'archived')}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors text-sm"
              >
                <Archive size={14} />
                <span>Archive</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'goal_reached' && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-bold text-green-900 mb-2">Goal Reached Actions:</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={onKickstarterLaunch}
                className="flex items-center space-x-1 px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-md border border-orange-200 transition-colors text-sm"
              >
                <Rocket size={14} />
                <span>Launch on Kickstarter</span>
              </button>
              <button
                onClick={onLaunchedProduct}
                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 transition-colors text-sm"
              >
                <ExternalLink size={14} />
                <span>Add Product Links</span>
              </button>
              <button
                onClick={() => onStatusChange(campaign.id, 'live')}
                className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-md border border-green-200 transition-colors text-sm"
              >
                <Play size={14} />
                <span>Move Back to Live</span>
              </button>
              <button
                onClick={() => onStatusChange(campaign.id, 'archived')}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors text-sm"
              >
                <Archive size={14} />
                <span>Archive</span>
              </button>
            </div>
            {campaign.goal_reached_at && (
              <p className="text-xs text-green-700 mt-2">
                Goal reached on: {new Date(campaign.goal_reached_at).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {activeTab === 'kickstarter' && (
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="text-sm font-bold text-orange-900 mb-2">Kickstarter Actions:</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={onLaunchedProduct}
                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 transition-colors text-sm"
              >
                <ExternalLink size={14} />
                <span>Add Product Links</span>
              </button>
              <button
                onClick={() => onStatusChange(campaign.id, 'live')}
                className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-md border border-green-200 transition-colors text-sm"
              >
                <Play size={14} />
                <span>Move Back to Live</span>
              </button>
              <button
                onClick={() => onStatusChange(campaign.id, 'archived')}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors text-sm"
              >
                <Archive size={14} />
                <span>Archive</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'launched' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-bold text-blue-900 mb-2">Launched Product Actions:</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={onLaunchedProduct}
                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 transition-colors text-sm"
              >
                <Edit size={14} />
                <span>Edit Product Links</span>
              </button>
              <button
                onClick={() => onStatusChange(campaign.id, 'archived')}
                className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors text-sm"
              >
                <Archive size={14} />
                <span>Archive</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'archived' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Restore Campaign:</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onStatusChange(campaign.id, 'live')}
                className="flex items-center space-x-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-md border border-green-200 transition-colors text-sm"
              >
                <Play size={14} />
                <span>Restore to Live</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Standard Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onView}
            className="flex items-center space-x-1 px-3 py-2 text-primary hover:bg-primary/5 rounded-md border border-primary transition-colors"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            onClick={onEdit}
            className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 transition-colors"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition-colors"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;