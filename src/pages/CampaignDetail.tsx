import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCoin } from '../context/CoinContext';
import {
  ArrowLeft, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  Medal, 
  Award, 
  ExternalLink,
  Calendar,
  Target,
  Coins,
  AlertCircle,
  CheckCircle,
  X,
  MessageSquare,
  Info,
  Sparkles,
  Heart,
  Share2
} from 'lucide-react';
import CampaignHeader from '../components/campaign/CampaignHeader';
import FundingBanner from '../components/campaign/FundingBanner';
import CampaignContent from '../components/campaign/CampaignContent';
import SupportTiers from '../components/campaign/SupportTiers';
import StickyFooter from '../components/campaign/StickyFooter';
import MediaModal from '../components/MediaModal';
import AllOrNothingModal from '../components/AllOrNothingModal';
import { ContentBlock } from '../components/campaign/RichTextRenderer'; // Import the type

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { coins, deductCoins, refreshCoins } = useCoin();
  const [campaign, setCampaign] = useState<any>(null);
  const [descriptionBlocks, setDescriptionBlocks] = useState<ContentBlock[]>([]);
  const [supporters, setSupporters] = useState<any[]>([]); // RESTORED
  const [comments, setComments] = useState<any[]>([]); // RESTORED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userSupport, setUserSupport] = useState<any>(null);
  const [isSupporting, setIsSupporting] = useState(false);
  const [supportAmount, setSupportAmount] = useState(1);
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showAllOrNothingModal, setShowAllOrNothingModal] = useState(false);
  const [showCoinSpendingVideo, setShowCoinSpendingVideo] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  const parseDescriptionStringToBlocks = useCallback((description: string): ContentBlock[] => {
    if (!description) return [];
    try {
      const parsed = JSON.parse(description);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      return [{ id: 'fallback-text', type: 'text', content: description }];
    }
    return [];
  }, []);

  const fetchCampaignData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (campaignError) throw campaignError;
      setCampaign(campaignData);

      if (campaignData && campaignData.description) {
        const blocks = parseDescriptionStringToBlocks(campaignData.description);
        setDescriptionBlocks(blocks);
      }
      
      // --- ALL DATA FETCHING LOGIC IS NOW RESTORED ---
      const { data: supportersData, error: supportersError } = await supabase
        .from('campaign_supporters')
        .select(`*, profiles:user_id (id, full_name, avatar_url, avatar_style, avatar_option)`)
        .eq('campaign_id', id)
        .order('coins_spent', { ascending: false });

      if (supportersError) throw supportersError;
      setSupporters(supportersData || []);

      if (currentUser) {
        const userSupportData = supportersData?.find(s => s.user_id === currentUser.id);
        setUserSupport(userSupportData || null);
      }

      const { data: commentsData, error: commentsError } = await supabase
        .from('campaign_comments')
        .select(`*, profiles:user_id (id, full_name, avatar_url, avatar_style, avatar_option)`)
        .eq('campaign_id', id)
        .order('calculated_score', { ascending: false });

      if (commentsError) throw commentsError;
      setComments(commentsData || []);

    } catch (err) {
      console.error('Error fetching campaign data:', err);
      setError('Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  }, [id, parseDescriptionStringToBlocks]);

  useEffect(() => {
    fetchCampaignData();
  }, [fetchCampaignData]);

  useEffect(() => {
    if (campaign) {
      const created = new Date(campaign.created_at);
      const deadline = new Date(created);
      deadline.setDate(deadline.getDate() + 100);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diffDays));
    }
  }, [campaign]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyFooter(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSupport = async () => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    if (isSupporting || coins < supportAmount) {
      return;
    }

    try {
      setIsSupporting(true);
      setError(null);

      // Deduct coins from user's account
      const success = await deductCoins(supportAmount);
      if (!success) {
        throw new Error('Failed to deduct coins from your account');
      }

      // Support the campaign
      const supported = await supportCampaign(parseInt(id!), supportAmount);
      if (!supported) {
        throw new Error('Failed to support campaign');
      }

      // Show coin spending celebration video
      setShowCoinSpendingVideo(true);

      // Refresh campaign data
      await fetchCampaignData();
      await refreshCoins();

    } catch (err: any) {
      console.error('Error supporting campaign:', err);
      setError(err.message);
    } finally {
      setIsSupporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading campaign...</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500 w-12 h-12" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The campaign you\'re looking for doesn\'t exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CampaignHeader 
        campaign={campaign} 
        setShowImageModal={setShowImageModal} 
        setShowVideoModal={setShowVideoModal}
        user={user}
        userSupport={userSupport}
        coins={coins}
        supportAmount={supportAmount}
        setSupportAmount={setSupportAmount}
        isSupporting={isSupporting}
        handleSupport={handleSupport}
      />
      
      <FundingBanner daysLeft={daysLeft} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CampaignContent 
              descriptionBlocks={descriptionBlocks} 
              campaign={campaign}
              comments={comments}
              fetchCampaignData={fetchCampaignData}
              id={id!}
              setShowAllOrNothingModal={setShowAllOrNothingModal}
            />
          </div>
          <div className="space-y-6">
            <div className="lg:sticky lg:top-24">
              <SupportTiers
                campaign={campaign}
                supporters={supporters}
                user={user}
                userSupport={userSupport}
                coins={coins}
                handleSupport={handleSupport}
                supportAmount={supportAmount}
                setSupportAmount={setSupportAmount}
                isSupporting={isSupporting}
              />
            </div>
          </div>
        </div>
      </div>

      <StickyFooter
        showStickyFooter={showStickyFooter && !userSupport}
        campaign={campaign}
        user={user}
        isSupporting={isSupporting}
        handleSupport={handleSupport}
      />

      {showAllOrNothingModal && <AllOrNothingModal isOpen={showAllOrNothingModal} onClose={() => setShowAllOrNothingModal(false)} />}
      {showImageModal && <MediaModal isOpen={showImageModal} type="image" src={campaign.image} title={campaign.title} onClose={() => setShowImageModal(false)} />}
      {showVideoModal && campaign.videoUrl && <MediaModal isOpen={showVideoModal} type="video" src={campaign.videoUrl} title={campaign.title} onClose={() => setShowVideoModal(false)} />}
      
      {/* Coin Spending Celebration Video */}
      {showCoinSpendingVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl max-w-md w-full mx-4">
            <video
              autoPlay
              muted
              className="w-full h-auto rounded-2xl animate-fade-in"
              onEnded={() => {
                setShowCoinSpendingVideo(false);
              }}
            >
              <source src="https://res.cloudinary.com/digjsdron/video/upload/v1749612635/Coin_Spending_g8wd9v.mp4" type="video/mp4" />
            </video>
            
            <button
              onClick={() => {
                setShowCoinSpendingVideo(false);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 text-xl font-bold"
            >
              ×
            </button>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-2 animate-fade-in">Support Successful! 🎉</h3>
                <p className="text-sm opacity-90 animate-fade-in">
                  {supportAmount} coin{supportAmount > 1 ? 's' : ''} spent • You've helped bring this project to life!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;