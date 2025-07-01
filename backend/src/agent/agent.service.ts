import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUser } from 'src/interfaces/user.interface';
import { UpdateAgentProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomersForAgent(agentId: string): Promise<IUser[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { createdBy: agentId },
      select: { id: true },
    });

    const vehicleIds = vehicles.map(v => v.id);

    const bookings = await this.prisma.booking.findMany({
      where: {
        vehicleId: { in: vehicleIds },
      },
      select: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const uniqueUsersMap = new Map();
    bookings.forEach(b => {
      if (!uniqueUsersMap.has(b.user.id)) {
        uniqueUsersMap.set(b.user.id, b.user);
      }
    });

    return Array.from(uniqueUsersMap.values());
  }

  async getPaymentsForAgent(agentId: string) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { createdBy: agentId },
      select: { id: true },
    });

    const vehicleIds = vehicles.map(v => v.id);

    const bookings = await this.prisma.booking.findMany({
      where: {
        vehicleId: { in: vehicleIds },
        status: 'COMPLETED',
        totalPrice: { not: null },
      },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            title: true,
          },
        },
      },
    });

    const totalIncome = bookings.reduce((acc, b) => acc + (b.totalPrice ?? 0), 0);

    return {
      totalIncome,
      completedPayments: bookings,
    };
  }

  async getProfile(agentId: string) {
    const agent = await this.prisma.user.findUnique({
      where: { id: agentId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!agent) throw new NotFoundException('Agent not found');

    return agent;
  }

  async updateProfile(agentId: string, dto: UpdateAgentProfileDto) {
    const agent = await this.prisma.user.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    return this.prisma.user.update({
      where: { id: agentId },
      data: { ...dto },
    });
  }

  async uploadProfileImage(agentId: string, filePath: string) {
    const agent = await this.prisma.user.findUnique({ where: { id: agentId } });
    if (!agent) throw new NotFoundException('Agent not found');

    return this.prisma.user.update({
      where: { id: agentId },
      data: { profileImage: filePath },
    });
  }

  async changePassword(agentId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: agentId } });
    if (!user) throw new NotFoundException('Agent not found');

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) throw new BadRequestException('Incorrect current password');

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    return this.prisma.user.update({
      where: { id: agentId },
      data: { password: hashed },
    });
  }
}
