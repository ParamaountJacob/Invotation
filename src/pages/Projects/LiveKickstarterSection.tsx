import React from 'react';
import { ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { Campaign } from '../../lib/campaigns';

interface LiveKickstarterSectionProps {
  filteredData: Campaign[];
  handleItemClick: (id: number) => void;
}

const LiveKickstarterSection: React.FC<LiveKickstarterSectionProps> = ({ filteredData, handleItemClick }) => {
  if (filteredData.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-xl shadow-sm p-12">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Kickstarter Projects Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Projects that successfully complete our voting process move to Kickstarter. Check back soon to see funded campaigns!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Live on Kickstarter</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          These projects have graduated from our platform and are now live on Kickstarter. 
          Support them to help bring innovative ideas to life!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredData.map((campaign) => (
          <div 
            key={campaign.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => handleItemClick(campaign.id)}
          >
            <div className="relative">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Live on Kickstarter
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {campaign.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {campaign.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Estimated Retail Price</span>
                  <span className="font-semibold text-gray-900">
                    ${campaign.estimatedRetailPrice.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Original Goal</span>
                  <span className="font-semibold text-gray-900">
                    {campaign.reservationGoal.toLocaleString()} reservations
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Launched {campaign.daysOld} days ago</span>
                </div>
              </div>

              <div className="space-y-3">
                {campaign.kickstarterUrl && (
                  <a
                    href={campaign.kickstarterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Kickstarter
                  </a>
                )}
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    This project graduated from our voting platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Stories</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          These projects started as ideas on our platform, gained community support through voting, 
          and are now successfully funded on Kickstarter. Your vote can help the next big idea!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="bg-white px-4 py-2 rounded-full">
            <span className="font-semibold text-green-600">{filteredData.length}</span>
            <span className="text-gray-600 ml-1">Live Campaigns</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full">
            <span className="font-semibold text-blue-600">
              ${filteredData.reduce((sum, c) => sum + c.estimatedRetailPrice, 0).toLocaleString()}
            </span>
            <span className="text-gray-600 ml-1">Total Value</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveKickstarterSection;