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
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" />
              Invotation Development Process
            </h3>
            <p className="text-gray-700 mb-4">
              This is stage one of our development process. Your support helps us take this idea from concept to physical prototype. Once we reach our goal, we'll move to crowdfunding to launch the full product.
            </p>
            <div className="space-y-4 mt-6">
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Idea Validation</h4>
                  <p className="text-gray-600 text-sm">We're currently here. Your support validates market interest and helps fund initial development.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Prototype Development</h4>
                  <p className="text-gray-600 text-sm">Once funded, we'll create physical prototypes and refine the design based on community feedback.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Crowdfunding Launch</h4>
                  <p className="text-gray-600 text-sm">The refined product will launch on Kickstarter, where you'll receive your promised discount.</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Our estimated retail price of ${campaign.estimatedRetailPrice} is based on current projections. The final cost may vary based on manufacturing requirements and market conditions.
                </p>
              </div>
            </div>
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