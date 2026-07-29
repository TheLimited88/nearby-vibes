import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { QrService } from './qr.service';
import { GeofenceService } from './geofence.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly qrService: QrService,
    private readonly geofenceService: GeofenceService,
  ) {}

  // Initiate post redemption (user scans QR code)
  async initiateRedemption(userId: string, postId: string) {
    try {
      // Verify user and post exist
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.status !== 'published') {
        throw new BadRequestException('Post is not available for redemption');
      }

      // Check if post has expired
      if (new Date() > new Date(post.expires_at)) {
        throw new BadRequestException('Post offer has expired');
      }

      // Create redemption record
      const redemptionId = uuid();
      const qrCode = this.qrService.generateQrCode(postId, redemptionId);

      const redemption = await this.databaseService.createRedemption({
        id: redemptionId,
        user_id: userId,
        post_id: postId,
        venue_id: post.venue_id,
        status: 'initiated',
        qr_code: qrCode,
      });

      this.logger.log(`Redemption initiated: ${redemptionId}`);

      return {
        redemption_id: redemption.id,
        qr_code: qrCode,
        qr_url: this.qrService.generateQrUrl(qrCode),
        post: {
          id: post.id,
          title: post.title,
          discount_percent: post.discount_percent,
          expires_at: post.expires_at,
        },
        venue: {
          id: post.venue_id,
          name: post.venue.venue_name,
          address: post.venue.address,
          latitude: post.venue.latitude,
          longitude: post.venue.longitude,
        },
        message: 'Redemption initiated. Please scan QR code or verify location.',
      };
    } catch (error) {
      this.logger.error('Failed to initiate redemption', error);
      throw error;
    }
  }

  // Verify QR code scan
  async verifyQrCode(redemptionId: string, qrCode: string) {
    try {
      const redemption = await this.databaseService.findRedemptionById(
        redemptionId,
      );
      if (!redemption) {
        throw new NotFoundException('Redemption not found');
      }

      if (redemption.status === 'completed') {
        throw new BadRequestException('This post has already been redeemed');
      }

      // Verify QR code
      const isValid = this.qrService.verifyQrCode(
        qrCode,
        redemption.post_id,
        redemptionId,
      );

      if (!isValid) {
        throw new BadRequestException('Invalid QR code');
      }

      // Update redemption
      await this.databaseService.updateRedemption(redemptionId, {
        status: 'qr_scanned',
        qr_scanned_at: new Date(),
      });

      this.logger.log(`QR code verified: ${redemptionId}`);

      return {
        success: true,
        message: 'QR code verified. Please verify your location.',
        next_step: 'geofence_verification',
      };
    } catch (error) {
      this.logger.error('QR code verification failed', error);
      throw error;
    }
  }

  // Verify geofence (user location check)
  async verifyGeofence(
    redemptionId: string,
    userLatitude: number,
    userLongitude: number,
  ) {
    try {
      // Validate coordinates
      const validation = this.geofenceService.validateCoordinates(
        userLatitude,
        userLongitude,
      );
      if (!validation.valid) {
        throw new BadRequestException(validation.error);
      }

      const redemption = await this.databaseService.findRedemptionById(
        redemptionId,
      );
      if (!redemption) {
        throw new NotFoundException('Redemption not found');
      }

      if (redemption.status === 'completed') {
        throw new BadRequestException('This post has already been redeemed');
      }

      const venue = redemption.venue;
      if (!venue.latitude || !venue.longitude) {
        throw new BadRequestException(
          'Venue location is not set. Please try at the venue.',
        );
      }

      // Calculate distance
      const distance = this.geofenceService.getDistance(
        userLatitude,
        userLongitude,
        parseFloat(venue.latitude.toString()),
        parseFloat(venue.longitude.toString()),
      );

      // Check if within geofence
      const isWithinGeofence = this.geofenceService.isWithinGeofence(
        userLatitude,
        userLongitude,
        parseFloat(venue.latitude.toString()),
        parseFloat(venue.longitude.toString()),
      );

      if (!isWithinGeofence) {
        throw new BadRequestException(
          `You are ${distance}m away from the venue. Please get closer.`,
        );
      }

      // Update redemption
      await this.databaseService.updateRedemption(redemptionId, {
        user_latitude: userLatitude,
        user_longitude: userLongitude,
        distance_m: distance,
        status: 'geofence_verified',
        geofence_verified_at: new Date(),
      });

      this.logger.log(`Geofence verified: ${redemptionId}`);

      return {
        success: true,
        message: 'Location verified! Post redeemed successfully.',
        distance_m: distance,
        status: 'completed',
      };
    } catch (error) {
      this.logger.error('Geofence verification failed', error);
      throw error;
    }
  }

  // Complete redemption (after QR + geofence verification)
  async completeRedemption(redemptionId: string) {
    try {
      const redemption = await this.databaseService.findRedemptionById(
        redemptionId,
      );
      if (!redemption) {
        throw new NotFoundException('Redemption not found');
      }

      if (redemption.status !== 'geofence_verified') {
        throw new BadRequestException(
          'Redemption must pass QR and geofence verification first',
        );
      }

      // Update redemption status
      await this.databaseService.updateRedemption(redemptionId, {
        status: 'completed',
        completed_at: new Date(),
      });

      // Update post redeem count
      const post = await this.databaseService.findPostById(redemption.post_id);
      if (post) {
        await this.databaseService.updatePost(post.id, {
          redeem_count: post.redeem_count + 1,
        });
      }

      this.logger.log(`Redemption completed: ${redemptionId}`);

      return {
        success: true,
        message: 'Post redeemed successfully!',
        redemption_id: redemptionId,
      };
    } catch (error) {
      this.logger.error('Failed to complete redemption', error);
      throw error;
    }
  }

  // Get redemption status
  async getRedemptionStatus(redemptionId: string) {
    try {
      const redemption = await this.databaseService.findRedemptionById(
        redemptionId,
      );
      if (!redemption) {
        throw new NotFoundException('Redemption not found');
      }

      return {
        redemption_id: redemption.id,
        status: redemption.status,
        post: {
          id: redemption.post.id,
          title: redemption.post.title,
        },
        venue: {
          id: redemption.venue.id,
          name: redemption.venue.venue_name,
        },
        created_at: redemption.created_at,
        qr_scanned_at: redemption.qr_scanned_at,
        geofence_verified_at: redemption.geofence_verified_at,
        completed_at: redemption.completed_at,
      };
    } catch (error) {
      this.logger.error('Failed to get redemption status', error);
      throw error;
    }
  }
}
