import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FirebaseService } from './firebase.service';
import { FirebaseStrategy } from './firebase.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [FirebaseService, FirebaseStrategy],
  exports: [FirebaseService],
})
export class AuthModule {}
