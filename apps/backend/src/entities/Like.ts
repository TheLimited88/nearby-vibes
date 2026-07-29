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
import { Post } from './Post';

@Entity('likes')
@Unique(['user_id', 'post_id'])
@Index('idx_likes_user_id', ['user_id'])
@Index('idx_likes_post_id', ['post_id'])
@Index('idx_likes_created_at', ['created_at'])
export class Like {
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

  @CreateDateColumn()
  created_at?: Date;
}
