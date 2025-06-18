/*
  # Admin Setup Migration

  1. Updates
    - Set invotation@gmail.com as admin user
    - Ensure proper admin privileges are configured

  2. Security
    - Only affects the specific email address
    - Maintains existing RLS policies
*/

-- Set invotation@gmail.com as admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'invotation@gmail.com';

-- If the profile doesn't exist yet, we'll create it when the user first signs up
-- The application will handle profile creation on first login