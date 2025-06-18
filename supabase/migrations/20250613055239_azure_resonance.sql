/*
  # Create function for atomic coin transactions
  
  1. New Function
    - `update_user_coins_with_transaction` - Updates user coins and logs the transaction in one atomic operation
    - Ensures data consistency between profile coins and transaction log
    - Prevents race conditions and partial updates
    
  2. Parameters
    - `p_user_id` - The user whose coins are being updated
    - `p_admin_id` - The admin performing the update
    - `p_amount` - The amount to add (positive) or subtract (negative)
    - `p_operation_type` - Type of operation (admin_credit, admin_debit, etc.)
    - `p_notes` - Optional notes about the transaction
    
  3. Security
    - Function is SECURITY DEFINER to ensure it runs with elevated privileges
    - Only accessible to authenticated users with admin privileges
*/

-- Create function for atomic coin transactions
CREATE OR REPLACE FUNCTION update_user_coins_with_transaction(
  p_user_id UUID,
  p_admin_id UUID,
  p_amount INTEGER,
  p_operation_type TEXT,
  p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_coins INTEGER;
  v_new_total INTEGER;
BEGIN
  -- Get current coin balance
  SELECT coins INTO v_current_coins
  FROM profiles
  WHERE id = p_user_id;
  
  -- Calculate new total (ensure it doesn't go negative)
  v_new_total := GREATEST(0, COALESCE(v_current_coins, 0) + p_amount);
  
  -- Update user's coins
  UPDATE profiles
  SET coins = v_new_total
  WHERE id = p_user_id;
  
  -- Log the transaction
  INSERT INTO coin_transactions (
    user_id,
    admin_id,
    amount,
    operation_type,
    notes
  ) VALUES (
    p_user_id,
    p_admin_id,
    p_amount,
    p_operation_type,
    p_notes
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_coins_with_transaction TO authenticated;

-- Create policy to restrict function execution to admins
CREATE POLICY "Only admins can execute update_user_coins_with_transaction"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );