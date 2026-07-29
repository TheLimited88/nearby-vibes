import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  // POST /verification/redeem/:postId — Initiate redemption (users only)
  @Post('redeem/:postId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async initiateRedemption(
    @Param('postId') postId: string,
    @Req() req: any,
  ) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can redeem posts');
    }
    return this.verificationService.initiateRedemption(req.user.sub, postId);
  }

  // POST /verification/:redemptionId/qr-verify — Verify QR code scan
  @Post(':redemptionId/qr-verify')
  @HttpCode(200)
  async verifyQrCode(
    @Param('redemptionId') redemptionId: string,
    @Body() body: { qr_code: string },
  ) {
    if (!body.qr_code) {
      throw new BadRequestException('QR code is required');
    }
    return this.verificationService.verifyQrCode(redemptionId, body.qr_code);
  }

  // POST /verification/:redemptionId/geofence-verify — Verify geofence
  @Post(':redemptionId/geofence-verify')
  @HttpCode(200)
  async verifyGeofence(
    @Param('redemptionId') redemptionId: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    if (body.latitude === undefined || body.longitude === undefined) {
      throw new BadRequestException('Latitude and longitude are required');
    }
    return this.verificationService.verifyGeofence(
      redemptionId,
      body.latitude,
      body.longitude,
    );
  }

  // POST /verification/:redemptionId/complete — Complete redemption
  @Post(':redemptionId/complete')
  @HttpCode(200)
  async completeRedemption(
    @Param('redemptionId') redemptionId: string,
  ) {
    return this.verificationService.completeRedemption(redemptionId);
  }

  // GET /verification/:redemptionId/status — Get redemption status
  @Get(':redemptionId/status')
  async getRedemptionStatus(
    @Param('redemptionId') redemptionId: string,
  ) {
    return this.verificationService.getRedemptionStatus(redemptionId);
  }
}
