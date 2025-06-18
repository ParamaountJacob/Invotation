/*
  # Add video_url to campaigns table
  
  1. New Column
    - `video_url` - URL to campaign video (optional)
    
  2. Changes
    - Add video_url column to campaigns table
    - Allow NULL values for optional videos
*/

-- Add video_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE campaigns 
    ADD COLUMN video_url TEXT;
  END IF;
END $$;