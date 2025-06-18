import { Play, CheckCircle, Rocket, ExternalLink, Archive } from 'lucide-react';

interface CampaignTabsProps {
  activeTab: 'live' | 'goal_reached' | 'kickstarter' | 'launched' | 'archived';
  setActiveTab: (tab: 'live' | 'goal_reached' | 'kickstarter' | 'launched' | 'archived') => void;
  tabCounts: {
    live: number;
    goal_reached: number;
    kickstarter: number;
    launched: number;
    archived: number;
  };
}

const CampaignTabs = ({ activeTab, setActiveTab, tabCounts }: CampaignTabsProps) => {
  const tabs = [
    { key: 'live', label: 'Live Campaigns', icon: Play },
    { key: 'goal_reached', label: 'Goal Reached', icon: CheckCircle },
    { key: 'kickstarter', label: 'Kickstarter Launched', icon: Rocket },
    { key: 'launched', label: 'Launched Products', icon: ExternalLink },
    { key: 'archived', label: 'Archived', icon: Archive }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = tabCounts[tab.key as keyof typeof tabCounts];
          
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === tab.key 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default CampaignTabs;