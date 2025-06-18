/*
  # Create campaign images storage bucket
  
  1. Storage Setup
    - Create campaign-images bucket for campaign image uploads
    - Set bucket to public for read access
    
  2. Security Policies
    - Allow authenticated admins to upload campaign images
    - Allow public read access to all campaign images
*/

-- Create the campaign-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-images', 'campaign-images', true)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can upload campaign images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update campaign images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete campaign images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view campaign images" ON storage.objects;

-- Policy to allow authenticated admins to upload campaign images
CREATE POLICY "Admins can upload campaign images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'campaign-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Policy to allow admins to update campaign images
CREATE POLICY "Admins can update campaign images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'campaign-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
)
WITH CHECK (
  bucket_id = 'campaign-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Policy to allow admins to delete campaign images
CREATE POLICY "Admins can delete campaign images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'campaign-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Policy to allow public read access to campaign images
CREATE POLICY "Public can view campaign images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'campaign-images');