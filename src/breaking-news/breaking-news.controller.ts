import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BreakingNewsService } from './breaking-news.service';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Breaking News')
@Controller('breaking-news')
export class BreakingNewsController {
  constructor(private readonly service: BreakingNewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create breaking news with optional video' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        heading: { type: 'string', example: 'Breaking: Major Event' },
        description: { type: 'string', example: 'Detailed description...' },
        video: { type: 'string', format: 'binary' },
        isActive: { 
          type: 'string', 
          example: 'true',
          description: 'true/false as string' 
        },
      },
      required: ['heading', 'description'],
    },
  })
  @UseInterceptors(FileInterceptor('video', { storage: memoryStorage() }))
  async create(
    @Body() dto: CreateBreakingNewsDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    try {
      console.log('📤 Creating breaking news:', {
        heading: dto.heading,
        isActive: dto.isActive,
        typeofIsActive: typeof dto.isActive,
        hasVideo: !!video,
        videoName: video?.originalname,
      });

      const result = await this.service.create(dto, video);
      console.log('✅ Breaking news created:', result);
      return result;

    } catch (error) {
      console.error('❌ Error creating breaking news:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all breaking news' })
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active breaking news only' })
  findActive() {
    return this.service.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get breaking news by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update breaking news' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        heading: { type: 'string', example: 'Updated Heading' },
        description: { type: 'string', example: 'Updated description...' },
        isActive: { 
          type: 'string', 
          example: 'true',
          description: 'true/false as string' 
        },
        video: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('video', { storage: memoryStorage() }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBreakingNewsDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    try {
      console.log('🔄 Updating breaking news:', { 
        id, 
        isActive: dto.isActive,
        typeofIsActive: typeof dto.isActive,
        hasVideo: !!video 
      });
      return await this.service.update(id, dto, video);
    } catch (error) {
      console.error('❌ Error updating breaking news:', error);
      throw error;
    }
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle active status of breaking news' })
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.service.toggleActive(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete breaking news' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}