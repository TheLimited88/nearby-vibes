-- Phase 5.5: QR & Geofence Verification
-- Creates the redemptions table for tracking post redemptions and verifications

CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Status tracking
  status VARCHAR(50) DEFAULT 'initiated', -- initiated, qr_scanned, geofence_verified, completed, expired

  -- Location data for verification
  user_latitude DECIMAL(10, 8),
  user_longitude DECIMAL(11, 8),
  distance_m DECIMAL(10, 2),

  -- QR code tracking
  qr_code VARCHAR(2048),
  qr_scanned_at TIMESTAMP WITH TIME ZONE,
  geofence_verified_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast lookups
CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX idx_redemptions_post_id ON redemptions(post_id);
CREATE INDEX idx_redemptions_venue_id ON redemptions(venue_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);
CREATE INDEX idx_redemptions_created_at ON redemptions(created_at);
