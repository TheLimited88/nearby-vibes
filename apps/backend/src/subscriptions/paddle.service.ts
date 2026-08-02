import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

interface PaddleCheckoutSession {
  checkout_id: string;
  paddle_url: string;
  expires_at: string;
}

interface PaddleWebhookEvent {
  event_id: string;
  event_type: string;
  occurred_at: string;
  data: Record<string, any>;
}

@Injectable()
export class PaddleService {
  private readonly logger = new Logger(PaddleService.name);
  private readonly paddleApiUrl = 'https://api.paddle.com/v1';
  private readonly paddleAuthToken = process.env.PADDLE_API_KEY || '';
  private readonly paddleWebhookSecret = process.env.PADDLE_WEBHOOK_SECRET || '';

  async createCheckout(data: {
    customerId: string;
    priceId: string;
    promoCode?: string;
    metadata?: Record<string, string>;
  }): Promise<PaddleCheckoutSession> {
    // Mock implementation - in production, call Paddle API
    // POST https://api.paddle.com/v1/checkouts
    this.logger.log(`Creating checkout for customer: ${data.customerId}`);

    // For now, return a mock checkout URL
    return {
      checkout_id: `checkout_${Date.now()}`,
      paddle_url: `https://checkout.paddle.com/p/checkout/${data.customerId}`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  async getSubscription(paddleSubscriptionId: string) {
    // Mock implementation
    this.logger.log(`Fetching subscription: ${paddleSubscriptionId}`);

    return {
      id: paddleSubscriptionId,
      status: 'active',
      current_billing_period: {
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  }

  async updateSubscription(paddleSubscriptionId: string, updates: any) {
    this.logger.log(`Updating subscription: ${paddleSubscriptionId}`, updates);
    // Mock implementation
    return { id: paddleSubscriptionId, ...updates };
  }

  async cancelSubscription(paddleSubscriptionId: string, effectiveFrom?: string) {
    this.logger.log(`Cancelling subscription: ${paddleSubscriptionId}`);
    // Mock implementation
    return { id: paddleSubscriptionId, status: 'cancelled' };
  }

  verifyWebhookSignature(
    event: PaddleWebhookEvent,
    signature: string
  ): boolean {
    try {
      const payload = JSON.stringify(event);
      const expectedSignature = crypto
        .createHmac('sha256', this.paddleWebhookSecret)
        .update(payload)
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error);
      return false;
    }
  }

  calculatePlatformFee(amount: number): { fee: number; total: number } {
    // 5% + $0.50 per PRD §21
    const percentFee = amount * 0.05;
    const fixedFee = 0.5;
    const totalFee = percentFee + fixedFee;

    return {
      fee: Math.round(totalFee * 100) / 100,
      total: Math.round((amount + totalFee) * 100) / 100,
    };
  }

  isFoundingVenueEligible(): boolean {
    // Check if we're still within the Founding Venue program window
    // For now, assume we're still in the window
    return true;
  }
}
