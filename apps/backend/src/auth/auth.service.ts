import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';
import { FirebaseService } from './firebase.service';
import { SignupDto, VenueSignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
  ) {}

  // Consumer User Signup (REQ-AUTH-001)
  async userSignup(signupDto: SignupDto) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: signupDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }

      // Create Firebase user
      const firebaseUser = await this.firebaseService.createUser(
        signupDto.email,
        signupDto.password,
      );

      // Create database user
      const user = this.userRepository.create({
        firebase_uid: firebaseUser.uid,
        email: signupDto.email,
        display_name: signupDto.displayName,
      });

      await this.userRepository.save(user);

      this.logger.log(`User created: ${user.id}`);

      return {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
      };
    } catch (error) {
      this.logger.error('User signup failed', error);
      throw error;
    }
  }

  // Venue Signup (REQ-AUTH-002)
  async venueSignup(venueSignupDto: VenueSignupDto) {
    try {
      // Check if venue already exists
      const existingVenue = await this.venueRepository.findOne({
        where: { email: venueSignupDto.email },
      });

      if (existingVenue) {
        throw new BadRequestException('Venue with this email already exists');
      }

      // Create Firebase user
      const firebaseUser = await this.firebaseService.createUser(
        venueSignupDto.email,
        venueSignupDto.password,
      );

      // Create database venue
      const venue = this.venueRepository.create({
        firebase_uid: firebaseUser.uid,
        email: venueSignupDto.email,
        venue_name: venueSignupDto.venue_name,
        address: venueSignupDto.address,
        city: venueSignupDto.city,
        state: venueSignupDto.state,
        zip_code: venueSignupDto.zip_code,
        status: 'pending_setup',
      });

      await this.venueRepository.save(venue);

      this.logger.log(`Venue created: ${venue.id}`);

      return {
        id: venue.id,
        email: venue.email,
        venue_name: venue.venue_name,
      };
    } catch (error) {
      this.logger.error('Venue signup failed', error);
      throw error;
    }
  }

  // Login and return JWT token
  async login(firebaseUid: string, userType: 'user' | 'venue') {
    try {
      let entity;

      if (userType === 'user') {
        entity = await this.userRepository.findOne({
          where: { firebase_uid: firebaseUid },
        });
      } else {
        entity = await this.venueRepository.findOne({
          where: { firebase_uid: firebaseUid },
        });
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
      throw error;
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
