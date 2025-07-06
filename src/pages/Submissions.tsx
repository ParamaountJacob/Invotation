import { useNavigate } from 'react-router-dom';
import { LogIn, X, CheckCircle, XCircle, Clock, AlertCircle, Lightbulb, FileText, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { Submission, Profile } from '../types';
import SubmissionTipsModal from '../components/SubmissionTipsModal';
import { StatusBadge } from '../components/shared/StatusBadge';

const Submissions = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submissions, setSubmissions] = useState<(Submission & { profile: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTipsModal, setShowTipsModal] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const fetchSubmissions = async () => {
    try {
      const { data, error: submissionsError } = await supabase
        .from('submissions')
        .select(`
          *,
          profile:profiles!user_id(*)
        `)
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;
      setSubmissions(data || []);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (submissionId: string, status: string) => {
    try {
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase.from('submission_updates').insert({
        submission_id: submissionId,
        status,
        created_by: user.id
      });

      fetchSubmissions();
    } catch (err: any) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">All Submissions</h1>
          </div>

          <div className="space-y-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{submission.idea_name}</h2>
                    <p className="text-gray-600 mt-1">{submission.short_description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Submitted by: {submission.profile.full_name || 'Unknown'} ({submission.profile.email})
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={submission.status} />
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => updateStatus(submission.id, 'approved')}
                    className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-md border border-green-200"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} />
                      <span>Approve</span>
                    </div>
                  </button>
                  <button
                    onClick={() => updateStatus(submission.id, 'rejected')}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                  >
                    <div className="flex items-center space-x-2">
                      <XCircle size={16} />
                      <span>Reject</span>
                    </div>
                  </button>
                  <button
                    onClick={() => navigate(`/submission/${submission.id}`)}
                    className="px-4 py-2 text-primary hover:bg-primary/5 rounded-md border border-primary"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Your Ideas</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your submitted ideas and stay updated on their progress. Sign in to view your submissions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-8 text-center">
              <div className="mb-8">
                <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-3">Your Ideas Dashboard</h2>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Sign in to track your submissions, receive updates, and communicate with our team about your ideas.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary text-lg px-8 py-3"
                >
                  Sign In
                </button>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold mb-4">What happens after you submit?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-primary mr-2" />
                      <span className="font-medium">Review</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Our team reviews your idea within 2-3 business days
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium">Feedback</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      We provide feedback and discuss next steps
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="font-medium">Development</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      If selected, we develop your idea at no cost to you
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTipsModal(true)}
                  className="text-primary hover:text-primary-dark mt-4 inline-block"
                >
                  View Submission Tips
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">Ready to share your brilliant idea?</p>
            <a
              href="/submit"
              className="inline-flex items-center bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors border-2 border-primary shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Your First Idea
            </a>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3 text-lg"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-primary-dark text-sm"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Submission Tips Modal */}
      <SubmissionTipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />
    </div>
  );
};

export default Submissions;