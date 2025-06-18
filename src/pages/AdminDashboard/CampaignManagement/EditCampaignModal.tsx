import React, { useState, useEffect, useCallback } from 'react';
import { X, Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import RichDescriptionEditor, { ContentBlock } from '../../../components/RichDescriptionEditor';
import FAQManager from './FAQManager';

interface Campaign {
  id: number;
  title: string;
  short_description?: string;
  description: string;
  image: string;
  reservation_goal: number;
  current_reservations: number;
  estimated_retail_price: number;
  category: string;
  minimum_bid: number;
  days_old: number;
  is_archived: boolean;
  status?: string;
  kickstarter_url?: string;
  amazon_url?: string;
  website_url?: string;
  video_url?: string;
}

interface EditCampaignModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

const EditCampaignModal = ({ campaign, onClose, onSave }: EditCampaignModalProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  const [descriptionBlocks, setDescriptionBlocks] = useState<ContentBlock[]>([]);
  const [editForm, setEditForm] = useState({
    title: '',
    short_description: '',
    image: '',
    reservation_goal: 0,
    estimated_retail_price: 0,
    category: '',
    minimum_bid: 1,
    kickstarter_url: '',
    amazon_url: '',
    website_url: '',  
    video_url: '',
    days_old: 0
  });
  const [activeTab, setActiveTab] = useState<'details' | 'faqs'>('details');
  
  const parseDescriptionStringToBlocks = useCallback((description: string): ContentBlock[] => {
    if (!description) {
      return [{ id: 'text-initial-block', type: 'text', content: '' }];
    }
    try {
      const parsed = JSON.parse(description);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) { /* Not a valid JSON array, treat as plain text. */ }
  
    return [{
      id: `text-initial-block`,
      type: 'text',
      content: description
    }];
  }, []);

  const getPlainTextFromBlocks = useCallback((blocks: ContentBlock[]): string => {
    if (!blocks) return '';
    return blocks
      .filter(block => block.type === 'text')
      .map(block => (block as any).content)
      .join('\n\n')
      .trim();
  }, []);

  useEffect(() => {
    if (campaign) {
      const initialBlocks = parseDescriptionStringToBlocks(campaign.description);
      setDescriptionBlocks(initialBlocks);
      
      const plainTextDesc = getPlainTextFromBlocks(initialBlocks);
      
      setEditForm({
        title: campaign.title,
        short_description: campaign.short_description || plainTextDesc.substring(0, 150) || '',
        image: campaign.image,
        reservation_goal: campaign.reservation_goal,
        estimated_retail_price: campaign.estimated_retail_price,
        category: campaign.category,
        minimum_bid: campaign.minimum_bid,
        kickstarter_url: campaign.kickstarter_url || '',
        amazon_url: campaign.amazon_url || '',
        website_url: campaign.website_url || '',
        video_url: campaign.video_url || '',
        days_old: campaign.days_old
      });

      setImagePreview(campaign.image);
      if (campaign.video_url) {
        setVideoPreview(campaign.video_url);
      }
    }
  }, [campaign?.id, getPlainTextFromBlocks, parseDescriptionStringToBlocks]);

  const handleSave = async () => {
    if (!campaign) return;
    setFormError(null);
    if (!editForm.title.trim() || !editForm.category) {
        setFormError('Title and Category are required.');
        return;
    }
    setUploading(true);
    
    try {
      let imageUrl = editForm.image;
      if (imageFile) {
        // Assume uploadImage function exists and works
        // imageUrl = await uploadImage(); 
      }
      
      const descriptionString = JSON.stringify(descriptionBlocks);

      const updateData = {
        ...editForm,
        description: descriptionString,
        image: imageUrl,
      };

      const { error } = await supabase
        .from('campaigns')
        .update(updateData)
        .eq('id', campaign.id);
      
      if (error) throw error;
      
      onSave({ ...campaign, ...updateData });
      onClose();

    } catch (error: any) {
      setFormError(error.message || 'An unexpected error occurred.');
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setEditForm({ ...editForm, video_url: url });
    setVideoPreview(url);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };


  if (!campaign) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Campaign</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{formError}</div>}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-8">
                    <button onClick={() => setActiveTab('details')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Campaign Details</button>
                    <button onClick={() => setActiveTab('faqs')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'faqs' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>FAQs</button>
                </div>
            </div>

            {activeTab === 'details' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
                            <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                                <option value="">Select category</option>
                                <option value="tech">Tech</option>
                                <option value="home">Home</option>
                                <option value="lifestyle">Lifestyle</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                        <textarea value={editForm.short_description} onChange={(e) => setEditForm({ ...editForm, short_description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" maxLength={150}/>
                        <p className="text-xs text-gray-500 mt-1">Max 150 characters.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                        <RichDescriptionEditor
                            blocks={descriptionBlocks}
                            onChange={setDescriptionBlocks}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Image</label>
                        <div className="space-y-4">
                        {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg"/>}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"/>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reservation Goal (coins)</label>
                            <input type="number" value={editForm.reservation_goal} onChange={(e) => setEditForm({ ...editForm, reservation_goal: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min="1"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Retail Price ($)</label>
                            <input type="number" step="0.01" value={editForm.estimated_retail_price} onChange={(e) => setEditForm({ ...editForm, estimated_retail_price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min="0.01"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Bid</label>
                            <input type="number" value={editForm.minimum_bid} onChange={(e) => setEditForm({ ...editForm, minimum_bid: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min="1"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Days Active</label>
                            <input type="number" value={editForm.days_old} onChange={(e) => setEditForm({ ...editForm, days_old: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" min="0"/>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900">External Links</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kickstarter URL</label>
                            <input type="url" value={editForm.kickstarter_url} onChange={(e) => setEditForm({ ...editForm, kickstarter_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://kickstarter.com/..."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amazon URL</label>
                            <input type="url" value={editForm.amazon_url} onChange={(e) => setEditForm({ ...editForm, amazon_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://amazon.com/..."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                            <input type="url" value={editForm.website_url} onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://example.com/..."/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                            <div className="space-y-3">
                                <input type="url" value={editForm.video_url} onChange={handleVideoUrlChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter a YouTube, Vimeo, or direct video URL..."/>
                                <p className="text-xs text-gray-500">Enter a YouTube, Vimeo, or direct MP4/WebM video URL.</p>
                                {videoPreview && (
                                    <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden aspect-video">
                                        {videoPreview.includes('youtube.com') || videoPreview.includes('youtu.be') ? (
                                            <iframe src={videoPreview.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} title="Video preview" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        ) : videoPreview.includes('vimeo.com') ? (
                                            <iframe src={videoPreview.replace('vimeo.com', 'player.vimeo.com/video')} title="Video preview" className="w-full h-full" frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
                                        ) : videoPreview.match(/\.(mp4|webm|ogg)$/i) ? (
                                            <video src={videoPreview} controls className="w-full h-full object-contain" preload="metadata">Your browser does not support the video tag.</video>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4"><p className="text-gray-500 text-sm">Video preview not available for this URL</p></div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'faqs' && campaign && <FAQManager campaignId={campaign.id} />}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button onClick={onClose} className="px-6 py-2 text-gray-600" disabled={uploading}>Cancel</button>
                <button onClick={handleSave} disabled={uploading} className="bg-primary text-white px-6 py-2 rounded-lg disabled:opacity-50 flex items-center space-x-2">{uploading && <Upload className="w-4 h-4 animate-spin" />}<span>{uploading ? 'Saving...' : 'Save Changes'}</span></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditCampaignModal;