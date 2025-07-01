import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateCustomerProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(customerId: string) {
    return this.prisma.user.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        profileImage: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(customerId: string, dto: UpdateCustomerProfileDto) {
    return this.prisma.user.update({
      where: { id: customerId },
      data: { ...dto },
    });
  }

  async uploadProfileImage(customerId: string, filePath: string) {
    return this.prisma.user.update({
      where: { id: customerId },
      data: { profileImage: filePath },
    });
  }

  async changePassword(customerId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: customerId } });

    if (!user) {
        throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
        throw new BadRequestException('Incorrect current password');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    return this.prisma.user.update({
        where: { id: customerId },
        data: { password: hashed },
    });
  }

  async getRentalHistory(customerId: string) {
    return this.prisma.booking.findMany({
        where: { userId: customerId },
        orderBy: { createdAt: 'desc' },
        select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        vehicle: {
            select: {
            title: true,
            location: true,
            imageUrls: true,
            category: true,
            pricePerDay: true,
            },
        },
      },
    });
  }


}
