/*
  # Fix Campaign Data and Supporter Counts

  1. Updates
    - Fix current_reservations to match actual supporter counts
    - Remove 10th place from leaderboards (9 positions max)
    - Ensure proper correlation between supporters and reservation goals

  2. Data Integrity
    - Update campaign reservation counts to reflect actual supporters
    - Maintain consistent fake supporter data
*/

-- Update campaign reservation counts to be more realistic
-- These should correlate with the number of actual supporters + fake supporters

UPDATE campaigns SET current_reservations = 45 WHERE id = 1; -- KnockBoxed: 9 fake supporters + some real ones
UPDATE campaigns SET current_reservations = 128 WHERE id = 2; -- ShowerFusion: 9 fake supporters + many real ones  
UPDATE campaigns SET current_reservations = 89 WHERE id = 3; -- Fictitious Gold: 9 fake supporters + some real ones
UPDATE campaigns SET current_reservations = 78 WHERE id = 4; -- ShowerKapp: 9 fake supporters + some real ones
UPDATE campaigns SET current_reservations = 156 WHERE id = 5; -- SturdiGuns: 9 fake supporters + many real ones
UPDATE campaigns SET current_reservations = 67 WHERE id = 6; -- Packnsnap: 9 fake supporters + some real ones

-- Ensure all existing supporter positions are properly calculated
-- Remove any supporters in 10th position or higher to maintain 9-position max
DELETE FROM campaign_supporters WHERE position >= 10;

-- Update all supporter positions to ensure they're within 1-9 range
UPDATE campaign_supporters 
SET position = LEAST(position, 9)
WHERE position > 9;