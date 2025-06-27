import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from 'src/interfaces/auth.interface';
import { LoginDto } from './dtos/login.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // 1. Check for existing user
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create user
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        phoneNumber: dto.phoneNumber,
        profileImage: dto.profileImage,
        role: 'CUSTOMER',
      },
    });

    // 4. Send welcome email
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Welcome to Dante Car Rental!',
      template: 'success-registration',
      context: {
        fullName: user.fullName,
        email: user.email,
      },
    });

    // 5. Generate JWT token
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // 6. Prepare response
    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage ?? undefined,
        phoneNumber: user.phoneNumber ?? undefined,
      },
    };
  }

   async login(dto: LoginDto): Promise<AuthResponse> {
       const user = await this.prisma.user.findUnique({
          where: { email: dto.email },
    });

    console.log('🔍 User found in DB:', user);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    console.log('🔑 Password check:', isMatch);
    console.log('➡ Provided:', dto.password);
    console.log('➡ Stored:', user.password);

    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    console.log('🎟 JWT token generated:', token);

    return {
        accessToken: token,
        user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage ?? undefined,
        phoneNumber: user.phoneNumber ?? undefined,
        },
    };
  }

}
