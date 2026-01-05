import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'category', 'mainImage'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        author: { type: 'string' },
        categoryColor: { type: 'string' },
        contentParagraphs: { type: 'array', items: { type: 'string' } },
        contentQuote: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        mainImage: { type: 'string', format: 'binary' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadArticle(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateArticleDto,
  ) {
    const mainFile = files?.find(f => f.fieldname === 'mainImage');
    const imageFiles = files?.filter(f => f.fieldname === 'images');

    if (!mainFile) {
      throw new BadRequestException('Main image is required');
    }

    return this.articlesService.create(dto, mainFile, imageFiles);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  async updateArticle(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateArticleDto,
  ) {
    const mainFile = files?.find(f => f.fieldname === 'mainImage');
    const imageFiles = files?.filter(f => f.fieldname === 'images');

    return this.articlesService.update(id, dto, mainFile, imageFiles);
  }

  @Get()
  getAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.articlesService.findOne(id);
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: number) {
    await this.articlesService.remove(id);
    return { message: 'Deleted successfully' };
  }
}
