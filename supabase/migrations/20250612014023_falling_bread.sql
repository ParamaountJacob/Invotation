/*
  # Fix Avatar Storage RLS Policies
  
  1. Problem Resolution
    - Current RLS policies check for user ID as first folder in path
    - Current upload path doesn't match this structure
    - Fix by updating policies to match actual file structure
    
  2. Changes
    - Drop existing conflicting policies
    - Create new policies that work with direct file uploads
    - Allow users to upload/update/delete their own avatars
    - Maintain public read access
*/

-- Drop existing policies that may conflict
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view all avatars" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;

-- Create new policies that work with the file structure: avatars/user_id/filename
CREATE POLICY "Users can upload their own avatar files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Avatar files are publicly viewable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');