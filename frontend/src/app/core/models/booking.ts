export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  createdAt: Date;
  totalPrice?: number;
  user?: User;
  vehicle?: Vehicle;
  payment?: Payment;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface CreateBookingDto {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
}

export interface UpdateBookingDto {
  startDate?: Date;
  endDate?: Date;
  status?: BookingStatus;
}

import { User } from './user';
import { Vehicle } from './vehicle';
import { Payment } from './payment';