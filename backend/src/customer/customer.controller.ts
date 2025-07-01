import {
  Controller, Get, Patch, Post, Body, Req,
  UseGuards, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UpdateCustomerProfileDto } from './dtos/update-profile.dto';
import { CustomerService } from './customer.service';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';


@Controller('customer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.customerService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Body() dto: UpdateCustomerProfileDto, @Req() req) {
    return this.customerService.updateProfile(req.user.id, dto);
  }

  @Post('profile/photo')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const path = `uploads/profile/${file.filename}`;
    return this.customerService.uploadProfileImage(req.user.id, path);
  }

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req) {
    return this.customerService.changePassword(req.user.id, dto);
  }

  @Get('rentals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CUSTOMER')
  getRentalHistory(@Req() req: RequestWithUser) {
    return this.customerService.getRentalHistory(req.user.id);
  }

}
