import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile, Submission, Message } from '../types';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Coins,
  Crown,
  FileText,
  MessageSquare,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Award,
  PlusCircle
} from 'lucide-react';
import MessagingModal from '../components/MessagingModal';
import UserTransactions from './AdminDashboard/UserTransactions';
import { useCoin } from '../context/CoinContext';
import StatusBadge from '../components/shared/StatusBadge';

interface CampaignSupport {
  id: string;
  campaign_id: number;
  coins_spent: number;
  position: number;
  discount_percentage: number;
  created_at: string;
  campaign: {
    id: number;
    title: string;
    image: string;
    estimated_retail_price: number;
  };
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [campaignSupports, setCampaignSupports] = useState<CampaignSupport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'campaigns' | 'transactions'>('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [coinOperation, setCoinOperation] = useState<'add' | 'subtract'>('add');
  const [coinNotes, setCoinNotes] = useState('');
  const [isUpdatingCoins, setIsUpdatingCoins] = useState(false);
  const { updateUserCoins } = useCoin();

  useEffect(() => {
    checkAdminAndFetchUser();
  }, [id]);

  const checkAdminAndFetchUser = async () => {
    try {
      // Check if current user is admin
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate('/admin');
        return;
      }

      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single();

      if (!currentProfile?.is_admin) {
        navigate('/admin');
        return;
      }

      // Check if current user is super admin
      const isSuperAdmin = currentUser.email === 'invotation@gmail.com';
      setIsSuperAdmin(isSuperAdmin);
      setCurrentUser(currentUser);

      setIsAdmin(true);
      await fetchUserDetails();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    if (!id) return;

    try {
      // Fetch user profile
      const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (userError) throw userError;
      setUser(userProfile);
      setCoinAmount(userProfile.coins || 0);

      // Fetch user submissions
      const { data: userSubmissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;
      setSubmissions(userSubmissions || []);

      // Fetch user campaign supports with campaign details
      const { data: supports, error: supportsError } = await supabase
        .from('campaign_supporters')
        .select(`
          *,
          campaign:campaigns(id, title, image, estimated_retail_price)
        `)
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (supportsError) throw supportsError;
      setCampaignSupports(supports || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async () => {
    if (!user) return;

    // Prevent removing admin status from super admin (invotation@gmail.com)
    if (user.email === 'invotation@gmail.com' && user.is_admin) {
      setError('Cannot remove admin status from super admin account (invotation@gmail.com)');
      return;
    }

    // Prevent non-super admins from modifying super admin
    if (user.email === 'invotation@gmail.com' && !isSuperAdmin) {
      setError('Only the super admin can modify the super admin account');
      return;
    }

    try {
      setError(null);
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !user.is_admin })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, is_admin: !user.is_admin });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateCoins = async () => {
    if (!user || !currentUser || isUpdatingCoins) return;

    try {
      setIsUpdatingCoins(true);
      setError(null);

      // Calculate the new coin amount
      const newAmount = coinOperation === 'add'
        ? (user.coins || 0) + coinAmount
        : Math.max(0, (user.coins || 0) - coinAmount);

      // Update the user's coins
      const success = await updateUserCoins(user.id, newAmount);

      if (!success) {
        throw new Error('Failed to update coins');
      }

      // Create a transaction record
      await supabase.from('coin_transactions').insert({
        user_id: user.id,
        admin_id: currentUser.id,
        amount: coinOperation === 'add' ? coinAmount : -coinAmount,
        operation_type: coinOperation === 'add' ? 'admin_credit' : 'admin_debit',
        notes: coinNotes
      });

      // Update local state
      setUser({ ...user, coins: newAmount });

      // Reset form and close modal
      setCoinAmount(0);
      setCoinNotes('');
      setShowCoinModal(false);

      // If on transactions tab, refresh the transactions
      if (activeTab === 'transactions') {
        setActiveTab('overview');
        setTimeout(() => setActiveTab('transactions'), 100);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdatingCoins(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested user could not be found.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalCoinsSpent = campaignSupports.reduce((sum, support) => sum + support.coins_spent, 0);
  const averagePosition = campaignSupports.length > 0
    ? Math.round(campaignSupports.reduce((sum, support) => sum + (support.position || 0), 0) / campaignSupports.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.full_name || 'Anonymous User'}
                    </h1>
                    {user.is_admin && (
                      <Crown className="w-5 h-5 text-yellow-500" title="Admin" />
                    )}
                  </div>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center mt-1">
                    <Coins className="w-4 h-4 mr-2 text-yellow-500" />
                    <span className="text-xl font-bold">{user.coins || 0}</span>
                    <button
                      onClick={() => setShowCoinModal(true)}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Manage Coins
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {currentUser && currentUser.id !== user.id && (
                  <button
                    onClick={() => setShowMessagingModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </button>
                )}

                <button
                  onClick={handleToggleAdmin}
                  disabled={user.email === 'invotation@gmail.com' && user.is_admin}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${user.email === 'invotation@gmail.com' && user.is_admin
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : user.is_admin
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  title={user.email === 'invotation@gmail.com' && user.is_admin ? 'Super admin status cannot be removed' : ''}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {user.email === 'invotation@gmail.com' && user.is_admin
                    ? 'Super Admin'
                    : user.is_admin
                      ? 'Remove Admin'
                      : 'Make Admin'
                  }
                </button>
              </div>
            </div>

            {user.bio && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{submissions.length}</div>
                <div className="text-sm text-gray-600">Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{campaignSupports.length}</div>
                <div className="text-sm text-gray-600">Campaigns Supported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalCoinsSpent}</div>
                <div className="text-sm text-gray-600">Total Coins Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{averagePosition || 'N/A'}</div>
                <div className="text-sm text-gray-600">Avg. Position</div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'submissions', label: 'Submissions', icon: FileText },
                { id: 'campaigns', label: 'Campaign Support', icon: Award },
                { id: 'transactions', label: 'Transactions', icon: DollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-700">Joined {formatDate(user.created_at || '')}</span>
                </div>
                {user.company_name && (
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{user.company_name}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{user.phone}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 text-gray-400 mr-3" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {submissions.slice(0, 3).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{submission.idea_name}</p>
                      <p className="text-sm text-gray-600">{formatDate(submission.created_at)}</p>
                    </div>
                    <StatusBadge status={submission.status} size="sm" />
                  </div>
                ))}
                {submissions.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No submissions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
            </div>
            <div className="p-6">
              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{submission.idea_name}</h4>
                          <p className="text-gray-600 mt-1">{submission.short_description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-gray-500">Stage: {submission.idea_stage}</span>
                            <span className="text-sm text-gray-500">Submitted: {formatDate(submission.created_at)}</span>
                            {submission.funding_needs && (
                              <span className="text-sm text-gray-500">
                                Funding: {formatCurrency(Number(submission.funding_needs))}
                              </span>
                            )}
                          </div>
                        </div>
                        <StatusBadge status={submission.status} size="sm" />
                      </div>
                      {submission.admin_notes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Admin Notes:</strong> {submission.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No submissions found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Campaign Support</h3>
            </div>
            <div className="p-6">
              {campaignSupports.length > 0 ? (
                <div className="space-y-4">
                  {campaignSupports.map((support) => (
                    <div key={support.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={support.campaign.image}
                          alt={support.campaign.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{support.campaign.title}</h4>
                          <div className="flex items-center mt-1 space-x-4">
                            <span className="text-sm text-gray-600">
                              <Coins className="w-4 h-4 inline mr-1" />
                              {support.coins_spent} coins spent
                            </span>
                            <span className="text-sm text-gray-600">
                              Position: #{support.position}
                            </span>
                            {support.discount_percentage && (
                              <span className="text-sm text-green-600">
                                {support.discount_percentage}% discount earned
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Supported on {formatDate(support.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Retail Price</p>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(Number(support.campaign.estimated_retail_price))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No campaign support found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <UserTransactions userId={id!} />
        )}
      </div>

      {/* Messaging Modal */}
      {showMessagingModal && currentUser && (
        <MessagingModal
          isOpen={showMessagingModal}
          onClose={() => setShowMessagingModal(false)}
          selectedUserId={user.id}
          currentUser={currentUser}
        />
      )}

      {/* Coin Management Modal */}
      {showCoinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Manage User Coins</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Current Balance:</span>
                <span className="text-xl font-bold text-gray-900">{user.coins || 0} coins</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-center space-x-4 mb-4">
                  <button
                    onClick={() => setCoinOperation('add')}
                    className={`px-4 py-2 rounded-lg font-medium ${coinOperation === 'add'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    Add Coins
                  </button>
                  <button
                    onClick={() => setCoinOperation('subtract')}
                    className={`px-4 py-2 rounded-lg font-medium ${coinOperation === 'subtract'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    Subtract Coins
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    value={coinNotes}
                    onChange={(e) => setCoinNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Reason for adjustment..."
                  ></textarea>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 mb-4">
                  <div className="flex items-start">
                    <InfoIcon className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">New Balance:</p>
                      <p>
                        {user.coins || 0} {coinOperation === 'add' ? '+' : '-'} {coinAmount} = {' '}
                        <span className="font-bold">
                          {coinOperation === 'add'
                            ? (user.coins || 0) + coinAmount
                            : Math.max(0, (user.coins || 0) - coinAmount)
                          } coins
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowCoinModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCoins}
                disabled={isUpdatingCoins || coinAmount <= 0}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isUpdatingCoins ? 'Updating...' : 'Update Coins'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Info Icon component
const InfoIcon = (props: any) => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default UserDetail;