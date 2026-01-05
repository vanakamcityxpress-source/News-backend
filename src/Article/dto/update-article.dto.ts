import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';
import { IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

// First extend CreateArticleDto, then override array fields to accept strings too
export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        // Try parsing as JSON
        return JSON.parse(value);
      } catch {
        // Split by commas
        return value.split(',').map(item => item.trim());
      }
    }
    return value;
  })
  contentParagraphs?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map(item => item.trim());
      }
    }
    return value;
  })
  tags?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map(item => item.trim());
      }
    }
    return value;
  })
  images?: string[];
}