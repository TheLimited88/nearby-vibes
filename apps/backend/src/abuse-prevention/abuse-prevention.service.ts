import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { PlaceClaimLedger } from '../entities/PlaceClaimLedger';
import { FraudEvent, Severity, ActionType } from '../entities/FraudEvent';
import { v4 as uuid } from 'uuid';

const COOLDOWN_DAYS = 90;
const TRIAL_DURATION_DAYS = 14;
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
];

export interface ClaimCheckResult {
  allowed: boolean;
  reason?: string;
  cooldownExpiresAt?: Date;
  previousClaim?: PlaceClaimLedger;
}

export interface SignupContextDto {
  email: string;
  ip_address: string;
  user_agent: string;
  device_fingerprint?: string;
  country_code?: string;
}

@Injectable()
export class AbusePreventionService {
  private readonly logger = new Logger(AbusePreventionService.name);

  // Mock storage
  private placeClaimLedger: PlaceClaimLedger[] = [];
  private fraudEvents: FraudEvent[] = [];

  // Check if place can be claimed
  async canClaimPlace(
    googlePlaceId: string,
    context: SignupContextDto,
  ): Promise<ClaimCheckResult> {
    // Find previous claims for this place
    const previousClaim = this.placeClaimLedger.find(
      c => c.google_place_id === googlePlaceId,
    );

    if (!previousClaim) {
      // First claim - allowed
      return { allowed: true };
    }

    // Check if still in cooldown
    if (previousClaim.cooldown_expires_at) {
      if (new Date() < previousClaim.cooldown_expires_at) {
        const daysLeft = Math.ceil(
          (previousClaim.cooldown_expires_at.getTime() - Date.now()) /
            (24 * 60 * 60 * 1000)
        );

        this.logger.warn(
          `Place ${googlePlaceId} in cooldown for ${daysLeft} more days`
        );

        await this.recordFraudEvent({
          event_type: 'claim_after_delete',
          severity: 'high',
          user_id: null,
          ip_address: context.ip_address,
          user_agent: context.user_agent,
          device_fingerprint: context.device_fingerprint,
          country_code: context.country_code,
          description: `Attempted to claim ${googlePlaceId} during cooldown`,
          metadata: { google_place_id: googlePlaceId, daysLeft },
        });

        return {
          allowed: false,
          reason: `This venue was already claimed. Please try again in ${daysLeft} days.`,
          cooldownExpiresAt: previousClaim.cooldown_expires_at,
          previousClaim,
        };
      }
    }

    // Cooldown expired - claim allowed
    return { allowed: true, previousClaim };
  }

  // Record a successful claim
  async recordClaim(
    googlePlaceId: string,
    venueId: string,
    context: SignupContextDto,
  ): Promise<PlaceClaimLedger> {
    const now = new Date();
    const cooldownExpiresAt = new Date(
      now.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000
    );

    const claim: PlaceClaimLedger = {
      id: uuid(),
      google_place_id: googlePlaceId,
      venue_id: venueId,
      claimed_at: now,
      trial_started_at: now,
      trial_ended_at: new Date(
        now.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000
      ),
      status: 'claimed',
      cooldown_expires_at: cooldownExpiresAt,
      ip_address: context.ip_address,
      user_agent: context.user_agent,
      device_fingerprint: context.device_fingerprint || null,
      country_code: context.country_code || null,
      metadata: {},
      created_at: now,
    };

    this.placeClaimLedger.push(claim);
    this.logger.log(`Recorded claim for place ${googlePlaceId} venue ${venueId}`);

    return claim;
  }

