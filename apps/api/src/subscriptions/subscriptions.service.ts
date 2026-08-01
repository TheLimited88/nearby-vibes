import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(subData: Partial<Subscription>): Promise<Subscription> {
    const sub = this.subscriptionsRepository.create(subData);
    return this.subscriptionsRepository.save(sub);
  }

  async findByVenueId(venueId: string): Promise<Subscription> {
    return this.subscriptionsRepository.findOne({ where: { venueId } });
  }

  async startTrial(venueId: string): Promise<Subscription> {
    const trialStartsAt = new Date();
    const trialEndsAt = new Date(trialStartsAt.getTime() + 14 * 24 * 60 * 60 * 1000);

    return this.create({
      venueId,
      status: 'trial',
      planType: 'premium',
      trialStartsAt,
      trialEndsAt,
    });
  }

  async update(venueId: string, subData: Partial<Subscription>): Promise<Subscription> {
    await this.subscriptionsRepository.update({ venueId }, subData);
    return this.findByVenueId(venueId);
  }
}
