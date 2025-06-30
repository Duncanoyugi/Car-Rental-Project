import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [PrismaModule, MailModule, BookingModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
