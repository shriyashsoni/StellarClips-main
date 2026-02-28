-- Stellar Micro-Payments Platform Database Schema
-- Version 1.0

-- Users table - stores user profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stellar_address VARCHAR(56) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  is_creator BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creators table - extended profile for content creators
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_price_xlm DECIMAL(20, 7),
  subscription_duration_days INTEGER DEFAULT 30,
  platform_fee_percent DECIMAL(5, 2) DEFAULT 2.5,
  total_earnings_xlm DECIMAL(20, 7) DEFAULT 0,
  subscriber_count INTEGER DEFAULT 0,
  content_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Content/Clips table - stores content metadata
CREATE TABLE IF NOT EXISTS clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content_type VARCHAR(50) NOT NULL, -- video, audio, article, image
  price_xlm DECIMAL(20, 7) NOT NULL,
  ipfs_hash VARCHAR(100), -- Content stored on IPFS
  thumbnail_url TEXT,
  duration_seconds INTEGER, -- for video/audio
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table - tracks individual content purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  clip_id UUID REFERENCES clips(id) ON DELETE CASCADE,
  amount_xlm DECIMAL(20, 7) NOT NULL,
  platform_fee_xlm DECIMAL(20, 7) NOT NULL,
  creator_earnings_xlm DECIMAL(20, 7) NOT NULL,
  stellar_tx_hash VARCHAR(64) UNIQUE NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, clip_id)
);

-- Subscriptions table - tracks creator subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  amount_xlm DECIMAL(20, 7) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  stellar_tx_hash VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tips table - tracks one-off tips to creators
CREATE TABLE IF NOT EXISTS tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  amount_xlm DECIMAL(20, 7) NOT NULL,
  platform_fee_xlm DECIMAL(20, 7) NOT NULL,
  creator_earnings_xlm DECIMAL(20, 7) NOT NULL,
  message TEXT,
  stellar_tx_hash VARCHAR(64) UNIQUE NOT NULL,
  tipped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table - stores blockchain events for indexing
CREATE TABLE IF NOT EXISTS blockchain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL, -- tip, purchase, subscription, refund
  stellar_tx_hash VARCHAR(64) UNIQUE NOT NULL,
  contract_id VARCHAR(56),
  from_address VARCHAR(56),
  to_address VARCHAR(56),
  amount_xlm DECIMAL(20, 7),
  event_data JSONB,
  processed BOOLEAN DEFAULT false,
  ledger_sequence BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_stellar_address ON users(stellar_address);
CREATE INDEX IF NOT EXISTS idx_clips_creator_id ON clips(creator_id);
CREATE INDEX IF NOT EXISTS idx_clips_published ON clips(is_published);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_clip_id ON purchases(clip_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_tips_from_user ON tips(from_user_id);
CREATE INDEX IF NOT EXISTS idx_tips_to_creator ON tips(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_events_processed ON blockchain_events(processed);
CREATE INDEX IF NOT EXISTS idx_events_type ON blockchain_events(event_type);
