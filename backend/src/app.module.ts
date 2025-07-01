import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ This is the missing import
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';
import { AgentController } from './agent/agent.controller';
import { AgentService } from './agent/agent.service';
import { AgentModule } from './agent/agent.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ Now this works
    PrismaModule,
    AuthModule,
    VehicleModule,
    BookingModule,
    PaymentModule,
    ReviewModule,
    AdminModule,
    MailModule,
    AgentModule,
    CustomerModule,
  ],
  controllers: [AppController, AgentController],
  providers: [AppService, AgentService],
})
export class AppModule {}
