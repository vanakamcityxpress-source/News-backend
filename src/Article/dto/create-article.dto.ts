import { IsString, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  categoryColor?: string;

  @IsOptional()
  contentParagraphs?: string[] | string;

  @IsOptional()
  @IsString()
  contentQuote?: string;

  @IsOptional()
  tags?: string[] | string;
}
