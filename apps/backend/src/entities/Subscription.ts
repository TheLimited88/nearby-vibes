import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venue } from './Venue';

@Entity('subscriptions')
@Index('idx_subscriptions_venue_id', { synchronize: false })
@Index('idx_subscriptions_status', { synchronize: false })
@Index('idx_subscriptions_paddle_subscription_id', { synchronize: false })
@Index('idx_subscriptions_trial_ends_at', { synchronize: false })
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  venue_id: string;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @Column({ nullable: true })
  trial_started_at: Date;

  @Column({ nullable: true })
  trial_ends_at: Date;

  @Column({ default: 'trial' })
  status: string; // trial, active, past_due, canceled, expired

  @Column({ default: 'Free' })
  plan_type: string; // Free, Monthly, Annual

  @Column({ nullable: true })
  paddle_subscription_id: string;

  @Column({ nullable: true })
  paddle_customer_id: string;

  @Column({ nullable: true })
  current_period_start: Date;

  @Column({ nullable: true })
  current_period_end: Date;

  @Column({ nullable: true })
  canceled_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
