import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  Logger,
  Headers,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PaddleService } from './paddle.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

interface CreateCheckoutDto {
  plan: 'premium' | 'pro';
  promoCode?: string;
}

@Controller('subscriptions')
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly paddleService: PaddleService,
  ) {}

  // Get current subscription for venue
  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentSubscription(@Req() req: any) {
    const venueId = req.user.sub;
    const subscription = await this.subscriptionsService.getSubscription(venueId);

    if (!subscription) {
      return { subscription: null, message: 'No active subscription' };
    }

    return {
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        trial_ends_at: subscription.trial_ends_at,
        next_billing_date: subscription.next_billing_date,
        amount: subscription.amount,
        founding_venue: subscription.founding_venue,
      },
    };
  }

  // Create checkout session
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(@Req() req: any, @Body() dto: CreateCheckoutDto) {
    const venueId = req.user.sub;

    if (!dto.plan || !['premium', 'pro'].includes(dto.plan)) {
      throw new BadRequestException('Invalid plan');
    }

    try {
      const checkout = await this.subscriptionsService.createCheckout({
        venueId,
        plan: dto.plan as any,
        promoCode: dto.promoCode,
      });

      return {
        success: true,
        checkout_url: checkout.paddleCheckoutUrl,
        subscription_id: checkout.subscriptionId,
        expires_at: checkout.expiresAt,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // Verify can access premium feature
  @Get('premium-access')
  @UseGuards(JwtAuthGuard)
  async checkPremiumAccess(@Req() req: any) {
    const venueId = req.user.sub;
    const hasAccess = await this.subscriptionsService.checkCanAccessPremiumFeature(
      venueId,
    );

    return {
      has_premium_access: hasAccess,
      feature: 'team_seats',
    };
  }

  // Webhook endpoint for Paddle events
  @Post('webhook/paddle')
  async handlePaddleWebhook(
    @Body() event: any,
    @Headers('paddle-signature') signature: string,
  ) {
    this.logger.log(`Received Paddle webhook: ${event.event_type}`);

    if (!signature) {
      throw new BadRequestException('Missing webhook signature');
    }

    // Verify webhook signature
    if (!this.paddleService.verifyWebhookSignature(event, signature)) {
      this.logger.warn('Invalid webhook signature');
      throw new BadRequestException('Invalid signature');
    }

    // Process webhook event
    await this.subscriptionsService.handleWebhookEvent(event);

    return {
      success: true,
      event_id: event.event_id,
    };
  }

  // Get subscription events (admin only)
  @Get('events/:subscriptionId')
  async getEvents(@Param('subscriptionId') subscriptionId: string) {
    const events = await this.subscriptionsService.getSubscriptionEvents(
      subscriptionId,
    );

    return {
      subscription_id: subscriptionId,
      events,
      total: events.length,
    };
  }

  // Admin: Trigger trial expiration check (for scheduled job)
  @Post('admin/check-trial-expirations')
  async checkTrialExpirations() {
    const expiredCount = await this.subscriptionsService.handleTrialExpirations();
    return {
      expired_count: expiredCount,
      message: `${expiredCount} trial subscriptions expired`,
    };
  }

  // Admin: Send renewal reminders (for scheduled job)
  @Post('admin/send-renewal-reminders')
  async sendReminderss() {
    const reminderCount = await this.subscriptionsService.sendRenewalReminders();
    return {
      reminder_count: reminderCount,
      message: `Sent ${reminderCount} renewal reminders`,
    };
  }

  // Admin: Check grace period expirations (for scheduled job)
  @Post('admin/check-grace-periods')
  async checkGracePeriods() {
    const expiredCount = await this.subscriptionsService.handleGracePeriodExpirations();
    return {
      expired_count: expiredCount,
      message: `${expiredCount} grace periods expired`,
    };
  }
}
