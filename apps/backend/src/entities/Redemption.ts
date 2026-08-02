import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Relation,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';
import { Venue } from './Venue';

@Entity('redemptions')
@Index('idx_redemptions_user_id', ['user_id'])
@Index('idx_redemptions_post_id', ['post_id'])
@Index('idx_redemptions_venue_id', ['venue_id'])
@Index('idx_redemptions_status', ['status'])
@Index('idx_redemptions_created_at', ['created_at'])
export class Redemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column()
  post_id: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Relation<Post>;

  @Column()
  venue_id: string;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Relation<Venue>;

  @Column({ default: 'initiated' })
  status: 'initiated' | 'qr_scanned' | 'geofence_verified' | 'completed' | 'expired';

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 8 })
  user_latitude?: number;

  @Column({ nullable: true, type: 'decimal', precision: 11, scale: 8 })
  user_longitude?: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  distance_m?: number;

  @Column({ nullable: true })
  qr_code?: string;

  @Column({ nullable: true })
  qr_scanned_at?: Date;

  @Column({ nullable: true })
  geofence_verified_at?: Date;

  @Column({ nullable: true })
  completed_at?: Date;

  @CreateDateColumn()
  created_at?: Date;
}
