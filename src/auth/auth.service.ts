import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private JWT_SECRET = 'secret_key_123'; // ⚠️ Change in production

  // ✳️ Generic Signup
  async signup(dto: SignupDto, role: 'user' | 'admin'): Promise<any> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashed,
      role,
    });
    await this.userRepo.save(user);

    return {
      message: `${role} signup successful`,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    };
  }

  // 🔐 Generic Login
  async login(dto: LoginDto, role: 'user' | 'admin'): Promise<any> {
    const user = await this.userRepo.findOne({ where: { email: dto.email, role } });
    if (!user) throw new UnauthorizedException(`Invalid ${role} email or password`);

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: '7d' },
    );

    return {
      message: `${role} login successful`,
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    };
  }
}
