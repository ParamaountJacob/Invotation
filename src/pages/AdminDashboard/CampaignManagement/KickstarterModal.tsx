import { useState } from 'react';
import { X, Rocket } from 'lucide-react';
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

interface KickstarterModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onSave: (campaignId: number, kickstarterUrl: string) => void;
}

const KickstarterModal = ({ campaign, onClose, onSave }: KickstarterModalProps) => {
  const [kickstarterUrl, setKickstarterUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!campaign) return null;

  const handleSave = async () => {
    try {
      setFormError(null);
      setIsSubmitting(true);
      
      // Update campaign in database
      const { error } = await supabase
        .from('campaigns')
        .update({
          status: 'kickstarter',
          kickstarter_url: kickstarterUrl || null
        })
        .eq('id', campaign.id);
      
      if (error) throw error;
      
      // Call the save handler
      onSave(campaign.id, kickstarterUrl);
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
            <h3 className="text-xl font-bold text-gray-900">Launch on Kickstarter</h3>
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
              Move "{campaign.title}" to Kickstarter status. You can optionally add a Kickstarter URL.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kickstarter URL (optional)
              </label>
              <input
                type="url"
                value={kickstarterUrl}
                onChange={(e) => setKickstarterUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="https://kickstarter.com/..."
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
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </span>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Launch on Kickstarter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KickstarterModal;