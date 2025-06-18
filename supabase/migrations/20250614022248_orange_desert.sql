/*
  # Fix Campaign Display Issues
  
  1. Changes
    - Ensure all campaigns have a short_description field
    - Update existing campaigns to have proper short descriptions
    - Limit short descriptions to 100 characters for better display
    
  2. Data Integrity
    - Extract text from JSON descriptions when needed
    - Add proper ellipsis for truncated descriptions
    - Maintain existing short descriptions when already set
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