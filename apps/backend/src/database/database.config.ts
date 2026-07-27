import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';
import { Post } from '../entities/Post';
import { Subscription } from '../entities/Subscription';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'nearby_vibes',
    url: process.env.DATABASE_URL,
    entities: [User, Venue, Post, Subscription],
    synchronize: !isProduction,
    logging: !isProduction,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    migrations: ['src/database/migrations/*.ts'],
    migrationsRun: true,
  };
};
