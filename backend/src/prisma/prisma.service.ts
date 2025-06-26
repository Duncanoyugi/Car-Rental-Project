import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log("Database connection is successfull");
    await this.$connect();
  }

  async onModuleDestroy() {
    console.log("Error in Database Connection");
    await this.$disconnect();
  }
}
