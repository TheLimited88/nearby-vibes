import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { Redemption } from '../entities/Redemption';
import { Subscription } from '../entities/Subscription';
import { PromoCode } from '../entities/PromoCode';
import { SubscriptionEvent } from '../entities/SubscriptionEvent';
import { PlaceClaimLedger } from '../entities/PlaceClaimLedger';
import { FraudEvent } from '../entities/FraudEvent';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Venue, Post, Follow, Redemption, Subscription, PromoCode, SubscriptionEvent, PlaceClaimLedger, FraudEvent],
    synchronize: false,
    logging: !isProduction,
    ssl: { rejectUnauthorized: false },
    migrationsTableName: 'typeorm_migrations',
    migrationsRun: false,
    retryAttempts: 10,
    retryDelay: 3000,
  };
};
