import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BreakingNewsModule } from './breaking-news/breaking-news.module';
import { ArticlesModule } from './Article/articles.module';
import { AdsModule } from './Ads/ads.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

import { BreakingNews } from './entity/BreakingNews';
import { Article } from './entity/Article';
import { Ad } from './entity/ads';
import { Comment } from './entity/comment';
import { User } from './entity/user';

@Module({
  imports: [
    // Load env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // PostgreSQL (pgAdmin / local DB)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USERNAME'), 
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'), 
        entities: [BreakingNews, Article, Ad, Comment, User],
        synchronize: true,
        logging: true,
      }),
    }),

    // App modules
    BreakingNewsModule,
    ArticlesModule,
    AdsModule,
    CommentsModule,
    AuthModule,
  ],
})
export class AppModule { }