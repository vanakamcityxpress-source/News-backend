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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BreakingNewsService } from './breaking-news.service';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { supabase } from '../supabase.client';
import { extname } from 'path';

@ApiTags('Breaking News')
@Controller('breaking-news')
export class BreakingNewsController {
  constructor(private readonly service: BreakingNewsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create breaking news',
    type: CreateBreakingNewsDto,
  })
  async create(
    @Body() dto: CreateBreakingNewsDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    let videoUrl = '';

    try {
      if (video) {
        const fileExt = extname(video.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        const filePath = `videos/${fileName}`;

        const { error } = await supabase.storage
          .from('news')
          .upload(filePath, video.buffer, {
            contentType: video.mimetype,
            upsert: false,
          });

        if (error) {
          console.error('❌ Supabase Upload Error:', error.message);
          throw new BadRequestException(`Video upload failed: ${error.message}`);
        }

        // ✅ Get public URL for the uploaded file
        const { data } = supabase.storage.from('news').getPublicUrl(filePath);
        videoUrl = data.publicUrl;
        console.log('✅ Uploaded video URL:', videoUrl);
      }

      const result = await this.service.create(dto, videoUrl);
      console.log('✅ Saved Breaking News:', result);
      return result;

    } catch (err) {
      console.error('🔥 Server Error:', err);
      throw err;
    }
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('video'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update breaking news',
    type: UpdateBreakingNewsDto,
  })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateBreakingNewsDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    let videoUrl = '';

    if (video) {
      const fileExt = extname(video.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error } = await supabase.storage
        .from('news')
        .upload(filePath, video.buffer, {
          contentType: video.mimetype,
          upsert: false,
        });

      if (error) {
        throw new BadRequestException(`Video upload failed: ${error.message}`);
      }

      const { data } = supabase.storage.from('news').getPublicUrl(filePath);
      videoUrl = data.publicUrl;
    }

    return this.service.update(id, dto, videoUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
