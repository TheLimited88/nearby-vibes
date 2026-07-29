import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Venue } from './entities/Venue';
import { Post } from './entities/Post';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Venue, Post],
  synchronize: false,
  logging: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
