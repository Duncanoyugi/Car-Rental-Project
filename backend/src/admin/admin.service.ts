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

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);

    const agent = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashed,
        phoneNumber: dto.phoneNumber,
        role: 'AGENT',
        mustChangePassword: true,
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

  async getSystemStats() {
    const [totalUsers, totalAgents, totalCustomers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'AGENT' } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    const totalVehicles = await this.prisma.vehicle.count();
    const totalBookings = await this.prisma.booking.count();

    const bookingStatusCounts = await this.prisma.booking.groupBy({
      by: ['status'],
      _count: true,
    });

    const revenueAgg = await this.prisma.booking.aggregate({
      _sum: {
        totalPrice: true, // 🔐 Ensure `totalPrice` exists in Booking model
      },
    });

    const revenue = revenueAgg._sum.totalPrice || 0;

    return {
      users: {
        total: totalUsers,
        agents: totalAgents,
        customers: totalCustomers,
      },
      vehicles: totalVehicles,
      bookings: {
        total: totalBookings,
        byStatus: bookingStatusCounts.reduce((acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        }, {} as Record<string, number>),
      },
      revenue,
    };
  }
}
