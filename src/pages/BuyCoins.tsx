import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCoin } from '../context/CoinContext';
import { stripeConfig } from '../stripe-config';
import { createCheckoutSession } from '../lib/stripe';

const BuyCoins = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCoinBuyingCelebrationVideo, setShowCoinBuyingCelebrationVideo] = useState(false);
  const [purchasedCoins, setPurchasedCoins] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addCoins, refreshCoins } = useCoin();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for success/cancel parameters
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const coinsParam = searchParams.get('coins');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user is admin
        supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', currentUser.id)
          .single()
          .then(({ data: profile }) => {
            if (profile?.is_admin) {
              setIsAdmin(true);
              navigate('/admin');
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (success === 'true' && coinsParam && user) {
      const coins = parseInt(coinsParam);
      if (!isNaN(coins)) {
        setPurchasedCoins(coins);
        // Add coins to user's account and refresh the coin count
        addCoins(coins).then(async () => {
          await refreshCoins(); // Force refresh coins after adding
          // Show celebration video first, then success modal
          setShowCoinBuyingCelebrationVideo(true);
        }).catch(console.error);
        // Clean up URL
        navigate('/buy-coins', { replace: true });
      }
    } else if (canceled === 'true') {
      setShowErrorModal(true);
      // Clean up URL
      navigate('/buy-coins', { replace: true });
    }
  }, [success, canceled, coinsParam, user, addCoins, navigate]);

  const handlePurchase = async (priceId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkoutUrl = await createCheckoutSession(priceId);
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setPurchasedCoins(0);
    
    // Check if there's a pending support action
    const pendingSupport = sessionStorage.getItem('pendingSupport');
    if (pendingSupport) {
      sessionStorage.removeItem('pendingSupport');
      const previousPath = sessionStorage.getItem('previousPath') || '/';
      navigate(previousPath);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-24 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-primary-dark/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-gray-600/10 to-gray-700/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                  alt="Coin"
                  className="w-32 h-32 drop-shadow-2xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
              Vote & Get <span className="text-primary">Exclusive Discounts</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Buy coins to vote on real people's ideas. The more you spend, the bigger your discount - up to 40% off retail price!
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Coin Packages */}
          <div className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {stripeConfig.products.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${
                    pkg.popular ? 'transform scale-105' : ''
                  }`}
                  onClick={() => handlePurchase(pkg.priceId)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <span className="bg-gradient-to-r from-primary to-primary-dark text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className={`relative bg-white rounded-2xl p-4 md:p-6 text-center shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:bg-gray-50 ${
                    pkg.popular ? 'ring-2 ring-primary shadow-primary/25' : ''
                  } ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {/* Plus symbol in top right */}
                    <div className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    
                    {/* Coin Image */}
                    <div className="mb-8 md:mb-10 h-32 md:h-40 flex items-center justify-center">
                      <img
                        src={pkg.image}
                        alt={`${pkg.coins} coins`}
                        className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg object-contain"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="mb-6 md:mb-8">
                      <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                        {pkg.coins}+
                      </div>
                      <div className="text-lg md:text-xl text-gray-600 font-medium">
                        coin{pkg.coins > 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    <div className="mb-8 md:mb-10">
                      <div className="text-3xl md:text-4xl font-black text-primary mb-2">
                        ${pkg.price.toFixed(2)}
                      </div>
                      <div className="text-base md:text-lg text-gray-500 font-medium">
                        ${(pkg.price / pkg.coins).toFixed(2)} per coin
                      </div>
                    </div>
                    
                    <div className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 md:py-5 rounded-xl font-bold text-lg md:text-xl group-hover:from-primary-dark group-hover:to-primary transition-all duration-300 shadow-lg cursor-pointer">
                      {loading ? 'Processing...' : 'Purchase'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-8 md:p-12 text-white border border-gray-700 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
              Power Your Decisions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl md:text-2xl font-black text-white">1</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Secure Your Position</h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">Buy coins to vote on ideas you love. More coins = higher position = bigger discount when the product launches.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl md:text-2xl font-black text-white">2</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Lock In Savings</h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">Top supporters get up to 40% off retail price. Everyone gets at least 20% off. Your votes secure your discount.</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl md:text-2xl font-black text-white">3</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Lead the Pack</h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">Your votes help real people's ideas succeed. You change lives while getting amazing products at exclusive discounts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-2"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary-dark text-sm"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCoinBuyingCelebrationVideo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl max-w-md w-full mx-4">
            <video
              autoPlay
              muted
              className="w-full h-auto rounded-2xl animate-fade-in"
              onEnded={() => {
                setShowCoinBuyingCelebrationVideo(false);
                setShowSuccessModal(true);
              }}
            >
              <source src="https://res.cloudinary.com/digjsdron/video/upload/v1749741996/Coin_Buying_jx2yfz.mp4" type="video/mp4" />
            </video>
            
            <button
              onClick={() => {
                setShowCoinBuyingCelebrationVideo(false);
                setShowSuccessModal(true);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 text-xl font-bold"
            >
              ×
            </button>
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-2 animate-fade-in">Coins Purchased! 🎉</h3>
                <p className="text-sm opacity-90 animate-fade-in">
                  {purchasedCoins} coin{purchasedCoins > 1 ? 's' : ''} added to your vault • Ready to vote on amazing projects!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Purchase Complete!
              </h2>
              <p className="text-gray-600 text-lg">
                You successfully purchased <span className="font-bold text-primary">{purchasedCoins} coin{purchasedCoins > 1 ? 's' : ''}</span>
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2">
                <img
                  src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                  alt="Coin"
                  className="w-8 h-8"
                  loading="lazy"
                />
                <span className="text-lg font-bold text-gray-800">
                  Your coins are ready to use!
                </span>
              </div>
            </div>
            
            <button
              onClick={handleSuccessClose}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-3 rounded-xl font-bold text-lg hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Purchase Canceled
              </h2>
              <p className="text-gray-600 text-lg">
                Your purchase was canceled. No charges were made to your account.
              </p>
            </div>
            
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full bg-gray-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-700 transition-all duration-300 shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCoins;