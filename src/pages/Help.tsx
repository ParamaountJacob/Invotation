import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MessageSquare, CheckCircle, X, AlertCircle, CreditCard, FileText, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import MessagingModal from '../components/MessagingModal';

const Help = () => {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'chat' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    
    getCurrentUser();
  }, []);

  const handleStartChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowLoginModal(true);
    } else {
      setContactMethod('chat');
      setShowContactModal(true);
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
      setShowLoginModal(false);
      setContactMethod('chat');
      setShowContactModal(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const helpCategories = [
    {
      id: 'account',
      title: 'Account & Login',
      icon: <HelpCircle className="w-6 h-6 text-blue-500" />,
      questions: [
        {
          q: "I can't log in to my account",
          a: "If you're having trouble logging in, try resetting your password using the 'Forgot Password' link on the login screen. Make sure you're using the correct email address and check your spam folder for reset emails."
        },
        {
          q: "How do I change my profile information?",
          a: "Go to Settings in the top-right menu after logging in. From there, you can update your name, profile picture, and other account details."
        },
        {
          q: "How do I delete my account?",
          a: "To delete your account, please contact our support team. We'll verify your identity and process your request within 48 hours."
        }
      ]
    },
    {
      id: 'coins',
      title: 'Coins & Purchases',
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
      questions: [
        {
          q: "My coin purchase didn't go through",
          a: "If your purchase wasn't completed, first check your email for a receipt. If you were charged but didn't receive coins, contact our support team with your order details and we'll resolve it immediately."
        },
        {
          q: "How do I get a refund?",
          a: "Coin purchases are generally non-refundable once added to your account. However, if you experienced a technical issue or duplicate charge, please contact support with your order details."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. All payments are processed securely through Stripe."
        }
      ]
    },
    {
      id: 'submissions',
      title: 'Idea Submissions',
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      questions: [
        {
          q: "Why was my submission rejected?",
          a: "Submissions may be rejected for several reasons: similarity to existing products, technical feasibility issues, limited market potential, or insufficient information. Check your submission feedback for specific details."
        },
        {
          q: "How long does the review process take?",
          a: "We typically review submissions within 2-3 business days. Complex ideas may take longer to evaluate. You'll receive an email notification when your submission status changes."
        },
        {
          q: "Can I update my submission after sending it?",
          a: "Once submitted, you cannot directly edit your submission. However, you can contact our team with additional information or clarifications, which we'll add to your submission notes."
        }
      ]
    },
    {
      id: 'voting',
      title: 'Voting & Discounts',
      icon: <CheckCircle className="w-6 h-6 text-orange-500" />,
      questions: [
        {
          q: "How do discounts work?",
          a: "When you vote with coins, you secure a discount on the final product. Everyone gets at least 20% off, while top supporters get up to 40% off. Your final discount depends on your position in the supporter rankings."
        },
        {
          q: "I lost my position after voting",
          a: "Positions are dynamic and change as more people vote. If someone votes with more coins than you, they may move ahead in the rankings. You can add more coins to improve your position."
        },
        {
          q: "When do I receive my discount code?",
          a: "Discount codes are sent via email when the product launches on Kickstarter or other platforms. Make sure your email address is up-to-date in your profile settings."
        }
      ]
    }
  ];

  // Arrow right icon component
  const ArrowRight = (props: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions or contact our support team for assistance
            </p>
          </div>

          {/* Common Issues Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">How Can We Help You?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="bg-red-50 rounded-xl p-6 border border-red-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setContactMethod('email')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-red-800">Having an Issue?</h3>
                    <p className="text-red-700">Get help with technical problems</p>
                  </div>
                </div>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span>Payment or purchase problems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span>Account access issues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span>Website errors or bugs</span>
                  </li>
                </ul>
              </div>
              
              <div 
                className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setContactMethod('phone')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-blue-800">Have Questions?</h3>
                    <p className="text-blue-700">Get answers about our platform</p>
                  </div>
                </div>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span>How the submission process works</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span>Voting and discount questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <span>Product development timeline</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={handleStartChat}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors inline-flex items-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Live Chat
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Our support team is available Monday-Friday, 9am-5pm ET
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Sidebar */}
              <div className="md:col-span-1">
                <div className="space-y-2">
                  {helpCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-3">{category.icon}</span>
                      <span className="font-medium">{category.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* FAQ Content */}
              <div className="md:col-span-3">
                {activeCategory ? (
                  <div className="space-y-6">
                    {helpCategories.find(c => c.id === activeCategory)?.questions.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
                        <h3 className="font-bold text-gray-900 mb-3">{item.q}</h3>
                        <p className="text-gray-600">{item.a}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center p-12 bg-gray-50 rounded-lg">
                    <div>
                      <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Category</h3>
                      <p className="text-gray-500">Choose a topic from the left to view related questions</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Email Support</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get a response within 24 hours to your questions or concerns.
              </p>
              <a 
                href="mailto:hello@invotation.com"
                className="text-primary hover:text-primary-dark font-medium flex items-center"
              >
                hello@invotation.com
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold">Phone Support</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Speak directly with our support team for urgent matters.
                  </p>
                  <a 
                    href="tel:+13462661456"
                    className="text-primary hover:text-primary-dark font-medium flex items-center"
                  >
                    (346) 266-1456
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold">Message Support</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Send a message to our support team and get a response in your inbox.
                  </p>
                  <button 
                    onClick={handleStartChat}
                    className="text-primary hover:text-primary-dark font-medium flex items-center"
                  >
                    Start Conversation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
              
              {/* Support Guides */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20">
                <h2 className="text-2xl font-bold mb-6 text-center">Support Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">For Inventors</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <a href="/submission-tips" className="text-primary hover:underline">
                          Submission Guidelines & Tips
                        </a>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <a href="/how-it-works" className="text-primary hover:underline">
                          Development Process Explained
                        </a>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <a href="/how-it-works" className="text-primary hover:underline">
                          Profit Sharing & Royalties
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">For Supporters</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <a href="/buy-coins" className="text-primary hover:underline">
                          Coin Purchasing Guide
                        </a>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <a href="/projects" className="text-primary hover:underline">
                          How Voting & Discounts Work
                        </a>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <a href="/completed-projects" className="text-primary hover:underline">
                          Redeeming Your Discounts
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
      {/* Contact Method Modal */}
      {showMessagingModal && currentUser && (
        <MessagingModal
          isOpen={showMessagingModal}
          onClose={() => setShowMessagingModal(false)}
          selectedUserId={selectedUserId}
          currentUser={currentUser}
        />
      )}
      
      {/* Contact Method Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {contactMethod === 'email' ? 'Email Support' : 
                 contactMethod === 'phone' ? 'Phone Support' : 'Live Chat'}
              </h2>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {contactMethod === 'email' && (
              <div>
                <p className="mb-6 text-gray-600">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <a 
                    href="mailto:hello@invotation.com" 
                    className="text-blue-700 font-medium"
                  >
                    hello@invotation.com
                  </a>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">Please include:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span>Your account email address</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span>Order or submission ID (if applicable)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span>Detailed description of your issue</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span>Screenshots (if relevant)</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {contactMethod === 'phone' && (
              <div>
                <p className="mb-6 text-gray-600">
                  Call our support team directly for immediate assistance.
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-6 flex items-center">
                  <Phone className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <a 
                    href="tel:+13462661456" 
                    className="text-green-700 font-medium"
                  >
                    (346) 266-1456
                  </a>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">Support hours:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span>Monday - Friday: 9:00 AM - 5:00 PM ET</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      <span>Saturday - Sunday: Closed</span>
                    </li>
                  </ul>
                  <p className="text-gray-600 text-sm mt-4">
                    Please have your account email ready when you call.
                  </p>
                </div>
              </div>
            )}
            
            {contactMethod === 'chat' && (
              <div>
                <p className="mb-6 text-gray-600">
                  Chat with our admin team for real-time assistance.
                </p>
                <div className="bg-purple-50 rounded-lg p-6 mb-6 text-center">
                  <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <p className="text-purple-700 font-medium mb-2">
                    Our messaging system will connect you with our admin team.
                  </p>
                  <p className="text-sm text-purple-600">
                    Typical response time: Within 24 hours
                  </p>
                </div>
                <button
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                  onClick={() => {
                    // Get admin user ID (first admin in the system)
                    const getAdminId = async () => {
                      try {
                        const { data: adminUser } = await supabase
                          .from('profiles')
                          .select('id')
                          .eq('is_admin', true)
                          .eq('email', 'invotation@gmail.com')  // Preferably get the super admin
                          .limit(1)
                          .single();
                        
                        if (adminUser) {
                          setShowMessagingModal(true);
                          setSelectedUserId(adminUser.id);
                        } else {
                          // Try to get any admin if super admin not found
                          const { data: anyAdmin } = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('is_admin', true)
                            .limit(1)
                            .single();
                            
                          if (anyAdmin) {
                            setShowMessagingModal(true);
                            setSelectedUserId(anyAdmin.id);
                          } else {
                            setError('No admin found to chat with. Please try email support.');
                          }
                        }
                      } catch (err) {
                        console.error('Error finding admin:', err);
                        setError('Error connecting to chat. Please try email support.');
                      }
                    };
                    
                    getAdminId();
                    setShowContactModal(false);
                  }}
                >
                  Start Chat Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sign In Required</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="mb-6 text-gray-600">
              Please sign in to start a chat with our support team.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignIn} className="space-y-4">
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
                className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/submissions" className="text-primary hover:text-primary-dark">
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;