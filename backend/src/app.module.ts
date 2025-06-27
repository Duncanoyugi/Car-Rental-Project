import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ This is the missing import
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Now this works
    PrismaModule,
    AuthModule,
    UserModule,
    VehicleModule,
    BookingModule,
    PaymentModule,
    ReviewModule,
    AdminModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
