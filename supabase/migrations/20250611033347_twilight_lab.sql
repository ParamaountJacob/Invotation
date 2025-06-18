/*
  # Add coins system to profiles
  
  1. Changes
    - Add coins column to profiles table with default value 0
    - Add check constraint to prevent negative coins
    - Create index for better performance
    
  2. Safety
    - Check if table exists before modifying
    - Handle case where column might already exist
    - Ensure proper constraints and defaults
*/

-- First, ensure the profiles table exists (create if it doesn't)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  avatar_style text DEFAULT 'initials',
  avatar_option integer DEFAULT 1,
  is_admin boolean DEFAULT false,
  bio text,
  company_name text,
  phone text,
  website text,
  linkedin_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add coins column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'coins'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN coins integer DEFAULT 0 CHECK (coins >= 0);
  END IF;
END $$;

-- Create index for better performance on coins queries (if it doesn't exist)
CREATE INDEX IF NOT EXISTS profiles_coins_idx ON profiles(coins);

-- Ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Ensure basic policies exist for profiles
DO $$
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone"
      ON profiles FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can create own profile'
  ) THEN
    CREATE POLICY "Users can create own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;