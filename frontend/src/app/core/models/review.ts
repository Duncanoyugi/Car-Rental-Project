export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  vehicleId: string;
  createdAt: Date;
  user?: User;
  vehicle?: Vehicle;
}

export interface CreateReviewDto {
  rating: number;
  comment: string;
  vehicleId: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

import { User } from './user';
import { Vehicle } from './vehicle';