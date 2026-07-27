-- Phase 1: User and Venue Authentication Setup
-- Creates core tables for consumer and venue accounts

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Consumer users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_url VARCHAR(2048),
  phone VARCHAR(20),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Venue accounts table
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  venue_name VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(20),
  website VARCHAR(2048),

  -- Location
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Google Places integration
  google_place_id VARCHAR(255),
  google_place_name VARCHAR(500),

  -- Status
  status VARCHAR(50) DEFAULT 'pending_setup', -- pending_setup, active, suspended
  profile_completed BOOLEAN DEFAULT FALSE,
  profile_completed_at TIMESTAMP WITH TIME ZONE,

  -- Branding
  logo_url VARCHAR(2048),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for fast lookups
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_venues_firebase_uid ON venues(firebase_uid);
CREATE INDEX idx_venues_email ON venues(email);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_google_place_id ON venues(google_place_id);
CREATE INDEX idx_venues_created_at ON venues(created_at);
