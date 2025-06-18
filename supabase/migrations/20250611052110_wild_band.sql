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
      - `created_at` (timestamp)
      - `is_archived` (boolean, default false)
    
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
    - Function to calculate supporter positions and discounts
    - Function to update campaign reservations
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

-- Function to calculate supporter positions and discounts
CREATE OR REPLACE FUNCTION calculate_supporter_positions(campaign_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Update positions based on coins spent (highest first)
  WITH ranked_supporters AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY coins_spent DESC, created_at ASC) as new_position
    FROM campaign_supporters 
    WHERE campaign_id = campaign_id_param
  )
  UPDATE campaign_supporters 
  SET 
    position = ranked_supporters.new_position,
    discount_percentage = CASE 
      WHEN ranked_supporters.new_position = 1 THEN 40
      WHEN ranked_supporters.new_position = 2 THEN 35
      WHEN ranked_supporters.new_position = 3 THEN 30
      WHEN ranked_supporters.new_position = 4 THEN 27
      WHEN ranked_supporters.new_position = 5 THEN 25
      WHEN ranked_supporters.new_position = 6 THEN 23
      WHEN ranked_supporters.new_position = 7 THEN 22
      WHEN ranked_supporters.new_position = 8 THEN 21
      ELSE 20
    END,
    updated_at = now()
  FROM ranked_supporters
  WHERE campaign_supporters.id = ranked_supporters.id;
  
  -- Update campaign reservation count
  UPDATE campaigns 
  SET current_reservations = (
    SELECT COUNT(*) FROM campaign_supporters 
    WHERE campaign_id = campaign_id_param
  )
  WHERE id = campaign_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle supporter updates
CREATE OR REPLACE FUNCTION handle_supporter_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate positions for the campaign
  PERFORM calculate_supporter_positions(NEW.campaign_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic position calculation
DROP TRIGGER IF EXISTS supporter_update_trigger ON campaign_supporters;
CREATE TRIGGER supporter_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON campaign_supporters
  FOR EACH ROW
  EXECUTE FUNCTION handle_supporter_update();

-- Insert sample campaigns data
INSERT INTO campaigns (id, title, description, image, reservation_goal, current_reservations, estimated_retail_price, category, minimum_bid, days_old) VALUES
(1, 'KnockBoxed', 'A hygienic knockbox with a lid for your coffee station. KnockBoxed keeps your espresso pucks neatly contained and sealed — reducing mess, minimizing odors, and elevating your barista setup.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/KnockBoxed.webp?v=1746395553', 150, 45, 40, 'home', 1, 23),
(2, 'ShowerFusion', 'A beautifully engineered dual-head shower system designed for effortless luxury. ShowerFusion delivers a spa-like experience with easy installation, powerful water flow, and sleek aesthetics.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/Shower_Jeane.webp?v=1732770175', 250, 128, 300, 'home', 1, 45),
(3, 'Fictitious Gold', 'A premium collection of ultra-dense tungsten bars, crafted and coated for the ultimate gold-like experience. Fictitious Gold offers luxury, weight, and presence without the price of real gold.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/Fictitious_gold.webp?v=1746395792', 150, 89, 450, 'lifestyle', 1, 67),
(4, 'ShowerKapp', 'Bring charm and personality to your daily routine with ShowerKapp — the world''s first line of cute, customizable attachments for your shower head!', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/ShowerKapp.webp?v=1746396947', 200, 78, 19.99, 'home', 1, 12),
(5, 'SturdiGuns', 'Rediscover childhood adventure with SturdiGuns — America''s favorite line of handcrafted wooden toy guns and swords. Built from UV-coated Baltic Birch and stress-tested for rugged durability.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/StrudiGuns.webp?v=1746401609', 300, 156, 24.99, 'lifestyle', 1, 34),
(6, 'Packnsnap', 'Packnsnap is a smart, snap-on travel cover designed to protect your delicate remotes — starting with the Apple TV remote. No more dents, scratches, or broken buttons when you toss your remote into a bag.', 'https://cdn.shopify.com/s/files/1/0817/7595/2154/files/Packnsnap.webp?v=1746399889', 150, 67, 16.99, 'tech', 1, 8)
ON CONFLICT (id) DO NOTHING;