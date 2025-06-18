import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  addComment, 
  fetchCommentsForCampaign, 
  addCommentReaction,
  removeCommentReaction,
  getUserReactionToComment,
  hasUserSupportedCampaign
} from '../lib/comments';
import { CampaignComment } from '../types';
import { ThumbsUp, ThumbsDown, MessageSquare, CornerDownRight, Trash2, Edit, X, AlertCircle, HelpCircle } from 'lucide-react';

interface CommentSectionProps {
  campaignId: number;
  currentUser: any;
  userSupport: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({ campaignId, currentUser, userSupport }) => {
  const [comments, setComments] = useState<CampaignComment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [userReactions, setUserReactions] = useState<Record<string, 'agree' | 'disagree' | null>>({});
  const [hasSupported, setHasSupported] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadComments();
      checkUserSupport();
    }
  }, [campaignId, currentUser]);

  const checkUserSupport = async () => {
    if (!currentUser) {
      setHasSupported(false);
      return;
    }
    
    const supported = await hasUserSupportedCampaign(currentUser.id, campaignId);
    setHasSupported(supported);
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const { comments, totalCount, error } = await fetchCommentsForCampaign(campaignId);
      
      if (error) throw new Error(error);
      
      setComments(comments);
      setTotalComments(totalCount);
      
      // Load user reactions if user is logged in
      if (currentUser) {
        const reactions: Record<string, 'agree' | 'disagree' | null> = {};
        
        await Promise.all(comments.map(async (comment) => {
          const { reactionType } = await getUserReactionToComment(comment.id, currentUser.id);
          reactions[comment.id] = reactionType || null;
        }));
        
        setUserReactions(reactions);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be signed in to comment');
      return;
    }
    
    if (!hasSupported) {
      setError('You must support this campaign before commenting');
      return;
    }
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const { success, error } = await addComment(
        campaignId,
        currentUser.id,
        newComment.trim()
      );
      
      if (!success) throw new Error(error);
      
      setNewComment('');
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!currentUser) {
      setError('You must be signed in to reply');
      return;
    }
    
    if (!hasSupported) {
      setError('You must support this campaign before replying');
      return;
    }
    
    if (!replyContent.trim()) {
      setError('Reply cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const { success, error } = await addComment(
        campaignId,
        currentUser.id,
        replyContent.trim(),
        parentId
      );
      
      if (!success) throw new Error(error);
      
      setReplyingTo(null);
      setReplyContent('');
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!currentUser) {
      setError('You must be signed in to edit');
      return;
    }
    
    if (!editContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const { data: comment } = await supabase
        .from('campaign_comments')
        .update({ content: editContent.trim(), updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('user_id', currentUser.id);
      
      setEditingId(null);
      setEditContent('');
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) {
      setError('You must be signed in to delete');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      setError(null);
      
      const { error } = await supabase
        .from('campaign_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUser.id);
      
      if (error) throw error;
      
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReaction = async (commentId: string, reactionType: 'agree' | 'disagree') => {
    if (!currentUser) {
      setError('You must be signed in to react');
      return;
    }
    
    if (!hasSupported) {
      setError('You must support this campaign before reacting');
      return;
    }
    
    try {
      setError(null);
      
      // If user already reacted with this type, remove the reaction
      if (userReactions[commentId] === reactionType) {
        await removeCommentReaction(commentId, currentUser.id);
        setUserReactions(prev => ({ ...prev, [commentId]: null }));
      } else {
        // Otherwise add/update the reaction
        const { success, error } = await addCommentReaction(
          commentId,
          currentUser.id,
          reactionType
        );
        
        if (!success) throw new Error(error);
        
        setUserReactions(prev => ({ ...prev, [commentId]: reactionType }));
      }
      
      await loadComments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEditing = (comment: CampaignComment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const startReplying = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const cancelReplying = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-xl md:text-2xl font-bold flex items-center">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-2 text-primary flex-shrink-0" />
            Community Suggestions
          </h2>
          <div className="ml-2">
            <button 
              onClick={() => setShowInfoModal(true)}
              className="bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center"
              aria-label="How suggestions work"
            >
              <HelpCircle className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="whitespace-nowrap">How It Works</span>
            </button>
          </div>
        </div>
        <div className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
          {totalComments} {totalComments === 1 ? 'suggestion' : 'suggestions'}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Comment Form */}
      {currentUser ? (
        hasSupported ? (
          <form onSubmit={handleSubmitComment} className="mb-6 md:mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Add Your Suggestion
              </label>
              <textarea
                id="comment"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Share your ideas or suggestions for this project..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={submitting}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? 'Submitting...' : 'Post Suggestion'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-medium">
              You need to vote with coins on this campaign before you can comment or react.
            </p>
          </div>
        )
      ) : (
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-700 font-medium">
            Please sign in and vote with coins to join the conversation.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading suggestions...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No suggestions yet</p>
          <p className="text-sm text-gray-400">Be the first to share your ideas!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              {/* Comment Header */}
              <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {comment.profile?.avatar_url ? (
                      <img
                        src={comment.profile.avatar_url} 
                        alt={comment.profile.full_name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 font-bold">
                        {comment.profile?.full_name?.charAt(0) || comment.profile?.email?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {comment.profile?.full_name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-500 flex flex-wrap items-center gap-1">
                      {new Date(comment.created_at).toLocaleDateString()} • 
                      <span className="font-medium text-primary">
                        {comment.author_coin_weight} coin{comment.author_coin_weight !== 1 ? 's' : ''} invested
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Score Display */}
                <div className="text-xs md:text-sm font-medium flex-shrink-0">
                  <span className={`px-2 py-1 rounded ${
                    comment.calculated_score > 0 
                      ? 'bg-green-100 text-green-800' 
                      : comment.calculated_score < 0
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    Score: {comment.calculated_score}
                  </span>
                </div>
              </div>
              
              {/* Comment Content */}
              {editingId === comment.id ? (
                <div className="mb-3">
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                      disabled={submitting}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 mb-3">{comment.content}</p>
              )}
              
              {/* Comment Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1 md:gap-2">
                  {/* Agree Button */}
                  <button
                    onClick={() => handleReaction(comment.id, 'agree')}
                    disabled={!currentUser || !hasSupported}
                    className={`flex items-center space-x-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm ${
                      userReactions[comment.id] === 'agree'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:text-gray-700'
                    } ${(!currentUser || !hasSupported) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={!currentUser ? "Sign in to react" : !hasSupported ? "Support this campaign to react" : "Agree with this suggestion"}
                  >
                    <span className="font-medium whitespace-nowrap">Agree</span>
                    <span>{comment.agreeCount || 0}</span>
                  </button>
                  
                  {/* Disagree Button */}
                  <button
                    onClick={() => handleReaction(comment.id, 'disagree')}
                    disabled={!currentUser || !hasSupported}
                    className={`flex items-center space-x-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm ${
                      userReactions[comment.id] === 'disagree'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-500 hover:text-gray-700'
                    } ${(!currentUser || !hasSupported) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={!currentUser ? "Sign in to react" : !hasSupported ? "Support this campaign to react" : "Disagree with this suggestion"}
                  >
                    <span className="font-medium whitespace-nowrap">Disagree</span>
                    <span>{comment.disagreeCount || 0}</span>
                  </button>
                  
                  {/* Reply Button */}
                  <button
                    onClick={() => startReplying(comment.id)}
                    disabled={!currentUser || !hasSupported}
                    className={`flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-xs md:text-sm ${
                      (!currentUser || !hasSupported) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title={!currentUser ? "Sign in to reply" : !hasSupported ? "Support this campaign to reply" : "Reply to this comment"}
                  >
                    <CornerDownRight className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="whitespace-nowrap">Reply</span>
                  </button>
                </div>
                
                {/* Edit/Delete (for comment owner) */}
                {currentUser && comment.user_id === currentUser.id && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => startEditing(comment)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      title="Edit your comment"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-500 hover:text-red-600 p-1"
                      title="Delete your comment"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Write your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={cancelReplying}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                      disabled={submitting || !replyContent.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
              
              {/* Show Reply Count */}
              {comment.replyCount > 0 && (
                <button
                  className="mt-2 text-xs md:text-sm text-primary hover:text-primary-dark flex items-center"
                  onClick={() => {/* TODO: Implement viewing replies */}}
                >
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* How Suggestions Work Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 md:p-6 max-w-lg w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold">How Suggestions Work</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-3 md:p-5 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2 md:mb-3 text-base md:text-lg">Example</h3>
                <div className="bg-white p-3 md:p-4 rounded-lg border border-blue-100 mb-2 md:mb-3">
                  <p className="font-medium text-gray-800">
                    <span className="text-primary font-bold">Sarah</span> voted with 5 coins and suggests: "Add a pink version"
                  </p>
                  <div className="mt-2 space-y-1 md:space-y-2 pl-3 md:pl-4 border-l-2 border-gray-200">
                    <p className="text-sm md:text-base">
                      <span className="font-medium">Mike</span> (voted with 3 coins) clicks "I agree" → +3 points
                    </p>
                    <p className="text-sm md:text-base">
                      <span className="font-medium">Lisa</span> (voted with 2 coins) clicks "I disagree" → -2 points
                    </p>
                  </div>
                  <div className="mt-2 md:mt-3 pt-2 border-t border-gray-100">
                    <p className="font-bold text-green-700 text-sm md:text-base">
                      Final score: 5 + 3 - 2 = 6 points
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-blue-700">
                  Higher scores mean the community strongly supports the suggestion!
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2 md:mb-3 text-base md:text-lg">How It Works</h3>
                <ul className="space-y-2 md:space-y-3 text-gray-700 text-sm md:text-base">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>You must vote with at least 1 coin to participate in discussions</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Your influence equals the number of coins you've voted with</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Voting with more coins increases your influence and secures a bigger discount</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;