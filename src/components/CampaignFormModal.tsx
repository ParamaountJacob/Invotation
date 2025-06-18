import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import RichDescriptionEditor from './RichDescriptionEditor';
import FAQManager from '../pages/AdminDashboard/CampaignManagement/FAQManager';

// Form validation schema
const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  short_description: z.string().min(1, 'Short description is required'),
  description: z.string().min(1, 'Description is required'),
  reservation_goal: z.number().min(1, 'Reservation goal must be at least 1'),
  estimated_retail_price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  minimum_bid: z.number().min(1, 'Minimum bid must be at least 1'),
  days_old: z.number().min(0, 'Days must be a positive number'),
  video_url: z.string().optional(),
  kickstarter_url: z.string().optional(),
  amazon_url: z.string().optional(),
  website_url: z.string().optional()
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CampaignFormModal: React.FC<CampaignFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [richDescription, setRichDescription] = useState<string>(JSON.stringify({
    text: '',
    media: []
  }));
  const [activeTab, setActiveTab] = useState<'details' | 'faqs'>('details');
  const [campaignId, setCampaignId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, formState: { errors, isDirty }, reset, setValue, watch } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: '',
      short_description: '',
      description: '',
      reservation_goal: 100,
      estimated_retail_price: 99.99,
      category: '',
      minimum_bid: 1,
      days_old: 0,
      video_url: '',
      kickstarter_url: '',
      amazon_url: '',
      website_url: ''
    }
  });

  // Watch form values to detect changes
  const formValues = watch();

  useEffect(() => {
    setHasChanges(isDirty || imageFile !== null);
  }, [isDirty, imageFile, formValues]);
  
  // Update hasChanges when richDescription changes
  useEffect(() => {
    try {
      const defaultDescription = JSON.stringify({
        text: '',
        media: []
      });
      
      if (richDescription !== defaultDescription) {
        setHasChanges(true);
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }, [richDescription]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      reset();
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview('');
      }
      setVideoPreview(null);
      setError(null);
      setSuccess(false);
      setRichDescription(JSON.stringify({
        text: '',
        media: []
      }));
      setHasChanges(false);
      setShowConfirmDialog(false);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseAttempt();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseAttempt();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, hasChanges]);

  const handleCloseAttempt = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset the file input value to allow selecting the same file again
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }
    
    // Clean up previous preview URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setImageFile(file);
    const newPreviewUrl = URL.createObjectURL(file);
    setImagePreview(newPreviewUrl);
    setHasChanges(true);
  };

  // Reset file input to allow re-uploading the same file
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle video URL change to show preview
  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('video_url', url);
    setVideoPreview(url);
    setHasChanges(true);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) throw new Error('No image file selected');
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `campaign-${Date.now()}.${fileExt}`;
      const filePath = `campaigns/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, imageFile, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const onSubmit = async (data: CampaignFormData) => {
    if (!imageFile) {
      setError('Please select an image for the campaign');
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      // Upload image first
      const imageUrl = await uploadImage();
      
      // Create campaign in database
      const { error: insertError } = await supabase
        .from('campaigns')
        .insert({
          title: data.title,
          short_description: data.short_description,
          description: richDescription,
          image: imageUrl,
          reservation_goal: data.reservation_goal,
          estimated_retail_price: data.estimated_retail_price,
          category: data.category,
          minimum_bid: data.minimum_bid,
          days_old: data.days_old,
          video_url: data.video_url || null,
          kickstarter_url: data.kickstarter_url || null,
          amazon_url: data.amazon_url || null,
          website_url: data.website_url || null
        })
        .select('id')
        .single();
      
      if (insertError) throw insertError;
      
      // Store the campaign ID for FAQs tab
      if (insertError?.data?.id) {
        setCampaignId(insertError.data.id);
      }
      
      // Show success message
      setSuccess(true);
      setHasChanges(false);
      
      // Reset form
      reset();
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(null);
      setImagePreview('');
      setVideoPreview(null);
      resetFileInput();
      
      // Notify parent component
      onSuccess();
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating campaign:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview('');
    resetFileInput();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Discard changes?</h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to close this form and discard your changes?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  onClose();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div 
        ref={modalRef}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Campaign</h2>
          <button
            onClick={handleCloseAttempt}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation - Only show if we have a campaign ID (after initial save) */}
        {campaignId && (
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Campaign Details
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faqs'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                FAQs
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <Check className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>Campaign created successfully!</p>
          </div>
        )}
        
        {activeTab === 'details' && (
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campaign Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Image <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Campaign preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image selected
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max 5MB)</p>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                {imageFile && (
                  <div className="mt-3 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {imageFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              A brief summary (150 characters max) that will appear on campaign cards
            </p>
            <textarea
              {...register('short_description')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Brief, attention-grabbing summary of your campaign..."
              rows={2}
              maxLength={150}
            ></textarea>
            {errors.short_description && (
              <p className="mt-1 text-sm text-red-600">{errors.short_description.message}</p>
            )}
          </div>
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., SmartMug Pro"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Select Category</option>
                <option value="tech">Tech</option>
                <option value="home">Home</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Rich Description Editor */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <RichDescriptionEditor
              value={richDescription}
              onChange={(value) => {
                setRichDescription(value);
                // Set a dummy value in the form to satisfy validation
                setValue('description', 'placeholder');
              }}
              placeholder="Describe the product in detail..."
              rows={6}
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reservation Goal <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('reservation_goal', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., 100"
              />
              {errors.reservation_goal && (
                <p className="mt-1 text-sm text-red-600">{errors.reservation_goal.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Retail Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('estimated_retail_price', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., 99.99"
              />
              {errors.estimated_retail_price && (
                <p className="mt-1 text-sm text-red-600">{errors.estimated_retail_price.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Bid <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('minimum_bid', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., 1"
              />
              {errors.minimum_bid && (
                <p className="mt-1 text-sm text-red-600">{errors.minimum_bid.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days Active
            </label>
            <input
              type="number"
              {...register('days_old', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., 0"
            />
            {errors.days_old && (
              <p className="mt-1 text-sm text-red-600">{errors.days_old.message}</p>
            )}
          </div>
          
          {/* Media and Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="url"
                {...register('video_url')}
                onChange={handleVideoUrlChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500">
                Enter a YouTube, Vimeo, or direct MP4 video URL
              </p>
              
              {/* Video Preview */}
              {videoPreview && (
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                  <div className={`${
                    videoPreview.includes('youtube.com') || videoPreview.includes('youtu.be') || videoPreview.includes('vimeo.com')
                      ? 'aspect-video'
                      : 'aspect-auto max-h-[200px]'
                  }`}>
                    {videoPreview.includes('youtube.com') || videoPreview.includes('youtu.be') ? (
                      <iframe
                        src={videoPreview.replace('watch?v=', 'embed/')}
                        title="Video preview"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : videoPreview.includes('vimeo.com') ? (
                      <iframe
                        src={videoPreview.replace('vimeo.com', 'player.vimeo.com/video')}
                        title="Video preview"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : videoPreview.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full"
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
                        <p className="text-gray-500 text-sm">Video preview not available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kickstarter URL (Optional)
              </label>
              <input
                type="url"
                {...register('kickstarter_url')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., https://www.kickstarter.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amazon URL (Optional)
              </label>
              <input
                type="url"
                {...register('amazon_url')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., https://www.amazon.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL (Optional)
              </label>
              <input
                type="url"
                {...register('website_url')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., https://www.example.com"
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Creating...
                </span>
              ) : (
                'Create Campaign'
              )}
            </button>
          </div>
        </form>
        )}
        
        {/* FAQs Tab - Only show if we have a campaign ID */}
        {activeTab === 'faqs' && campaignId && (
          <FAQManager campaignId={campaignId} />
        )}
      </div>
    </div>
  );
};

export default CampaignFormModal;