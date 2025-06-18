/*
  # Create campaign-description-images bucket
  
  1. Storage Setup
    - Create campaign-description-images bucket for rich text editor images
    - Set bucket to public for read access
    - Set file size limit to 5MB
    - Limit to image file types only
    
  2. Security Policies
    - Allow authenticated users to upload images
    - Allow public read access to all images
    - Allow authenticated users to manage their own images
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

-- Create policies for the bucket
DO $$
BEGIN
  -- Policy to allow authenticated users to upload images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload campaign description images'
  ) THEN
    CREATE POLICY "Authenticated users can upload campaign description images"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'campaign-description-images');
  END IF;

  -- Policy to allow public read access to images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public read access for campaign description images'
  ) THEN
    CREATE POLICY "Public read access for campaign description images"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'campaign-description-images');
  END IF;

  -- Policy to allow authenticated users to delete their images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete their own campaign description images'
  ) THEN
    CREATE POLICY "Users can delete their own campaign description images"
    ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'campaign-description-images');
  END IF;

  -- Policy to allow authenticated users to update their images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update their own campaign description images'
  ) THEN
    CREATE POLICY "Users can update their own campaign description images"
    ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'campaign-description-images')
    WITH CHECK (bucket_id = 'campaign-description-images');
  END IF;
END $$;