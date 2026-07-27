import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, VenueSignupDto } from './dtos/signup.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private users = new Map(); // Mock data store
  private venues = new Map(); // Mock data store

  constructor(private readonly jwtService: JwtService) {}

  // Consumer User Signup (REQ-AUTH-001)
  async userSignup(signupDto: SignupDto) {
    try {
      // Check if user already exists
      const existingUser = Array.from(this.users.values()).find(
        (u) => u.email === signupDto.email,
      );

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Create user
      const user = {
        id: uuid(),
        firebase_uid: `temp_${Date.now()}`,
        email: signupDto.email,
        display_name: signupDto.displayName,
        created_at: new Date(),
      };

      this.users.set(user.id, user);
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
      const existingVenue = Array.from(this.venues.values()).find(
        (v) => v.email === venueSignupDto.email,
      );

      if (existingVenue) {
        throw new BadRequestException('Venue with this email already exists');
      }

      // Create venue
      const venue = {
        id: uuid(),
        firebase_uid: `temp_${Date.now()}`,
        email: venueSignupDto.email,
        venue_name: venueSignupDto.venue_name,
        address: venueSignupDto.address,
        city: venueSignupDto.city,
        state: venueSignupDto.state,
        zip_code: venueSignupDto.zip_code,
        status: 'pending_setup',
        created_at: new Date(),
      };

      this.venues.set(venue.id, venue);
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

  // Login and return JWT token
  async login(firebaseUid: string, userType: 'user' | 'venue') {
    try {
      let entity;

      if (userType === 'user') {
        entity = Array.from(this.users.values()).find(
          (u) => u.firebase_uid === firebaseUid,
        );
      } else {
        entity = Array.from(this.venues.values()).find(
          (v) => v.firebase_uid === firebaseUid,
        );
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

  // Verify JWT token
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
