import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ScoringService } from './scoring.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SocialService {
  private readonly logger = new Logger(SocialService.name);

  // In-memory storage for likes and comments (Phase 3 uses mock store)
  private likes = new Map<string, { user_id: string; post_id: string }>();
  private comments = new Map<
    string,
    { id: string; user_id: string; post_id: string; content: string; created_at: Date }
  >();

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly scoringService: ScoringService,
  ) {}

  // Like a post
  async likePost(userId: string, postId: string) {
    try {
      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Check if already liked
      const likeId = `${userId}-${postId}`;
      if (this.likes.has(likeId)) {
        throw new BadRequestException('Already liked this post');
      }

      this.likes.set(likeId, { user_id: userId, post_id: postId });
      this.logger.log(`Post liked: ${postId} by ${userId}`);

      return {
        success: true,
        message: 'Post liked successfully',
        post_id: postId,
        likes_count: this.getPostLikesCount(postId),
      };
    } catch (error) {
      this.logger.error('Failed to like post', error);
      throw error;
    }
  }

  // Unlike a post
  async unlikePost(userId: string, postId: string) {
    try {
      const likeId = `${userId}-${postId}`;
      if (!this.likes.has(likeId)) {
        throw new BadRequestException('You have not liked this post');
      }

      this.likes.delete(likeId);
      this.logger.log(`Post unliked: ${postId} by ${userId}`);

      return {
        success: true,
        message: 'Post unliked successfully',
        post_id: postId,
        likes_count: this.getPostLikesCount(postId),
      };
    } catch (error) {
      this.logger.error('Failed to unlike post', error);
      throw error;
    }
  }

  // Check if user liked post
  async isPostLiked(userId: string, postId: string): Promise<boolean> {
    const likeId = `${userId}-${postId}`;
    return this.likes.has(likeId);
  }

  // Get likes count for post
  private getPostLikesCount(postId: string): number {
    let count = 0;
    for (const [, like] of this.likes) {
      if (like.post_id === postId) {
        count++;
      }
    }
    return count;
  }

  // Add comment to post
  async addComment(userId: string, postId: string, content: string) {
    try {
      if (!content || content.trim().length === 0) {
        throw new BadRequestException('Comment cannot be empty');
      }

      if (content.length > 500) {
        throw new BadRequestException('Comment must be less than 500 characters');
      }

      const user = await this.databaseService.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const commentId = uuid();
      const comment = {
        id: commentId,
        user_id: userId,
        post_id: postId,
        content: content.trim(),
        created_at: new Date(),
      };

      this.comments.set(commentId, comment);
      this.logger.log(`Comment added: ${commentId} on post ${postId}`);

      return {
        id: comment.id,
        post_id: postId,
        user: {
          id: user.id,
          name: user.display_name || user.email,
        },
        content: comment.content,
        created_at: comment.created_at,
      };
    } catch (error) {
      this.logger.error('Failed to add comment', error);
      throw error;
    }
  }

  // Get post comments
  async getPostComments(postId: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const postComments = Array.from(this.comments.values())
        .filter((c) => c.post_id === postId)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

      return {
        post_id: postId,
        comments_count: postComments.length,
        comments: postComments.map((c) => ({
          id: c.id,
          user_id: c.user_id,
          content: c.content,
          created_at: c.created_at,
        })),
      };
    } catch (error) {
      this.logger.error('Failed to get post comments', error);
      throw error;
    }
  }

  // Get trending posts
  async getTrendingPosts(limit: number = 20) {
    try {
      const posts = await this.databaseService.findPublishedPosts(100);

      const postsWithEngagement = posts.map((post) => ({
        ...post,
        likes_count: this.getPostLikesCount(post.id),
        comments_count: Array.from(this.comments.values()).filter(
          (c) => c.post_id === post.id,
        ).length,
      }));

      const trendingScores = postsWithEngagement
        .map((post) => ({
          ...post,
          trending_score: this.scoringService.getTrendingScore(post),
        }))
        .sort((a, b) => b.trending_score - a.trending_score)
        .slice(0, limit);

      return {
        posts_count: trendingScores.length,
        posts: trendingScores.map((post) => ({
          id: post.id,
          title: post.title,
          venue_name: post.venue.venue_name,
          discount: `${post.discount_percent}%`,
          engagement: {
            likes: this.getPostLikesCount(post.id),
            comments: Array.from(this.comments.values()).filter(
              (c) => c.post_id === post.id,
            ).length,
            views: post.view_count,
            clicks: post.click_count,
          },
          trending_score: post.trending_score,
          published_at: post.published_at,
        })),
      };
    } catch (error) {
      this.logger.error('Failed to get trending posts', error);
      throw error;
    }
  }

  // Get post with full social stats
  async getPostWithSocialStats(postId: string, userId?: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const likesCount = this.getPostLikesCount(postId);
      const commentsCount = Array.from(this.comments.values()).filter(
        (c) => c.post_id === postId,
      ).length;

      const isLiked = userId
        ? await this.isPostLiked(userId, postId)
        : false;

      return {
        post: {
          id: post.id,
          title: post.title,
          description: post.description,
          discount: `${post.discount_percent}%`,
          status: post.status,
          expires_at: post.expires_at,
        },
        venue: {
          id: post.venue.id,
          name: post.venue.venue_name,
          address: post.venue.address,
        },
        engagement: {
          likes: likesCount,
          comments: commentsCount,
          views: post.view_count,
          clicks: post.click_count,
          redemptions: post.redeem_count,
          is_liked_by_user: isLiked,
        },
        timestamps: {
          created_at: post.created_at,
          published_at: post.published_at,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get post with social stats', error);
      throw error;
    }
  }
}
