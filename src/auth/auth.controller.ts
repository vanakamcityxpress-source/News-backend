import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🧍‍♂️ USER ROUTES
  @Post('user/signup')
  @ApiOperation({ summary: 'Register a normal user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async userSignup(@Body() dto: SignupDto) {
    return this.authService.signup(dto, 'user');
  }

  @Post('user/login')
  @ApiOperation({ summary: 'Login as user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  async userLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto, 'user');
  }

  // 👨‍💼 ADMIN ROUTES
  @Post('admin/signup')
  @ApiOperation({ summary: 'Register an admin user' })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  async adminSignup(@Body() dto: SignupDto) {
    return this.authService.signup(dto, 'admin');
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Login as admin' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  async adminLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto, 'admin');
  }
}
