/*
  # Fix Campaign Display Issues
  
  1. Changes
    - Add short_description column if it doesn't exist
    - Populate short descriptions for all campaigns
    - Truncate descriptions to 100 characters with ellipsis
    - Ensure all campaigns have a short description
    
  2. Data Integrity
    - Properly handle JSON descriptions
    - Fall back to title if no description is available
    - Ensure consistent display across all campaign cards
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

-- Update existing campaigns to have a short_description based on the first 100 chars of description
UPDATE campaigns
SET short_description = CASE
  WHEN description LIKE '{%' THEN -- Check if it's a JSON string
    CASE
      WHEN json_typeof(description::json->'text') = 'string' THEN -- Check if it has a text field
        SUBSTRING((description::json->>'text') FROM 1 FOR 100) || CASE WHEN LENGTH((description::json->>'text')) > 100 THEN '...' ELSE '' END
      ELSE
        SUBSTRING(description FROM 1 FOR 100) || CASE WHEN LENGTH(description) > 100 THEN '...' ELSE '' END
    END
  ELSE
    SUBSTRING(description FROM 1 FOR 100) || CASE WHEN LENGTH(description) > 100 THEN '...' ELSE '' END
END
WHERE short_description IS NULL OR short_description = '';

-- Ensure all campaigns have a short_description
UPDATE campaigns
SET short_description = SUBSTRING(title FROM 1 FOR 50) || '...'
WHERE short_description IS NULL OR short_description = '';