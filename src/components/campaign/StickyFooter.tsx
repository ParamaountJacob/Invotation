import React from 'react';

interface StickyFooterProps {
  showStickyFooter: boolean;
  campaign: any;
  user: any;
  isSupporting: boolean;
  handleSupport: () => void;
}

const StickyFooter: React.FC<StickyFooterProps> = ({
  showStickyFooter,
  campaign,
  user,
  isSupporting,
  handleSupport
}) => {
  if (!showStickyFooter) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {campaign.currentReservations} / {campaign.reservationGoal * campaign.minimumBid}
          </div>
          <div className="text-xs text-gray-500">
            coins collected
          </div>
        </div>
        <button
          onClick={handleSupport}
          disabled={!user || isSupporting}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {!user ? 'Sign in' : isSupporting ? 'Supporting...' : '1 coin to support'}
        </button>
      </div>
    </div>
  );
};

export default StickyFooter;