/*
  # Setup Avatar Storage Bucket and Policies

  1. Storage Setup
    - Create avatars bucket if it doesn't exist
    - Set bucket to be public for reading
    
  2. Security Policies
    - Allow authenticated users to upload their own avatars
    - Allow authenticated users to update their own avatars
    - Allow authenticated users to delete their own avatars
    - Allow public read access to all avatars
    
  3. Notes
    - Avatar files are stored with user ID as folder structure
    - Public read access allows avatars to be displayed without authentication
*/

-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Policy: Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Allow public read access to all avatars
CREATE POLICY "Public can view all avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');