/*
  # Add Campaign FAQs Table
  
  1. New Table
    - `campaign_faqs` - Stores frequently asked questions for campaigns
      - `id` (uuid, primary key)
      - `campaign_id` (integer, foreign key to campaigns)
      - `question` (text)
      - `answer` (text)
      - `created_at` (timestamp)
    
  2. Security
    - Enable RLS on the table
    - Add policies for public to view FAQs
    - Add policies for admins to manage FAQs
*/

-- Create campaign_faqs table
CREATE TABLE IF NOT EXISTS campaign_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS campaign_faqs_campaign_id_idx ON campaign_faqs(campaign_id);

-- Enable RLS
ALTER TABLE campaign_faqs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view campaign FAQs"
  ON campaign_faqs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage campaign FAQs"
  ON campaign_faqs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );