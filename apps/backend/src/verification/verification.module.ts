import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { QrService } from './qr.service';
import { GeofenceService } from './geofence.service';
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
  providers: [VerificationService, QrService, GeofenceService, JwtAuthGuard],
  controllers: [VerificationController],
})
export class VerificationModule {}
