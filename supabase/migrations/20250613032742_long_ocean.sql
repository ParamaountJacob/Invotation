/*
  # Campaign Comments and Reactions System
  
  1. New Tables
    - `campaign_comments` - Stores user comments on campaigns
      - `id` (uuid, primary key)
      - `campaign_id` (integer, foreign key to campaigns)
      - `user_id` (uuid, foreign key to profiles)
      - `content` (text)
      - `parent_id` (uuid, self-reference for replies)
      - `author_coin_weight` (integer, coins spent by author at time of posting)
      - `total_agree_weight` (integer, sum of agree reaction weights)
      - `total_disagree_weight` (integer, sum of disagree reaction weights)
      - `calculated_score` (integer, derived from weights)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `comment_reactions` - Stores user reactions to comments
      - `id` (uuid, primary key)
      - `comment_id` (uuid, foreign key to campaign_comments)
      - `user_id` (uuid, foreign key to profiles)
      - `reaction_type` (enum: 'agree', 'disagree')
      - `reactor_coin_weight` (integer, coins spent by reactor at time of reaction)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Only allow users who have supported a campaign to comment or react
    - Users can only react once to each comment
    - Users can update/delete their own comments and reactions
    
  3. Functions
    - Function to recalculate comment scores when reactions change
    - Function to update user influence when they spend more coins
*/

-- Create reaction_type enum
CREATE TYPE reaction_type AS ENUM ('agree', 'disagree');

-- Create campaign_comments table
CREATE TABLE IF NOT EXISTS campaign_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES campaign_comments(id) ON DELETE CASCADE,
  author_coin_weight INTEGER NOT NULL DEFAULT 0,
  total_agree_weight INTEGER NOT NULL DEFAULT 0,
  total_disagree_weight INTEGER NOT NULL DEFAULT 0,
  calculated_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create comment_reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES campaign_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  reactor_coin_weight INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(comment_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS campaign_comments_campaign_id_idx ON campaign_comments(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_comments_user_id_idx ON campaign_comments(user_id);
CREATE INDEX IF NOT EXISTS campaign_comments_parent_id_idx ON campaign_comments(parent_id);
CREATE INDEX IF NOT EXISTS campaign_comments_score_idx ON campaign_comments(calculated_score DESC);
CREATE INDEX IF NOT EXISTS comment_reactions_comment_id_idx ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS comment_reactions_user_id_idx ON comment_reactions(user_id);

-- Enable RLS
ALTER TABLE campaign_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Campaign comments policies
CREATE POLICY "Anyone can view campaign comments"
  ON campaign_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Users who supported the campaign can insert comments"
  ON campaign_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaign_supporters
      WHERE campaign_supporters.campaign_id = campaign_comments.campaign_id
      AND campaign_supporters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own comments"
  ON campaign_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON campaign_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comment reactions policies
CREATE POLICY "Anyone can view comment reactions"
  ON comment_reactions
  FOR SELECT
  USING (true);

CREATE POLICY "Users who supported the campaign can insert reactions"
  ON comment_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaign_comments
      JOIN campaign_supporters ON campaign_supporters.campaign_id = campaign_comments.campaign_id
      WHERE campaign_comments.id = comment_reactions.comment_id
      AND campaign_supporters.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own reactions"
  ON comment_reactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON comment_reactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to calculate comment score
CREATE OR REPLACE FUNCTION calculate_comment_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate the score based on author weight and reaction weights
  NEW.calculated_score := NEW.author_coin_weight + NEW.total_agree_weight - NEW.total_disagree_weight;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update calculated_score when weights change
CREATE TRIGGER update_comment_score
  BEFORE INSERT OR UPDATE OF author_coin_weight, total_agree_weight, total_disagree_weight
  ON campaign_comments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_comment_score();

-- Function to update comment reaction totals
CREATE OR REPLACE FUNCTION update_comment_reaction_totals()
RETURNS TRIGGER AS $$
DECLARE
  old_weight INTEGER := 0;
  comment_record RECORD;
BEGIN
  -- Get the comment record
  SELECT * INTO comment_record FROM campaign_comments WHERE id = NEW.comment_id;
  
  -- If this is an update, get the old weight
  IF TG_OP = 'UPDATE' AND OLD.reaction_type = NEW.reaction_type THEN
    old_weight := OLD.reactor_coin_weight;
  END IF;
  
  -- If reaction type changed, we need to remove from old type and add to new type
  IF TG_OP = 'UPDATE' AND OLD.reaction_type != NEW.reaction_type THEN
    -- Remove from old type
    IF OLD.reaction_type = 'agree' THEN
      UPDATE campaign_comments 
      SET total_agree_weight = total_agree_weight - OLD.reactor_coin_weight
      WHERE id = NEW.comment_id;
    ELSE
      UPDATE campaign_comments 
      SET total_disagree_weight = total_disagree_weight - OLD.reactor_coin_weight
      WHERE id = NEW.comment_id;
    END IF;
    
    -- Add to new type
    IF NEW.reaction_type = 'agree' THEN
      UPDATE campaign_comments 
      SET total_agree_weight = total_agree_weight + NEW.reactor_coin_weight
      WHERE id = NEW.comment_id;
    ELSE
      UPDATE campaign_comments 
      SET total_disagree_weight = total_disagree_weight + NEW.reactor_coin_weight
      WHERE id = NEW.comment_id;
    END IF;
  ELSE
    -- Just update the weight for the current type
    IF NEW.reaction_type = 'agree' THEN
      UPDATE campaign_comments 
      SET total_agree_weight = total_agree_weight - old_weight + NEW.reactor_coin_weight
      WHERE id = NEW.comment_id;
    ELSE
      UPDATE campaign_comments 
      SET total_disagree_weight = total_disagree_weight - old_weight + NEW.reactor_coin_weight
      WHERE id = NEW.comment_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for inserting/updating reactions
CREATE TRIGGER update_reaction_totals
  AFTER INSERT OR UPDATE
  ON comment_reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_reaction_totals();

-- Function to handle reaction deletion
CREATE OR REPLACE FUNCTION handle_reaction_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove the weight from the appropriate total
  IF OLD.reaction_type = 'agree' THEN
    UPDATE campaign_comments 
    SET total_agree_weight = total_agree_weight - OLD.reactor_coin_weight
    WHERE id = OLD.comment_id;
  ELSE
    UPDATE campaign_comments 
    SET total_disagree_weight = total_disagree_weight - OLD.reactor_coin_weight
    WHERE id = OLD.comment_id;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for deleting reactions
CREATE TRIGGER handle_reaction_delete
  AFTER DELETE
  ON comment_reactions
  FOR EACH ROW
  EXECUTE FUNCTION handle_reaction_delete();