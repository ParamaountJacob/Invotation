import React from 'react';
import { Trophy, Medal, Award, Sparkles, Play } from 'lucide-react';
import { useState, useRef } from 'react';

type CampaignCardProps = {
  campaign: {
    id: number;
    title: string;
    short_description?: string;
    description: string;
    image: string;
    reservationGoal: number;
    currentReservations: number;
    estimatedRetailPrice: number;
    daysOld: number;
    category: 'tech' | 'home' | 'lifestyle';
    minimumBid: number;
    status?: string;
    videoUrl?: string;
    goal_reached_at?: string;
    topBidders: Array<{
      position: number;
      coins: number;
      reward: string;
    }>;
  };
};

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="w-4 h-4 text-white" />;
    case 2:
      return <Medal className="w-4 h-4 text-white" />;
    case 3:
      return <Award className="w-4 h-4 text-white" />;
    default:
      return null;
  }
};

const getPositionColor = (position: number) => {
  switch (position) {
    case 1:
      return 'bg-primary text-white';
    case 2:
      return 'bg-primary/80 text-white';
    case 3:
      return 'bg-primary/60 text-white';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const progressPercentage = Math.min(
    Math.round((campaign.currentReservations / (campaign.reservationGoal * campaign.minimumBid)) * 100),
    100
  );

  // Only show top 3 supporters
  const topThreeSupporers = campaign.topBidders.slice(0, 3);
  
  // Get display description with proper truncation
  const getDisplayDescription = () => {
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

  // Handle mouse enter - start playing video after a small delay
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a small delay before playing to avoid flickering on quick mouse movements
    timeoutRef.current = setTimeout(() => {
      if (videoRef.current && campaign.videoUrl) {
        videoRef.current.play().catch(err => {
          // Autoplay might be blocked by browser settings
          console.log('Video autoplay failed:', err);
        });
      }
    }, 150);
  };

  // Handle mouse leave - pause video
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Pause the video
    if (videoRef.current) {
      videoRef.current.pause();
      // Reset to beginning for next hover
      videoRef.current.currentTime = 0;
    }
  };

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="campaign-card bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 h-full flex flex-col group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        {campaign.videoUrl && isHovering ? (
          <div className="w-full aspect-video relative">
            {campaign.videoUrl.includes('youtube.com') || campaign.videoUrl.includes('youtu.be') ? (
              <iframe
                src={`${campaign.videoUrl.includes('youtube.com') 
                  ? campaign.videoUrl.replace('watch?v=', 'embed/') 
                  : campaign.videoUrl.replace('youtu.be/', 'youtube.com/embed/')}?autoplay=1&mute=1`}
                title={campaign.title}
                className="w-full h-full object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0"
              ></iframe>
            ) : campaign.videoUrl.includes('vimeo.com') ? (
              <iframe
                src={`${campaign.videoUrl.replace('vimeo.com', 'player.vimeo.com/video')}?autoplay=1&muted=1`}
                title={campaign.title}
                className="w-full h-full object-cover"
                allow="autoplay; fullscreen; picture-in-picture"
                frameBorder="0"
              ></iframe>
            ) : (
              <video
                ref={videoRef}
                src={campaign.videoUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
              />
            )}
          </div>
        ) : (
          <div className="relative w-full aspect-video">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            {campaign.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-white/90 text-gray-800 backdrop-blur-sm">
            {campaign.category}
          </span>
        </div>
        
        <div className="absolute top-4 left-4">
          <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
            🔥 LIVE
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors">{campaign.title}</h3>
        <p className="text-gray-600 mb-6 flex-1 leading-relaxed line-clamp-3">
          {getDisplayDescription()}
        </p>
        
        {/* Top 3 Supporters Only */}
        <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-primary" />
            Top 3 Supporters
          </h4>
          <div className="space-y-3">
            {topThreeSupporers.map((supporter) => (
              <div key={supporter.position} className={`flex items-center justify-between p-3 rounded-lg ${getPositionColor(supporter.position)}`}>
                <div className="flex items-center space-x-3">
                  {getPositionIcon(supporter.position)}
                  <span className="text-sm font-bold">#{supporter.position}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{supporter.coins}</span>
                  <img
                    src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                    alt="Coin"
                    className="w-4 h-4"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Support Info */}
        <div className="mb-6 bg-primary/5 rounded-xl p-4 border border-primary/20">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Vote with coins:</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">{campaign.minimumBid}</span>
              <img
                src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                alt="Coin"
                className="w-5 h-5"
                loading="lazy"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Everyone gets 20% off • More coins = bigger discount (up to 40% off!)
          </p>
        </div>
        
        <div className="space-y-4 mt-auto">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">
                {campaign.currentReservations} {campaign.currentReservations === 1 ? 'coin' : 'coins'}
                {campaign.status === 'goal_reached' && (
                  <span className="ml-1 text-green-600 font-bold">✓</span>
                )}
              </span>
              <span className="text-gray-500">Goal: {campaign.reservationGoal * campaign.minimumBid} coins</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  campaign.status === 'goal_reached' ? 'bg-green-500' : 'bg-primary'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="font-medium text-gray-700">{progressPercentage}%</span>
              <span className="text-gray-500">
                {campaign.status === 'goal_reached' ? 'Goal reached!' : `${campaign.daysOld} days active`}
              </span>
              <span className="text-gray-500">{(campaign.reservationGoal * campaign.minimumBid) - campaign.currentReservations} coins needed</span>
            </div>
          </div>
          
          <button className="btn-primary w-full flex justify-center items-center space-x-2 py-3">
            <span>
              {campaign.status === 'goal_reached' ? 'View Campaign' : 'Vote With Coins'}
            </span>
          </button>
          
          {campaign.status === 'goal_reached' && campaign.goal_reached_at && (
            <div className="text-center">
              <p className="text-xs text-green-600 font-medium">
                Goal reached on {new Date(campaign.goal_reached_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;