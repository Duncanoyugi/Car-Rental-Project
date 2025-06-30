import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthResponse } from 'src/interfaces/auth.interface';
import { LoginDto } from './dtos/login.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { RequestResetDto } from './dtos/request-reset.dto';
import { ConfirmResetDto } from './dtos/confirm-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<string> {
    return this.authService.verifyEmail(token);
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req,
    @Body() dto: ChangePasswordDto,
  ): Promise<string> {
    return this.authService.changePassword(req.user.sub, dto);
  }
  @Post('request-reset')
  async requestReset(@Body() dto: RequestResetDto): Promise<string> {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('confirm-reset')
  async confirmReset(@Body() dto: ConfirmResetDto): Promise<string> {
    return this.authService.confirmPasswordReset(dto);
  }

}
