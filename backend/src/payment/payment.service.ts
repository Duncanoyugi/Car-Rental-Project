import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { IPayment } from 'src/interfaces/payment.interface';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, userId: string): Promise<IPayment> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Unauthorized booking access');

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        method: dto.method,
        status: 'COMPLETED',
      },
      include: {
        booking: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    await this.prisma.booking.update({
      where: { id: dto.bookingId },
      data: { status: 'COMPLETED' },
    });

    return this.mapToIPayment(payment);
  }

  async getPaymentsByUser(userId: string): Promise<IPayment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        booking: {
          userId,
        },
      },
      include: {
        booking: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    return payments.map(this.mapToIPayment);
  }

  async getInvoice(paymentId: string): Promise<IPayment> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            user: true,
            vehicle: true,
          },
        },
      },
    });

    if (!payment) throw new NotFoundException('Invoice not found');
    return this.mapToIPayment(payment);
  }

  private mapToIPayment(payment: any): IPayment {
    return {
      id: payment.id,
      bookingId: payment.bookingId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      createdAt: payment.createdAt.toISOString(),
      booking: payment.booking
        ? {
            id: payment.booking.id,
            startDate: payment.booking.startDate.toISOString(),
            endDate: payment.booking.endDate.toISOString(),
            totalPrice: payment.booking.totalPrice ?? 0,
            vehicle: {
              id: payment.booking.vehicle.id,
              title: payment.booking.vehicle.title,
              location: payment.booking.vehicle.location,
              pricePerDay: payment.booking.vehicle.pricePerDay,
            },
          }
        : undefined,
    };
  }
}
