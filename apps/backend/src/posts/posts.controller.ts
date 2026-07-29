import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // POST /posts — Create a new post (venue only)
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can create posts');
    }
    return this.postsService.createPost(createPostDto, req.user.sub);
  }

  // GET /posts/:id — Get a single post
  @Get(':id')
  async getPost(@Param('id') postId: string) {
    return this.postsService.getPost(postId);
  }

  // GET /posts/discover — Discover published posts (users)
  @Get('discover/feed')
  async discoverPosts(@Query('limit') limit?: string) {
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 50;
    return this.postsService.discoverPosts(limitNum);
  }

  // GET /posts/venue/:venueId — Get posts by venue
  @Get('venue/:venueId')
  async getVenuePosts(@Param('venueId') venueId: string) {
    return this.postsService.getVenuePosts(venueId);
  }

  // PUT /posts/:id — Update a post (venue only)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can update posts');
    }
    return this.postsService.updatePost(postId, req.user.sub, updatePostDto);
  }

  // POST /posts/:id/publish — Publish a post (venue only)
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async publishPost(@Param('id') postId: string, @Req() req: any) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can publish posts');
    }
    return this.postsService.publishPost(postId, req.user.sub);
  }

  // POST /posts/:id/cancel — Cancel a post (venue only)
  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async cancelPost(@Param('id') postId: string, @Req() req: any) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can cancel posts');
    }
    return this.postsService.cancelPost(postId, req.user.sub);
  }

  // DELETE /posts/:id — Delete a post (soft delete)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deletePost(@Param('id') postId: string, @Req() req: any) {
    if (req.user.userType !== 'venue') {
      throw new BadRequestException('Only venues can delete posts');
    }
    // For now, just cancel the post (soft delete via cancelled status)
    await this.postsService.cancelPost(postId, req.user.sub);
  }
}
