/*
  # Fix campaigns table sequence synchronization

  1. Problem
    - The campaigns table sequence is out of sync with existing data
    - This causes duplicate key violations when inserting new campaigns
    
  2. Solution
    - Reset the sequence to start from the next available ID
    - Ensure the sequence is properly configured for auto-increment
*/

-- Reset the sequence to the next available ID
SELECT setval('campaigns_id_seq', COALESCE((SELECT MAX(id) FROM campaigns), 0) + 1, false);

-- Ensure the sequence is owned by the campaigns.id column
ALTER SEQUENCE campaigns_id_seq OWNED BY campaigns.id;

-- Verify the column default is properly set
ALTER TABLE campaigns ALTER COLUMN id SET DEFAULT nextval('campaigns_id_seq'::regclass);