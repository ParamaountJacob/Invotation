import { supabase } from './supabase';

/**
 * Get the total coins a user has spent on a specific campaign
 */
export async function getUserCoinsSpentOnCampaign(userId: string, campaignId: number): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('campaign_supporters')
      .select('coins_spent')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data?.coins_spent || 0;
  } catch (error) {
    console.error('Error getting user coins spent:', error);
    return 0;
  }
}

/**
 * Check if a user has supported a campaign
 */
export async function hasUserSupportedCampaign(userId: string, campaignId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('campaign_supporters')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking if user supported campaign:', error);
    return false;
  }
}

/**
 * Add a new comment to a campaign
 */
export async function addComment(
  campaignId: number, 
  userId: string, 
  content: string, 
  parentId?: string
): Promise<{ success: boolean; commentId?: string; error?: string }> {
  try {
    // Check if user has supported the campaign
    const hasSupported = await hasUserSupportedCampaign(userId, campaignId);
    if (!hasSupported) {
      return { 
        success: false, 
        error: 'You must support this campaign before commenting' 
      };
    }

    // Get user's coin weight
    const coinWeight = await getUserCoinsSpentOnCampaign(userId, campaignId);

    // Insert the comment
    const { data, error } = await supabase
      .from('campaign_comments')
      .insert({
        campaign_id: campaignId,
        user_id: userId,
        content,
        parent_id: parentId || null,
        author_coin_weight: coinWeight,
        calculated_score: coinWeight // Initial score is just the author's weight
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, commentId: data.id };
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing comment
 */
export async function updateComment(
  commentId: string, 
  userId: string, 
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the comment belongs to the user
    const { data: comment, error: checkError } = await supabase
      .from('campaign_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (checkError) throw checkError;
    if (comment.user_id !== userId) {
      return { success: false, error: 'You can only edit your own comments' };
    }

    // Update the comment
    const { error } = await supabase
      .from('campaign_comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating comment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a comment
 */
export async function deleteComment(
  commentId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if the comment belongs to the user
    const { data: comment, error: checkError } = await supabase
      .from('campaign_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (checkError) throw checkError;
    if (comment.user_id !== userId) {
      return { success: false, error: 'You can only delete your own comments' };
    }

    // Delete the comment
    const { error } = await supabase
      .from('campaign_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add or update a reaction to a comment
 */
export async function addCommentReaction(
  commentId: string, 
  userId: string, 
  reactionType: 'agree' | 'disagree'
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get the campaign ID for this comment
    const { data: comment, error: commentError } = await supabase
      .from('campaign_comments')
      .select('campaign_id')
      .eq('id', commentId)
      .single();

    if (commentError) throw commentError;

    // Check if user has supported the campaign
    const hasSupported = await hasUserSupportedCampaign(userId, comment.campaign_id);
    if (!hasSupported) {
      return { 
        success: false, 
        error: 'You must support this campaign before reacting to comments' 
      };
    }

    // Get user's coin weight
    const coinWeight = await getUserCoinsSpentOnCampaign(userId, comment.campaign_id);

    // Check if user has already reacted to this comment
    const { data: existingReaction, error: reactionError } = await supabase
      .from('comment_reactions')
      .select('id, reaction_type')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (reactionError) throw reactionError;

    if (existingReaction) {
      // Update existing reaction if type is different
      if (existingReaction.reaction_type !== reactionType) {
        const { error } = await supabase
          .from('comment_reactions')
          .update({ 
            reaction_type: reactionType,
            reactor_coin_weight: coinWeight,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReaction.id);

        if (error) throw error;
      } else {
        // Just update the weight if type is the same
        const { error } = await supabase
          .from('comment_reactions')
          .update({ 
            reactor_coin_weight: coinWeight,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReaction.id);

        if (error) throw error;
      }
    } else {
      // Insert new reaction
      const { error } = await supabase
        .from('comment_reactions')
        .insert({
          comment_id: commentId,
          user_id: userId,
          reaction_type: reactionType,
          reactor_coin_weight: coinWeight
        });

      if (error) throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error adding reaction:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove a reaction from a comment
 */
export async function removeCommentReaction(
  commentId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete the reaction
    const { error } = await supabase
      .from('comment_reactions')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error removing reaction:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Recalculate a user's influence on all comments and reactions for a campaign
 * when they spend more coins
 */
export async function recalculateUserInfluenceOnComments(
  userId: string, 
  campaignId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user's new coin weight
    const coinWeight = await getUserCoinsSpentOnCampaign(userId, campaignId);

    // Update author weights for all comments by this user on this campaign
    const { error: commentError } = await supabase
      .from('campaign_comments')
      .update({ 
        author_coin_weight: coinWeight,
        updated_at: new Date().toISOString()
      })
      .eq('campaign_id', campaignId)
      .eq('user_id', userId);

    if (commentError) throw commentError;

    // Update reactor weights for all reactions by this user on comments in this campaign
    const { error: reactionError } = await supabase.rpc('update_user_reaction_weights', {
      p_user_id: userId,
      p_campaign_id: campaignId,
      p_new_weight: coinWeight
    });

    if (reactionError) throw reactionError;

    return { success: true };
  } catch (error: any) {
    console.error('Error recalculating user influence:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch comments for a campaign
 */
export async function fetchCommentsForCampaign(
  campaignId: number,
  parentId: string | null = null,
  limit: number = 50,
  page: number = 0
): Promise<{ 
  comments: any[]; 
  totalCount: number; 
  error?: string 
}> {
  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from('campaign_comments')
      .select('*', { count: 'exact', head: true })
      .eq('campaign_id', campaignId)
      .is('parent_id', parentId);

    if (countError) throw countError;

    // Get comments with user profiles
    const { data: comments, error: commentsError } = await supabase
      .from('campaign_comments')
      .select(`
        *,
        profile:profiles!user_id(id, full_name, email, avatar_url)
      `)
      .eq('campaign_id', campaignId)
      .is('parent_id', parentId)
      .order('calculated_score', { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (commentsError) throw commentsError;

    // Get reply counts for each comment
    const commentIds = comments.map(c => c.id);
    const { data: replyCounts, error: replyError } = await supabase
      .from('campaign_comments')
      .select('parent_id')
      .in('parent_id', commentIds);

    if (replyError) throw replyError;

    // Get reaction counts for each comment
    const { data: reactions, error: reactionsError } = await supabase
      .from('comment_reactions')
      .select('comment_id, reaction_type')
      .in('comment_id', commentIds);

    if (reactionsError) throw reactionsError;

    // Process the comments to include reply count and reaction info
    const processedComments = comments.map(comment => {
      const replyCount = replyCounts.filter(r => r.parent_id === comment.id).length;
      
      // Count reactions by type
      const commentReactions = reactions.filter(r => r.comment_id === comment.id);
      const agreeCount = commentReactions.filter(r => r.reaction_type === 'agree').length;
      const disagreeCount = commentReactions.filter(r => r.reaction_type === 'disagree').length;
      
      return {
        ...comment,
        replyCount,
        agreeCount,
        disagreeCount
      };
    });

    return { 
      comments: processedComments, 
      totalCount: count || 0 
    };
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return { comments: [], totalCount: 0, error: error.message };
  }
}

/**
 * Get a user's reaction to a specific comment
 */
export async function getUserReactionToComment(
  commentId: string, 
  userId: string
): Promise<{ reactionType?: 'agree' | 'disagree'; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('comment_reactions')
      .select('reaction_type')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    return { reactionType: data?.reaction_type as 'agree' | 'disagree' | undefined };
  } catch (error: any) {
    console.error('Error getting user reaction:', error);
    return { error: error.message };
  }
}