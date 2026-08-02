-- Phase 4: Push Notifications & User Preferences
-- Creates tables for user preferences and FCM tokens

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  notify_new_posts BOOLEAN DEFAULT true,
  notify_post_updates BOOLEAN DEFAULT true,
  notify_new_followers BOOLEAN DEFAULT true,
  notify_comments BOOLEAN DEFAULT true,
  notify_likes BOOLEAN DEFAULT true,
  notify_redemption_reminders BOOLEAN DEFAULT true,
  notify_venue_announcements BOOLEAN DEFAULT true,

  email_weekly_digest BOOLEAN DEFAULT false,
  email_promotional BOOLEAN DEFAULT false,
  email_transactional BOOLEAN DEFAULT true,

  preferred_categories TEXT,
  preferred_latitude DECIMAL(10, 8),
  preferred_longitude DECIMAL(11, 8),
  preferred_distance_km INTEGER DEFAULT 5,

  push_notifications_enabled BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  device_name VARCHAR(255),
  platform VARCHAR(50) DEFAULT 'web',
  active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fcm_tokens_user_id ON fcm_tokens(user_id);
CREATE INDEX idx_fcm_tokens_token ON fcm_tokens(token);
CREATE INDEX idx_fcm_tokens_created_at ON fcm_tokens(created_at);
