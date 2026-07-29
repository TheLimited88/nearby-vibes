import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { TotpService } from './totp.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [AdminAuthService, TotpService],
  controllers: [AdminAuthController],
  exports: [AdminAuthService, TotpService],
})
export class AdminModule {}
