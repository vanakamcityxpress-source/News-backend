import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Ad } from '../entity/ads';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdsService {
  // ✅ Use process.cwd() to get project root directory
  private baseUploadDir = path.join(process.cwd(), 'uploads');
  private imagesDir = path.join(this.baseUploadDir, 'images');
  private videosDir = path.join(this.baseUploadDir, 'videos');

  constructor(
    @InjectRepository(Ad)
    private readonly adsRepo: Repository<Ad>,
  ) {
    console.log('📁 Upload directories:', {
      base: this.baseUploadDir,
      images: this.imagesDir,
      videos: this.videosDir,
      exists: {
        base: fs.existsSync(this.baseUploadDir),
        images: fs.existsSync(this.imagesDir),
        videos: fs.existsSync(this.videosDir)
      }
    });
    
    // Create directories if they don't exist
    if (!fs.existsSync(this.baseUploadDir)) {
      fs.mkdirSync(this.baseUploadDir, { recursive: true });
      console.log('✅ Created base upload directory');
    }
    if (!fs.existsSync(this.imagesDir)) {
      fs.mkdirSync(this.imagesDir, { recursive: true });
      console.log('✅ Created images directory');
    }
    if (!fs.existsSync(this.videosDir)) {
      fs.mkdirSync(this.videosDir, { recursive: true });
      console.log('✅ Created videos directory');
    }
  }

  async findAll(): Promise<Ad[]> {
    await this.deactivateExpiredAds();
    return this.adsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Ad> {
    const ad = await this.adsRepo.findOne({ where: { id } });
    if (!ad) throw new NotFoundException('Ad not found'); 
    return ad;
  }

  async create(dto: CreateAdDto, file?: Express.Multer.File): Promise<Ad> {
    if (!file) {
      throw new InternalServerErrorException('Image file required');
    }

    console.log('📤 Creating ad with file:', {
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });

    // Check file type
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(fileExtension);
    
    console.log('📄 File extension:', fileExtension, 'isVideo:', isVideo);
    
    // Determine upload directory
    const uploadDir = isVideo ? this.videosDir : this.imagesDir;
    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    console.log('💾 Saving file to:', filePath);

    try {
      // Save file
      fs.writeFileSync(filePath, file.buffer);
      console.log('✅ File saved successfully');
    } catch (error) {
      console.error('❌ Error saving file:', error);
      throw new InternalServerErrorException('Failed to save file');
    }

    // Create ad instance
    const ad = new Ad();
    ad.title = dto.title;
    ad.link = dto.link;
    ad.startTime = dto.startTime ? new Date(dto.startTime) : undefined;
    ad.endTime = dto.endTime ? new Date(dto.endTime) : undefined;
    ad.image = isVideo ? `/uploads/videos/${fileName}` : `/uploads/images/${fileName}`;
    ad.isActive = true;

    console.log('📝 Ad object to save:', {
      title: ad.title,
      image: ad.image,
      isVideo: isVideo,
      filePath: filePath
    });

    return this.adsRepo.save(ad);
  }

  async update(id: number, dto: UpdateAdDto, file?: Express.Multer.File): Promise<Ad> {
    const ad = await this.findOne(id);

    // Update only if values are provided
    if (dto.title !== undefined) ad.title = dto.title.trim();
    if (dto.link !== undefined) ad.link = dto.link.trim();
    if (dto.startTime !== undefined) {
      ad.startTime = dto.startTime ? new Date(dto.startTime) : undefined;
    }
    if (dto.endTime !== undefined) {
      ad.endTime = dto.endTime ? new Date(dto.endTime) : undefined;
    }

    if (file) {
      // Delete old file if exists
      if (ad.image) {
        const oldFilePath = path.join(
          this.baseUploadDir,
          ad.image.replace('/uploads/', '')
        );
        console.log('🗑️ Attempting to delete old file:', oldFilePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log('✅ Old file deleted');
        }
      }

      // Check file type for new file
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(fileExtension);
      
      // Determine upload directory
      const uploadDir = isVideo ? this.videosDir : this.imagesDir;
      const fileName = `${Date.now()}_${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);

      console.log('💾 Saving new file to:', filePath);

      // Save new file
      fs.writeFileSync(filePath, file.buffer);

      // Update image path
      ad.image = isVideo ? `/uploads/videos/${fileName}` : `/uploads/images/${fileName}`;
    }

    return this.adsRepo.save(ad);
  }

  async remove(id: number) {
    const ad = await this.findOne(id);

    // Delete associated file
    if (ad.image) {
      const filePath = path.join(
        this.baseUploadDir,
        ad.image.replace('/uploads/', '')
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return this.adsRepo.remove(ad);
  }

  private async deactivateExpiredAds() {
    const now = new Date();
    await this.adsRepo.update(
      { endTime: LessThanOrEqual(now), isActive: true },
      { isActive: false },
    );
  }
}