import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post(':venueId/trial')
  @UseGuards(AuthGuard('jwt'))
  async startTrial(@Param('venueId') venueId: string) {
    return this.subscriptionsService.startTrial(venueId);
  }

  @Get(':venueId')
  async getSubscription(@Param('venueId') venueId: string) {
    return this.subscriptionsService.findByVenueId(venueId);
  }
}
