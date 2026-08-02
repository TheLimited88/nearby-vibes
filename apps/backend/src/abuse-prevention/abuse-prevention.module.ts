import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AbusePreventionService } from './abuse-prevention.service';
import { AbusePreventionController } from './abuse-prevention.controller';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AbusePreventionService, JwtAuthGuard],
  controllers: [AbusePreventionController],
  exports: [AbusePreventionService],
})
export class AbusePreventionModule {}
