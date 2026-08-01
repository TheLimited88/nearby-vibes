import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  venueId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'enum', enum: ['draft', 'live', 'expired'] })
  status: 'draft' | 'live' | 'expired';

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ nullable: true })
  heroImageUrl: string;

  @Column({ type: 'simple-array', default: '' })
  mediaUrls: string[];

  @Column({ type: 'integer', default: 0 })
  views: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;

  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ nullable: true })
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
