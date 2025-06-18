import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { Settings as SettingsIcon, User, Mail, AlertCircle, Lock, Upload, X } from 'lucide-react';
import AvatarCropper from '../components/AvatarCropper';

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(profile);
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || ''
      });
      setAvatarPreview(profile.avatar_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
      
      setSelectedFile(file);
      setShowCropper(true);
    }
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    setShowCropper(false);
    setSelectedFile(null);
    
    // Convert blob to file
    const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    setAvatarFile(croppedFile);
    
    // Create preview URL
    const preview = URL.createObjectURL(croppedBlob);
    setAvatarPreview(preview);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !profile) return;
    
    setUploadingAvatar(true);
    setError(null);
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);
      
      if (updateError) throw updateError;
      
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      setAvatarFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const cancelAvatarChange = () => {
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar_url || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile?.id);

      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Profile Settings</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              Profile updated successfully!
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!profile?.is_admin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Profile Picture
                  </label>
                  
                  <div className="flex items-center space-x-6">
                    {/* Current Avatar Display */}
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
                            {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Upload Controls */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        {!avatarFile ? (
                          <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>Choose Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="sr-only"
                            />
                          </label>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={uploadAvatar}
                              disabled={uploadingAvatar}
                              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                            >
                              {uploadingAvatar ? 'Uploading...' : 'Save Photo'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelAvatarChange}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                        
                      <p className="text-sm text-gray-500 mt-2">
                        Upload a photo (JPG, PNG, GIF up to 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {profile?.is_admin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Admin Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 ring-2 ring-yellow-400 ring-offset-2 flex items-center justify-center">
                      <img
                        src="https://res.cloudinary.com/digjsdron/image/upload/v1749767827/ChatGPT_Image_Jun_12_2025_05_35_50_PM_ntiox3.png"
                        alt="Admin Badge"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Admin Badge</p>
                      <p className="text-sm text-gray-500">
                        As an admin, your avatar is set to a special admin badge and cannot be changed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={profile?.email}
                      disabled
                      className="pl-10 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              <Lock className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold">Change Password</h2>
            </div>

            {passwordError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Password updated successfully!
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Avatar Cropper Modal */}
      {showCropper && selectedFile && (
        <AvatarCropper
          imageFile={selectedFile}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default Settings;