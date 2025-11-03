import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BreakingNewsModule } from './breaking-news/breaking-news.module';
import { ArticlesModule } from './Article/articles.module';
import { BreakingNews } from './entity/BreakingNews';
import { Article } from './entity/Article';
import { Ad } from './entity/ads';
import { AdsModule } from './Ads/ads.module';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './entity/comment';
import { User } from './entity/user';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1️⃣ Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2️⃣ Configure TypeORM dynamically using ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('SUPABASE_DB_HOST'),
        port: parseInt(config.get<string>('SUPABASE_DB_PORT') || '5432', 10),
        username: config.get<string>('SUPABASE_DB_USER'),
        password: config.get<string>('SUPABASE_DB_PASSWORD') || '',
        database: config.get<string>('SUPABASE_DB_NAME'),
        entities: [BreakingNews, Article, Ad, Comment, User ],
        synchronize: true, // Auto-create tables in Supabase
        ssl: {
          rejectUnauthorized: false, // required for Supabase
        },
      }),
      inject: [ConfigService],
    }),

    // 3️⃣ App modules
    BreakingNewsModule,
    ArticlesModule,
    AdsModule,
    CommentsModule,
    AuthModule,
  ],
})
export class AppModule {}
