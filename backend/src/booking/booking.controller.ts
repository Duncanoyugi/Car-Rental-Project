import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { Booking } from 'src/interfaces/booking.interface';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.AGENT, Role.ADMIN)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('my-vehicles')
  getBookingsForMyVehicles(@Req() req: RequestWithUser): Promise<Booking[]> {
    return this.bookingService.getBookingsForAgent(req.user.id);
  }

  @Patch(':id/status')
  updateBookingStatus(
    @Param('id') id: string,
    @Body('status') status: Booking['status'],
    @Req() req: RequestWithUser,
  ): Promise<Booking> {
    return this.bookingService.updateBookingStatusByAgent(id, status, req.user.id);
  }
}
