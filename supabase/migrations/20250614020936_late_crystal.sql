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