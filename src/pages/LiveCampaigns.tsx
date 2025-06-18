import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { fetchCampaigns, convertCampaignToFrontend, fetchCampaignSupporters } from '../lib/campaigns';
import { campaignCache } from '../lib/campaignCache';

const LiveCampaigns = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize filtered campaigns to prevent unnecessary recalculations
  const filteredCampaigns = useMemo(() => {
    return activeFilter === 'all'
      ? campaigns
      : campaigns.filter(campaign => campaign.category === activeFilter);
  }, [campaigns, activeFilter]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      // Try to get cached campaigns first
      const cachedCampaigns = campaignCache.getCachedCampaigns();
      
      if (cachedCampaigns && cachedCampaigns.length > 0) {
        // Use cached data immediately - no loading state
        setCampaigns(cachedCampaigns);
        return;
      }

      // Only show loading if we have no cached data
      setLoading(true);
      
      const dbCampaigns = await fetchCampaigns(false);
      
      const campaignsWithSupporters = await Promise.all(
        dbCampaigns.map(async (dbCampaign) => {
          const supporters = await fetchCampaignSupporters(dbCampaign.id);
          return convertCampaignToFrontend(dbCampaign, supporters);
        })
      );
      
      setCampaigns(campaignsWithSupporters);
    } catch (err: any) {
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignClick = (id: number) => {
    navigate(`/campaign/${id}`);
  };

  // Only show loading if we have no campaigns and are actually loading
  if (loading && campaigns.length === 0) {
    return (
      <div className="pt-24">
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Active Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our current projects and be part of bringing these innovative ideas to life.
            Support a project today and join our community of forward-thinking innovators.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['all', 'tech', 'home', 'lifestyle'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
              }`}
            >
              {filter === 'all' ? 'All Projects' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Fixed height container to prevent layout shifts */}
        <div className="min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => {
                  // Add a slight delay to show the click effect
                  const element = document.querySelector(`[data-campaign-id="${campaign.id}"]`);
                  if (element) {
                    element.classList.add('transform', 'scale-95');
                    setTimeout(() => {
                      handleCampaignClick(campaign.id);
                    }, 150);
                  } else {
                    handleCampaignClick(campaign.id);
                  }
                }}
                className="cursor-pointer nav-transition hover:scale-105 active:scale-95"
                data-campaign-id={campaign.id}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && !loading && (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <p className="text-gray-500 text-lg">No campaigns found for this category.</p>
            </div>
          )}
        </div>

        {/* Info Sections */}
        <div className="mt-20 space-y-16">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative">
                <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">1-2</span>
                      <img
                        src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                        alt="Coin"
                        className="w-10 h-10 ml-2"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm text-white/90 font-medium">Support</div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-secondary rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <span className="text-3xl text-white">🎯</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-4xl font-bold mb-6 text-gray-900">
                  How Our Support System Works
                </h3>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Use coins to support projects and lock in <span className="font-bold text-primary">up to 40% off</span> retail price.
                  When we hit our support goal, the product goes into production. Your support helps bring
                  innovative products to life and guarantees you'll be first in line when the product launches.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/live-campaigns')}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Browse Products
                  </button>
                  <button 
                    onClick={() => navigate('/how-it-works')}
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 rounded-3xl p-12 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative">
                <div className="w-40 h-40 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white">20%</div>
                    <div className="text-sm text-white/90 font-medium">Profit</div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-secondary rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <span className="text-3xl text-white">💡</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-4xl font-bold mb-6 text-gray-900">
                  Got a Great Idea? Submit It!
                </h3>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Turn your innovative ideas into reality with Invotation. We handle the design, development,
                  and crowdfunding – you earn 20% of the profits when your product succeeds. No upfront costs,
                  just your great idea and our expertise working together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => navigate('/submit')}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Submit Your Idea
                  </button>
                  <button 
                    onClick={() => navigate('/submission-tips')}
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    Submission Tips
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCampaigns;