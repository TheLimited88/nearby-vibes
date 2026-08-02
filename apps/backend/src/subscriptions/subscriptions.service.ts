import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Subscription, SubscriptionStatus, SubscriptionPlan } from '../entities/Subscription';
import { SubscriptionEvent } from '../entities/SubscriptionEvent';
import { PaddleService } from './paddle.service';
import { v4 as uuid } from 'uuid';

const TRIAL_DURATION_DAYS = 14;
const GRACE_PERIOD_DAYS = 3;
const FOUNDING_VENUE_DISCOUNT = 0.5; // 50%
const FOUNDING_VENUE_CAP = 50; // $50 max discount

interface CreateSubscriptionDto {
  venueId: string;
  plan: SubscriptionPlan;
  promoCode?: string;
}

interface SubscriptionCheckoutDto {
  subscriptionId: string;
  paddleCheckoutUrl: string;
  expiresAt: string;
}

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  // Mock data store for trial subscriptions
  private trialSubscriptions = new Map<string, Subscription>();
  private subscriptions = new Map<string, Subscription>();
  private subscriptionEvents: SubscriptionEvent[] = [];

  constructor(
    private readonly db: DatabaseService,
    private readonly paddleService: PaddleService,
  ) {}

  // Start trial on venue claim completion
  async startTrial(venueId: string): Promise<Subscription> {
    this.logger.log(`Starting trial for venue: ${venueId}`);

    const existing = Array.from(this.trialSubscriptions.values()).find(s => s.venue_id === venueId);
    if (existing) {
      throw new ConflictException('Venue already has an active trial or subscription');
    }

    const trialStartsAt = new Date();
    const trialEndsAt = new Date(trialStartsAt.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);

    const subscription: Subscription = {
      id: uuid(),
      venue_id: venueId,
      venue: null,
      plan: 'free',
      status: 'trialing',
      paddle_subscription_id: null,
      paddle_customer_id: null,
      amount: 0,
      currency: 'USD',
      trial_starts_at: trialStartsAt,
      trial_ends_at: trialEndsAt,
      next_billing_date: trialEndsAt,
      cancelled_at: null,
      promo_code: null,
      discount_percent: 0,
      grace_period_days: GRACE_PERIOD_DAYS,
      grace_period_ends_at: null,
      founding_venue: false,
      metadata: {},
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.trialSubscriptions.set(subscription.id, subscription);
    await this.recordEvent(subscription.id, 'subscription.created', subscription);

    return subscription;
  }

  // Create checkout session for premium subscription
  async createCheckout(dto: CreateSubscriptionDto): Promise<SubscriptionCheckoutDto> {
    const subscription = this.trialSubscriptions.get(
      Array.from(this.trialSubscriptions.keys()).find(
        id => this.trialSubscriptions.get(id)?.venue_id === dto.venueId
      ) || ''
    );

    if (!subscription) {
      throw new NotFoundException('No trial subscription found for this venue');
    }

    // Validate promo code
    let discountPercent = 0;
    if (dto.promoCode) {
      // Check if it's a founding venue code
      if (dto.promoCode.toLowerCase().includes('founding')) {
        if (this.paddleService.isFoundingVenueEligible()) {
          discountPercent = FOUNDING_VENUE_DISCOUNT;
          subscription.founding_venue = true;
          subscription.promo_code = dto.promoCode;
          subscription.discount_percent = discountPercent;
        }
      }
    }

    // Create Paddle checkout
    const checkout = await this.paddleService.createCheckout({
      customerId: subscription.id,
      priceId: 'price_monthly', // Mock price ID
      promoCode: dto.promoCode,
      metadata: {
        venue_id: dto.venueId,
        subscription_id: subscription.id,
      },
    });

    return {
      subscriptionId: subscription.id,
      paddleCheckoutUrl: checkout.paddle_url,
      expiresAt: checkout.expires_at,
    };
  }

  // Handle Paddle webhook events
  async handleWebhookEvent(event: any): Promise<void> {
    this.logger.log(`Handling webhook event: ${event.event_type}`);

    const subscriptionId = event.data?.subscription_id || event.data?.id;
    if (!subscriptionId) {
      this.logger.warn('Webhook event missing subscription ID', event);
      return;
    }

    const subscription = this.subscriptions.get(subscriptionId) ||
      this.trialSubscriptions.get(subscriptionId);

    if (!subscription) {
      this.logger.warn(`Subscription not found: ${subscriptionId}`);
      return;
    }

    try {
      switch (event.event_type) {
        case 'subscription.created':
          await this.handleSubscriptionCreated(subscription, event);
          break;
        case 'subscription.activated':
          subscription.status = 'active';
          subscription.paddle_subscription_id = event.data.id;
          subscription.paddle_customer_id = event.data.customer_id;
          await this.recordEvent(subscription.id, 'subscription.activated', event.data);
          break;
        case 'subscription.updated':
          await this.handleSubscriptionUpdated(subscription, event);
          break;
        case 'subscription.cancelled':
          subscription.status = 'cancelled';
          subscription.cancelled_at = new Date();
          await this.recordEvent(subscription.id, 'subscription.cancelled', event.data);
          break;
        case 'subscription.past_due':
          subscription.status = 'past_due';
          subscription.grace_period_ends_at = new Date(
            Date.now() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
          );
          await this.recordEvent(subscription.id, 'subscription.past_due', event.data);
          break;
        case 'subscription.payment_succeeded':
          await this.handlePaymentSucceeded(subscription, event);
          break;
      }

      this.subscriptions.set(subscription.id, subscription);
    } catch (error: any) {
      this.logger.error(`Failed to handle webhook event: ${event.event_type}`, error);
      await this.recordEvent(
        subscription.id,
        event.event_type as any,
        event.data,
        error?.message || 'Unknown error'
      );
    }
  }

  private async handleSubscriptionCreated(sub: Subscription, event: any) {
    sub.status = 'active';
    sub.paddle_subscription_id = event.data.id;
    sub.paddle_customer_id = event.data.customer_id;
    sub.plan = 'premium';
    sub.amount = event.data.amount;
    sub.next_billing_date = new Date(event.data.next_billing_date);
    await this.recordEvent(sub.id, 'subscription.created', event.data);
  }

  private async handleSubscriptionUpdated(sub: Subscription, event: any) {
    sub.plan = event.data.plan || sub.plan;
    sub.amount = event.data.amount || sub.amount;
    sub.next_billing_date = event.data.next_billing_date
      ? new Date(event.data.next_billing_date)
      : sub.next_billing_date;
    await this.recordEvent(sub.id, 'subscription.updated', event.data);
  }

  private async handlePaymentSucceeded(sub: Subscription, event: any) {
    if (sub.status === 'past_due') {
      sub.status = 'active';
      sub.grace_period_ends_at = null;
    }
    sub.next_billing_date = new Date(event.data.next_billing_date);
    await this.recordEvent(sub.id, 'subscription.payment_succeeded', event.data);
  }

  async getSubscription(venueId: string): Promise<Subscription | null> {
    const trialSub = Array.from(this.trialSubscriptions.values()).find(
      s => s.venue_id === venueId
    );
    if (trialSub) return trialSub;

    return (
      Array.from(this.subscriptions.values()).find(s => s.venue_id === venueId) || null
    );
  }

  async checkCanAccessPremiumFeature(venueId: string): Promise<boolean> {
    const sub = await this.getSubscription(venueId);
    if (!sub) return false;

    if (sub.status === 'active') return true;
    if (sub.status === 'past_due') {
      // Check if still in grace period
      if (sub.grace_period_ends_at && new Date() < sub.grace_period_ends_at) {
        return true;
      }
    }

    return false;
  }

  // Scheduled job: Check trial expirations
  async handleTrialExpirations(): Promise<number> {
    this.logger.log('Running trial expiration check');
    let expiredCount = 0;

    for (const [id, sub] of this.trialSubscriptions) {
      if (sub.status === 'trialing' && new Date() > sub.trial_ends_at) {
        sub.status = 'cancelled';
        sub.cancelled_at = new Date();
        this.subscriptions.set(id, sub);
        this.trialSubscriptions.delete(id);
        await this.recordEvent(id, 'subscription.trial_ended', {});
        expiredCount++;
      }
    }

    this.logger.log(`${expiredCount} trial subscriptions expired`);
    return expiredCount;
  }

  // Scheduled job: Send renewal reminders
  async sendRenewalReminders(): Promise<number> {
    this.logger.log('Sending renewal reminders');
    let reminderCount = 0;

    for (const sub of this.subscriptions.values()) {
      if (sub.status === 'active' && sub.next_billing_date) {
        const daysUntilRenewal = Math.floor(
          (sub.next_billing_date.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        );

        // Send reminder 3 days before renewal
        if (daysUntilRenewal === 3) {
          this.logger.log(`Sending renewal reminder for venue: ${sub.venue_id}`);
          reminderCount++;
          // TODO: Send email/push notification
        }
      }
    }

    return reminderCount;
  }

  // Scheduled job: Handle grace period expirations
  async handleGracePeriodExpirations(): Promise<number> {
    this.logger.log('Checking grace period expirations');
    let expiredCount = 0;

    for (const sub of this.subscriptions.values()) {
      if (
        sub.status === 'past_due' &&
        sub.grace_period_ends_at &&
        new Date() > sub.grace_period_ends_at
      ) {
        sub.status = 'cancelled';
        sub.cancelled_at = new Date();
        expiredCount++;
        this.logger.log(`Grace period expired for venue: ${sub.venue_id}`);
        // TODO: Send cancellation notification
      }
    }

    return expiredCount;
  }

  private async recordEvent(
    subscriptionId: string,
    eventType: string,
    payload: any,
    errorMessage?: string
  ): Promise<void> {
    const event: SubscriptionEvent = {
      id: uuid(),
      subscription_id: subscriptionId,
      subscription: null,
      event_type: eventType as any,
      paddle_event_id: payload?.id || null,
      payload,
      processed_at: new Date(),
      error_message: errorMessage || null,
      created_at: new Date(),
    };

    this.subscriptionEvents.push(event);
  }

  async getSubscriptionEvents(subscriptionId: string): Promise<SubscriptionEvent[]> {
    return this.subscriptionEvents.filter(e => e.subscription_id === subscriptionId);
  }
}
