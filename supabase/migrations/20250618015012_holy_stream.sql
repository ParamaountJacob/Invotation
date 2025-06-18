/*
  # Create campaign description images storage bucket

  1. Storage Setup
    - Create `campaign-description-images` storage bucket
    - Configure bucket to be public for read access
    - Set up RLS policies for authenticated users to upload images

  2. Security
    - Enable RLS on storage.objects table
    - Add policy for authenticated users to insert images
    - Add policy for public read access to images
    - Add policy for authenticated users to delete their own images
*/

-- Create the storage bucket for campaign description images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campaign-description-images',
  'campaign-description-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload images to campaign-description-images bucket
CREATE POLICY "Authenticated users can upload campaign description images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'campaign-description-images');

-- Policy to allow public read access to campaign description images
CREATE POLICY "Public read access for campaign description images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'campaign-description-images');

-- Policy to allow authenticated users to delete images they uploaded
CREATE POLICY "Users can delete their own campaign description images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'campaign-description-images');

-- Policy to allow authenticated users to update images they uploaded
CREATE POLICY "Users can update their own campaign description images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'campaign-description-images')
  WITH CHECK (bucket_id = 'campaign-description-images');