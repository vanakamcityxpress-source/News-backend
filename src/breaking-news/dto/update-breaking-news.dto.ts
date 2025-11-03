// src/breaking-news/dto/update-breaking-news.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateBreakingNewsDto } from './create-breaking-news.dto';

export class UpdateBreakingNewsDto extends PartialType(CreateBreakingNewsDto) {}