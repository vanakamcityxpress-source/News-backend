import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entity/comment';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Article } from '../entity/Article';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async create(articleId: number, dto: CreateCommentDto): Promise<Comment> {
    const article = await this.articleRepo.findOne({ where: { id: articleId } });
    if (!article) throw new NotFoundException('Article not found');

    const newComment = this.commentRepo.create({
      name: dto.name,
      comment: dto.comment,
      article,
    });

    return await this.commentRepo.save(newComment);
  }

  async findByArticle(articleId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { article: { id: articleId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.commentRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Comment not found');
  }
}
