-- =====================================================
-- Credits System Migration
-- =====================================================

-- Create user_credits table to track credit balances
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(user_id)
);

-- Create credit_transactions table to track all credit transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive for earning, negative for spending
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'registration_bonus', 'subscription_grant', 'image_generation', 'refund', etc.
  description TEXT,
  related_id UUID, -- reference to subscription, generated image, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_credits
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credits"
  ON user_credits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credits"
  ON user_credits FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policies for credit_transactions
CREATE POLICY "Users can view own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert transactions"
  ON credit_transactions FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can view all transactions"
  ON credit_transactions FOR SELECT
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- Function to create or get user credits
CREATE OR REPLACE FUNCTION get_or_create_user_credits(user_uuid UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  credit_id UUID;
BEGIN
  -- Try to get existing credits
  SELECT id INTO credit_id FROM user_credits WHERE user_id = user_uuid;

  -- If not exists, create with 0 balance
  IF NOT FOUND THEN
    INSERT INTO user_credits (user_id, balance)
    VALUES (user_uuid, 0)
    RETURNING id INTO credit_id;
  END IF;

  RETURN credit_id;
END;
$$;

-- Function to add credits to user
CREATE OR REPLACE FUNCTION add_credits(
  user_uuid UUID,
  amount INTEGER,
  trans_type TEXT,
  descr TEXT DEFAULT NULL,
  rel_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Lock the user's credit row
  SELECT balance INTO current_balance
  FROM user_credits
  WHERE user_id = user_uuid
  FOR UPDATE;

  -- If no credits row exists, create one
  IF NOT FOUND THEN
    current_balance := 0;
    INSERT INTO user_credits (user_id, balance)
    VALUES (user_uuid, current_balance);
  END IF;

  -- Check if user has enough credits for deduction
  IF amount < 0 AND current_balance < ABS(amount) THEN
    RAISE EXCEPTION 'Insufficient credits. Current balance: %, Required: %', current_balance, ABS(amount);
  END IF;

  -- Update balance
  UPDATE user_credits
  SET
    balance = balance + amount,
    updated_at = NOW()
  WHERE user_id = user_uuid;

  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    amount,
    balance_after,
    transaction_type,
    description,
    related_id
  ) VALUES (
    user_uuid,
    amount,
    current_balance + amount,
    trans_type,
    descr,
    rel_id
  );

  RETURN TRUE;
END;
$$;

-- Function to get user credit balance
CREATE OR REPLACE FUNCTION get_credit_balance(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT balance FROM user_credits WHERE user_id = user_uuid),
    0
  );
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_or_create_user_credits TO service_role;
GRANT EXECUTE ON FUNCTION add_credits TO service_role;
GRANT EXECUTE ON FUNCTION get_credit_balance TO authenticated, service_role;

-- =====================================================
-- IMPORTANT: Run these commands manually after registration
-- =====================================================
-- To give new users 4 free credits on registration:
-- SELECT add_credits(
--   (SELECT id FROM auth.users WHERE email = 'user@example.com'),
--   4,
--   'registration_bonus',
--   'Free credits for signing up'
-- );
