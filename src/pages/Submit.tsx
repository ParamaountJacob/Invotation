import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { Upload, AlertCircle, X, Check, Box as Box3d, Lightbulb, Pencil, Plus, Image } from 'lucide-react';
import ModelViewer from '../components/ModelViewer';
import SubmissionTipsModal from '../components/SubmissionTipsModal';
import AuthModal from '../components/Header/AuthModal';

// Simple schema for the submission form
const submissionSchema = z.object({
  idea_name: z.string().min(1, 'Please give your idea a name'),
  short_description: z.string().min(1, 'Please provide a brief description'),
  idea_stage: z.string().min(1, 'Please select your idea stage'),
  idea_details: z.string().min(1, 'Please tell us more about your idea'),
  funding_needs: z.preprocess(
    (val) => (val === '' || val === null ? undefined : Number(val)),
    z.number().min(0).optional().nullable()
  ),
  retail_price: z.preprocess(
    (val) => (val === '' || val === null ? undefined : Number(val)),
    z.number().min(0).optional().nullable()
  ),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms to submit your idea'
  })
});

const Submit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modelFiles, setModelFiles] = useState<{ file: File; id: string }[]>([]);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [pendingSubmissionData, setPendingSubmissionData] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      idea_name: '',
      short_description: '',
      idea_stage: '',
      idea_details: '',
      funding_needs: null,
      retail_price: null,
      terms_accepted: false
    }
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      // If user just authenticated and we have pending submission data, retry submission
      if (newUser && pendingSubmissionData) {
        handleActualSubmission(pendingSubmissionData);
        setPendingSubmissionData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [pendingSubmissionData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        id: crypto.randomUUID()
      }));
      setModelFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeModel = (id: string) => {
    setModelFiles(prev => prev.filter(model => model.id !== id));
  };

  const onSubmit = async (data: any) => {
    if (!user) {
      // Store the form data for later submission after auth
      setPendingSubmissionData(data);
      setShowAuthModal(true);
      return;
    }

    // User is authenticated, proceed with submission
    await handleActualSubmission(data);
  };

  const handleActualSubmission = async (data: any) => {
    if (!user) {
      setError('Authentication required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Insert submission into database
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .insert([{
          user_id: user.id,
          idea_name: data.idea_name,
          short_description: data.short_description,
          idea_stage: data.idea_stage,
          idea_details: data.idea_details,
          funding_needs: data.funding_needs,
          retail_price: data.retail_price,
          terms_accepted: data.terms_accepted
        }])
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Upload files if any
      const uploadPromises = [];

      // Upload images
      for (const { file } of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${submission.id}/${fileName}`;

        uploadPromises.push(
          supabase.storage
            .from('submission-files')
            .upload(filePath, file)
            .then(async ({ error: uploadError }) => {
              if (uploadError) throw uploadError;

              await supabase.from('submission_files').insert({
                submission_id: submission.id,
                file_name: file.name,
                file_type: file.type,
                file_size: file.size,
                file_url: filePath
              });
            })
        );
      }

      // Upload 3D models
      for (const { file } of modelFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${submission.id}/${fileName}`;

        uploadPromises.push(
          supabase.storage
            .from('submission-files')
            .upload(filePath, file)
            .then(async ({ error: uploadError }) => {
              if (uploadError) throw uploadError;

              await supabase.from('submission_files').insert({
                submission_id: submission.id,
                file_name: file.name,
                file_type: file.type,
                file_size: file.size,
                file_url: filePath
              });
            })
        );
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      // Show success message
      setSuccess(true);

      // Reset form and clear pending data
      reset();
      setImageFiles([]);
      setModelFiles([]);
      setPendingSubmissionData(null);

      // Redirect after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Jot Down Your Idea</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share your concept with us - no matter how simple or rough. We'll handle all the development work!
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Idea Submitted Successfully!</h2>
              <p className="text-green-700 mb-4">
                Thanks for sharing your idea with us. We'll review it and get back to you soon.
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-green-600">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {!success && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Auth Banner */}
              {!user && (
                <div className="bg-primary/10 p-4 border-b border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary font-medium">
                        Sign in to save and track your submissions
                      </p>
                      {pendingSubmissionData && (
                        <p className="text-sm text-gray-600 mt-1">
                          Your form data is saved and will be submitted after sign in
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                </div>
              )}

              <div className="p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Idea Name */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                      <span className="text-2xl mr-2">💡</span>
                      What should we call your idea?
                    </label>
                    <input
                      type="text"
                      {...register('idea_name')}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., SmartMug Pro"
                    />
                    {errors.idea_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.idea_name.message as string}</p>
                    )}
                  </div>

                  {/* Quick Pitch */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                      <span className="text-2xl mr-2">🎯</span>
                      Quick Pitch
                    </label>
                    <input
                      type="text"
                      {...register('short_description')}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Coffee mug that connects to your phone and keeps coffee at perfect temperature"
                    />
                    {errors.short_description && (
                      <p className="mt-1 text-sm text-red-600">{errors.short_description.message as string}</p>
                    )}
                  </div>

                  {/* Idea Stage */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                      <span className="text-2xl mr-2">📋</span>
                      Where are you in your journey?
                    </label>
                    <select
                      {...register('idea_stage')}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select your stage</option>
                      <option value="Just thought of it!">Just thought of it - It's fresh in my mind!</option>
                      <option value="Been thinking about it">Been thinking about it - I've done some research</option>
                      <option value="Working on it">Working on it - I have sketches/prototypes</option>
                    </select>
                    {errors.idea_stage && (
                      <p className="mt-1 text-sm text-red-600">{errors.idea_stage.message as string}</p>
                    )}
                  </div>

                  {/* Idea Details */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                      <span className="text-2xl mr-2">📝</span>
                      Tell us more about your idea
                    </label>
                    <textarea
                      {...register('idea_details')}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="What inspired you? How would it work? Who would use it? What makes it special?"
                      rows={4}
                    ></textarea>
                    {errors.idea_details && (
                      <p className="mt-1 text-sm text-red-600">{errors.idea_details.message as string}</p>
                    )}
                  </div>

                  {/* Price and Budget - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Retail Price */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                        <span className="text-2xl mr-2">💰</span>
                        Estimated Retail Price (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                        <input
                          type="text"
                          pattern="\d*\.?\d*"
                          {...register('retail_price')}
                          className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., 89"
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2 flex items-center">
                        <span className="text-2xl mr-2">💵</span>
                        Budget Estimate (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                        <input
                          type="text"
                          pattern="\d*\.?\d*"
                          {...register('funding_needs')}
                          className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., 15000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Uploads */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <span className="text-2xl mr-2">✏️</span>
                      Sketches or Images (Optional)
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {/* Existing Images */}
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={file.preview}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Add Image Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-primary transition-colors"
                      >
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Add Image</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                      Upload sketches, diagrams, or any images that help explain your idea. Don't worry if you don't have any - a simple description is enough!
                    </p>
                  </div>

                  {/* 3D Model Uploads */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <span className="text-2xl mr-2">🧩</span>
                      3D Models (Optional)
                    </label>

                    <div className="space-y-4">
                      {/* Existing Models */}
                      {modelFiles.map((model) => (
                        <div key={model.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-between items-center">
                          <div className="flex items-center">
                            <Box3d className="w-6 h-6 text-primary mr-3" />
                            <div>
                              <p className="font-medium text-gray-800">{model.file.name}</p>
                              <p className="text-sm text-gray-500">{(model.file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeModel(model.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}

                      {/* Add Model Button */}
                      <button
                        type="button"
                        onClick={() => modelInputRef.current?.click()}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary transition-colors"
                      >
                        <Box3d className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-600 font-medium">Add 3D Model</span>
                        <span className="text-sm text-gray-500 mt-1">GLB, GLTF, STL, or STP files</span>
                        <input
                          ref={modelInputRef}
                          type="file"
                          accept=".glb,.gltf,.stl,.stp"
                          onChange={handleModelUpload}
                          className="hidden"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Terms Acceptance */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms_accepted"
                        {...register('terms_accepted')}
                        className="mt-1.5"
                      />
                      <label htmlFor="terms_accepted" className="text-gray-700">
                        I understand that if Invotation selects my idea, we'll partner together with me receiving
                        ongoing profit share (typically 10-20%) from all sales. If not selected, I keep all rights.
                        This is my original idea and I have the right to submit it.
                      </label>
                    </div>
                    {errors.terms_accepted && (
                      <p className="mt-2 text-sm text-red-600">{errors.terms_accepted.message as string}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-xl hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-6 h-6 mr-2" />
                        Submit Your Idea
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't worry about perfection - we're here to help develop your idea!
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setShowTipsModal(true)}
                className="text-primary hover:text-primary-dark flex items-center"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Submission Tips
              </button>
              <a href="/how-it-works" className="text-primary hover:text-primary-dark flex items-center">
                <Lightbulb className="w-4 h-4 mr-1" />
                How It Works
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Tips Modal */}
      <SubmissionTipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        onSuccess={() => {
          // Re-submit form after successful authentication
          if (pendingSubmissionData) {
            onSubmit(pendingSubmissionData);
            setPendingSubmissionData(null);
          }
        }}
      />
    </div>
  );
};

export default Submit;