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
  Query,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Vehicle } from 'src/interfaces/vehicle.interface';
import { Role } from '../../generated/prisma';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @Roles(Role.ADMIN, Role.AGENT)
  create(@Body() dto: CreateVehicleDto, @Request() req): Promise<Vehicle> {
    return this.vehicleService.create(dto, req.user.sub);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.AGENT)
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto): Promise<Vehicle> {
    return this.vehicleService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.AGENT)
  delete(@Param('id') id: string): Promise<Vehicle> {
    return this.vehicleService.delete(id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.AGENT)
  findAll(): Promise<Vehicle[]> {
    return this.vehicleService.findAll();
  }

  @Get('browse')
  @Roles(Role.CUSTOMER)
  browseVehicles(
    @Query('location') location?: string,
    @Query('category') category?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('q') q?: string,
  ) {
    return this.vehicleService.searchAvailableVehicles({ location, category, from, to, q });
  }
}
