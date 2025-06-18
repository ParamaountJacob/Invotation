import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

interface CampaignStatsProps {
  campaign: any;
  supporters: any[];
  daysLeft: number;
  progressPercentage: number;
  user: any;
  userSupport: any;
  coins: number;
  supportAmount: number;
  setSupportAmount: (amount: number) => void;
  isSupporting: boolean;
  handleSupport: () => void;
  setShowAllOrNothingModal: (show: boolean) => void;
}

const CampaignStats: React.FC<CampaignStatsProps> = ({
  campaign,
  supporters,
  daysLeft,
  progressPercentage,
  user,
  userSupport,
  coins,
  supportAmount,
  setSupportAmount,
  isSupporting,
  handleSupport,
  setShowAllOrNothingModal
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Campaign Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-2xl font-bold text-green-600">{campaign.currentReservations}</span>
              <img
                src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                alt="Coin"
                className="w-6 h-6"
                loading="lazy"
              />
            </div>
            <div className="text-sm text-gray-500">of {campaign.reservationGoal * campaign.minimumBid} coins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {supporters.length}
            </div>
            <div className="text-sm text-gray-500">supporters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {daysLeft}
            </div>
            <div className="text-sm text-gray-500">days left</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-blue-600" />
            <button
              onClick={() => setShowAllOrNothingModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              All or nothing
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {progressPercentage.toFixed(1)}% funded
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="p-6">
        {user ? (
          <div className="space-y-4">
            {userSupport && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-green-800 font-medium">
                    You've backed this project with {userSupport.coins_spent} coins
                  </span>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Support Amount
                </label>
                <span className="text-sm text-gray-500">
                  You have {coins} coins
                </span>
              </div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max={coins}
                  value={supportAmount}
                  onChange={(e) => setSupportAmount(parseInt(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSupport}
                  disabled={isSupporting || coins < supportAmount}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSupporting ? 'Supporting...' : 'Support this project'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">Sign in to support this campaign</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignStats;