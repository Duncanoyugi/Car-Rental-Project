import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, CreateBookingDto, UpdateBookingDto, BookingStatus } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  // Create a new booking
  createBooking(booking: CreateBookingDto): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  // Get all bookings for current user
  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user`);
  }

  // Get all bookings (admin/agent only)
  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  // Get booking by ID
  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  // Update booking
  updateBooking(id: string, booking: UpdateBookingDto): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}`, booking);
  }

  // Cancel booking
  cancelBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Confirm booking (admin/agent only)
  confirmBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/confirm`, {});
  }

  // Complete booking
  completeBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/complete`, {});
  }

  // Delete booking (admin only)
  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get bookings by status
  getBookingsByStatus(status: BookingStatus): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get bookings by vehicle
  getBookingsByVehicle(vehicleId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/vehicle/${vehicleId}`);
  }

  // Calculate total price
  calculatePrice(vehicleId: string, startDate: Date, endDate: Date): Observable<{ totalPrice: number }> {
    return this.http.post<{ totalPrice: number }>(`${this.apiUrl}/calculate-price`, {
      vehicleId,
      startDate,
      endDate
    });
  }
}