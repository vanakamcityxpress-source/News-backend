import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('breaking_news')
export class BreakingNews {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'https://xyz.supabase.co/storage/v1/object/public/breaking-news/videos/video123.mp4',
    description: 'Public Supabase video URL',
    required: false,
  })
  video?: string;

  @Column()
  @ApiProperty({ example: 'Breaking: Major Event Happened' })
  heading: string;

  @Column('text')
  @ApiProperty({ example: 'Detailed description of the breaking news...' })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}
