/*
  # Create coin_transactions table

  1. New Tables
    - `coin_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `admin_id` (uuid, foreign key to profiles, nullable)
      - `amount` (integer, can be negative for debits)
      - `operation_type` (text, type of transaction)
      - `notes` (text, optional description)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `coin_transactions` table
    - Add policy for admins to insert transaction records
    - Add policy for users to view their own transaction history
    - Add policy for admins to view all transactions

  3. Indexes
    - Index on user_id for efficient queries
    - Index on admin_id for admin tracking
    - Index on created_at for chronological ordering
*/

CREATE TABLE IF NOT EXISTS coin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  operation_type text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS coin_transactions_user_id_idx ON coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS coin_transactions_admin_id_idx ON coin_transactions(admin_id);
CREATE INDEX IF NOT EXISTS coin_transactions_created_at_idx ON coin_transactions(created_at DESC);

-- RLS Policies

-- Admins can insert transaction records
CREATE POLICY "Admins can insert coin transactions"
  ON coin_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Users can view their own transaction history
CREATE POLICY "Users can view own coin transactions"
  ON coin_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all coin transactions"
  ON coin_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Admins can update transaction records (for corrections)
CREATE POLICY "Admins can update coin transactions"
  ON coin_transactions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );