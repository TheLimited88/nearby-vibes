import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications/preferences — Get user preferences
  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  async getUserPreferences(@Req() req: any) {
    return this.notificationsService.getUserPreferences(req.user.sub);
  }

  // PUT /notifications/preferences — Update user preferences
  @Put('preferences')
  @UseGuards(JwtAuthGuard)
  async updateUserPreferences(
    @Body() updates: any,
    @Req() req: any,
  ) {
    return this.notificationsService.updateUserPreferences(req.user.sub, updates);
  }

  // POST /notifications/tokens — Register FCM token
  @Post('tokens')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async registerFCMToken(
    @Body() body: { token: string; device_name?: string; platform?: string },
    @Req() req: any,
  ) {
    return this.notificationsService.registerFCMToken(
      req.user.sub,
      body.token,
      body.device_name,
      body.platform || 'web',
    );
  }

  // GET /notifications/tokens — Get user FCM tokens
  @Get('tokens')
  @UseGuards(JwtAuthGuard)
  async getUserTokens(@Req() req: any) {
    return this.notificationsService.getUserTokens(req.user.sub);
  }

  // DELETE /notifications/tokens/:tokenId — Unregister FCM token
  @Delete('tokens/:tokenId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async unregisterFCMToken(
    @Param('tokenId') tokenId: string,
    @Req() req: any,
  ) {
    return this.notificationsService.unregisterFCMToken(req.user.sub, tokenId);
  }

  // GET /notifications/queue — Get notification queue (admin only)
  @Get('queue')
  async getNotificationQueue() {
    return this.notificationsService.getNotificationQueue();
  }
}
