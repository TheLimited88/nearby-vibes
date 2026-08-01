import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './venue.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async create(venueData: Partial<Venue>): Promise<Venue> {
    const venue = this.venuesRepository.create(venueData);
    return this.venuesRepository.save(venue);
  }

  async findById(id: string): Promise<Venue> {
    return this.venuesRepository.findOne({ where: { id } });
  }

  async findByGooglePlaceId(googlePlaceId: string): Promise<Venue> {
    return this.venuesRepository.findOne({ where: { googlePlaceId } });
  }

  async findNearby(latitude: number, longitude: number, radiusMiles: number = 5) {
    const radiusKm = radiusMiles * 1.60934;
    return this.venuesRepository
      .createQueryBuilder('venue')
      .where(
        `ST_DWithin(
          ST_MakePoint(venue.longitude, venue.latitude)::geography,
          ST_MakePoint(:longitude, :latitude)::geography,
          :radius
        )`,
        { latitude, longitude, radius: radiusKm * 1000 }
      )
      .setParameters({ latitude, longitude, radius: radiusKm * 1000 })
      .getMany();
  }

  async update(id: string, venueData: Partial<Venue>): Promise<Venue> {
    await this.venuesRepository.update(id, venueData);
    return this.findById(id);
  }
}
