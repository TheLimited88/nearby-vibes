-- Phase 9A: Abuse Prevention
-- Creates tables for place claim ledger and fraud event tracking

CREATE TABLE IF NOT EXISTS place_claim_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  google_place_id VARCHAR(100) UNIQUE NOT NULL,
  venue_id UUID,

  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_started_at TIMESTAMP WITH TIME ZONE,
  trial_ended_at TIMESTAMP WITH TIME ZONE,

  status VARCHAR(50) NOT NULL DEFAULT 'claimed',
  cooldown_expires_at TIMESTAMP WITH TIME ZONE,

  ip_address VARCHAR(45),
  user_agent TEXT,
  device_fingerprint VARCHAR(100),
  country_code VARCHAR(2),

  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_place_claim_ledger_google_place_id ON place_claim_ledger(google_place_id);
CREATE INDEX idx_place_claim_ledger_venue_id ON place_claim_ledger(venue_id);
CREATE INDEX idx_place_claim_ledger_claimed_at ON place_claim_ledger(claimed_at);
CREATE INDEX idx_place_claim_ledger_cooldown_expires_at ON place_claim_ledger(cooldown_expires_at);
CREATE INDEX idx_place_claim_ledger_status ON place_claim_ledger(status);

CREATE TABLE IF NOT EXISTS fraud_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID,
  venue_id UUID,

  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  action_taken VARCHAR(50) NOT NULL DEFAULT 'flagged',

  ip_address VARCHAR(45),
  user_agent TEXT,
  device_fingerprint VARCHAR(100),
  country_code VARCHAR(2),

  description TEXT,
  metadata JSONB DEFAULT '{}',

  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fraud_events_user_id ON fraud_events(user_id);
CREATE INDEX idx_fraud_events_venue_id ON fraud_events(venue_id);
CREATE INDEX idx_fraud_events_event_type ON fraud_events(event_type);
CREATE INDEX idx_fraud_events_severity ON fraud_events(severity);
CREATE INDEX idx_fraud_events_action_taken ON fraud_events(action_taken);
CREATE INDEX idx_fraud_events_created_at ON fraud_events(created_at);
CREATE INDEX idx_fraud_events_ip_address ON fraud_events(ip_address);
CREATE INDEX idx_fraud_events_reviewed_at ON fraud_events(reviewed_at)
  WHERE reviewed_at IS NULL;
