import { CheckCircle, Archive } from 'lucide-react';

interface ProjectTabsProps {
  activeTab: 'live' | 'kickstarter' | 'launched' | 'archived';
  setActiveTab: (tab: 'live' | 'kickstarter' | 'launched' | 'archived') => void;
  counts: {
    live: number;
    kickstarter: number;
    launched: number;
    archived: number;
  };
}

const ProjectTabs = ({ activeTab, setActiveTab, counts }: ProjectTabsProps) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl p-2 shadow-xl border border-gray-200 gap-1">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
            activeTab === 'live'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
              : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
          }`}
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Voting ({counts.live})</span>
        </button>
        <button
          onClick={() => setActiveTab('kickstarter')}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
            activeTab === 'kickstarter'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105'
              : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
          }`}
        >
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <span>Live Kickstarter ({counts.kickstarter})</span>
        </button>
        <button
          onClick={() => setActiveTab('launched')}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
            activeTab === 'launched'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
              : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Launched Products ({counts.launched})</span>
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-bold transition-all duration-300 text-sm ${
            activeTab === 'archived'
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg transform scale-105'
              : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Archived Ideas ({counts.archived})</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectTabs;