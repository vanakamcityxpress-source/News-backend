import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from './comment';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  categoryColor?: string;

  @Column('simple-array', { nullable: true })
  contentParagraphs?: string[];

  @Column({ nullable: true })
  contentQuote?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column({ nullable: true })
  mainImage?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Comment, comment => comment.article, { cascade: true })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
