import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ads')
export class Ad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'timestamptz', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endTime?: Date;

  @Column({ default: true })
  isActive: boolean;  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
