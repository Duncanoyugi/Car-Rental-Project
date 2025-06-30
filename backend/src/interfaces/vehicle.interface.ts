export interface Vehicle {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  features: string[];
  imageUrls: string[];
  availableFrom: string;
  availableTo: string;
  location: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
