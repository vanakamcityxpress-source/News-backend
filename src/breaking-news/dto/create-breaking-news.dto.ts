// src/breaking-news/dto/create-breaking-news.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBreakingNewsDto {
  @ApiProperty()
  @IsNotEmpty()
  heading: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  video?: any;
}


