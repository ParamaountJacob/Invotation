import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay } from '../shared/ErrorDisplay';

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  onSuccess?: () => void;
}

const AuthModal = ({ showAuthModal, setShowAuthModal, onSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Reset form and close modal
      setEmail('');
      setPassword('');
      setShowAuthModal(false);

      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (err) {
      handleError(err, 'Failed to sign in');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      // Reset form and close modal
      setEmail('');
      setPassword('');
      setShowAuthModal(false);

      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (err) {
      handleError(err, 'Failed to create account');
    }
  };

  const handleClose = () => {
    setShowAuthModal(false);
    clearError();
    setEmail('');
    setPassword('');
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
        </div>

        {/* Error Display */}
        <ErrorDisplay error={error} onClear={clearError} />

        {/* Form */}
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 text-base font-medium transition-colors mt-6"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Sign In/Up */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:text-primary-dark text-sm transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;