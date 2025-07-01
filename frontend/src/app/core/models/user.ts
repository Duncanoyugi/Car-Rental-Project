export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role: Role;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  emailVerifyToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  mustChangePassword: boolean;
  isBlocked: boolean;
  bookings?: Booking[];
  reviews?: Review[];
}

export enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  CUSTOMER = 'CUSTOMER'
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

import { Booking } from './booking';
import { Review } from './review';