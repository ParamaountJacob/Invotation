import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

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
  status?: string;
  kickstarter_url?: string;
  amazon_url?: string;
  website_url?: string;
}

interface LaunchedProductModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

const LaunchedProductModal = ({ campaign, onClose, onSave }: LaunchedProductModalProps) => {
  const [amazonUrl, setAmazonUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaign) {
      setAmazonUrl(campaign.amazon_url || '');
      setWebsiteUrl(campaign.website_url || '');
    }
  }, [campaign]);

  if (!campaign) return null;

  const handleSave = async () => {
    try {
      setFormError(null);
      setIsSubmitting(true);
      
      // Update campaign in database
      const { error } = await supabase
        .from('campaigns')
        .update({
          amazon_url: amazonUrl || null,
          website_url: websiteUrl || null
        })
        .eq('id', campaign.id);
      
      if (error) throw error;
      
      // Call the save handler
      const updatedCampaign = {
        ...campaign,
        amazon_url: amazonUrl || null,
        website_url: websiteUrl || null
      };
      onSave(updatedCampaign);
      onClose();
    } catch (error: any) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Product Links</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-600">
              Add purchase links for "{campaign.title}".
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amazon URL
              </label>
              <input
                type="url"
                value={amazonUrl}
                onChange={(e) => setAmazonUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="https://amazon.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="https://example.com/..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Save Links</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchedProductModal;