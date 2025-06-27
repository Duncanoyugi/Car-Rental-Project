import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentDto } from './dtos/create-agent.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createAgent(dto: CreateAgentDto): Promise<string> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    const tempPassword = Math.random().toString(36).slice(-8); // random 8-char string
    const hashed = await bcrypt.hash(tempPassword, 10);

    const agent = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashed,
        phoneNumber: dto.phoneNumber,
        role: 'AGENT',
      },
    });

    await this.mailService.sendMail({
      to: dto.email,
      subject: 'Agent Account Created',
      template: 'agent-invite',
      context: {
        fullName: dto.fullName,
        email: dto.email,
        tempPassword,
        loginUrl: 'http://localhost:3000/login',
      },
    });

    return `Agent ${agent.fullName} created and invite sent.`;
  }
}
