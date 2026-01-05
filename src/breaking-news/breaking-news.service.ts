import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { BreakingNews } from '../entity/BreakingNews';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';

@Injectable()
export class BreakingNewsService {
  private baseUploadDir = path.join(process.cwd(), 'uploads');
  private breakingNewsDir = path.join(this.baseUploadDir, 'breaking-news');

  constructor(
    @InjectRepository(BreakingNews)
    private readonly repo: Repository<BreakingNews>,
  ) {
    // Create directory if it doesn't exist
    if (!fs.existsSync(this.breakingNewsDir)) {
      fs.mkdirSync(this.breakingNewsDir, { recursive: true });
      console.log('✅ Created breaking-news directory:', this.breakingNewsDir);
    }
  }

  async create(dto: CreateBreakingNewsDto, file?: Express.Multer.File) {
    let videoPath = '';

    if (file) {
      // Validate file is a video
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        throw new InternalServerErrorException(
          'Only video files are allowed (mp4, mov, avi, webm, mkv)'
        );
      }

      const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      const filePath = path.join(this.breakingNewsDir, fileName);

      try {
        fs.writeFileSync(filePath, file.buffer);
        console.log('✅ Video saved successfully:', filePath);
      } catch (error) {
        console.error('❌ Error saving video:', error);
        throw new InternalServerErrorException('Failed to save video file');
      }

      videoPath = `uploads/breaking-news/${fileName}`;
    }

    const news = this.repo.create({
      heading: dto.heading,
      description: dto.description,
      video: videoPath,
      isActive: dto.isActive !== undefined ? dto.isActive : false, // Default to false if not provided
    });

    return this.repo.save(news);
  }

  async findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive() {
    return this.repo.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const news = await this.repo.findOneBy({ id });
    if (!news) {
      throw new NotFoundException(`Breaking news with id ${id} not found`);
    }
    return news;
  }

  async update(id: number, dto: UpdateBreakingNewsDto, file?: Express.Multer.File) {
    const news = await this.findOne(id);

    // Update text fields
    if (dto.heading !== undefined) news.heading = dto.heading;
    if (dto.description !== undefined) news.description = dto.description;
    if (dto.isActive !== undefined) news.isActive = dto.isActive;

    // Handle video update
    if (file) {
      // Delete old video if exists
      if (news.video) {
        const oldFilePath = path.join(
          this.baseUploadDir,
          news.video.replace('uploads/', '')
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log('🗑️ Old video deleted:', oldFilePath);
        }
      }

      // Save new video
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        throw new InternalServerErrorException(
          'Only video files are allowed (mp4, mov, avi, webm, mkv)'
        );
      }

      const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      const filePath = path.join(this.breakingNewsDir, fileName);

      try {
        fs.writeFileSync(filePath, file.buffer);
        console.log('✅ New video saved:', filePath);
      } catch (error) {
        console.error('❌ Error saving new video:', error);
        throw new InternalServerErrorException('Failed to save new video');
      }

      news.video = `uploads/breaking-news/${fileName}`;
    }

    return this.repo.save(news);
  }

  async remove(id: number) {
    const news = await this.findOne(id);

    // Delete video file if exists
    if (news.video) {
      const filePath = path.join(
        this.baseUploadDir,
        news.video.replace('uploads/', '')
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Video file deleted:', filePath);
      }
    }

    return this.repo.remove(news);
  }

  async toggleActive(id: number) {
    const news = await this.findOne(id);
    news.isActive = !news.isActive;
    return this.repo.save(news);
  }
}