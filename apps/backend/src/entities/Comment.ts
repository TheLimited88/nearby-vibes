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
import { User } from './User';
import { Post } from './Post';

@Entity('comments')
@Index('idx_comments_user_id', ['user_id'])
@Index('idx_comments_post_id', ['post_id'])
@Index('idx_comments_created_at', ['created_at'])
export class Comment {
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

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ nullable: true })
  deleted_at?: Date;
}
