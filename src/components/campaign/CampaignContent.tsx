import React, { useState } from 'react';
import FAQSection from '../FAQSection';
import CommentSection from '../CommentSection';
import { MessageSquare, FileText, HelpCircle, Info } from 'lucide-react';
import RichTextRenderer, { ContentBlock } from './RichTextRenderer'; // Import the new renderer and its types

interface CampaignContentProps {
  descriptionBlocks: ContentBlock[]; // Receive the parsed blocks
  campaign: any;
  comments: any[];
  fetchCampaignData: () => void;
  id: string;
  setShowAllOrNothingModal: (show: boolean) => void;
}

const CampaignContent: React.FC<CampaignContentProps> = ({ 
  descriptionBlocks,
  campaign, 
  comments, 
  fetchCampaignData,
  id,
  setShowAllOrNothingModal
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'comments' | 'faqs'>('about');

  // REMOVED: The old parseRichDescription and user fetching logic, as the parent handles it.

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'about'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>About this project</span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'comments'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Community Suggestions ({comments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'faqs'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            <span>FAQs</span>
          </button>
        </nav>
      </div>

      {/* Renders content based on active tab */}
      {activeTab === 'about' && (
        <section className="space-y-8">
          {/* USE THE RENDERER COMPONENT HERE */}
          <RichTextRenderer blocks={descriptionBlocks} />
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              All or Nothing Funding
            </h3>
            <p className="text-blue-800 mb-4">
              This project will only be funded if it reaches its goal by the deadline. If the project doesn't complete, your tokens will be refunded.
            </p>
            <button
              onClick={() => setShowAllOrNothingModal(true)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Learn more about all-or-nothing funding
            </button>
          </div>
        </section>
      )}

      {activeTab === 'faqs' && (
        <FAQSection campaignId={parseInt(id)} />
      )}

      {activeTab === 'comments' && (
        <section>
          <CommentSection
            campaignId={parseInt(id)} 
            // Pass necessary user props if CommentSection needs them
          />
        </section>
      )}
    </div>
  );
};

export default CampaignContent;