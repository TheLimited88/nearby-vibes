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

@Entity('fcm_tokens')
@Index('idx_fcm_tokens_user_id', ['user_id'])
@Index('idx_fcm_tokens_token', ['token'])
@Index('idx_fcm_tokens_created_at', ['created_at'])
export class FCMToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ unique: true })
  token: string;

  @Column({ nullable: true })
  device_name?: string;

  @Column({ default: 'web' })
  platform: 'web' | 'ios' | 'android';

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  last_used_at?: Date;

  @CreateDateColumn()
  created_at?: Date;
}
