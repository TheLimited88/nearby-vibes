import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';
import { Post } from '../entities/Post';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Venue) private venuesRepository: Repository<Venue>,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
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
}
