import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentDto } from './dtos/create-agent.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { User, Role } from '../../generated/prisma';
import { UpdateUserDto } from './dtos/update-user.dto';

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
        totalPrice: true,
      },
      where: {
        status: 'COMPLETED',
      },
    });

    const revenue = revenueAgg._sum.totalPrice || 0;

    // Most rented vehicles
    const mostRented = await this.prisma.booking.groupBy({
      by: ['vehicleId'],
      _count: {
        vehicleId: true,
      },
      orderBy: {
        _count: {
          vehicleId: 'desc',
        },
      },
      take: 5,
    });

    const vehicleIds = mostRented.map((v) => v.vehicleId);
    const vehicles = await this.prisma.vehicle.findMany({
      where: { id: { in: vehicleIds } },
    });

    const mostRentedVehicles = vehicles.map((v) => {
      const rentals = mostRented.find((m) => m.vehicleId === v.id)?._count.vehicleId || 0;
      return {
        id: v.id,
        title: v.title,
        category: v.category,
        pricePerDay: v.pricePerDay,
        location: v.location,
        totalRentals: rentals,
      };
    });

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
      mostRentedVehicles,
    };
  }


  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUser(filter: { email?: string; name?: string; role?: Role }) {
    const user = await this.prisma.user.findFirst({
      where: {
        ...(filter.email && { email: filter.email }),
        ...(filter.name && { fullName: { contains: filter.name, mode: 'insensitive' } }),
        ...(filter.role && { role: filter.role }),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async toggleBlockUser(id: string, block: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        isBlocked: block,
      },
    });
  }




}
