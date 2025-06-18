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

// --- HELPER FUNCTIONS ---

const calculateDaysLeft = (campaign: any) => {
  if (!campaign || !campaign.created_at) return 0;
  const created = new Date(campaign.created_at);
  const deadline = new Date(created);
  deadline.setDate(deadline.getDate() + 100); // 100-day campaign
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const getProgressPercentage = (campaign: any) => {
  if (!campaign || !campaign.reservationGoal || !campaign.minimumBid) return 0;
  const goal = campaign.reservationGoal * campaign.minimumBid;
  if (goal === 0) return 0;
  return Math.min((campaign.currentReservations / goal) * 100, 100);
};

const getEmbedUrl = (videoUrl: string): { type: 'youtube' | 'vimeo' | 'other'; url: string } | null => {
  if (!videoUrl) return null;

  let youtubeMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (youtubeMatch) {
    return { type: 'youtube', url: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  let vimeoMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }
  
  // Fallback for other direct video links
  return { type: 'other', url: videoUrl };
};

// --- COMPONENT ---

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
  const embedInfo = getEmbedUrl(campaign.videoUrl);

  const renderMedia = () => {
    if (embedInfo) {
      if (embedInfo.type === 'youtube' || embedInfo.type === 'vimeo') {
        return (
          <iframe
            src={`${embedInfo.url}?autoplay=1&mute=1&loop=1&controls=0`}
            title={campaign.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          ></iframe>
        );
      }
      // 'other' type uses CustomVideoPlayer
      return (
        <CustomVideoPlayer
          src={embedInfo.url}
          poster={campaign.image}
          onFullscreen={() => setShowVideoModal(true)}
        />
      );
    }

    // Fallback to image if no videoUrl
    return (
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
    );
  };

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
          {/* Media Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative group">
              {renderMedia()}
            </div>
            {/* Thumbnail Gallery (assuming you want to keep this as is) */}
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-video bg-gray-200 rounded overflow-hidden cursor-pointer">
                  <img
                    src={campaign.image} // Using main image as placeholder
                    alt={`${campaign.title} - Image ${i + 1}`}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                    onClick={() => setShowImageModal(true)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Info Section */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {campaign.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {campaign.short_description}
              </p>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-3xl font-bold text-green-600">{campaign.currentReservations || 0}</span>
                        <img src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp" alt="Coin" className="w-7 h-7" loading="lazy" />
                      </div>
                      <div className="text-sm text-gray-500 mt-1">of {campaign.reservationGoal * campaign.minimumBid || 0} goal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{campaign.supportersCount || 0}</div>
                      <div className="text-sm text-gray-500 mt-1">supporters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{daysLeft}</div>
                      <div className="text-sm text-gray-500 mt-1">days left</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>

                  {userSupport && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        <span className="text-green-800 font-medium">You've supported this project with {userSupport.coins_spent} coins</span>
                      </div>
                    </div>
                  )}

                  {user && !userSupport && (
                    <div className="flex space-x-2 items-center mb-4">
                      <input type="number" min="1" max={coins} value={supportAmount} onChange={(e) => setSupportAmount(parseInt(e.target.value) || 1)} className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
                      <button onClick={handleSupport} disabled={isSupporting || coins < supportAmount} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-grow">
                        {isSupporting ? 'Processing...' : 'Support this project'}
                      </button>
                    </div>
                  )}

                  {!user && (
                    <button className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4">Sign In to Support</button>
                  )}

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