/*
  # Add external links to campaigns table
  
  1. New Columns
    - `kickstarter_url` - URL to Kickstarter campaign
    - `amazon_url` - URL to Amazon product page
    - `website_url` - URL to product website
    - `status` - Campaign status (live, kickstarter, completed, archived)
    
  2. Updates
    - Add status field for better campaign categorization
    - Add external link fields for launched products
*/

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'status'
  ) THEN
    ALTER TABLE campaigns 
    ADD COLUMN status TEXT DEFAULT 'live';
  END IF;
END $$;

-- Add external link columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'kickstarter_url'
  ) THEN
    ALTER TABLE campaigns 
    ADD COLUMN kickstarter_url TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'amazon_url'
  ) THEN
    ALTER TABLE campaigns 
    ADD COLUMN amazon_url TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'campaigns' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE campaigns 
    ADD COLUMN website_url TEXT;
  END IF;
END $$;