import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useErrorHandler } from '../hooks/useErrorHandler';
import ProjectTabs from './Projects/ProjectTabs';
import ProjectStats from './Projects/ProjectStats';
import LiveVotingSection from './Projects/LiveVotingSection';
import LiveKickstarterSection from './Projects/LiveKickstarterSection';
import LaunchedProductsSection from './Projects/LaunchedProductsSection';
import ArchivedIdeasSection from './Projects/ArchivedIdeasSection';
import ProjectCallToAction from './Projects/ProjectCallToAction';
import HowItWorksExample from './Projects/HowItWorksExample';
import { convertCampaignToFrontend, Campaign, DatabaseCampaign } from '../lib/campaigns';

interface CampaignData {
  id: number;
  title: string;
  description: string;
  image: string;
  reservation_goal: number;
  current_reservations: number;
  estimated_retail_price: number;
  category: string;
  days_old: number;
  is_archived: boolean;
  status?: string;
  kickstarter_url?: string;
  amazon_url?: string;
  website_url?: string;
  topBidders?: any[];
  isArchived?: boolean;
  amazonUrl?: string;
  websiteUrl?: string;
  kickstarterUrl?: string;
}

const Projects = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'kickstarter' | 'launched' | 'archived'>('live');
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data: dbCampaigns, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database campaigns to frontend format
      const convertedCampaigns = await Promise.all(
        (dbCampaigns || []).map(async (dbCampaign: DatabaseCampaign) => {
          const converted = convertCampaignToFrontend(dbCampaign, []);
          return {
            ...converted,
            topBidders: converted.topBidders || [],
            isArchived: converted.isArchived || false,
            amazonUrl: converted.amazonUrl,
            websiteUrl: converted.websiteUrl,
            kickstarterUrl: converted.kickstarterUrl
          };
        })
      );

      setCampaigns(convertedCampaigns);
    } catch (err) {
      handleError(err, 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // Memoized campaign categorization for performance
  const categorizedCampaigns = useMemo(() => {
    return {
      live: campaigns.filter(c => !c.isArchived && c.status !== 'kickstarter' && c.status !== 'archived' && !c.amazonUrl && !c.websiteUrl),
      kickstarter: campaigns.filter(c => c.status === 'kickstarter' || c.kickstarterUrl),
      launched: campaigns.filter(c => (c.amazonUrl || c.websiteUrl) && !c.isArchived),
      archived: campaigns.filter(c => c.isArchived)
    };
  }, [campaigns]);

  const { live: liveCampaigns, kickstarter: kickstarterCampaigns, launched: launchedCampaigns, archived: archivedCampaigns } = categorizedCampaigns;

  const handleItemClick = (id: number) => {
    navigate(`/campaign/${id}`);
  };

  // Memoized stats calculation for performance
  const stats = useMemo(() => ({
    total: campaigns.length,
    supporters: campaigns.reduce((sum, c) => sum + (c.topBidders?.length || 0), 0),
    funded: kickstarterCampaigns.length + launchedCampaigns.length,
    success: campaigns.length > 0 ? Math.round(((kickstarterCampaigns.length + launchedCampaigns.length) / campaigns.length) * 100) : 0
  }), [campaigns, kickstarterCampaigns.length, launchedCampaigns.length]);

  // Memoized tab counts for performance
  const tabCounts = useMemo(() => ({
    live: liveCampaigns.length,
    kickstarter: kickstarterCampaigns.length,
    launched: launchedCampaigns.length,
    archived: archivedCampaigns.length
  }), [liveCampaigns.length, kickstarterCampaigns.length, launchedCampaigns.length, archivedCampaigns.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error.isVisible && error.message) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading projects: {error.message}</p>
          <button
            onClick={() => {
              clearError();
              fetchCampaigns();
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section - Fixed with proper padding */}
      <div className="relative overflow-hidden">
        {/* Background gradient with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#3366FF_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Vote on Ideas & Change Lives
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Buy coins to vote on real people's ideas. Get exclusive discounts while helping inventors earn life-changing income.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-6 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Stats */}
        <ProjectStats stats={stats} />

        {/* Tab Navigation */}
        <ProjectTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={tabCounts}
        />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'live' && (
            <LiveVotingSection filteredData={liveCampaigns} handleItemClick={handleItemClick} />
          )}

          {activeTab === 'kickstarter' && (
            <LiveKickstarterSection filteredData={kickstarterCampaigns} handleItemClick={handleItemClick} />
          )}

          {activeTab === 'launched' && (
            <LaunchedProductsSection filteredData={launchedCampaigns} handleItemClick={handleItemClick} />
          )}

          {activeTab === 'archived' && (
            <ArchivedIdeasSection filteredData={archivedCampaigns} handleItemClick={handleItemClick} />
          )}
        </div>

        {/* How It Works Example */}
        <HowItWorksExample />

        {/* Call to Action */}
        <ProjectCallToAction />
      </div>
    </div>
  );
};

export default Projects;