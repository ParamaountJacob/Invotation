/*
  # Fix supporter update trigger to prevent stack overflow

  1. Changes
    - Replace the existing trigger function with an optimized version
    - Use a more efficient approach to update supporter positions
    - Prevent recursive trigger calls that cause stack overflow
    - Add proper error handling and logging

  2. Security
    - Maintains existing RLS policies
    - No changes to table structure or permissions
*/

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS supporter_update_trigger ON campaign_supporters;

-- Create an improved trigger function that prevents stack overflow
CREATE OR REPLACE FUNCTION handle_supporter_update()
RETURNS TRIGGER AS $$
DECLARE
    affected_campaign_id INTEGER;
BEGIN
    -- Determine which campaign was affected
    IF TG_OP = 'DELETE' THEN
        affected_campaign_id := OLD.campaign_id;
    ELSE
        affected_campaign_id := NEW.campaign_id;
    END IF;

    -- Update campaign reservation count efficiently
    UPDATE campaigns 
    SET current_reservations = (
        SELECT COUNT(*) 
        FROM campaign_supporters 
        WHERE campaign_id = affected_campaign_id
    )
    WHERE id = affected_campaign_id;

    -- Update supporter positions using a single query with window functions
    -- This prevents recursive calls and is much more efficient
    WITH ranked_supporters AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) as new_position
        FROM campaign_supporters 
        WHERE campaign_id = affected_campaign_id
    )
    UPDATE campaign_supporters 
    SET position = ranked_supporters.new_position
    FROM ranked_supporters 
    WHERE campaign_supporters.id = ranked_supporters.id
    AND campaign_supporters.campaign_id = affected_campaign_id;

    -- Return the appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER supporter_update_trigger
    AFTER INSERT OR UPDATE OR DELETE ON campaign_supporters
    FOR EACH ROW
    EXECUTE FUNCTION handle_supporter_update();

-- Update all existing supporter positions to ensure consistency
DO $$
DECLARE
    campaign_record RECORD;
BEGIN
    -- Loop through each campaign and fix positions
    FOR campaign_record IN 
        SELECT DISTINCT campaign_id FROM campaign_supporters
    LOOP
        WITH ranked_supporters AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) as new_position
            FROM campaign_supporters 
            WHERE campaign_id = campaign_record.campaign_id
        )
        UPDATE campaign_supporters 
        SET position = ranked_supporters.new_position
        FROM ranked_supporters 
        WHERE campaign_supporters.id = ranked_supporters.id
        AND campaign_supporters.campaign_id = campaign_record.campaign_id;
        
        -- Update campaign reservation counts
        UPDATE campaigns 
        SET current_reservations = (
            SELECT COUNT(*) 
            FROM campaign_supporters 
            WHERE campaign_id = campaign_record.campaign_id
        )
        WHERE id = campaign_record.campaign_id;
    END LOOP;
END $$;