import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Relation,
} from 'typeorm';
import { Venue } from './Venue';

@Entity('posts')
@Index('idx_posts_venue_id', ['venue_id'])
@Index('idx_posts_status', ['status'])
@Index('idx_posts_expires_at', ['expires_at'])
@Index('idx_posts_created_at', ['created_at'])
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  venue_id: string;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Relation<Venue>;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  image_url?: string;

  @Column({ default: 'draft' })
  status: 'draft' | 'published' | 'expired' | 'cancelled';

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount_percent?: number;

  @Column({ type: 'integer', nullable: true })
  discount_cap?: number;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  tags?: string;

  @Column({ type: 'integer', default: 0 })
  view_count: number;

  @Column({ type: 'integer', default: 0 })
  click_count: number;

  @Column({ type: 'integer', default: 0 })
  redeem_count: number;

  @Column()
  expires_at: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ nullable: true })
  published_at?: Date;

  @Column({ nullable: true })
  deleted_at?: Date;
}
