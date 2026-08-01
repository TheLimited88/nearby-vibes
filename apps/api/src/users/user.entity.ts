import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: ['customer', 'venue'] })
  userType: 'customer' | 'venue';

  @Column({ nullable: true })
  displayName: string;

  @Column({ type: 'boolean', default: false })
  ageVerified: boolean;

  @Column({ type: 'varchar', default: 'mi' })
  distanceUnit: 'mi' | 'km';

  @Column({ nullable: true })
  venueId: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
