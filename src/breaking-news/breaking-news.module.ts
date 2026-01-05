import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreakingNews } from '../entity/BreakingNews';
import { BreakingNewsService } from './breaking-news.service';
import { BreakingNewsController } from './breaking-news.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BreakingNews])],
  controllers: [BreakingNewsController],
  providers: [BreakingNewsService],
  exports: [BreakingNewsService],
})
export class BreakingNewsModule {}