import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  // Get post performance metrics
  async getPostMetrics(postId: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const redemptions = await this.databaseService.getPostRedemptions(postId);
      const completedRedemptions = redemptions.filter(
        (r) => r.status === 'completed',
      );

      // Calculate conversion rate
      const conversionRate =
        post.view_count > 0
          ? ((completedRedemptions.length / post.view_count) * 100).toFixed(2)
          : '0.00';

      // Calculate engagement rate
      const engagementRate =
        post.view_count > 0
          ? ((post.click_count / post.view_count) * 100).toFixed(2)
          : '0.00';

      return {
        post_id: post.id,
        title: post.title,
        status: post.status,
        metrics: {
          views: post.view_count,
          clicks: post.click_count,
          click_through_rate: `${engagementRate}%`,
          redemptions: post.redeem_count,
          conversion_rate: `${conversionRate}%`,
          redeemed: completedRedemptions.length,
          pending: redemptions.filter((r) => r.status !== 'completed').length,
        },
        offer: {
          discount_percent: post.discount_percent,
          expires_at: post.expires_at,
          published_at: post.published_at,
        },
        timestamps: {
          created_at: post.created_at,
          updated_at: post.updated_at,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get post metrics', error);
      throw error;
    }
  }

  // Get venue dashboard overview
  async getVenueDashboard(venueId: string) {
    try {
      const venue = await this.databaseService.findVenueById(venueId);
      if (!venue) {
        throw new NotFoundException('Venue not found');
      }

      const posts = await this.databaseService.findPostsByVenueId(venueId);
      const redemptions = await this.databaseService.getVenueRedemptions(venueId);
      const followers = await this.databaseService.getVenueFollowers(venueId);

      // Aggregate metrics
      const publishedPosts = posts.filter((p) => p.status === 'published');
      const totalViews = posts.reduce((sum, p) => sum + p.view_count, 0);
      const totalClicks = posts.reduce((sum, p) => sum + p.click_count, 0);
      const totalRedeems = posts.reduce((sum, p) => sum + p.redeem_count, 0);

      const completedRedemptions = redemptions.filter(
        (r) => r.status === 'completed',
      );

      // Calculate overall conversion rate
      const overallConversionRate =
        totalViews > 0 ? ((totalRedeems / totalViews) * 100).toFixed(2) : '0.00';

      const overallCTR =
        totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';

      return {
        venue: {
          id: venue.id,
          name: venue.venue_name,
          address: venue.address,
          city: venue.city,
          followers_count: followers,
          profile_completed: venue.profile_completed,
        },
        posts: {
          total: posts.length,
          published: publishedPosts.length,
          draft: posts.filter((p) => p.status === 'draft').length,
          expired: posts.filter((p) => p.status === 'expired').length,
        },
        engagement: {
          total_views: totalViews,
          total_clicks: totalClicks,
          click_through_rate: `${overallCTR}%`,
          total_redemptions: totalRedeems,
          conversion_rate: `${overallConversionRate}%`,
          completed_redemptions: completedRedemptions.length,
        },
        performance: {
          top_post: this.getTopPost(posts),
          avg_views_per_post: (totalViews / (posts.length || 1)).toFixed(0),
          avg_redemptions_per_post: (totalRedeems / (posts.length || 1)).toFixed(2),
        },
      };
    } catch (error) {
      this.logger.error('Failed to get venue dashboard', error);
      throw error;
    }
  }

  // Get venue posts with analytics
  async getVenuePostsAnalytics(venueId: string, limit: number = 50) {
    try {
      const venue = await this.databaseService.findVenueById(venueId);
      if (!venue) {
        throw new NotFoundException('Venue not found');
      }

      const posts = await this.databaseService.findPostsByVenueId(venueId);
      const postsWithMetrics = posts.slice(0, limit).map((post) => {
        const ctr =
          post.view_count > 0
            ? ((post.click_count / post.view_count) * 100).toFixed(2)
            : '0.00';
        const conversionRate =
          post.view_count > 0
            ? ((post.redeem_count / post.view_count) * 100).toFixed(2)
            : '0.00';

        return {
          id: post.id,
          title: post.title,
          status: post.status,
          discount: `${post.discount_percent}%`,
          metrics: {
            views: post.view_count,
            clicks: post.click_count,
            ctr: `${ctr}%`,
            redemptions: post.redeem_count,
            conversion_rate: `${conversionRate}%`,
          },
          expires_at: post.expires_at,
          published_at: post.published_at,
        };
      });

      return {
        venue_id: venueId,
        posts_count: postsWithMetrics.length,
        posts: postsWithMetrics,
      };
    } catch (error) {
      this.logger.error('Failed to get venue posts analytics', error);
      throw error;
    }
  }

  // Get redemption analytics for venue
  async getVenueRedemptionAnalytics(venueId: string) {
    try {
      const venue = await this.databaseService.findVenueById(venueId);
      if (!venue) {
        throw new NotFoundException('Venue not found');
      }

      const redemptions = await this.databaseService.getVenueRedemptions(venueId);

      const completed = redemptions.filter((r) => r.status === 'completed');
      const qrScanned = redemptions.filter((r) => r.status === 'qr_scanned');
      const geofenceVerified = redemptions.filter(
        (r) => r.status === 'geofence_verified',
      );

      // Calculate average distance for geofence verifications
      const distances = geofenceVerified
        .map((r) => r.distance_m)
        .filter((d) => d !== null) as number[];
      const avgDistance =
        distances.length > 0
          ? (distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(0)
          : 'N/A';

      // Completion rate
      const completionRate =
        redemptions.length > 0
          ? ((completed.length / redemptions.length) * 100).toFixed(2)
          : '0.00';

      return {
        venue_id: venueId,
        redemptions: {
          total: redemptions.length,
          completed: completed.length,
          qr_scanned: qrScanned.length,
          geofence_verified: geofenceVerified.length,
          initiated: redemptions.filter((r) => r.status === 'initiated').length,
        },
        completion_rate: `${completionRate}%`,
        geofence_stats: {
          verified_count: geofenceVerified.length,
          average_distance_m: avgDistance,
        },
        recent_redemptions: redemptions.slice(0, 10).map((r) => ({
          id: r.id,
          user_email: r.user.email,
          post_title: r.post.title,
          status: r.status,
          created_at: r.created_at,
          completed_at: r.completed_at,
        })),
      };
    } catch (error) {
      this.logger.error('Failed to get redemption analytics', error);
      throw error;
    }
  }

  // Track post view
  async trackPostView(postId: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      await this.databaseService.updatePost(postId, {
        view_count: post.view_count + 1,
      });

      this.logger.log(`Post view tracked: ${postId}`);
    } catch (error) {
      this.logger.error('Failed to track post view', error);
      throw error;
    }
  }

  // Track post click
  async trackPostClick(postId: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      await this.databaseService.updatePost(postId, {
        click_count: post.click_count + 1,
      });

      this.logger.log(`Post click tracked: ${postId}`);
    } catch (error) {
      this.logger.error('Failed to track post click', error);
      throw error;
    }
  }

  private getTopPost(posts: any[]): any {
    if (posts.length === 0) return null;

    const topPost = posts.reduce((max, post) =>
      post.redeem_count > max.redeem_count ? post : max,
    );

    return {
      id: topPost.id,
      title: topPost.title,
      redemptions: topPost.redeem_count,
    };
  }
}
