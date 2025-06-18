import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface DeleteConfirmModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onConfirm: (campaignId: number) => void;
}

const DeleteConfirmModal = ({ campaign, onClose, onConfirm }: DeleteConfirmModalProps) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!campaign) return null;

  const handleDelete = async () => {
    try {
      setFormError(null);
      setIsSubmitting(true);
      
      // Delete campaign from database
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id);
      
      if (error) throw error;
      
      // Call the confirm handler
      onConfirm(campaign.id);
    } catch (error: any) {
      setFormError(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Delete Campaign</h3>
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
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
              <Trash2 className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-medium text-red-900">
                  Are you sure you want to delete this campaign?
                </p>
                <p className="text-sm text-red-700">
                  "{campaign.title}" will be permanently deleted. This action cannot be undone.
                </p>
              </div>
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
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Deleting...
                </span>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;