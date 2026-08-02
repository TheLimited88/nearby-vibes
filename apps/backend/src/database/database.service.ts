import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { Redemption } from '../entities/Redemption';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Venue) private venuesRepository: Repository<Venue>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Follow) private followsRepository: Repository<Follow>,
    @InjectRepository(Redemption) private redemptionsRepository: Repository<Redemption>,
  ) {}

  // User operations
  async createUser(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUserByFirebaseUid(firebase_uid: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { firebase_uid } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await this.usersRepository.update(id, data);
    return this.findUserById(id);
  }

  // Venue operations
  async createVenue(venue: Partial<Venue>): Promise<Venue> {
    return this.venuesRepository.save(venue);
  }

  async findVenueById(id: string): Promise<Venue | null> {
    return this.venuesRepository.findOne({ where: { id } });
  }

  async findVenueByEmail(email: string): Promise<Venue | null> {
    return this.venuesRepository.findOne({ where: { email } });
  }

  async findVenueByFirebaseUid(firebase_uid: string): Promise<Venue | null> {
    return this.venuesRepository.findOne({ where: { firebase_uid } });
  }

  async updateVenue(id: string, data: Partial<Venue>): Promise<Venue | null> {
    await this.venuesRepository.update(id, data);
    return this.findVenueById(id);
  }

  async findVenuesByStatus(status: string): Promise<Venue[]> {
    return this.venuesRepository.find({ where: { status } });
  }

  // Post operations
  async createPost(post: Partial<Post>): Promise<Post> {
    return this.postsRepository.save(post);
  }

  async findPostById(id: string): Promise<Post | null> {
    return this.postsRepository.findOne({
      where: { id },
      relations: ['venue'],
    });
  }

  async findPostsByVenueId(venueId: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: { venue_id: venueId },
      relations: ['venue'],
      order: { created_at: 'DESC' },
    });
  }

  async findPublishedPosts(limit: number = 50): Promise<Post[]> {
    return this.postsRepository.find({
      where: { status: 'published' },
      relations: ['venue'],
      order: { published_at: 'DESC' },
      take: limit,
    });
  }

  async updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
    await this.postsRepository.update(id, data);
    return this.findPostById(id);
  }

  async deletePost(id: string): Promise<void> {
    await this.postsRepository.softDelete(id);
  }

  async findPostsByStatus(
    status: 'draft' | 'published' | 'expired' | 'cancelled',
  ): Promise<Post[]> {
    return this.postsRepository.find({
      where: { status },
      relations: ['venue'],
      order: { created_at: 'DESC' },
    });
  }

  // Follow operations
  async createFollow(userId: string, venueId: string): Promise<Follow> {
    return this.followsRepository.save({ user_id: userId, venue_id: venueId });
  }

  async removeFollow(userId: string, venueId: string): Promise<void> {
    await this.followsRepository.delete({ user_id: userId, venue_id: venueId });
  }

  async isFollowing(userId: string, venueId: string): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
      where: { user_id: userId, venue_id: venueId },
    });
    return !!follow;
  }

  async getUserFollows(userId: string): Promise<Venue[]> {
    const follows = await this.followsRepository.find({
      where: { user_id: userId },
      relations: ['venue'],
      order: { created_at: 'DESC' },
    });
    return follows.map(f => f.venue);
  }

  async getVenueFollowers(venueId: string): Promise<number> {
    return this.followsRepository.count({ where: { venue_id: venueId } });
  }

  async getFollowedVenuesPosts(userId: string, limit: number = 50): Promise<Post[]> {
    const follows = await this.followsRepository.find({
      where: { user_id: userId },
      select: ['venue_id'],
    });

    if (follows.length === 0) {
      return [];
    }

    const venueIds = follows.map(f => f.venue_id);

    return this.postsRepository.find({
      where: [
        { venue_id: venueIds[0] },
        ...venueIds.slice(1).map(id => ({ venue_id: id })),
      ],
      relations: ['venue'],
      order: { published_at: 'DESC' },
      take: limit,
    });
  }

  // Venue discovery/search
  async searchVenues(query: string, limit: number = 20): Promise<Venue[]> {
    return this.venuesRepository
      .createQueryBuilder('venue')
      .where('venue.venue_name ILIKE :query', { query: `%${query}%` })
      .orWhere('venue.city ILIKE :query', { query: `%${query}%` })
      .orderBy('venue.created_at', 'DESC')
      .take(limit)
      .getMany();
  }

  async findNearbyVenues(latitude: number, longitude: number, _radiusKm: number = 5, limit: number = 20): Promise<Venue[]> {
    // Using PostGIS distance calculation
    return this.venuesRepository
      .createQueryBuilder('venue')
      .where('venue.latitude IS NOT NULL AND venue.longitude IS NOT NULL')
      .orderBy(
        `(3959 * acos(cos(radians(:lat)) * cos(radians(venue.latitude)) * cos(radians(venue.longitude) - radians(:lon)) + sin(radians(:lat)) * sin(radians(venue.latitude))))`,
        'ASC'
      )
      .setParameters({ lat: latitude, lon: longitude })
      .take(limit)
      .getMany();
  }

  async getActiveVenues(limit: number = 20): Promise<Venue[]> {
    return this.venuesRepository.find({
      where: { profile_completed: true },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  // Redemption operations
  async createRedemption(redemption: Partial<Redemption>): Promise<Redemption> {
    return this.redemptionsRepository.save(redemption);
  }

  async findRedemptionById(id: string): Promise<Redemption | null> {
    return this.redemptionsRepository.findOne({
      where: { id },
      relations: ['user', 'post', 'venue'],
    });
  }

  async findRedemptionByQrCode(qrCode: string): Promise<Redemption | null> {
    return this.redemptionsRepository.findOne({
      where: { qr_code: qrCode },
      relations: ['user', 'post', 'venue'],
    });
  }

  async updateRedemption(id: string, data: Partial<Redemption>): Promise<Redemption | null> {
    await this.redemptionsRepository.update(id, data);
    return this.findRedemptionById(id);
  }

  async getUserRedemptions(userId: string): Promise<Redemption[]> {
    return this.redemptionsRepository.find({
      where: { user_id: userId },
      relations: ['post', 'venue'],
      order: { created_at: 'DESC' },
    });
  }

  async getPostRedemptions(postId: string): Promise<Redemption[]> {
    return this.redemptionsRepository.find({
      where: { post_id: postId },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async getVenueRedemptions(venueId: string): Promise<Redemption[]> {
    return this.redemptionsRepository.find({
      where: { venue_id: venueId },
      relations: ['user', 'post'],
      order: { created_at: 'DESC' },
    });
  }

  async countRedemptionsByStatus(
    postId: string,
    status: 'initiated' | 'qr_scanned' | 'geofence_verified' | 'completed' | 'expired',
  ): Promise<number> {
    return this.redemptionsRepository.count({
      where: { post_id: postId, status },
    });
  }
}
