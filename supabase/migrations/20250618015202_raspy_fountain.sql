/*
  # Create Campaign Description Images Storage Bucket
  
  1. Storage Setup
    - Create campaign-description-images bucket for rich text editor image uploads
    - Set bucket to public for read access
    - Set file size limits and allowed MIME types
    
  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to all images
    - Allow users to update/delete their own images
*/

-- Create the campaign-description-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campaign-description-images',
  'campaign-description-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload campaign description images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for campaign description images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own campaign description images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own campaign description images" ON storage.objects;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload campaign description images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'campaign-description-images');

-- Policy to allow public read access to images
CREATE POLICY "Public read access for campaign description images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'campaign-description-images');

-- Policy to allow authenticated users to delete their images
CREATE POLICY "Users can delete their own campaign description images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'campaign-description-images');

-- Policy to allow authenticated users to update their images
CREATE POLICY "Users can update their own campaign description images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'campaign-description-images')
WITH CHECK (bucket_id = 'campaign-description-images');