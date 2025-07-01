import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(Role.CUSTOMER)
  create(
    @Body() dto: CreatePaymentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.paymentService.create(dto, req.user.id);
  }

  @Get()
  @Roles(Role.CUSTOMER)
  getMyPayments(@Req() req: RequestWithUser) {
    return this.paymentService.getPaymentsByUser(req.user.id);
  }

  @Get('invoice/:id')
  @Roles(Role.CUSTOMER)
  getInvoice(@Param('id') id: string) {
    return this.paymentService.getInvoice(id);
  }
}
