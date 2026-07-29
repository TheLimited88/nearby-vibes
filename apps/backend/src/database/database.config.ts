import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';
import { Post } from '../entities/Post';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Parse DATABASE_URL to remove sslmode parameter for custom SSL config
  let databaseUrl = process.env.DATABASE_URL || '';
  databaseUrl = databaseUrl.replace(/([?&])sslmode=\w+&/, '$1').replace(/([?&])sslmode=\w+$/, '');

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: [User, Venue, Post],
    synchronize: false,
    logging: !isProduction,
    ssl: { rejectUnauthorized: false },
    migrationsTableName: 'typeorm_migrations',
    migrationsRun: false,
    retryAttempts: 10,
    retryDelay: 3000,
  };
};
