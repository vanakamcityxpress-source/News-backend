import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Article } from './Article';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  comment: string;

  @ManyToOne(() => Article, (article) => article.comments, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @CreateDateColumn()
  createdAt: Date;
}
