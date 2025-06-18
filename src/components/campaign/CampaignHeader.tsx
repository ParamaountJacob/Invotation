import React from 'react';
import { ArrowLeft, Maximize, Play, Info, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomVideoPlayer from '../CustomVideoPlayer';

interface CampaignHeaderProps {
  campaign: any;
  setShowImageModal: (show: boolean) => void;
  setShowVideoModal: (show: boolean) => void;
  user: any;
  userSupport: any;
  coins: number;
  supportAmount: number;
  setSupportAmount: (amount: number) => void;
  isSupporting: boolean;
  handleSupport: () => void;
}

// Function to calculate days left
const calculateDaysLeft = (campaign: any) => {
  if (!campaign) return 0;
  
  // Calculate days left based on campaign creation date + 100 days
  const created = new Date(campaign.created_at);
  const deadline = new Date(created);
  deadline.setDate(deadline.getDate() + 100); // 100-day campaign
  
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

// Function to calculate progress percentage
const getProgressPercentage = (campaign: any) => {
  if (!campaign) return 0;
  return Math.min((campaign.currentReservations / (campaign.reservationGoal * campaign.minimumBid)) * 100, 100);
};

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ 
  campaign, 
  setShowImageModal, 
  setShowVideoModal,
  user,
  userSupport,
  coins,
  supportAmount,
  setSupportAmount,
  isSupporting,
  handleSupport
}) => {
  const navigate = useNavigate();

  const daysLeft = calculateDaysLeft(campaign);
  const progressPercentage = getProgressPercentage(campaign);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Projects
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Media Section - 7 columns on large screens */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Media */}
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative group">
              {campaign.videoUrl ? (
                <div className="w-full h-full">
                  {campaign.videoUrl.includes('youtube.com') || campaign.videoUrl.includes('youtu.be') || campaign.videoUrl.includes('vimeo.com') ? (
                    <div className="aspect-video cursor-pointer" onClick={() => setShowVideoModal(true)}>
                      {campaign.videoUrl.includes('youtube.com') || campaign.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={`${campaign.videoUrl.includes('youtube.com') 
                            ? campaign.videoUrl.replace('watch?v=', 'embed/') 
                            : campaign.videoUrl.replace('youtu.be/', 'youtube.com/embed/')}?mute=1`}
                          title={campaign.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          frameBorder="0"
                        ></iframe>
                      ) : (
                        <iframe
                          src={`${campaign.videoUrl.replace('vimeo.com', 'player.vimeo.com/video')}?muted=1`}
                          title={campaign.title}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          frameBorder="0"
                        ></iframe>
                      )}
                    </div>
                  ) : (
                    <CustomVideoPlayer 
                      src={campaign.videoUrl} 
                      poster={campaign.image}
                      onFullscreen={() => setShowVideoModal(true)}
                    />
                  )}
                </div>
              ) : (
                <div 
                  className="w-full h-full cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <Maximize className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-video bg-gray-200 rounded overflow-hidden cursor-pointer">
                <img
                  src={campaign.image}
                  alt={`${campaign.title} - Image 1`}
                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  onClick={() => setShowImageModal(true)}
                />
              </div>
              {/* Placeholder thumbnails */}
              {[2, 3, 4].map((i) => (
                <div key={i} className="aspect-video bg-gray-200 rounded overflow-hidden cursor-pointer">
                  <img
                    src={campaign.image}
                    alt={`${campaign.title} - Image ${i}`}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    onClick={() => setShowImageModal(true)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Info Section - 5 columns on large screens */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {campaign.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {campaign.short_description}
              </p>

              {/* Campaign Stats - Kickstarter Style */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-3xl font-bold text-green-600">{campaign.currentReservations}</span>
                        <img
                          src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                          alt="Coin"
                          className="w-7 h-7"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-sm text-gray-500 mt-1">of {campaign.reservationGoal * campaign.minimumBid} goal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {campaign.topBidders?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">supporters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {daysLeft}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">days left</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Support Input and Button */}
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

                  {user && !userSupport && (
                    <div className="flex space-x-2 items-center mb-4">
                      <input
                        type="number"
                        min="1"
                        max={coins}
                        value={supportAmount}
                        onChange={(e) => setSupportAmount(parseInt(e.target.value) || 1)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <button
                        onClick={handleSupport}
                        disabled={isSupporting || coins < supportAmount}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-grow"
                      >
                        {isSupporting ? 'Processing...' : 'Back this project'}
                      </button>
                    </div>
                  )}
                  
                  {!user && (
                    <button className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4">
                      Sign In to Back
                    </button>
                  )}

                  {/* Remind and Share Buttons */}
                  <div className="flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>Remind me</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignHeader;