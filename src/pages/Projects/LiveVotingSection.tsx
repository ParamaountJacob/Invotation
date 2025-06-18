import React from 'react';
import CampaignCard from '../../components/CampaignCard';
import { CheckCircle, Sparkles } from 'lucide-react';

interface LiveVotingSectionProps {
  filteredData: any[];
  handleItemClick: (id: number) => void;
}

const LiveVotingSection: React.FC<LiveVotingSectionProps> = ({ filteredData, handleItemClick }) => {
  // Separate goal reached campaigns
  const goalReachedCampaigns = filteredData.filter(campaign => campaign.status === 'goal_reached');
  const activeCampaigns = filteredData.filter(campaign => campaign.status !== 'goal_reached');
  
  // Check if any goal reached campaigns are less than 24 hours old
  const hasRecentlyCompletedCampaigns = goalReachedCampaigns.some(campaign => {
    if (!campaign.goal_reached_at) return false;
    const goalReachedDate = new Date(campaign.goal_reached_at);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return goalReachedDate > oneDayAgo;
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-green-900 mb-2">🗳️ Vote With Coins & Change Lives</h3>
        <p className="text-green-800">
          Each project below was submitted by a real person with a dream. Buy coins to vote on your favorites.
          Projects need to reach their coin goal to succeed. You'll secure exclusive 
          discounts while helping change the inventor's life forever!
        </p>
      </div>

      {/* Goal Reached Campaigns Section */}
      {hasRecentlyCompletedCampaigns && (
        <div className="mb-12">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-yellow-800 mb-1">🎉 Recently Completed Campaigns</h3>
                <p className="text-yellow-700">
                  These projects just reached their goals! You can still vote to secure your discount.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goalReachedCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => handleItemClick(campaign.id)}
                className="cursor-pointer nav-transition hover:scale-105 active:scale-95 relative"
              >
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center space-x-1 animate-pulse">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Goal Reached!</span>
                  </div>
                </div>
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Active Campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => handleItemClick(campaign.id)}
            className="cursor-pointer nav-transition hover:scale-105 active:scale-95"
          >
            <CampaignCard campaign={campaign} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveVotingSection;