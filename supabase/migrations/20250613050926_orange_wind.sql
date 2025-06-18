/*
  # Add coin transactions table
  
  1. New Table
    - `coin_transactions` - Tracks all coin-related transactions
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `admin_id` (uuid, foreign key to profiles, for admin operations)
      - `amount` (integer, the amount of coins involved)
      - `operation_type` (text, e.g., 'purchase', 'support', 'admin_update')
      - `notes` (text, optional details about the transaction)
      - `created_at` (timestamp)
    
  2. Security
    - Enable RLS on the table
    - Add policies for admins to view all transactions
    - Add policies for users to view their own transactions
*/

-- Create coin_transactions table
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  operation_type TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS coin_transactions_user_id_idx ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS coin_transactions_admin_id_idx ON coin_transactions(admin_id);
CREATE INDEX IF NOT EXISTS coin_transactions_created_at_idx ON coin_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own transactions"
  ON coin_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON coin_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert transactions"
  ON coin_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );