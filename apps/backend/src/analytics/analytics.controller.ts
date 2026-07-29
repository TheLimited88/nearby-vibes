import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
  Query,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // GET /analytics/posts/:postId — Get post performance metrics
  @Get('posts/:postId')
  async getPostMetrics(@Param('postId') postId: string) {
    return this.analyticsService.getPostMetrics(postId);
  }

  // POST /analytics/posts/:postId/view — Track post view
  @Post('posts/:postId/view')
  @HttpCode(204)
  async trackPostView(@Param('postId') postId: string) {
    await this.analyticsService.trackPostView(postId);
  }

  // POST /analytics/posts/:postId/click — Track post click
  @Post('posts/:postId/click')
  @HttpCode(204)
  async trackPostClick(@Param('postId') postId: string) {
    await this.analyticsService.trackPostClick(postId);
  }

  // GET /analytics/venues/:venueId/dashboard — Get venue dashboard
  @Get('venues/:venueId/dashboard')
  @UseGuards(JwtAuthGuard)
  async getVenueDashboard(
    @Param('venueId') venueId: string,
    @Req() req: any,
  ) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can access this endpoint');
    }
    // Verify venue ownership
    if (req.user.sub !== venueId) {
      throw new BadRequestException('Cannot access another venue dashboard');
    }
    return this.analyticsService.getVenueDashboard(venueId);
  }

  // GET /analytics/venues/:venueId/posts — Get venue posts analytics
  @Get('venues/:venueId/posts')
  @UseGuards(JwtAuthGuard)
  async getVenuePostsAnalytics(
    @Param('venueId') venueId: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can access this endpoint');
    }
    if (req.user.sub !== venueId) {
      throw new BadRequestException('Cannot access another venue analytics');
    }
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50;
    return this.analyticsService.getVenuePostsAnalytics(venueId, limitNum);
  }

  // GET /analytics/venues/:venueId/redemptions — Get venue redemption analytics
  @Get('venues/:venueId/redemptions')
  @UseGuards(JwtAuthGuard)
  async getVenueRedemptionAnalytics(
    @Param('venueId') venueId: string,
    @Req() req: any,
  ) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can access this endpoint');
    }
    if (req.user.sub !== venueId) {
      throw new BadRequestException('Cannot access another venue analytics');
    }
    return this.analyticsService.getVenueRedemptionAnalytics(venueId);
  }
}
