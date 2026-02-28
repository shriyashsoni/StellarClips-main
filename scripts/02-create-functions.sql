-- Database functions for atomic operations

-- Function to increment purchase count
CREATE OR REPLACE FUNCTION increment_purchase_count(clip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE clips
  SET purchase_count = purchase_count + 1
  WHERE id = clip_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment subscriber count
CREATE OR REPLACE FUNCTION increment_subscriber_count(creator_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE creators
  SET subscriber_count = subscriber_count + 1
  WHERE id = creator_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update creator earnings
CREATE OR REPLACE FUNCTION update_creator_earnings(creator_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE creators
  SET total_earnings_xlm = total_earnings_xlm + amount
  WHERE id = creator_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check subscription status
CREATE OR REPLACE FUNCTION check_subscription_active(user_id UUID, creator_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_active BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM subscriptions
    WHERE user_id = user_id
      AND creator_id = creator_id
      AND is_active = true
      AND end_date > NOW()
  ) INTO is_active;
  
  RETURN is_active;
END;
$$ LANGUAGE plpgsql;
