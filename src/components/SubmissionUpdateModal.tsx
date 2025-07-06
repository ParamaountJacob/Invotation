import { useState, useEffect } from 'react';
import { X, MessageSquare, AlertCircle, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Submission, SubmissionUpdate, Profile } from '../types';
import { StatusBadge } from './shared/StatusBadge';

interface SubmissionUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: Submission & { profile: Profile };
    onUpdateComplete: () => void;
}

const SubmissionUpdateModal = ({ isOpen, onClose, submission, onUpdateComplete }: SubmissionUpdateModalProps) => {
    const [updates, setUpdates] = useState<SubmissionUpdate[]>([]);
    const [newStatus, setNewStatus] = useState(submission.status);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchUpdates();
        }
    }, [isOpen, submission.id]);

    const fetchUpdates = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('submission_updates')
                .select(`
          *,
          profile:profiles!created_by(full_name, email)
        `)
                .eq('submission_id', submission.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUpdates(data || []);
        } catch (err: any) {
            setError('Failed to load submission updates');
            console.error('Error fetching updates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitUpdate = async () => {
        if (!comment.trim() && newStatus === submission.status) {
            setError('Please provide a comment or change the status');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Update submission status if changed
            if (newStatus !== submission.status) {
                const { error: updateError } = await supabase
                    .from('submissions')
                    .update({ status: newStatus })
                    .eq('id', submission.id);

                if (updateError) throw updateError;
            }

            // Create submission update record
            const { error: insertError } = await supabase
                .from('submission_updates')
                .insert({
                    submission_id: submission.id,
                    status: newStatus,
                    comment: comment.trim() || null,
                    created_by: user.id
                });

            if (insertError) throw insertError;

            // Reset form
            setComment('');
            setNewStatus(newStatus);

            // Refresh data
            await fetchUpdates();
            onUpdateComplete();

        } catch (err: any) {
            setError(err.message);
            console.error('Error creating update:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'review':
                return <AlertCircle className="w-4 h-4 text-blue-500" />;
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'development':
                return <Settings className="w-4 h-4 text-purple-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Submission Updates</h2>
                            <h3 className="text-lg opacity-90">{submission.idea_name}</h3>
                            <p className="text-sm opacity-75 mt-1">
                                By {submission.profile.full_name || 'Anonymous'} ({submission.profile.email})
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
                    {/* Update History */}
                    <div className="lg:w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
                        <h4 className="text-lg font-semibold mb-4 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Update History
                        </h4>

                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading updates...</p>
                            </div>
                        ) : updates.length > 0 ? (
                            <div className="space-y-4">
                                {updates.map((update) => (
                                    <div key={update.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(update.status)}
                                                <StatusBadge status={update.status} size="sm" />
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(update.created_at)}
                                            </span>
                                        </div>

                                        {update.comment && (
                                            <p className="text-gray-700 mb-2">{update.comment}</p>
                                        )}

                                        <div className="text-xs text-gray-500">
                                            Updated by {update.profile?.full_name || 'Admin'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No updates yet</p>
                                <p className="text-sm">Create the first update for this submission</p>
                            </div>
                        )}
                    </div>

                    {/* Create New Update */}
                    <div className="lg:w-1/2 p-6 overflow-y-auto">
                        <h4 className="text-lg font-semibold mb-4">Create Update</h4>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Current Status */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Status
                                </label>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(submission.status)}
                                    <StatusBadge status={submission.status} size="sm" />
                                </div>
                            </div>

                            {/* New Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="review">In Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="development">In Development</option>
                                </select>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Message
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Provide details about this update..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    This message will be visible to the submission owner
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    onClick={handleSubmitUpdate}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Creating Update...' : 'Create Update'}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionUpdateModal;
