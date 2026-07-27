import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, VenueSignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/signup')
  async userSignup(@Body() signupDto: SignupDto) {
    try {
      return await this.authService.userSignup(signupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('venue/signup')
  async venueSignup(@Body() venueSignupDto: VenueSignupDto) {
    try {
      return await this.authService.venueSignup(venueSignupDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('user/login')
  async userLogin(@Body() body: { firebaseUid: string }) {
    try {
      return await this.authService.login(body.firebaseUid, 'user');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('venue/login')
  async venueLogin(@Body() body: { firebaseUid: string }) {
    try {
      return await this.authService.login(body.firebaseUid, 'venue');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
