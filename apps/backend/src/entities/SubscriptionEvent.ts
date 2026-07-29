import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Subscription } from './Subscription';

export type EventType =
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.activated'
  | 'subscription.cancelled'
  | 'subscription.past_due'
  | 'subscription.payment_failed'
  | 'subscription.payment_succeeded'
  | 'subscription.trial_ended'
  | 'promo_code_applied';

@Entity('subscription_events')
export class SubscriptionEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  subscription_id: string;

  @ManyToOne(() => Subscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription | null;

  @Column({ type: 'varchar', length: 100 })
  event_type: EventType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paddle_event_id: string;

  @Column({ type: 'jsonb', default: '{}' })
  payload: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  processed_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  error_message: string | null;

  @CreateDateColumn()
  created_at: Date;
}
