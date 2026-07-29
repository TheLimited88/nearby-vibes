import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  HttpCode,
  Query,
} from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  // POST /social/posts/:postId/like — Like a post (users only)
  @Post('posts/:postId/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async likePost(@Param('postId') postId: string, @Req() req: any) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can like posts');
    }
    return this.socialService.likePost(req.user.sub, postId);
  }

  // DELETE /social/posts/:postId/like — Unlike a post (users only)
  @Delete('posts/:postId/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async unlikePost(@Param('postId') postId: string, @Req() req: any) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can unlike posts');
    }
    return this.socialService.unlikePost(req.user.sub, postId);
  }

  // GET /social/posts/:postId/like — Check if user liked post
  @Get('posts/:postId/like')
  @UseGuards(JwtAuthGuard)
  async isPostLiked(@Param('postId') postId: string, @Req() req: any) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can check like status');
    }
    const isLiked = await this.socialService.isPostLiked(req.user.sub, postId);
    return { post_id: postId, is_liked: isLiked };
  }

  // POST /social/posts/:postId/comments — Add comment to post (users only)
  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async addComment(
    @Param('postId') postId: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    if (req.user.userType !== 'user') {
      throw new BadRequestException('Only users can comment');
    }
    if (!body.content) {
      throw new BadRequestException('Comment content is required');
    }
    return this.socialService.addComment(req.user.sub, postId, body.content);
  }

  // GET /social/posts/:postId/comments — Get post comments
  @Get('posts/:postId/comments')
  async getPostComments(
    @Param('postId') postId: string,
    @Query('limit') limit?: string,
  ) {
    return this.socialService.getPostComments(postId);
  }

  // GET /social/trending — Get trending posts
  @Get('trending')
  async getTrendingPosts(@Query('limit') limit?: string) {
    const limitNum = limit ? Math.min(parseInt(limit, 10), 100) : 20;
    return this.socialService.getTrendingPosts(limitNum);
  }

  // GET /social/posts/:postId/stats — Get post with social stats
  @Get('posts/:postId/stats')
  @UseGuards(JwtAuthGuard)
  async getPostWithSocialStats(
    @Param('postId') postId: string,
    @Req() req: any,
  ) {
    return this.socialService.getPostWithSocialStats(
      postId,
      req.user.userType === 'user' ? req.user.sub : undefined,
    );
  }

  // GET /social/posts/:postId/stats (no auth) — Get post stats for public view
  @Get('posts/:postId/public-stats')
  async getPostPublicStats(@Param('postId') postId: string) {
    return this.socialService.getPostWithSocialStats(postId);
  }
}
