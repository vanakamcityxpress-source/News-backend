import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly articlesService: ArticlesService,
  ) {}

  // 🟢 CREATE
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        author: { type: 'string' },
        category: { type: 'string' },
        categoryColor: { type: 'string' },
        contentParagraphs: {
          type: 'array',
          items: { type: 'string' },
        },
        contentQuote: { type: 'string' },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async uploadArticle(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateArticleDto,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    try {
      const imageUrl = await this.supabaseService.uploadToNewsBucket(file);
      const article = await this.articlesService.create({
        ...dto,
        mainImage: imageUrl,
      });
      return { message: 'Article uploaded successfully', article };
    } catch (err) {
      console.error('Article upload error:', err);
      throw new BadRequestException('Article upload failed');
    }
  }

  // 🟡 UPDATE
@Patch(':id')
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      author: { type: 'string' },
      category: { type: 'string' },
      categoryColor: { type: 'string' },
      contentParagraphs: {
        type: 'array',
        items: { type: 'string' },
      },
      contentQuote: { type: 'string' },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
      file: { type: 'string', format: 'binary' },
    },
  },
})
@UseInterceptors(FileInterceptor('file'))
async updateArticle(
  @Param('id') id: number,
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: UpdateArticleDto,
) {
  try {
    let imageUrl = dto.mainImage;

    // Upload only if a new file is provided
    if (file) {
      imageUrl = await this.supabaseService.uploadToNewsBucket(file);
    }

    const updated = await this.articlesService.update(id, {
      ...dto,
      ...(imageUrl ? { mainImage: imageUrl } : {}),
    });

    return { message: 'Article updated successfully', article: updated };
  } catch (err) {
    console.error('Article update error:', err);
    throw new BadRequestException('Article update failed');
  }
}


  // 🔴 DELETE
  @Delete(':id')
  async deleteArticle(@Param('id') id: number) {
    await this.articlesService.remove(id);
    return { message: 'Article deleted successfully' };
  }

  // 🔵 READ
  @Get()
  async getAll() {
    return this.articlesService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.articlesService.findOne(id);
  }
}
