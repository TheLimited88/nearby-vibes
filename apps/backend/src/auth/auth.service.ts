import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, VenueSignupDto } from './dtos/signup.dto';
import { DatabaseService } from '../database/database.service';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  // Consumer User Signup (REQ-AUTH-001)
  async userSignup(signupDto: SignupDto) {
    try {
      // Check if user already exists
      const existingUser = await this.databaseService.findUserByEmail(
        signupDto.email,
      );

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Hash password (will be used for Firebase Auth in future)
      const password_hash = await bcrypt.hash(signupDto.password, 10);

      // Create user
      const user = await this.databaseService.createUser({
        id: uuid(),
        firebase_uid: `temp_${Date.now()}`, // Placeholder until Firebase integration
        email: signupDto.email,
        display_name: signupDto.displayName,
        onboarding_completed: false,
      });

      this.logger.log(`User created: ${user.id}`);

      return {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
      };
    } catch (error) {
      this.logger.error('User signup failed', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  // Venue Signup (REQ-AUTH-002)
  async venueSignup(venueSignupDto: VenueSignupDto) {
    try {
      // Check if venue already exists
      const existingVenue = await this.databaseService.findVenueByEmail(
        venueSignupDto.email,
      );

      if (existingVenue) {
        throw new BadRequestException('Venue with this email already exists');
      }

      // Create venue
      const venue = await this.databaseService.createVenue({
        id: uuid(),
        firebase_uid: `temp_${Date.now()}`, // Placeholder until Firebase integration
        email: venueSignupDto.email,
        venue_name: venueSignupDto.venue_name,
        address: venueSignupDto.address,
        city: venueSignupDto.city,
        state: venueSignupDto.state,
        zip_code: venueSignupDto.zip_code,
        status: 'pending_setup',
        profile_completed: false,
      });

      this.logger.log(`Venue created: ${venue.id}`);

      return {
        id: venue.id,
        email: venue.email,
        venue_name: venue.venue_name,
      };
    } catch (error) {
      this.logger.error('Venue signup failed', error);
      throw new BadRequestException('Failed to create venue');
    }
  }

  // Login with firebase UID
  async login(firebaseUid: string, userType: 'user' | 'venue') {
    try {
      let entity;

      if (userType === 'user') {
        entity = await this.databaseService.findUserByFirebaseUid(firebaseUid);
      } else {
        entity = await this.databaseService.findVenueByFirebaseUid(firebaseUid);
      }

      if (!entity) {
        throw new UnauthorizedException('User not found');
      }

      // Generate JWT token
      const token = this.jwtService.sign(
        {
          sub: entity.id,
          firebaseUid,
          userType,
        },
        { expiresIn: '7d' },
      );

      return { token, userId: entity.id, userType };
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new UnauthorizedException('Login failed');
    }
  }

  // Login with email and password (for development/testing)
  async loginWithEmail(email: string, password: string, userType: 'user' | 'venue') {
    try {
      let entity;

      if (userType === 'user') {
        entity = await this.databaseService.findUserByEmail(email);
      } else {
        entity = await this.databaseService.findVenueByEmail(email);
      }

      if (!entity) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token (no password verification yet - will be done via Firebase Auth in production)
      const token = this.jwtService.sign(
        {
          sub: entity.id,
          email: entity.email,
          userType,
        },
        { expiresIn: '7d' },
      );

      return { token, userId: entity.id, userType };
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new UnauthorizedException('Login failed');
    }
  }

  // Verify JWT token
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
