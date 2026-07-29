import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  // POST /discovery/follow/:venueId — Follow a venue (users only)
  @Post('follow/:venueId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async followVenue(@Param('venueId') venueId: string, @Req() req: any) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can follow venues');
    }
    return this.discoveryService.followVenue(req.user.sub, venueId);
  }

  // DELETE /discovery/follow/:venueId — Unfollow a venue (users only)
  @Delete('follow/:venueId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async unfollowVenue(@Param('venueId') venueId: string, @Req() req: any) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can unfollow venues');
    }
    return this.discoveryService.unfollowVenue(req.user.sub, venueId);
  }

  // GET /discovery/follows — Get user's followed venues (users only)
  @Get('follows')
  @UseGuards(JwtAuthGuard)
  async getUserFollows(@Req() req: any) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can access this endpoint');
    }
    return this.discoveryService.getUserFollows(req.user.sub);
  }

  // GET /discovery/feed — Get personalized feed (users only)
  @Get('feed')
  @UseGuards(JwtAuthGuard)
  async getPersonalizedFeed(
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can access this endpoint');
    }
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50;
    return this.discoveryService.getPersonalizedFeed(req.user.sub, limitNum);
  }

  // GET /discovery/search — Search venues
  @Get('search')
  async searchVenues(
    @Query('q') query?: string,
    @Query('limit') limit?: string,
  ) {
    if (!query) {
      throw new BadRequestException('Search query required (q parameter)');
    }
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 20;
    return this.discoveryService.searchVenues(query, limitNum);
  }

  // GET /discovery/nearby — Find nearby venues
  @Get('nearby')
  async getNearbyVenues(
    @Query('lat') latitude?: string,
    @Query('lng') longitude?: string,
    @Query('radius') radius?: string,
    @Query('limit') limit?: string,
  ) {
    if (!latitude || !longitude) {
      throw new BadRequestException('Latitude (lat) and longitude (lng) required');
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusKm = radius ? parseFloat(radius) : 5;
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 20;

    if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm)) {
      throw new BadRequestException('Invalid coordinate values');
    }

    return this.discoveryService.getNearbyVenues(lat, lng, radiusKm, limitNum);
  }

  // GET /discovery/popular — Discover popular venues
  @Get('popular')
  async discoverPopularVenues(@Query('limit') limit?: string) {
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 20;
    return this.discoveryService.discoverPopularVenues(limitNum);
  }

  // GET /discovery/follows/:venueId — Check if user follows venue
  @Get('follows/:venueId')
  @UseGuards(JwtAuthGuard)
  async isUserFollowing(
    @Param('venueId') venueId: string,
    @Req() req: any,
  ) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can access this endpoint');
    }
    return this.discoveryService.isUserFollowing(req.user.sub, venueId);
  }
}
