import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Breaking News: Major City Update',
    description: 'Main title of the article',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A quick summary of what happened in the city today.',
    description: 'Short article description or summary',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Reporter Name',
    description: 'Name of the article author',
  })
  @IsString()
  author: string;

  @ApiProperty({
    example: 'Local',
    description: 'Category of the article (e.g., Sports, Politics, Local, etc.)',
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: 'blue',
    description: 'Color associated with the article category',
  })
  @IsOptional()
  @IsString()
  categoryColor?: string;

  @ApiProperty({
    type: [String],
    example: ['The city witnessed...', 'Authorities have responded promptly.'],
    description: 'Main content paragraphs of the article',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value,
  )
  contentParagraphs?: string[];

  @ApiProperty({
    required: false,
    example: '“The city will recover stronger than before,” said the mayor.',
    description: 'Optional highlighted quote from the article',
  })
  @IsOptional()
  @IsString()
  contentQuote?: string;

  @ApiProperty({
    type: [String],
    example: ['city', 'breaking-news', 'local-updates'],
    description: 'Tags or keywords related to the article',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value,
  )
  tags?: string[];

  @ApiProperty({
    required: false,
    example: 'https://your-supabase-url/storage/v1/object/public/news/main-image.png',
    description: 'Main featured image URL for the article',
  })
  @IsOptional()
  @IsUrl()
  mainImage?: string;

  @ApiProperty({
    type: [String],
    required: false,
    example: [
      'https://your-supabase-url/storage/v1/object/public/news/image1.png',
      'https://your-supabase-url/storage/v1/object/public/news/image2.png',
    ],
    description: 'Optional additional image URLs for the article',
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map((v) => v.trim()) : value,
  )
  images?: string[];
}
