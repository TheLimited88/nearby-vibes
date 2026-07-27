import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index('idx_users_firebase_uid', ['firebase_uid'])
@Index('idx_users_email', ['email'])
@Index('idx_users_created_at', ['created_at'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  firebase_uid: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  display_name?: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: false })
  onboarding_completed: boolean;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ nullable: true })
  deleted_at?: Date;
}
