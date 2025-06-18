import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampaignCard from './CampaignCard';
import { fetchCampaigns, convertCampaignToFrontend, fetchCampaignSupporters, recalculateCampaignData } from '../lib/campaigns';
import { campaignCache } from '../lib/campaignCache';

const LiveCampaigns = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Memoize filtered campaigns to prevent unnecessary recalculations
  const filteredCampaigns = useMemo(() => {
    return selectedFilter === 'all' 
      ? campaigns 
      : campaigns.filter(campaign => campaign.category === selectedFilter);
  }, [campaigns, selectedFilter]);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      // Try to get cached campaigns first
      const cachedCampaigns = campaignCache.getCachedCampaigns();
      
      if (cachedCampaigns && cachedCampaigns.length > 0) {
        // Use cached data immediately - no loading state
       // Filter out completed campaigns for the home page
       const activeCampaigns = cachedCampaigns.filter(campaign => 
         campaign.status !== 'goal_reached' && !campaign.amazonUrl && !campaign.websiteUrl
       );
       setCampaigns(activeCampaigns);
        return;
      }

      // Only show loading if we have no cached data
      setLoading(true);
      
      const dbCampaigns = await fetchCampaigns(false);
      
      const campaignsWithSupporters = await Promise.all(
        dbCampaigns.map(async (dbCampaign) => {
          // Ensure campaign data is up-to-date
          await recalculateCampaignData(dbCampaign.id);
          const supporters = await fetchCampaignSupporters(dbCampaign.id);
          return convertCampaignToFrontend(dbCampaign, supporters);
        })
      );
      
     // Filter out completed campaigns for the home page
     const activeCampaigns = campaignsWithSupporters.filter(campaign => 
       campaign.status !== 'goal_reached' && !campaign.amazonUrl && !campaign.websiteUrl
     );
     setCampaigns(activeCampaigns);
    } catch (err: any) {
      console.error('Error loading campaigns:', err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, [filteredCampaigns]); // Re-observe when campaigns change

  // Only show loading if we have no campaigns and are actually loading
  if (loading && campaigns.length === 0) {
    return (
      <section 
        id="live-campaigns" 
        className="section-padding bg-white" 
        ref={sectionRef}
      >
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="live-campaigns" 
      className="section-padding bg-white" 
      ref={sectionRef}
    >
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="animate-on-scroll opacity-0 mb-4 text-gray-900">
            Vote With Coins – Change Lives & Get Exclusive Discounts
          </h2>
          <p className="animate-on-scroll opacity-0 max-w-3xl mx-auto text-lg text-gray-600 delay-100">
            These ideas came from regular people just like you. We developed them into professional 
            concepts, and now YOUR VOTES decide which ones succeed. Buy coins, support your favorites, 
            and secure up to 40% off when they launch!
          </p>
        </div>

        <div className="animate-on-scroll opacity-0 flex flex-wrap justify-center gap-4 mb-8 delay-200">
          {['all', 'tech', 'home', 'lifestyle'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedFilter === filter
                  ? 'bg-primary text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
              }`}
            >
              {filter === 'all' ? 'All Projects' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Fixed height container to prevent layout shifts */}
        <div className="min-h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign, index) => (
              <div 
                key={campaign.id} 
                className="animate-on-scroll opacity-0 cursor-pointer nav-transition" 
                style={{animationDelay: `${300 + (index * 100)}ms`}}
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>

          {filteredCampaigns.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No campaigns available at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12 animate-on-scroll opacity-0 delay-700">
          <Link
            to="/projects"
            className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
          >
            View All Projects
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </Link>
        </div>
        
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto animate-on-scroll opacity-0 delay-800">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">5-10</span>
                    <img
                      src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                      alt="Coin"
                      className="w-8 h-8 ml-1"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-sm text-white/90">Support</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-secondary rounded-full flex items-center justify-center animate-bounce">
                <span className="text-2xl text-white">🎯</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                These Are Real People's Ideas
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Every project you see was submitted by someone with a dream. Your votes help determine 
                which ideas succeed, changing the inventor's life forever. Like Sarah, who now earns 
                $40,000+ from her simple coffee mug idea that YOU could have supported!
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/buy-coins" 
                  className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
                >
                  Buy Coins & Vote
                </Link>
                <Link 
                  to="/submit" 
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  Submit Your Idea
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 max-w-4xl mx-auto animate-on-scroll opacity-0 delay-900">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-primary rounded-full flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">20%</div>
                <div className="text-sm text-white/90">Profit</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-secondary rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl text-white">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Got a Great Idea? Submit It!
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Turn your innovative ideas into reality with Invotation. We handle the design, development,
              and crowdfunding – you earn 20% of the profits when your product succeeds. No upfront costs,
              just your great idea and our expertise working together.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/submit" 
                className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Submit Your Idea
              </Link>
              <Link 
                to="/submission-tips" 
                className="btn-secondary inline-flex items-center gap-2"
              >
                Submission Tips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveCampaigns;