-- Phase 7: Subscription & Billing
-- Creates tables for subscription management and Paddle integration

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID UNIQUE NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  plan VARCHAR(50) NOT NULL DEFAULT 'free',
  status VARCHAR(50) NOT NULL DEFAULT 'trialing',

  paddle_subscription_id VARCHAR(100),
  paddle_customer_id VARCHAR(100),

  amount DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',

  trial_starts_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,

  promo_code VARCHAR(100),
  discount_percent DECIMAL(5, 2) DEFAULT 0,

  grace_period_days INTEGER DEFAULT 3,
  grace_period_ends_at TIMESTAMP WITH TIME ZONE,

  founding_venue BOOLEAN DEFAULT false,

  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_venue_id ON subscriptions(venue_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_ends_at ON subscriptions(trial_ends_at)
  WHERE status = 'trialing';
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_paddle_subscription_id ON subscriptions(paddle_subscription_id);

CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,

  discount_percent DECIMAL(5, 2),
  discount_fixed DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',

  max_uses INTEGER,
  times_used INTEGER DEFAULT 0,

  expires_at TIMESTAMP WITH TIME ZONE,
  valid_from TIMESTAMP WITH TIME ZONE,

  active BOOLEAN DEFAULT true,
  description VARCHAR(100),

  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(active);
CREATE INDEX idx_promo_codes_expires_at ON promo_codes(expires_at);

CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,

  event_type VARCHAR(100) NOT NULL,
  paddle_event_id VARCHAR(100),

  payload JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message VARCHAR(255),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_events_subscription_id ON subscription_events(subscription_id);
CREATE INDEX idx_subscription_events_event_type ON subscription_events(event_type);
CREATE INDEX idx_subscription_events_created_at ON subscription_events(created_at);
