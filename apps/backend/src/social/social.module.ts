import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { ScoringService } from './scoring.service';
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
  providers: [SocialService, ScoringService, JwtAuthGuard],
  controllers: [SocialController],
})
export class SocialModule {}
