import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Venue } from '../entities/Venue';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Venue, Post, Follow])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
