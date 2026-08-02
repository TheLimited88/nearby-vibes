-- Phase 2.5: User Discovery
-- Creates the follows table for user-venue relationships

CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, venue_id)
);

-- Indexes for fast lookups
CREATE INDEX idx_follows_user_id ON follows(user_id);
CREATE INDEX idx_follows_venue_id ON follows(venue_id);
CREATE INDEX idx_follows_created_at ON follows(created_at);
