import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Relation,
  Unique,
} from 'typeorm';
import { User } from './User';
import { Venue } from './Venue';

@Entity('follows')
@Unique(['user_id', 'venue_id'])
@Index('idx_follows_user_id', ['user_id'])
@Index('idx_follows_venue_id', ['venue_id'])
@Index('idx_follows_created_at', ['created_at'])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column()
  venue_id: string;

  @ManyToOne(() => Venue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue: Relation<Venue>;

  @CreateDateColumn()
  created_at?: Date;
}
