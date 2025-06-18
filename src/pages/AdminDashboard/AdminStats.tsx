import { BarChart3, TrendingUp, Users, Coins } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalSubmissions: number;
    totalCampaigns: number;
    totalSupporters: number;
    totalCoinsSpent: number;
    recentActivity: Array<{
      id: string;
      type: 'submission' | 'support' | 'user_signup';
      description: string;
      timestamp: string;
    }>;
  };
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return '📝';
      case 'support':
        return '💰';
      case 'user_signup':
        return '👤';
      default:
        return '📊';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Platform Statistics</h2>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSubmissions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCampaigns.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Coins Spent</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCoinsSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Coins className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {stats.recentActivity.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No recent activity to display.
            </div>
          ) : (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Platform Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Submissions per User</span>
              <span className="font-bold text-gray-900">
                {stats.totalUsers > 0 ? (stats.totalSubmissions / stats.totalUsers).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Support per Campaign</span>
              <span className="font-bold text-gray-900">
                {stats.totalCampaigns > 0 ? (stats.totalSupporters / stats.totalCampaigns).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Coins per User</span>
              <span className="font-bold text-gray-900">
                {stats.totalUsers > 0 ? (stats.totalCoinsSpent / stats.totalUsers).toFixed(1) : '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Growth</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Platform Value</span>
              <span className="font-bold text-green-600">
                ${(stats.totalCoinsSpent * 0.99).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Engagement Rate</span>
              <span className="font-bold text-blue-600">
                {stats.totalUsers > 0 ? ((stats.totalSupporters / stats.totalUsers) * 100).toFixed(1) : '0'}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Innovation Index</span>
              <span className="font-bold text-purple-600">
                {stats.totalSubmissions > 0 ? ((stats.totalCampaigns / stats.totalSubmissions) * 100).toFixed(1) : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;