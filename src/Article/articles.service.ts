import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entity/Article';
import { slugify } from 'transliteration';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ArticlesService {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }
private imagesDir = path.join(process.cwd(), 'uploads/images');
private videosDir = path.join(process.cwd(), 'uploads/videos');

private saveFile(file: Express.Multer.File): string {
  const isVideo = file.mimetype.startsWith('video/');
  const dir = isVideo ? this.videosDir : this.imagesDir;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fileName = `${Date.now()}-${file.originalname}`;
  fs.writeFileSync(path.join(dir, fileName), file.buffer);

  return isVideo
    ? `/uploads/videos/${fileName}`
    : `/uploads/images/${fileName}`;
}


  private normalizeArray(value?: string[] | string): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  async create(
    dto: any,
    mainFile: Express.Multer.File,
    imageFiles: Express.Multer.File[] = [],
  ) {
    const article = this.articleRepo.create({
      ...dto,
      tags: this.normalizeArray(dto.tags),
      contentParagraphs: this.normalizeArray(dto.contentParagraphs),
      mainImage: this.saveFile(mainFile),
      images: imageFiles.map(f => this.saveFile(f)),
      slug: slugify(dto.title, { lowercase: true }),
    });

    return this.articleRepo.save(article);
  }

  async update(
    id: number,
    dto: any,
    mainFile?: Express.Multer.File,
    imageFiles: Express.Multer.File[] = [],
  ) {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    if (mainFile) article.mainImage = this.saveFile(mainFile);

    if (imageFiles.length) {
      article.images = [
        ...(article.images || []),
        ...imageFiles.map(f => this.saveFile(f)),
      ];
    }

    Object.assign(article, {
      ...dto,
      tags: this.normalizeArray(dto.tags),
      contentParagraphs: this.normalizeArray(dto.contentParagraphs),
    });

    return this.articleRepo.save(article);
  }

  findAll() {
    return this.articleRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    await this.articleRepo.remove(article);
  }
}
