export interface IReview {
  id: string;
  rating: number;
  comment: string;
  vehicleId: string;
  userId: string;
  createdAt: string;
  user: {
    fullName: string;
    profileImage: string | null;
  };
}
