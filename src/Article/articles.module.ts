import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entity/Article';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticlesController],
  providers: [ArticlesService, SupabaseService],
})
export class ArticlesModule {}
