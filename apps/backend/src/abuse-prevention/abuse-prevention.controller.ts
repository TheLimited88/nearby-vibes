import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AbusePreventionService } from './abuse-prevention.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('abuse-prevention')
export class AbusePreventionController {
  constructor(private readonly abusePreventionService: AbusePreventionService) {}

  // Check if place can be claimed
  @Post('check-claim')
  async checkClaim(
    @Body()
    data: {
      google_place_id: string;
      ip_address: string;
      user_agent: string;
      device_fingerprint?: string;
      country_code?: string;
    }
  ) {
    const result = await this.abusePreventionService.canClaimPlace(
      data.google_place_id,
      {
        email: '', // Will be added when user is created
        ip_address: data.ip_address,
        user_agent: data.user_agent,
        device_fingerprint: data.device_fingerprint,
        country_code: data.country_code,
      }
    );

    return result;
  }

  // Check email quality
  @Post('check-email')
  checkEmail(@Body() data: { email: string }) {
    if (!data.email || !data.email.includes('@')) {
      throw new BadRequestException('Invalid email');
    }

    const isDisposable = this.abusePreventionService.checkDisposableEmail(
      data.email
    );
    const isVpn = this.abusePreventionService.checkVpnOrProxy(''); // IP passed in context

    return {
      email: data.email,
      disposable: isDisposable,
      risky: isDisposable || isVpn,
      reason: isDisposable ? 'Disposable email not allowed' : null,
    };
  }

  // Admin: Get fraud queue
  @Get('admin/fraud-queue')
  @UseGuards(JwtAuthGuard)
  async getFraudQueue(
    @Query('severity') severity?: 'low' | 'medium' | 'high',
    @Query('reviewed') reviewed?: string
  ) {
    const queue = await this.abusePreventionService.getFraudQueue({
      severity,
      reviewed: reviewed === 'false' ? false : reviewed === 'true' ? true : undefined,
    });

    return {
      total: queue.length,
      reviewed_count: queue.filter(e => e.reviewed_at).length,
      events: queue,
    };
  }

  // Admin: Review fraud event
  @Post('admin/review-fraud/:eventId')
  @UseGuards(JwtAuthGuard)
  async reviewFraudEvent(
    @Param('eventId') eventId: string,
    @Body() data: { action: 'approve' | 'dismiss'; notes?: string },
    @Req() req: any
  ) {
    const adminId = req.user.sub;

    const event = await this.abusePreventionService.reviewFraudEvent(
      eventId,
      adminId,
      data.action,
      data.notes
    );

    if (!event) {
      throw new BadRequestException('Fraud event not found');
    }

    return {
      success: true,
      event,
    };
  }

  // Admin: Override cooldown
  @Post('admin/override-cooldown')
  @UseGuards(JwtAuthGuard)
  async overrideCooldown(
    @Body()
    data: {
      google_place_id: string;
      reason: string;
    },
    @Req() req: any
  ) {
    const adminId = req.user.sub;

    const claim = await this.abusePreventionService.overrideCooldown(
      data.google_place_id,
      adminId,
      data.reason
    );

    if (!claim) {
      throw new BadRequestException('Place claim not found');
    }

    return {
      success: true,
      message: `Cooldown overridden for ${data.google_place_id}`,
      claim,
    };
  }

  // Get place claim history
  @Get('place-history/:googlePlaceId')
  async getPlaceClaimHistory(@Param('googlePlaceId') googlePlaceId: string) {
    const history = await this.abusePreventionService.getPlaceClaimHistory(
      googlePlaceId
    );

    return {
      google_place_id: googlePlaceId,
      total_claims: history.length,
      claims: history,
    };
  }

  // Get user claim history
  @Get('user-history/:venueId')
  @UseGuards(JwtAuthGuard)
  async getUserClaimHistory(@Param('venueId') venueId: string) {
    const history = await this.abusePreventionService.getUserClaimHistory(
      venueId
    );

    return {
      venue_id: venueId,
      claims: history,
    };
  }
}
