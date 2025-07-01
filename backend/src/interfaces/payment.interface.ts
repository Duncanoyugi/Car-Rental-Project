export interface IPayment {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  booking?: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    vehicle: {
      id: string;
      title: string;
      location: string;
      pricePerDay: number;
    };
  };
}
