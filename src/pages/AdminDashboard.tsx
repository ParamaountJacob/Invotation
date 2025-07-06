import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Submission, Profile, Message } from '../types';
import { useCoin } from '../context/CoinContext';
import { useErrorHandler } from '../hooks/useErrorHandler';
import {
  AdminOverview,
  UserManagement,
  SubmissionReview,
  CampaignManagement,
  AdminMessaging,
  AdminStats
} from './AdminDashboard/index';
import CampaignFormModal from '../components/CampaignFormModal';

type TabType = 'overview' | 'users' | 'submissions' | 'campaigns' | 'messages' | 'stats';

interface Campaign {
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
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<Profile[]>([]);
  const [submissions, setSubmissions] = useState<(Submission & { profile: Profile })[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [messages, setMessages] = useState<(Message & { fromProfile: Profile; toProfile: Profile })[]>([]);
  const { refreshCoins } = useCoin();
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalCampaigns: 0,
    totalSupporters: 0,
    totalCoinsSpent: 0,
    unreadMessages: 0,
    recentActivity: [] as Array<{
      id: string;
      type: 'submission' | 'support' | 'user_signup';
      description: string;
      timestamp: string;
    }>
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/submissions');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        navigate('/treasure-hoard');
        return;
      }

      // Refresh coins to ensure admin has latest data
      await refreshCoins();
      await fetchAllData();
    } catch (err) {
      handleError(err, 'Failed to initialize admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [usersData, submissionsData, campaignsData, messagesData, supportersData] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('submissions').select(`
          *,
          profile:profiles!user_id(*)
        `).order('created_at', { ascending: false }),
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select(`
          *,
          fromProfile:profiles!from_user_id(*),
          toProfile:profiles!to_user_id(*)
        `).order('created_at', { ascending: false }),
        supabase.from('campaign_supporters').select('*')
      ]);

      if (usersData.error) throw usersData.error;
      if (submissionsData.error) throw submissionsData.error;
      if (campaignsData.error) throw campaignsData.error;
      if (messagesData.error) throw messagesData.error;
      if (supportersData.error) throw supportersData.error;

      setUsers(usersData.data || []);
      setSubmissions(submissionsData.data || []);
      setCampaigns(campaignsData.data || []);
      setMessages(messagesData.data || []);

      // Calculate stats
      const totalCoinsSpent = supportersData.data?.reduce((sum, supporter) => sum + supporter.coins_spent, 0) || 0;
      const pendingSubmissions = submissionsData.data?.filter(s => s.status === 'pending').length || 0;
      const unreadMessages = messagesData.data?.filter(m => !m.read).length || 0;

      setStats({
        totalUsers: usersData.data?.length || 0,
        totalSubmissions: submissionsData.data?.length || 0,
        pendingSubmissions,
        totalCampaigns: campaignsData.data?.length || 0,
        totalSupporters: supportersData.data?.length || 0,
        totalCoinsSpent,
        unreadMessages,
        recentActivity: [] // Would be populated with real activity data
      });

    } catch (err) {
      handleError(err, 'Failed to load admin data');
    }
  };

  const handleStatusUpdate = async (submissionId: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase.from('submission_updates').insert({
        submission_id: submissionId,
        status,
        created_by: user.id
      });

      await fetchAllData();
    } catch (err) {
      handleError(err, 'Failed to update submission status');
    }
  };

  const handleSendMessage = async (toUserId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('messages').insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        content
      });

      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUserClick = (user: Profile) => {
    navigate(`/admin/user/${user.id}`);
  };

  const handleSubmissionClick = (submission: Submission & { profile: Profile }) => {
    navigate(`/submission/${submission.id}`);
  };

  const handleCampaignEdit = (campaign: Campaign) => {
    // This will be handled by the CampaignManagement component
    // The component will call fetchAllData after successful edit
    fetchAllData();
  };

  const handleCampaignView = (campaignId: number) => {
    navigate(`/campaign/${campaignId}`);
  };

  const handleCampaignArchive = async (campaignId: number) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ is_archived: true })
        .eq('id', campaignId);

      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCampaignDelete = async (campaignId: number) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCampaignCreate = () => {
    setShowCampaignModal(true);
  };

  const handleCampaignStatusChange = async (campaignId: number, status: string) => {
    try {
      const updates: any = {};

      if (status === 'archived') {
        updates.is_archived = true;
      } else if (status === 'live') {
        updates.is_archived = false;
        updates.status = 'live';
      } else if (status === 'kickstarter') {
        updates.is_archived = false;
        updates.status = 'kickstarter';
      }

      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId);

      if (error) throw error;
      await fetchAllData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error.isVisible && error.message) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12">
          <div className="text-center text-red-600">
            <p>Error loading dashboard: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'messages', label: 'Messages' },
    { id: 'stats', label: 'Statistics' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, submissions, campaigns, and platform operations</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === 'overview' && <AdminOverview stats={stats} />}
            {activeTab === 'users' && <UserManagement users={users} onUserClick={handleUserClick} />}
            {activeTab === 'submissions' && (
              <SubmissionReview
                submissions={submissions}
                onSubmissionClick={handleSubmissionClick}
                onStatusUpdate={handleStatusUpdate}
                onRefreshData={fetchAllData}
              />
            )}
            {activeTab === 'campaigns' && (
              <CampaignManagement
                campaigns={campaigns}
                onCampaignEdit={handleCampaignEdit}
                onCampaignView={handleCampaignView}
                onCampaignArchive={handleCampaignArchive}
                onCampaignCreate={handleCampaignCreate}
                onCampaignDelete={handleCampaignDelete}
                onCampaignStatusChange={handleCampaignStatusChange}
              />
            )}
            {activeTab === 'messages' && (
              <AdminMessaging
                messages={messages}
                onSendMessage={handleSendMessage}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
            {activeTab === 'stats' && <AdminStats stats={stats} />}
          </div>
        </div>
      </div>

      {/* Campaign Creation Modal */}
      <CampaignFormModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        onSuccess={fetchAllData}
      />
    </div>
  );
};

export default AdminDashboard;