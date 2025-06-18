import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';

interface AdminOverviewProps {
  stats: {
    totalUsers: number;
    totalSubmissions: number;
    pendingSubmissions: number;
    totalCampaigns: number;
    totalSupporters: number;
    totalCoinsSpent: number;
    unreadMessages: number;
  };
}

const AdminOverview = ({ stats }: AdminOverviewProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Supporters</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSupporters.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unreadMessages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-2">Pending Review</h4>
              <p className="text-2xl font-bold text-red-600 mb-2">{stats.pendingSubmissions}</p>
              <p className="text-sm text-red-700">submissions need attention</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Active Campaigns</h4>
              <p className="text-2xl font-bold text-blue-600 mb-2">{stats.totalCampaigns}</p>
              <p className="text-sm text-blue-700">campaigns running</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-2">Coins Spent</h4>
              <p className="text-2xl font-bold text-green-600 mb-2">{stats.totalCoinsSpent.toLocaleString()}</p>
              <p className="text-sm text-green-700">total platform activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;