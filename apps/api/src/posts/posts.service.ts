import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(postData: Partial<Post>): Promise<Post> {
    const post = this.postsRepository.create(postData);
    return this.postsRepository.save(post);
  }

  async findById(id: string): Promise<Post> {
    return this.postsRepository.findOne({ where: { id } });
  }

  async findByVenueId(venueId: string): Promise<Post[]> {
    return this.postsRepository.find({ where: { venueId } });
  }

  async findLive(): Promise<Post[]> {
    return this.postsRepository.find({ where: { status: 'live' } });
  }

  async update(id: string, postData: Partial<Post>): Promise<Post> {
    await this.postsRepository.update(id, postData);
    return this.findById(id);
  }
}
