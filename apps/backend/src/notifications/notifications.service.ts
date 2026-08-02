import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  timestamp: Date;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Mock storage for preferences and tokens
  private userPreferences = new Map<string, any>();
  private fcmTokens = new Map<string, { user_id: string; token: string; platform: string }>();
  private notificationQueue: Notification[] = [];

  constructor(private readonly databaseService: DatabaseService) {
    this.initializeDefaultPreferences();
  }

  private initializeDefaultPreferences() {
    // Initialize default preferences for all users
  }

  // Get user preferences
  async getUserPreferences(userId: string) {
    try {
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Return stored or default preferences
      const prefs = this.userPreferences.get(userId) || {
        notify_new_posts: true,
        notify_post_updates: true,
        notify_new_followers: true,
        notify_comments: true,
        notify_likes: true,
        notify_redemption_reminders: true,
        notify_venue_announcements: true,
        email_weekly_digest: false,
        email_promotional: false,
        email_transactional: true,
        push_notifications_enabled: true,
        preferred_distance_km: 5,
      };

      return {
        user_id: userId,
        preferences: prefs,
      };
    } catch (error) {
      this.logger.error('Failed to get user preferences', error);
      throw error;
    }
  }

  // Update user preferences
  async updateUserPreferences(userId: string, updates: any) {
    try {
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const currentPrefs = this.userPreferences.get(userId) || {};
      const updatedPrefs = { ...currentPrefs, ...updates };

      this.userPreferences.set(userId, updatedPrefs);
      this.logger.log(`Preferences updated for user: ${userId}`);

      return {
        success: true,
        message: 'Preferences updated successfully',
        preferences: updatedPrefs,
      };
    } catch (error) {
      this.logger.error('Failed to update user preferences', error);
      throw error;
    }
  }

  // Register FCM token
  async registerFCMToken(userId: string, token: string, deviceName?: string, platform: string = 'web') {
    try {
      if (!token || token.trim().length === 0) {
        throw new BadRequestException('FCM token is required');
      }

      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const tokenId = uuid();
      this.fcmTokens.set(tokenId, {
        user_id: userId,
        token,
        platform,
      });

      this.logger.log(`FCM token registered for user: ${userId}`);

      return {
        success: true,
        message: 'Device registered for notifications',
        token_id: tokenId,
        platform,
      };
    } catch (error) {
      this.logger.error('Failed to register FCM token', error);
      throw error;
    }
  }

  // Unregister FCM token
  async unregisterFCMToken(userId: string, tokenId: string) {
    try {
      const token = this.fcmTokens.get(tokenId);
      if (!token || token.user_id !== userId) {
        throw new NotFoundException('Token not found');
      }

      this.fcmTokens.delete(tokenId);
      this.logger.log(`FCM token unregistered for user: ${userId}`);

      return {
        success: true,
        message: 'Device unregistered from notifications',
      };
    } catch (error) {
      this.logger.error('Failed to unregister FCM token', error);
      throw error;
    }
  }

  // Get user FCM tokens
  async getUserTokens(userId: string) {
    try {
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const tokens = Array.from(this.fcmTokens.entries())
        .filter(([, token]) => token.user_id === userId)
        .map(([id, token]) => ({
          id,
          platform: token.platform,
          registered: true,
        }));

      return {
        user_id: userId,
        tokens_count: tokens.length,
        tokens,
      };
    } catch (error) {
      this.logger.error('Failed to get user tokens', error);
      throw error;
    }
  }

  // Send notification to user (mock implementation)
  async sendNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const prefs = this.userPreferences.get(userId) || {};
      if (!prefs.push_notifications_enabled) {
        return { success: false, message: 'Notifications disabled by user' };
      }

      const notification: Notification = {
        id: uuid(),
        type: 'notification',
        title,
        body,
        data,
        timestamp: new Date(),
      };

      this.notificationQueue.push(notification);
      this.logger.log(`Notification queued for user: ${userId}`);

      return {
        success: true,
        message: 'Notification sent',
        notification_id: notification.id,
      };
    } catch (error) {
      this.logger.error('Failed to send notification', error);
      throw error;
    }
  }

  // Send batch notifications
  async sendBatchNotifications(userIds: string[], title: string, body: string) {
    try {
      const results = await Promise.all(
        userIds.map((uid) => this.sendNotification(uid, title, body)),
      );

      const successful = results.filter((r) => r.success).length;
      return {
        total: userIds.length,
        successful,
        failed: userIds.length - successful,
      };
    } catch (error) {
      this.logger.error('Failed to send batch notifications', error);
      throw error;
    }
  }

  // Get notification queue
  getNotificationQueue(limit: number = 50) {
    return {
      queued_count: this.notificationQueue.length,
      notifications: this.notificationQueue.slice(-limit).reverse(),
    };
  }
}
