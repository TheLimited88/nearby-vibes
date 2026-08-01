import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Body() postData: any) {
    return this.postsService.create(postData);
  }

  @Get('live')
  async getLivePosts() {
    return this.postsService.findLive();
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    return this.postsService.findById(id);
  }
}
