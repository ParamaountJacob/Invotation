/*
  # Fix Campaign Display Issues
  
  1. Updates
    - Add short_description column to campaigns table
    - Populate short_description from existing descriptions
    - Ensure proper truncation for display
    
  2. Data Integrity
    - Extract text from JSON descriptions when needed
    - Limit short descriptions to 150 characters
    - Add ellipsis for truncated descriptions
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