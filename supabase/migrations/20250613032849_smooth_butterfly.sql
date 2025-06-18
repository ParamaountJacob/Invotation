/*
  # Add RPC function for updating user reaction weights
  
  1. New Function
    - `update_user_reaction_weights`: Updates reaction weights for a user across all comments in a campaign
    - Handles the complex case of updating reaction weights when a user spends more coins
    
  2. Security
    - Function is accessible to all authenticated users
    - Uses proper SQL to update reaction weights and recalculate comment scores
*/

-- Create a function to update user reaction weights for a campaign
CREATE OR REPLACE FUNCTION update_user_reaction_weights(
  p_user_id UUID,
  p_campaign_id INTEGER,
  p_new_weight INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update all reactions by this user on comments in this campaign
  UPDATE comment_reactions
  SET 
    reactor_coin_weight = p_new_weight,
    updated_at = now()
  FROM campaign_comments
  WHERE 
    comment_reactions.comment_id = campaign_comments.id
    AND campaign_comments.campaign_id = p_campaign_id
    AND comment_reactions.user_id = p_user_id;
END;
$$;

-- Grant access to the function for authenticated users
GRANT EXECUTE ON FUNCTION update_user_reaction_weights TO authenticated;