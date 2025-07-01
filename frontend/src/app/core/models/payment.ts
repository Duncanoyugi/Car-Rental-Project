export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: Date;
  booking?: Booking;
}

export interface CreatePaymentDto {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
}

export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  FLUTTERWAVE = 'FLUTTERWAVE',
  CASH = 'CASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

import { Booking } from './booking';