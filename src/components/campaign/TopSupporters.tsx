import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface TopSupportersProps {
  supporters: any[];
}

const TopSupporters: React.FC<TopSupportersProps> = ({ supporters }) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
          {position}
        </div>;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Top Supporters</h3>
      
      {supporters.length > 0 ? (
        <div className="space-y-4">
          {supporters.slice(0, 9).map((supporter) => (
            <div 
              key={supporter.id} 
              className={`flex items-center justify-between p-4 rounded-lg ${getPositionColor(supporter.position || 999)}`}
            >
              <div className="flex items-center space-x-3">
                {getPositionIcon(supporter.position || 999)}
                <div>
                  <div className="font-bold">
                    #{supporter.position || '?'} {supporter.profiles?.full_name || 'Anonymous'}
                  </div>
                  <div className="text-sm opacity-80">
                    {supporter.coins_spent} coins spent
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{supporter.discount_percentage || 20}% off</div>
                <div className="text-sm opacity-80">
                  Discount
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No supporters yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to support this campaign!</p>
        </div>
      )}
    </div>
  );
};

export default TopSupporters;