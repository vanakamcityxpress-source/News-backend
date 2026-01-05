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
    example: 'uploads/videos/breaking-news-123.mp4',
    description: 'Path to the video file',
    required: false,
  })
  video?: string;

  @Column()
  @ApiProperty({ example: 'Breaking: Major Event Happened' })
  heading: string;

  @Column('text')
  @ApiProperty({ example: 'Detailed description of the breaking news...' })
  description: string;

  @Column({ 
    name: 'isActive', // Match your database column name
    default: false 
  })
  @ApiProperty({ example: false, description: 'Whether the news is active' })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: Date;
}