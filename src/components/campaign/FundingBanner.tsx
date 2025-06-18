import React from 'react';
import { Info } from 'lucide-react';

interface FundingBannerProps {
  daysLeft: number;
}

const FundingBanner: React.FC<FundingBannerProps> = ({ daysLeft }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-y border-blue-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
            <p className="text-blue-800 font-medium">
              All or nothing. This project will only be funded if it reaches its goal by the deadline.
              {daysLeft > 0 && ` ${daysLeft} days to go.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingBanner;