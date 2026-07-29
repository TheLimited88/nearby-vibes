import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DiscoveryService {
  private readonly logger = new Logger(DiscoveryService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  // Follow a venue
  async followVenue(userId: string, venueId: string) {
    try {
      // Verify both exist
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const venue = await this.databaseService.findVenueById(venueId);
      if (!venue) {
        throw new NotFoundException('Venue not found');
      }

      // Check if already following
      const isFollowing = await this.databaseService.isFollowing(userId, venueId);
      if (isFollowing) {
        throw new BadRequestException('Already following this venue');
      }

      await this.databaseService.createFollow(userId, venueId);
      this.logger.log(`User ${userId} followed venue ${venueId}`);

      return {
        success: true,
        message: 'Successfully followed venue',
        venue_id: venueId,
      };
    } catch (error) {
      this.logger.error('Failed to follow venue', error);
      throw error;
    }
  }

  // Unfollow a venue
  async unfollowVenue(userId: string, venueId: string) {
    try {
      const isFollowing = await this.databaseService.isFollowing(userId, venueId);
      if (!isFollowing) {
        throw new BadRequestException('Not following this venue');
      }

      await this.databaseService.removeFollow(userId, venueId);
      this.logger.log(`User ${userId} unfollowed venue ${venueId}`);

      return {
        success: true,
        message: 'Successfully unfollowed venue',
        venue_id: venueId,
      };
    } catch (error) {
      this.logger.error('Failed to unfollow venue', error);
      throw error;
    }
  }

  // Get user's follows
  async getUserFollows(userId: string) {
    try {
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const venues = await this.databaseService.getUserFollows(userId);
      const venuesWithFollowCounts = await Promise.all(
        venues.map(async (venue) => ({
          ...venue,
          followers_count: await this.databaseService.getVenueFollowers(
            venue.id,
          ),
        })),
      );

      return {
        follows_count: venuesWithFollowCounts.length,
        venues: venuesWithFollowCounts,
      };
    } catch (error) {
      this.logger.error('Failed to get user follows', error);
      throw error;
    }
  }

  // Get personalized feed (posts from followed venues)
  async getPersonalizedFeed(userId: string, limit: number = 50) {
    try {
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const posts = await this.databaseService.getFollowedVenuesPosts(
        userId,
        limit,
      );

      return {
        posts_count: posts.length,
        posts,
      };
    } catch (error) {
      this.logger.error('Failed to get personalized feed', error);
      throw error;
    }
  }

  // Search venues
  async searchVenues(query: string, limit: number = 20) {
    try {
      if (!query || query.trim().length < 2) {
        throw new BadRequestException('Search query must be at least 2 characters');
      }

      const venues = await this.databaseService.searchVenues(query, limit);
      const venuesWithCounts = await Promise.all(
        venues.map(async (venue) => ({
          ...venue,
          followers_count: await this.databaseService.getVenueFollowers(
            venue.id,
          ),
        })),
      );

      return {
        query,
        results_count: venuesWithCounts.length,
        venues: venuesWithCounts,
      };
    } catch (error) {
      this.logger.error('Venue search failed', error);
      throw error;
    }
  }

  // Find nearby venues
  async getNearbyVenues(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
    limit: number = 20,
  ) {
    try {
      if (!latitude || !longitude) {
        throw new BadRequestException('Latitude and longitude are required');
      }

      if (radiusKm < 0.1 || radiusKm > 50) {
        throw new BadRequestException('Radius must be between 0.1 and 50 km');
      }

      const venues = await this.databaseService.findNearbyVenues(
        latitude,
        longitude,
        radiusKm,
        limit,
      );

      const venuesWithCounts = await Promise.all(
        venues.map(async (venue) => ({
          ...venue,
          followers_count: await this.databaseService.getVenueFollowers(
            venue.id,
          ),
        })),
      );

      return {
        location: { latitude, longitude },
        radius_km: radiusKm,
        results_count: venuesWithCounts.length,
        venues: venuesWithCounts,
      };
    } catch (error) {
      this.logger.error('Nearby venues search failed', error);
      throw error;
    }
  }

  // Discover popular venues
  async discoverPopularVenues(limit: number = 20) {
    try {
      const venues = await this.databaseService.getActiveVenues(limit);
      const venuesWithCounts = await Promise.all(
        venues.map(async (venue) => ({
          ...venue,
          followers_count: await this.databaseService.getVenueFollowers(
            venue.id,
          ),
        })),
      );

      return {
        results_count: venuesWithCounts.length,
        venues: venuesWithCounts,
      };
    } catch (error) {
      this.logger.error('Popular venues discovery failed', error);
      throw error;
    }
  }

  // Check if user follows venue
  async isUserFollowing(userId: string, venueId: string) {
    try {
      const isFollowing = await this.databaseService.isFollowing(userId, venueId);
      return { is_following: isFollowing };
    } catch (error) {
      this.logger.error('Failed to check follow status', error);
      throw error;
    }
  }
}
