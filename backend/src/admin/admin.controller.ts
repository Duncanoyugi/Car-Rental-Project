import { Controller, Post, Body, UseGuards, Get, Param, Patch, Query, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAgentDto } from './dtos/create-agent.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BookingService } from 'src/booking/booking.service';
import { UpdateBookingStatusDto } from 'src/booking/dtos/update-booking-status.dto';
import { BookingStatus, Role } from '../../generated/prisma';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly bookingService: BookingService,
  ) {}

  @Post('create-agent')
  createAgent(@Body() dto: CreateAgentDto) {
    return this.adminService.createAgent(dto);
  }

  @Get('stats')
  getStats() {
    return this.adminService.getSystemStats();
  }

  @Get('bookings')
  getAllBookings() {
    return this.bookingService.findAll();
  }

  @Patch('booking/:id/status')
  updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingService.updateStatus(id, dto.status as BookingStatus);
  }
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('user')
  getSingleUser(
    @Query('email') email?: string,
    @Query('name') name?: string,
    @Query('role') role?: Role,
  ) {
    return this.adminService.findUser({ email, name, role });
  }

  @Patch('update-user/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Patch('block-user/:id')
  blockOrUnblockUser(
    @Param('id') id: string,
    @Body('block') block: boolean,
  ) {
    return this.adminService.toggleBlockUser(id, block);
  }


}
