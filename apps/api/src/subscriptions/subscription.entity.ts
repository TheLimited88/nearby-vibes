import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  venueId: string;

  @Column({ type: 'enum', enum: ['trial', 'active', 'expired', 'cancelled'] })
  status: 'trial' | 'active' | 'expired' | 'cancelled';

  @Column({ type: 'enum', enum: ['free', 'premium'] })
  planType: 'free' | 'premium';

  @Column({ nullable: true })
  trialStartsAt: Date;

  @Column({ nullable: true })
  trialEndsAt: Date;

  @Column({ nullable: true })
  renewsAt: Date;

  @Column({ nullable: true })
  paddleSubscriptionId: string;

  @Column({ nullable: true })
  paddleCustomerId: string;

  @Column({ nullable: true })
  promoCodeApplied: string;

  @Column({ type: 'boolean', default: false })
  isFoundingVenue: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
