-- Nearby Vibes Phase 0 - Initial Database Schema
-- PostgreSQL with PostGIS extension
-- Created: 2026-07-27

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- Core User Tables
-- ============================================================================

-- users (consumer accounts)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_url VARCHAR(2048),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- venues (restaurant/bar accounts)
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  venue_name VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  website VARCHAR(2048),

  -- Location data (PostGIS)
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOMETRY(Point, 4326),

  -- Place data
  google_place_id VARCHAR(255),
  google_place_name VARCHAR(500),

  -- Venue status
  status VARCHAR(50) DEFAULT 'pending_verification', -- pending_verification, claimed, verified
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Profile completion
  profile_completed_at TIMESTAMP WITH TIME ZONE,

  -- Avatar/branding
  logo_url VARCHAR(2048),
  cover_image_url VARCHAR(2048),

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_location CHECK (
    (latitude IS NULL AND longitude IS NULL AND location IS NULL) OR
    (latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NOT NULL)
  )
);

-- admin_users (admin portal access)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  totp_secret VARCHAR(255),
  totp_enabled BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Subscription & Billing
-- ============================================================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Trial
  trial_started_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,

  -- Billing status
  status VARCHAR(50) DEFAULT 'trial', -- trial, active, past_due, canceled, expired
  plan_type VARCHAR(50) DEFAULT 'Free', -- Free, Monthly, Annual

  -- Paddle subscription info
  paddle_subscription_id VARCHAR(255),
  paddle_customer_id VARCHAR(255),

  -- Billing dates
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- trial_started, trial_ending_soon, renewal_scheduled, etc.
  paddle_event_id VARCHAR(255),
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Posts & Content
-- ============================================================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Specials/offers
  offer_type VARCHAR(50), -- drink, food, happy_hour, event, etc.
  discount_value VARCHAR(100),
  discount_type VARCHAR(50), -- percentage, fixed_amount

  -- Timing
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Media
  image_url VARCHAR(2048),

  -- Status
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, expired, archived
  published_at TIMESTAMP WITH TIME ZONE,

  -- Engagement tracking (updated by analytics job)
  views_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- Audit & Admin Logging
-- ============================================================================

CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE SET NULL,

  action VARCHAR(100) NOT NULL, -- login, logout, approve_venue, reject_post, etc.
  resource_type VARCHAR(100), -- venue, post, subscription, user, etc.
  resource_id VARCHAR(255),

  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Indexes
-- ============================================================================

-- Users
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Venues
CREATE INDEX idx_venues_firebase_uid ON venues(firebase_uid);
CREATE INDEX idx_venues_email ON venues(email);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_location ON venues USING GIST(location);
CREATE INDEX idx_venues_google_place_id ON venues(google_place_id);
CREATE INDEX idx_venues_created_at ON venues(created_at);

-- Subscriptions
CREATE INDEX idx_subscriptions_venue_id ON subscriptions(venue_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_paddle_subscription_id ON subscriptions(paddle_subscription_id);
CREATE INDEX idx_subscriptions_trial_ends_at ON subscriptions(trial_ends_at);

-- Posts
CREATE INDEX idx_posts_venue_id ON posts(venue_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_end_time ON posts(end_time);
CREATE INDEX idx_posts_published_at ON posts(published_at);

-- Admin audit
CREATE INDEX idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX idx_admin_audit_log_created_at ON admin_audit_log(created_at);