  // Check for disposable email
  checkDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain || '');
  }

  // Validate geographic consistency
  validateGeographic(
    signupCountry: string,
    paymentCountry?: string
  ): { valid: boolean; reason?: string } {
    if (!paymentCountry) {
      return { valid: true }; // No payment info yet
    }

    if (signupCountry !== paymentCountry) {
      return {
        valid: false,
        reason: `Signup country (${signupCountry}) doesn't match payment country (${paymentCountry})`,
      };
    }

    return { valid: true };
  }

  // Check VPN/Proxy
  checkVpnOrProxy(ip: string): boolean {
    // This would integrate with MaxMind GeoIP2 or similar service
    // For now, return false (in production, call actual VPN detection service)
    this.logger.debug(`Checking IP ${ip} for VPN/Proxy`);
    return false;
  }

  // Record fraud event
  async recordFraudEvent(data: {
    event_type: FraudEvent['event_type'];
    severity: Severity;
    user_id?: string | null;
    venue_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    device_fingerprint?: string | null;
    country_code?: string | null;
    description?: string | null;
    metadata?: Record<string, any>;
  }): Promise<FraudEvent> {
    // Determine action based on severity
    let action: ActionType = 'flagged';
    if (data.severity === 'high') {
      action = 'manual_review';
    }

    const event: FraudEvent = {
      id: uuid(),
      user_id: data.user_id || null,
      venue_id: data.venue_id || null,
      event_type: data.event_type,
      severity: data.severity,
      action_taken: action,
      ip_address: data.ip_address || null,
      user_agent: data.user_agent || null,
      device_fingerprint: data.device_fingerprint || null,
      country_code: data.country_code || null,
      description: data.description || null,
      metadata: data.metadata || {},
      reviewed_at: null,
      reviewed_by: null,
      admin_notes: null,
      created_at: new Date(),
    };

    this.fraudEvents.push(event);
    this.logger.log(
      `Recorded fraud event: ${data.event_type} (severity: ${data.severity})`
    );

    return event;
  }

  // Get fraud queue for admin
  async getFraudQueue(
    filters?: {
      severity?: Severity;
      reviewed?: boolean;
    }
  ): Promise<FraudEvent[]> {
    let queue = this.fraudEvents;

    if (filters?.severity) {
      queue = queue.filter(e => e.severity === filters.severity);
    }

    if (filters?.reviewed !== undefined) {
      queue = queue.filter(e =>
        filters.reviewed ? e.reviewed_at : !e.reviewed_at
      );
    }

    return queue.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  // Admin: Review fraud event
  async reviewFraudEvent(
    eventId: string,
    adminId: string,
    action: 'approve' | 'dismiss',
    notes?: string
  ): Promise<FraudEvent | null> {
    const event = this.fraudEvents.find(e => e.id === eventId);
    if (!event) return null;

    event.reviewed_at = new Date();
    event.reviewed_by = adminId;
    event.admin_notes = notes || null;
    event.action_taken = action === 'approve' ? 'suspended' : 'none';

    this.logger.log(
      `Admin reviewed fraud event ${eventId}: ${action}`
    );

    return event;
  }

  // Admin: Override cooldown
  async overrideCooldown(
    googlePlaceId: string,
    adminId: string,
    reason: string
  ): Promise<PlaceClaimLedger | null> {
    const claim = this.placeClaimLedger.find(
      c => c.google_place_id === googlePlaceId
    );

    if (!claim) return null;

    claim.cooldown_expires_at = new Date(); // Cooldown expired immediately
    claim.metadata = {
      ...claim.metadata,
      cooldown_overridden_by: adminId,
      cooldown_override_reason: reason,
      cooldown_override_at: new Date().toISOString(),
    };

    this.logger.log(`Admin ${adminId} overrode cooldown for ${googlePlaceId}`);

    return claim;
  }

  // Get claim history for place
  async getPlaceClaimHistory(
    googlePlaceId: string
  ): Promise<PlaceClaimLedger[]> {
    return this.placeClaimLedger.filter(
      c => c.google_place_id === googlePlaceId
    );
  }

  // Get claim history for user (by venue)
  async getUserClaimHistory(venueId: string): Promise<PlaceClaimLedger[]> {
    return this.placeClaimLedger.filter(c => c.venue_id === venueId);
  }
}
