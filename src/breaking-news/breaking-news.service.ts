import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BreakingNews } from '../entity/BreakingNews';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';

@Injectable()
export class BreakingNewsService {
  constructor(
    @InjectRepository(BreakingNews)
    private readonly repo: Repository<BreakingNews>,
  ) {}

  async create(dto: CreateBreakingNewsDto, videoUrl?: string) {
    const news = this.repo.create({
      ...dto,
      video: videoUrl || '',
    });
    return this.repo.save(news);
  }

  async findAll() {
    return this.repo.find({
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

  async update(id: number, dto: UpdateBreakingNewsDto, videoUrl?: string) {
    const news = await this.findOne(id);
    Object.assign(news, dto);
    if (videoUrl) news.video = videoUrl;
    return this.repo.save(news);
  }

  async remove(id: number) {
    const news = await this.findOne(id);
    return this.repo.remove(news);
  }
}
