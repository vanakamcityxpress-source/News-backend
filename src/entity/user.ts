import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // 👈 Role: 'user' or 'admin'
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
