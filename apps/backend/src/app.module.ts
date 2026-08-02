import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PostsModule } from './posts/posts.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { VerificationModule } from './verification/verification.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SocialModule } from './social/social.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AbusePreventionModule } from './abuse-prevention/abuse-prevention.module';
import { getDatabaseConfig } from './database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    AdminModule,
    PostsModule,
    DiscoveryModule,
    VerificationModule,
    AnalyticsModule,
    SocialModule,
    NotificationsModule,
    SubscriptionsModule,
    AbusePreventionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
