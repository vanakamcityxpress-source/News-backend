import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from 'src/entity/Article';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { slugify } from 'transliteration';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) { }

  // 🟢 CREATE
  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create({
      ...createArticleDto,
      slug: slugify(createArticleDto.title),
    });
    return await this.articleRepository.save(article);
  }

  // 🔵 READ - ALL
  async findAll(limit?: number): Promise<Article[]> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .orderBy('article.createdAt', 'DESC');
    if (limit) query.limit(limit);
    return query.getMany();
  }

  // 🔵 READ - BY ID
  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  // 🔵 READ - BY SLUG
  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  // 🟡 UPDATE
  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const existing = await this.articleRepository.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Article not found');

    // Create a clean update object (only defined fields)
    const cleanUpdate: Partial<Article> = {};

    for (const [key, value] of Object.entries(updateArticleDto)) {
  if (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    !(Array.isArray(value) && value.every(v => v === ''))
  ) {
    (cleanUpdate as any)[key] = value;
  }
}

    // 🟣 If title changed → regenerate slug
    if (cleanUpdate.title && cleanUpdate.title !== existing.title) {
      cleanUpdate.slug = slugify(cleanUpdate.title);
    }

    // 🟡 Merge changes safely
    const updated = this.articleRepository.merge(existing, cleanUpdate);
    await this.articleRepository.save(updated);

    return updated;
  }


  // 🔴 DELETE
  async remove(id: number): Promise<void> {
    const result = await this.articleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Article not found');
    }
  }
}
