import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { fetchCampaigns, fetchCampaignSupporters, convertCampaignToFrontend } from '../lib/campaigns';
import { Submission } from '../types';
import { Sword, Trophy, Clock, CheckCircle, XCircle, AlertCircle, Plus, ArrowLeft } from 'lucide-react';
import CompletionPlaque from '../components/CompletionPlaque';
import { useCoin } from '../context/CoinContext'; 

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  review: <AlertCircle className="w-5 h-5 text-blue-500" />,
  approved: <CheckCircle className="w-5 h-5 text-green-500" />,
  rejected: <XCircle className="w-5 h-5 text-red-500" />,
  development: <CheckCircle className="w-5 h-5 text-purple-500" />
};

// Cache for treasure hoard data
let treasureCache: {
  supportedCampaigns: any[];
  submissions: Submission[];
  lastFetch: number;
} | null = null;

const CACHE_DURATION = 30000; // 30 seconds

const TreasureHoard = () => {
  const navigate = useNavigate();
  const { coins } = useCoin();
  const [activeTab, setActiveTab] = useState<'hoard' | 'conquests'>('hoard');
  const [supportedCampaigns, setSupportedCampaigns] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/submissions');
        return;
      }

      // Check cache first
      const now = Date.now();
      if (treasureCache && (now - treasureCache.lastFetch) < CACHE_DURATION) {
        setSupportedCampaigns(treasureCache.supportedCampaigns);
        setSubmissions(treasureCache.submissions);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Fetch data in parallel for better performance
      const [supportData, submissionsData] = await Promise.all([
        supabase
          .from('campaign_supporters')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      // Process supported campaigns
      let campaignsWithSupport: any[] = [];
      if (supportData.data && supportData.data.length > 0) {
        const campaigns = await fetchCampaigns(false);
        
        // Process campaigns in parallel
        const campaignPromises = supportData.data.map(async (support) => {
          const campaign = campaigns.find(c => c.id === support.campaign_id);
          if (campaign) {
            // Calculate progress percentage directly without fetching all supporters
            const progressPercentage = Math.min(
              Math.round((campaign.current_reservations / campaign.reservation_goal) * 100),
              100
            );
            
            return {
              id: campaign.id,
              title: campaign.title,
              description: campaign.description,
              image: campaign.image,
              reservationGoal: campaign.reservation_goal,
              currentReservations: campaign.current_reservations,
              estimatedRetailPrice: campaign.estimated_retail_price,
              daysOld: campaign.days_old,
              category: campaign.category,
              minimumBid: campaign.minimum_bid,
              userSupport: support,
              progressPercentage,
              isCompleted: progressPercentage >= 100
            };
          }
          return null;
        });
        
        const results = await Promise.all(campaignPromises);
        campaignsWithSupport = results.filter(Boolean);
      }

      const processedSubmissions = submissionsData.data || [];

      // Update cache
      treasureCache = {
        supportedCampaigns: campaignsWithSupport,
        submissions: processedSubmissions,
        lastFetch: now
      };

      setSupportedCampaigns(campaignsWithSupport);
      setSubmissions(processedSubmissions);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlaqueMode = (campaign: any) => {
    if (campaign.isCompleted) return 'completed';
    
    const userPosition = campaign.userSupport?.position;
    if (userPosition === 1) return 'first';
    if (userPosition === 2) return 'second';
    if (userPosition === 3) return 'third';
    
    return 'percentage';
  };

  const getCoinMessage = () => {
    if (coins === 0) return "Building Your Fortune!";
    if (coins < 10) return "Growing Your Wealth!";
    if (coins < 50) return "Impressive Collection!";
    if (coins < 100) return "Substantial Treasury!";
    return "Magnificent Hoard!";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your treasure hoard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Trophy className="w-20 h-20 text-primary drop-shadow-lg" />
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary-dark/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Your <span className="text-primary">Treasure Hoard</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Track your votes, secure your discounts, and see how you're helping change inventors' lives.
            </p>
          </div>

          {/* Coin Display Section */}
          <div className="mb-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-8 shadow-2xl border border-yellow-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">{getCoinMessage()}</h2>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-6xl font-black text-white">{coins}</div>
                <img
                  src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                  alt="Coin"
                  className="w-16 h-16 drop-shadow-lg"
                  loading="lazy"
                />
              </div>
              
              {/* Interactive Coin Vault */}
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-2xl p-6 shadow-inner border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-900 mb-4">Your Coin Vault</h3>
                
                {coins === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-yellow-800 mb-4">Your vault is empty</div>
                    <button
                      onClick={() => navigate('/buy-coins')}
                      className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-700 transition-colors"
                    >
                      Buy Coins & Start Voting
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-64 overflow-hidden">
                    {Array.from({ length: Math.min(coins, 50) }, (_, i) => (
                      <div
                        key={i}
                        className="relative group cursor-pointer"
                        style={{
                          animationDelay: `${i * 50}ms`
                        }}
                      >
                        <img
                          src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                          alt="Coin"
                          className="w-8 h-8 hover:scale-110 transition-transform duration-200 animate-bounce"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {coins > 50 && (
                  <div className="text-center mt-4 text-yellow-800 font-medium">
                    Showing 50 of your {coins} coins
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => navigate('/buy-coins')}
                  className="bg-white text-yellow-600 px-6 py-3 rounded-xl font-bold hover:bg-yellow-50 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Buy More Coins
                </button>
                <button
                  onClick={() => navigate('/live-campaigns')}
                  className="bg-yellow-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-800 transition-colors shadow-lg"
                >
                  Vote on More Projects
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-gray-100 rounded-2xl p-2 shadow-xl border border-gray-300">
              <button
                onClick={() => setActiveTab('hoard')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === 'hoard'
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <img
                  src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                  alt="Coin"
                  className="w-6 h-6"
                  loading="lazy"
                />
                <span className="text-lg">Projects You've Voted On</span>
              </button>
              <button
                onClick={() => setActiveTab('conquests')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 relative ${
                  activeTab === 'conquests'
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                <Sword className={`w-6 h-6 ${activeTab === 'conquests' ? 'text-red-300' : ''}`} />
                <span className="text-lg">My Submissions</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'hoard' ? (
            <div className="space-y-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Projects You've Voted On</h2>
                <p className="text-blue-800 font-medium">
                  Projects you've voted on with your coins, showing your position and secured discount
                </p>
              </div>

              {supportedCampaigns.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg border border-blue-300">
                  <Trophy className="w-24 h-24 text-blue-600 mx-auto mb-6 opacity-70" />
                  <h3 className="text-2xl font-bold mb-3 text-blue-900">No Votes Cast Yet</h3>
                  <p className="text-blue-800 text-lg max-w-md mx-auto mb-8">
                    Buy coins and vote on projects to secure exclusive discounts and help change inventors' lives!
                  </p>
                  <button
                    onClick={() => navigate('/projects')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Vote on Projects
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {supportedCampaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                      onClick={() => navigate(`/campaign/${campaign.id}`)}
                    >
                      <div className="mb-4">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-48 object-cover rounded-xl"
                          loading="lazy"
                        />
                      </div>
                      
                      <CompletionPlaque
                        mode={getPlaqueMode(campaign)}
                        percentage={campaign.progressPercentage}
                        campaignTitle={campaign.title}
                        position={campaign.userSupport?.position}
                        coinsSpent={campaign.userSupport?.coins_spent}
                        discount={campaign.userSupport?.discount_percentage}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-600 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Your Submissions</h2>
                <p className="text-gray-300 font-medium">
                  Ideas you've submitted and their journey through our development process
                </p>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl shadow-lg border border-gray-600">
                  <Sword className="w-24 h-24 text-red-400 mx-auto mb-6 opacity-70" />
                  <h3 className="text-2xl font-bold mb-3 text-white">No Submissions Yet</h3>
                  <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
                    Submit your first idea to begin your journey toward innovation and profit!
                  </p>
                  <button
                    onClick={() => navigate('/submit')}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center space-x-2"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Submit Your First Idea</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {submissions.map((submission) => (
                    <div 
                      key={submission.id}
                      className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600 hover:border-red-400 overflow-hidden group cursor-pointer relative"
                      onClick={() => navigate(`/submission/${submission.id}`)}
                    >
                      <div className="p-8">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border bg-gray-600 text-white border-gray-500 mb-4">
                          {statusIcons[submission.status]}
                          <span className="capitalize text-sm font-medium">{submission.status}</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-white group-hover:text-red-400 transition-colors">
                          {submission.idea_name}
                        </h2>
                        <p className="text-gray-300 mb-4">{submission.short_description}</p>

                        <p className="text-sm text-gray-400">
                          Submitted on {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                        
                        <div className="absolute bottom-4 right-4 bg-gray-600 hover:bg-gray-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowLeft className="w-5 h-5 text-white rotate-180" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreasureHoard;