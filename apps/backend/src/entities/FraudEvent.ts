import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type EventType =
  | 'suspicious_claim'
  | 'rapid_signups'
  | 'rapid_venue_creation'
  | 'claim_after_delete'
  | 'disposable_email'
  | 'vpn_signup'
  | 'velocity_exceeded'
  | 'geographic_mismatch'
  | 'device_mismatch';

export type Severity = 'low' | 'medium' | 'high';
export type ActionType = 'flagged' | 'challenged' | 'suspended' | 'manual_review' | 'none';

@Entity('fraud_events')
@Index(['user_id'])
@Index(['event_type'])
@Index(['severity'])
@Index(['created_at'])
@Index(['ip_address'])
export class FraudEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  venue_id: string | null;

  @Column({ type: 'varchar', length: 50 })
  event_type: EventType;

  @Column({ type: 'varchar', length: 50 })
  severity: Severity;

  @Column({ type: 'varchar', length: 50, default: 'flagged' })
  action_taken: ActionType;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  device_fingerprint: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  country_code: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date | null;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string | null;

  @Column({ type: 'text', nullable: true })
  admin_notes: string | null;

  @CreateDateColumn()
  created_at: Date;
}
