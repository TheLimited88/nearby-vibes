import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Venue],
    synchronize: false,
    logging: !isProduction,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    migrations: ['src/database/migrations/*.sql'],
  };
};
