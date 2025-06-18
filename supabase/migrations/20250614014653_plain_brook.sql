/*
  # Add short_description to campaigns table
  
  1. Changes
    - Add short_description column to campaigns table
    - Populate short_description for existing campaigns by extracting from description
    - Handle both plain text and JSON formatted descriptions
    
  2. Safety
    - Check if column exists before adding
    - Preserve existing short_description values if present
    - Handle JSON parsing safely
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