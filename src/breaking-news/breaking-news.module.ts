// src/breaking-news/breaking-news.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreakingNews } from '../entity/BreakingNews';
import { BreakingNewsService } from './breaking-news.service';
import { BreakingNewsController } from './breaking-news.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BreakingNews])],
  providers: [BreakingNewsService],
  controllers: [BreakingNewsController],
})
export class BreakingNewsModule {}
