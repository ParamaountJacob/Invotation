/*
  # Add Short Description and Goal Reached Fields to Campaigns
  
  1. New Columns
    - `short_description` - Concise summary for display on cards and lists
    - `goal_reached_at` - Timestamp when campaign successfully meets its reservation goal
    
  2. Changes
    - Add short_description column to campaigns table
    - Add goal_reached_at column to campaigns table
    - Update status field to include 'goal_reached' option
*/

-- Add short_description column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'short_description'
  ) THEN
    ALTER TABLE campaigns 
    ADD COLUMN short_description TEXT;
  END IF;
END $$;

-- Add goal_reached_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'goal_reached_at'
  ) THEN
    ALTER TABLE campaigns 
    ADD COLUMN goal_reached_at TIMESTAMPTZ DEFAULT NULL;
  END IF;
END $$;

-- Update existing campaigns to have a short_description based on the first 150 chars of description
UPDATE campaigns
SET short_description = CASE
  WHEN description LIKE '{%' THEN -- Check if it's a JSON string
    CASE
      WHEN json_typeof(description::json->'text') = 'string' THEN -- Check if it has a text field
        SUBSTRING((description::json->>'text') FROM 1 FOR 150) || CASE WHEN LENGTH((description::json->>'text')) > 150 THEN '...' ELSE '' END
      ELSE
        SUBSTRING(description FROM 1 FOR 150) || CASE WHEN LENGTH(description) > 150 THEN '...' ELSE '' END
    END
  ELSE
    SUBSTRING(description FROM 1 FOR 150) || CASE WHEN LENGTH(description) > 150 THEN '...' ELSE '' END
END
WHERE short_description IS NULL;

-- Create function to check if a campaign has reached its goal
CREATE OR REPLACE FUNCTION check_campaign_goal_reached()
RETURNS TRIGGER AS $$
BEGIN
  -- If current_reservations meets or exceeds reservation_goal and status is 'live'
  -- and goal_reached_at is null, update status and set goal_reached_at
  IF NEW.current_reservations >= NEW.reservation_goal AND 
     (NEW.status = 'live' OR NEW.status IS NULL) AND 
     NEW.goal_reached_at IS NULL THEN
    
    NEW.status := 'goal_reached';
    NEW.goal_reached_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically check if goal is reached when reservations are updated
DROP TRIGGER IF EXISTS campaign_goal_check_trigger ON campaigns;
CREATE TRIGGER campaign_goal_check_trigger
  BEFORE UPDATE OF current_reservations ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION check_campaign_goal_reached();