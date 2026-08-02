import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type ClaimStatus = 'claimed' | 'trial_expired' | 'reused' | 'suspended';

@Entity('place_claim_ledger')
@Index(['google_place_id'])
@Index(['venue_id'])
@Index(['claimed_at'])
export class PlaceClaimLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  google_place_id: string;

  @Column({ type: 'uuid', nullable: true })
  venue_id: string | null;

  @Column({ type: 'timestamp' })
  claimed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  trial_started_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  trial_ended_at: Date | null;

  @Column({ type: 'varchar', length: 50, default: 'claimed' })
  status: ClaimStatus;

  @Column({ type: 'timestamp', nullable: true })
  cooldown_expires_at: Date | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_address: string | null;

  @Column({ type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  device_fingerprint: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  country_code: string | null;

  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}
