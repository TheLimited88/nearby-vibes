import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseService } from './firebase.service';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Venue]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, FirebaseService],
  controllers: [AuthController],
  exports: [AuthService, FirebaseService],
})
export class AuthModule {}
