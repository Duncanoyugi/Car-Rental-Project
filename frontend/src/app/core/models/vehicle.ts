export interface Vehicle {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  features: string[];
  imageUrls: string[];
  availableFrom: Date;
  availableTo: Date;
  location: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  bookings?: Booking[];
  reviews?: Review[];
}

export interface CreateVehicleDto {
  title: string;
  category: string;
  pricePerDay: number;
  features: string[];
  imageUrls: string[];
  availableFrom: Date;
  availableTo: Date;
  location: string;
}

export interface UpdateVehicleDto {
  title?: string;
  category?: string;
  pricePerDay?: number;
  features?: string[];
  imageUrls?: string[];
  availableFrom?: Date;
  availableTo?: Date;
  location?: string;
}

export interface VehicleSearchDto {
  location?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
}

export const VEHICLE_CATEGORIES = [
  'SUV',
  'Sedan',
  'Economy',
  'Luxury',
  'Compact',
  'Van',
  'Truck'
] as const;

export type VehicleCategory = typeof VEHICLE_CATEGORIES[number];

import { Booking } from './booking';
import { Review } from './review';