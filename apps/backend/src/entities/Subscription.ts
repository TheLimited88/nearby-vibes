import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Venue } from './Venue';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'paused';
export type SubscriptionPlan = 'free' | 'pro' | 'premium';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  venue_id: string;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue | null;

  @Column({ type: 'varchar', length: 50 })
  plan: SubscriptionPlan;

  @Column({ type: 'varchar', length: 50 })
  status: SubscriptionStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paddle_subscription_id: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paddle_customer_id: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'timestamp', nullable: true })
  trial_starts_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  trial_ends_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  next_billing_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  promo_code: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount_percent: number;

  @Column({ type: 'integer', default: 0 })
  grace_period_days: number;

  @Column({ type: 'timestamp', nullable: true })
  grace_period_ends_at: Date | null;

  @Column({ type: 'boolean', default: false })
  founding_venue: boolean;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
