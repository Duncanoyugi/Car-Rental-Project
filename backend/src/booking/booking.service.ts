import { Injectable, NotFoundException, ForbiddenException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Booking } from 'src/interfaces/booking.interface';
import { BookingStatus } from '../../generated/prisma';
import { Booking as BookingInterface } from 'src/interfaces/booking.interface';




@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToInterface(booking: any): Booking {
    return {
      ...booking,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      createdAt: booking.createdAt.toISOString(),
    };
  }

  async findAll(): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map(this.mapToInterface);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const booking = await this.prisma.booking.update({
        where: { id },
        data: { status },
    });
    return this.mapToInterface(booking);
  }
  async getBookingsForAgent(agentId: string): Promise<BookingInterface[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { createdBy: agentId },
      select: { id: true },
    });

    const vehicleIds = vehicles.map((v) => v.id);

    const bookings = await this.prisma.booking.findMany({
      where: { vehicleId: { in: vehicleIds } },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => ({
      id: b.id,
      userId: b.userId,
      vehicleId: b.vehicleId,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      status: b.status,
      totalPrice: b.totalPrice,
      createdAt: b.createdAt.toISOString(),
    }));
  }

  async updateBookingStatusByAgent(
    bookingId: string,
    status: BookingInterface['status'],
    agentId: string,
  ): Promise<BookingInterface> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true },
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.vehicle.createdBy !== agentId)
      throw new ForbiddenException('You do not own this vehicle');

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    return {
      id: updated.id,
      userId: updated.userId,
      vehicleId: updated.vehicleId,
      startDate: updated.startDate.toISOString(),
      endDate: updated.endDate.toISOString(),
      status: updated.status,
      totalPrice: updated.totalPrice,
      createdAt: updated.createdAt.toISOString(),
    };
  }

}
