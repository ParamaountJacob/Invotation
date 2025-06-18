/*
  # Add RPC function for campaign goal comparison
  
  1. New Function
    - `get_campaigns_reaching_goal`: Returns campaigns where current_reservations >= reservation_goal
    - Allows proper column-to-column comparison that the Supabase client can't handle directly
    
  2. Security
    - Function is accessible to all authenticated users
    - Uses proper SQL comparison operators
    - Returns the same columns as the original query
*/

-- Create a function to get campaigns that have reached their goal
CREATE OR REPLACE FUNCTION get_campaigns_reaching_goal()
RETURNS SETOF campaigns
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM campaigns
  WHERE current_reservations >= reservation_goal
  AND is_archived = false;
$$;

-- Grant access to the function for authenticated users
GRANT EXECUTE ON FUNCTION get_campaigns_reaching_goal TO authenticated;