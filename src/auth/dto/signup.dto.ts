import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'mathi', description: 'Username of the user' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'mathi@example.com', description: 'Valid email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Password (min 6 chars)' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user', description: 'Role: user or admin', required: false })
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: string;
}
