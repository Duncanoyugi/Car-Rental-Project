import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { Vehicle } from 'src/interfaces/vehicle.interface';
import { Vehicle as PrismaVehicle } from '@prisma/client';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToInterface(vehicle: PrismaVehicle): Vehicle {
    return {
      id: vehicle.id,
      title: vehicle.title,
      category: vehicle.category,
      pricePerDay: vehicle.pricePerDay,
      features: vehicle.features,
      imageUrls: vehicle.imageUrls,
      availableFrom: vehicle.availableFrom.toISOString(),
      availableTo: vehicle.availableTo.toISOString(),
      location: vehicle.location,
      createdBy: vehicle.createdBy,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }

  async create(dto: CreateVehicleDto, adminId: string): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.create({
      data: {
        ...dto,
        createdBy: adminId,
      },
    });
    return this.mapToInterface(vehicle);
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const existing = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Vehicle not found');

    const vehicle = await this.prisma.vehicle.update({
      where: { id },
      data: dto,
    });
    return this.mapToInterface(vehicle);
  }

  async delete(id: string): Promise<Vehicle> {
    const existing = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Vehicle not found');

    const vehicle = await this.prisma.vehicle.delete({ where: { id } });
    return this.mapToInterface(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return vehicles.map((v) => this.mapToInterface(v));
  }
}
