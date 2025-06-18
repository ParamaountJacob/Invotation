/*
  # Campaign Support System

  1. New Tables
    - `campaigns`
      - `id` (integer, primary key)
      - `title` (text)
      - `description` (text)
      - `image` (text)
      - `reservation_goal` (integer)
      - `current_reservations` (integer, default 0)
      - `estimated_retail_price` (numeric)
      - `category` (text)
      - `minimum_bid` (integer, default 1)
      - `days_old` (integer, default 0)
      - `is_archived` (boolean, default false)
      - `created_at` (timestamp)
    
    - `campaign_supporters`
      - `id` (uuid, primary key)
      - `campaign_id` (integer, foreign key)
      - `user_id` (uuid, foreign key)
      - `coins_spent` (integer)
      - `position` (integer)
      - `discount_percentage` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read campaigns
    - Add policies for authenticated users to manage their own support
    - Add policies for admins to manage campaigns

  3. Functions
    - Function to update supporter positions and campaign reservations
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  reservation_goal INTEGER NOT NULL,
  current_reservations INTEGER DEFAULT 0,
  estimated_retail_price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  minimum_bid INTEGER DEFAULT 1,
  days_old INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create campaign_supporters table
CREATE TABLE IF NOT EXISTS campaign_supporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coins_spent INTEGER NOT NULL DEFAULT 0,
  position INTEGER,
  discount_percentage INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS campaigns_category_idx ON campaigns(category);
CREATE INDEX IF NOT EXISTS campaigns_archived_idx ON campaigns(is_archived);
CREATE INDEX IF NOT EXISTS campaign_supporters_campaign_id_idx ON campaign_supporters(campaign_id);
CREATE INDEX IF NOT EXISTS campaign_supporters_user_id_idx ON campaign_supporters(user_id);
CREATE INDEX IF NOT EXISTS campaign_supporters_coins_spent_idx ON campaign_supporters(campaign_id, coins_spent DESC);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_supporters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admins can manage campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can view campaign supporters" ON campaign_supporters;
DROP POLICY IF EXISTS "Users can manage their own support" ON campaign_supporters;

-- Campaigns policies
CREATE POLICY "Anyone can view campaigns"
  ON campaigns
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Campaign supporters policies
CREATE POLICY "Users can view campaign supporters"
  ON campaign_supporters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own support"
  ON campaign_supporters
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample campaigns data
INSERT INTO campaigns (id, title, description, image, reservation_goal, current_reservations, estimated_retail_price, category, minimum_bid, days_old) VALUES
(1, 'KnockBoxed', 'A hygienic knockbox with a lid for your coffee station. KnockBoxed keeps your espresso pucks neatly contained and sealed — reducing mess, minimizing odors, and elevating your barista setup.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/KnockBoxed.webp?v=1746395553', 150, 45, 40, 'home', 1, 23),
(2, 'ShowerFusion', 'A beautifully engineered dual-head shower system designed for effortless luxury. ShowerFusion delivers a spa-like experience with easy installation, powerful water flow, and sleek aesthetics.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/Shower_Jeane.webp?v=1732770175', 250, 128, 300, 'home', 1, 45),
(3, 'Fictitious Gold', 'A premium collection of ultra-dense tungsten bars, crafted and coated for the ultimate gold-like experience. Fictitious Gold offers luxury, weight, and presence without the price of real gold.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/Fictitious_gold.webp?v=1746395792', 150, 89, 450, 'lifestyle', 1, 67),
(4, 'ShowerKapp', 'Bring charm and personality to your daily routine with ShowerKapp — the world''s first line of cute, customizable attachments for your shower head!', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/ShowerKapp.webp?v=1746396947', 200, 78, 19.99, 'home', 1, 12),
(5, 'SturdiGuns', 'Rediscover childhood adventure with SturdiGuns — America''s favorite line of handcrafted wooden toy guns and swords. Built from UV-coated Baltic Birch and stress-tested for rugged durability.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/StrudiGuns.webp?v=1746401609', 300, 156, 24.99, 'lifestyle', 1, 34),
(6, 'Packnsnap', 'Packnsnap is a smart, snap-on travel cover designed to protect your delicate remotes — starting with the Apple TV remote. No more dents, scratches, or broken buttons when you toss your remote into a bag.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/Packnsnap.webp?v=1746399889', 150, 67, 16.99, 'tech', 1, 8)
ON CONFLICT (id) DO NOTHING;

-- Function to update supporter positions and discounts
CREATE OR REPLACE FUNCTION handle_supporter_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update positions and discount percentages for all supporters of this campaign
  WITH ranked_supporters AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) as new_position,
      CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 1 THEN 40
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 2 THEN 35
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 3 THEN 30
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 4 THEN 27
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 5 THEN 25
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 6 THEN 23
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 7 THEN 22
        WHEN ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) = 8 THEN 21
        ELSE 20
      END as new_discount
    FROM campaign_supporters 
    WHERE campaign_id = COALESCE(NEW.campaign_id, OLD.campaign_id)
  )
  UPDATE campaign_supporters 
  SET 
    position = ranked_supporters.new_position,
    discount_percentage = ranked_supporters.new_discount,
    updated_at = now()
  FROM ranked_supporters 
  WHERE campaign_supporters.id = ranked_supporters.id;

  -- Update campaign reservation count
  UPDATE campaigns 
  SET current_reservations = (
    SELECT COUNT(*) 
    FROM campaign_supporters 
    WHERE campaign_id = COALESCE(NEW.campaign_id, OLD.campaign_id)
  )
  WHERE id = COALESCE(NEW.campaign_id, OLD.campaign_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for supporter updates
DROP TRIGGER IF EXISTS supporter_update_trigger ON campaign_supporters;
CREATE TRIGGER supporter_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON campaign_supporters
  FOR EACH ROW EXECUTE FUNCTION handle_supporter_update();