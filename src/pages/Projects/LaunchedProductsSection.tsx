import React from 'react';
import { CheckCircle } from 'lucide-react';

interface LaunchedProductsSectionProps {
  filteredData: any[];
  handleItemClick: (id: number) => void;
}

const LaunchedProductsSection: React.FC<LaunchedProductsSectionProps> = ({ filteredData, handleItemClick }) => {
  // Get display description with proper truncation
  const getDisplayDescription = (campaign: any) => {
    // Use short_description if available
    if (campaign.short_description) {
      return campaign.short_description;
    }
    
    // Otherwise try to extract from description
    try {
      if (typeof campaign.description === 'string' && campaign.description.startsWith('{')) {
        const parsed = JSON.parse(campaign.description);
        if (parsed && typeof parsed === 'object' && parsed.text) {
          return parsed.text.substring(0, 100) + (parsed.text.length > 100 ? '...' : '');
        }
      }
    } catch (e) {
      // Parsing failed, use description as is
    }
    
    // Fallback to plain description with truncation
    return typeof campaign.description === 'string' 
      ? campaign.description.substring(0, 100) + (campaign.description.length > 100 ? '...' : '')
      : '';
  };
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-blue-900 mb-2">🚀 Successfully Launched Products</h3>
        <p className="text-blue-800">
          These ideas received enough votes, were developed, and successfully launched! You can now purchase them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredData.map((project) => (
          <div
            key={project.id}
            onClick={() => handleItemClick(project.id)}
            className="cursor-pointer nav-transition hover:scale-105 active:scale-95 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
          >
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>LAUNCHED</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900">{project.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{getDisplayDescription(project)}</p>
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">${project.estimatedRetailPrice}</div>
                  <div className="text-xs text-gray-500">Current Price</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaunchedProductsSection;