import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('venues')
@Index('idx_venues_firebase_uid', { synchronize: false })
@Index('idx_venues_email', { synchronize: false })
@Index('idx_venues_status', { synchronize: false })
@Index('idx_venues_google_place_id', { synchronize: false })
@Index('idx_venues_created_at', { synchronize: false })
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  firebase_uid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  venue_name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  // Location data
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip_code: string;

  @Column({ default: 'US' })
  country: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  // Place data
  @Column({ nullable: true })
  google_place_id: string;

  @Column({ nullable: true })
  google_place_name: string;

  // Status
  @Column({ default: 'pending_verification' })
  status: string; // pending_verification, claimed, verified

  @Column({ nullable: true })
  verified_at: Date;

  @Column({ nullable: true })
  profile_completed_at: Date;

  // Branding
  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  cover_image_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
