import React from 'react';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

interface ProjectStatsProps {
  stats: {
    total: number;
    supporters: number;
    funded: number;
    success: number;
  };
}

const ProjectStats: React.FC<ProjectStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Supporters</p>
            <p className="text-2xl font-bold text-gray-900">{stats.supporters}</p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Funded Projects</p>
            <p className="text-2xl font-bold text-gray-900">{stats.funded}</p>
          </div>
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">{stats.success}%</p>
          </div>
          <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Award className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;