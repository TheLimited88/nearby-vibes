import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('venues')
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createVenue(@Body() venueData: any) {
    return this.venuesService.create(venueData);
  }

  @Get('nearby')
  async getNearbyVenues(
    @Query('lat') latitude: number,
    @Query('lon') longitude: number,
    @Query('radius') radius: number = 5,
  ) {
    return this.venuesService.findNearby(latitude, longitude, radius);
  }

  @Get(':id')
  async getVenue(@Param('id') id: string) {
    return this.venuesService.findById(id);
  }
}
