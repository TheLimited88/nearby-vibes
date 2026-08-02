import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePostDto, UpdatePostDto } from './dtos/create-post.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  // Create a new post (REQ-POST-001)
  async createPost(createPostDto: CreatePostDto, venueId: string) {
    try {
      // Verify venue exists and belongs to the current user
      const venue = await this.databaseService.findVenueById(venueId);
      if (!venue) {
        throw new NotFoundException('Venue not found');
      }

      // Verify that the post's venue_id matches the authenticated venue
      if (createPostDto.venue_id !== venueId) {
        throw new BadRequestException(
          'Cannot create post for a different venue',
        );
      }

      // Create post
      const post = await this.databaseService.createPost({
        id: uuid(),
        venue_id: venueId,
        title: createPostDto.title,
        description: createPostDto.description,
        image_url: createPostDto.image_url,
        expires_at: new Date(createPostDto.expires_at),
        discount_percent: createPostDto.discount_percent,
        discount_cap: createPostDto.discount_cap,
        category: createPostDto.category,
        tags: createPostDto.tags,
        status: 'draft',
        view_count: 0,
        click_count: 0,
        redeem_count: 0,
      });

      this.logger.log(`Post created: ${post.id}`);

      return {
        id: post.id,
        venue_id: post.venue_id,
        title: post.title,
        status: post.status,
        expires_at: post.expires_at,
      };
    } catch (error) {
      this.logger.error('Failed to create post', error);
      throw error;
    }
  }

  // Get a single post
  async getPost(postId: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (error) {
      this.logger.error('Failed to get post', error);
      throw error;
    }
  }

  // Get posts by venue
  async getVenuePosts(venueId: string) {
    try {
      const posts = await this.databaseService.findPostsByVenueId(venueId);
      return posts;
    } catch (error) {
      this.logger.error('Failed to get venue posts', error);
      throw error;
    }
  }

  // Publish a post
  async publishPost(postId: string, venueId: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.venue_id !== venueId) {
        throw new BadRequestException(
          'Cannot publish a post for a different venue',
        );
      }

      if (post.status !== 'draft') {
        throw new BadRequestException(
          'Only draft posts can be published',
        );
      }

      const updatedPost = await this.databaseService.updatePost(postId, {
        status: 'published',
        published_at: new Date(),
      });

      this.logger.log(`Post published: ${postId}`);

      return updatedPost;
    } catch (error) {
      this.logger.error('Failed to publish post', error);
      throw error;
    }
  }

  // Update a post
  async updatePost(
    postId: string,
    venueId: string,
    updatePostDto: UpdatePostDto,
  ) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.venue_id !== venueId) {
        throw new BadRequestException(
          'Cannot update a post for a different venue',
        );
      }

      if (post.status === 'published' || post.status === 'expired') {
        throw new BadRequestException(
          'Cannot update published or expired posts',
        );
      }

      const updateData: any = { ...updatePostDto };
      if (updatePostDto.expires_at) {
        updateData.expires_at = new Date(updatePostDto.expires_at);
      }

      const updatedPost = await this.databaseService.updatePost(
        postId,
        updateData,
      );

      this.logger.log(`Post updated: ${postId}`);

      return updatedPost;
    } catch (error) {
      this.logger.error('Failed to update post', error);
      throw error;
    }
  }

  // Cancel a post
  async cancelPost(postId: string, venueId: string) {
    try {
      const post = await this.databaseService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.venue_id !== venueId) {
        throw new BadRequestException(
          'Cannot cancel a post for a different venue',
        );
      }

      if (post.status === 'cancelled' || post.status === 'expired') {
        throw new BadRequestException(
          'Cannot cancel already cancelled or expired posts',
        );
      }

      const updatedPost = await this.databaseService.updatePost(postId, {
        status: 'cancelled',
      });

      this.logger.log(`Post cancelled: ${postId}`);

      return updatedPost;
    } catch (error) {
      this.logger.error('Failed to cancel post', error);
      throw error;
    }
  }

  // Discover published posts (for users)
  async discoverPosts(limit: number = 50) {
    try {
      const posts = await this.databaseService.findPublishedPosts(limit);
      return posts;
    } catch (error) {
      this.logger.error('Failed to discover posts', error);
      throw error;
    }
  }
}
