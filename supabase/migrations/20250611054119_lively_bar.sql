/*
# Remove Recursive Database Trigger

1. Problem Resolution
   - Drops the `supporter_update_trigger` that was causing infinite recursion
   - Removes the `handle_supporter_update` function that was updating the same table it was triggered by
   - This eliminates the "stack depth limit exceeded" error

2. Application-Level Solution
   - Campaign supporter ranking and position calculation is now handled in the application
   - The `recalculateCampaignData` function in `src/lib/campaigns.ts` manages all position updates
   - This provides better control and prevents database recursion issues

3. Data Integrity
   - All existing data remains intact
   - Position calculations will be handled by the application going forward
   - Campaign reservation counts will be updated through application logic
*/

-- Drop the problematic trigger that causes stack overflow
DROP TRIGGER IF EXISTS supporter_update_trigger ON campaign_supporters;

-- Drop the function that was causing recursive calls
DROP FUNCTION IF EXISTS handle_supporter_update();

-- Drop the helper function as well
DROP FUNCTION IF EXISTS calculate_supporter_positions(INTEGER);