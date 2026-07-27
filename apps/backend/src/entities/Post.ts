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

@Entity('posts')
@Index('idx_posts_venue_id', { synchronize: false })
@Index('idx_posts_status', { synchronize: false })
@Index('idx_posts_end_time', { synchronize: false })
@Index('idx_posts_published_at', { synchronize: false })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  venue_id: string;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  offer_type: string; // drink, food, happy_hour, event, etc.

  @Column({ nullable: true })
  discount_value: string;

  @Column({ nullable: true })
  discount_type: string; // percentage, fixed_amount

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: 'draft' })
  status: string; // draft, published, expired, archived

  @Column({ nullable: true })
  published_at: Date;

  @Column({ default: 0 })
  views_count: number;

  @Column({ default: 0 })
  click_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
