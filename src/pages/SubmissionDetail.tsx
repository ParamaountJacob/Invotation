import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Submission, SubmissionUpdate, SubmissionFile, ScoreDescription } from '../types';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, DollarSign, Target, Lightbulb, FileText, Download, Box as Box3d, Plus, MessageSquare } from 'lucide-react';

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  review: <AlertCircle className="w-5 h-5 text-blue-500" />,
  approved: <CheckCircle className="w-5 h-5 text-green-500" />,
  rejected: <XCircle className="w-5 h-5 text-red-500" />,
  development: <CheckCircle className="w-5 h-5 text-purple-500" />
};

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  review: 'bg-blue-50 text-blue-800 border-blue-200',
  approved: 'bg-green-50 text-green-800 border-green-200',
  rejected: 'bg-red-50 text-red-800 border-red-200',
  development: 'bg-purple-50 text-purple-800 border-purple-200'
};

const statusMessages = {
  pending: 'Your submission is being reviewed by our team. This typically takes 2-3 business days.',
  review: 'Our team is actively reviewing your submission and will provide feedback soon.',
  approved: 'Congratulations! Your submission has been approved. We\'ll be in touch about next steps.',
  rejected: 'Unfortunately, we cannot proceed with your submission at this time.',
  development: 'Your project is in active development!'
};

const SubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [updates, setUpdates] = useState<SubmissionUpdate[]>([]);
  const [files, setFiles] = useState<SubmissionFile[]>([]);
  const [scoreDescription, setScoreDescription] = useState<ScoreDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [id]);

  const fetchSubmissionDetails = async () => {
    try {
      const { data: submission, error: submissionError } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (submissionError) throw submissionError;
      setSubmission(submission);

      if (submission.score) {
        const { data: scoreDesc } = await supabase
          .from('score_descriptions')
          .select('*')
          .eq('score', submission.score)
          .single();
        setScoreDescription(scoreDesc);
      }

      // Fetch submission files
      const { data: files, error: filesError } = await supabase
        .from('submission_files')
        .select('*')
        .eq('submission_id', id);

      if (filesError) throw filesError;
      setFiles(files || []);

      // Fetch submission updates
      const { data: updates, error: updatesError } = await supabase
        .from('submission_updates')
        .select('*')
        .eq('submission_id', id)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;
      setUpdates(updates || []);

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('submission-files')
        .download(fileUrl);

      if (error) throw error;

      // Create blob URL and trigger download
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error downloading file:', err);
      setError('Failed to download file');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading submission details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container-custom py-12">
          <div className="text-center text-red-600">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>{error || 'Submission not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header with Status */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{submission.idea_name}</h1>
                  <p className="text-lg text-gray-600">{submission.short_description}</p>
                </div>
                <div className={`${statusColors[submission.status]} px-6 py-3 rounded-xl border flex items-center space-x-3 flex-shrink-0`}>
                  {statusIcons[submission.status]}
                  <span className="font-medium capitalize">{submission.status}</span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="p-6 border-b border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3 text-gray-600">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p>{statusMessages[submission.status]}</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-lg font-medium text-gray-700">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    <h2>Project Details</h2>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-2">Current Stage</h3>
                    <p className="text-gray-600">{submission.idea_stage}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{submission.idea_details}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-lg font-medium text-gray-700">
                    <Target className="w-6 h-6 text-primary" />
                    <h2>Financial Overview</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {submission.funding_needs && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          <h3 className="font-medium text-gray-700">Estimated Budget</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${submission.funding_needs.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {submission.retail_price && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-5 h-5 text-primary" />
                          <h3 className="font-medium text-gray-700">Target Price</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${submission.retail_price.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Files Section */}
              {files.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-3 text-lg font-medium text-gray-700 mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                    <h2>Attached Files</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file) => (
                      <div key={file.id} className="bg-gray-50 border rounded-lg p-4 hover:border-primary transition-colors">
                        <button
                          onClick={() => downloadFile(file.file_url, file.file_name)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start space-x-3">
                            {file.file_type.includes('model') || file.file_name.endsWith('.stl') ? (
                              <Box3d className="w-5 h-5 text-primary mt-1" />
                            ) : (
                              <FileText className="w-5 h-5 text-primary mt-1" />
                            )}
                            <div>
                              <p className="font-medium text-gray-700">{file.file_name}</p>
                              <p className="text-sm text-gray-500">{Math.round(file.file_size / 1024)} KB</p>
                            </div>
                            <Download className="w-5 h-5 text-gray-400 ml-auto" />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Updates Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 text-lg font-medium text-gray-700">
                    <Clock className="w-6 h-6 text-primary" />
                    <h2>Updates & Progress</h2>
                  </div>
                  
                  <button className="text-primary hover:text-primary-dark text-sm font-medium flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Contact Team
                  </button>
                </div>
                
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`w-2 h-2 rounded-full ${
                            update.status === 'approved' ? 'bg-green-500' :
                            update.status === 'rejected' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`} />
                          <p className="text-sm font-medium text-gray-600">
                            {new Date(update.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="pl-5">
                          <p className="text-gray-700">{update.comment || `Status updated to ${update.status}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No updates yet</p>
                    <p className="text-sm text-gray-400">Check back soon for progress updates</p>
                  </div>
                )}
              </div>
              
              {/* Add Update Button (for admins) */}
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-primary hover:text-primary-dark font-medium flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;