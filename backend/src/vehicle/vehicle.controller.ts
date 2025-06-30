import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Vehicle } from 'src/interfaces/vehicle.interface';

// Define Role manually if Prisma enum import fails
type Role = 'ADMIN' | 'AGENT' | 'CUSTOMER';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  create(
    @Body() dto: CreateVehicleDto,
    @Request() req,
  ): Promise<Vehicle> {
    return this.vehicleService.create(dto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehicleService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Vehicle> {
    return this.vehicleService.delete(id);
  }

  @Get()
  findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }
}
