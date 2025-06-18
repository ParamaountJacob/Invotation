import React from 'react';
import CampaignCard from '../../components/CampaignCard';

interface ArchivedIdeasSectionProps {
  filteredData: any[];
  handleItemClick: (id: number) => void;
}

const ArchivedIdeasSection: React.FC<ArchivedIdeasSectionProps> = ({ filteredData, handleItemClick }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">🗄️ Archived Ideas</h3>
        <p className="text-gray-700">
          These projects didn't reach their coin goals within 100 days. While they're no longer actively seeking support, 
          you can still view their details and see what innovative ideas were proposed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredData.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => handleItemClick(campaign.id)}
            className="cursor-pointer opacity-75 hover:opacity-100 nav-transition"
          >
            <div className="relative">
              <CampaignCard campaign={campaign} />
              <div className="absolute top-4 left-4 bg-gray-800/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                ARCHIVED
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗄️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Archived Projects Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Projects that don't reach their coin goals within 100 days will appear here.
          </p>
        </div>
      )}
      
      {/* Info Section */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">About Archived Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Why Projects Get Archived</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Projects that don't reach their coin goal within 100 days</li>
              <li>• Insufficient market interest or support</li>
              <li>• Technical or manufacturing challenges discovered</li>
              <li>• Creator decided not to proceed</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-3">What Happens Next</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Projects remain viewable for reference</li>
              <li>• No new support can be added</li>
              <li>• Ideas may be revisited in the future</li>
              <li>• Lessons learned help improve new projects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedIdeasSection;