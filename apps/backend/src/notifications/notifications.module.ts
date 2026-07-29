import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [NotificationsService, JwtAuthGuard],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
