import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './User';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  user_id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  // Notification preferences
  @Column({ default: true })
  notify_new_posts: boolean;

  @Column({ default: true })
  notify_post_updates: boolean;

  @Column({ default: true })
  notify_new_followers: boolean;

  @Column({ default: true })
  notify_comments: boolean;

  @Column({ default: true })
  notify_likes: boolean;

  @Column({ default: true })
  notify_redemption_reminders: boolean;

  @Column({ default: true })
  notify_venue_announcements: boolean;

  // Email preferences
  @Column({ default: false })
  email_weekly_digest: boolean;

  @Column({ default: false })
  email_promotional: boolean;

  @Column({ default: true })
  email_transactional: boolean;

  // Discovery preferences
  @Column({ type: 'text', nullable: true })
  preferred_categories?: string; // Comma-separated (e.g., "food,drinks,brunch")

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  preferred_latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  preferred_longitude?: number;

  @Column({ default: 5 })
  preferred_distance_km: number;

  // Push notification toggle
  @Column({ default: true })
  push_notifications_enabled: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
