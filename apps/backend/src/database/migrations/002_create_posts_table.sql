-- Phase 2: Post Lifecycle
-- Creates the posts table for venue specials/offers

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

  -- Content
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(2048),

  -- Status and timing
  status VARCHAR(50) DEFAULT 'draft', -- draft, published, expired, cancelled
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,

  -- Offer details
  discount_percent DECIMAL(5, 2),
  discount_cap INTEGER,
  category VARCHAR(100),
  tags TEXT,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  redeem_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for fast lookups
CREATE INDEX idx_posts_venue_id ON posts(venue_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_expires_at ON posts(expires_at);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_published_at ON posts(published_at) WHERE published_at IS NOT NULL;
