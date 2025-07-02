import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleSearchDto } from '../models/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/api/vehicles`; // Changed from '/vehicles' to '/api/vehicles'

  constructor(private http: HttpClient) {}

  // Get all vehicles
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.apiUrl);
  }

  // Get vehicle by ID
  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  // Search vehicles
  searchVehicles(searchDto: VehicleSearchDto): Observable<Vehicle[]> {
    let params = new HttpParams();
    
    if (searchDto.location) params = params.set('location', searchDto.location);
    if (searchDto.category) params = params.set('category', searchDto.category);
    if (searchDto.startDate) params = params.set('startDate', searchDto.startDate.toISOString());
    if (searchDto.endDate) params = params.set('endDate', searchDto.endDate.toISOString());
    if (searchDto.minPrice) params = params.set('minPrice', searchDto.minPrice.toString());
    if (searchDto.maxPrice) params = params.set('maxPrice', searchDto.maxPrice.toString());

    return this.http.get<Vehicle[]>(`${this.apiUrl}/browse`, { params }); // Adjusted to match backend 'browse'
  }

  // Create vehicle (admin/agent only)
  createVehicle(vehicle: CreateVehicleDto): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.apiUrl, vehicle);
  }

  // Update vehicle (admin/agent only)
  updateVehicle(id: string, vehicle: UpdateVehicleDto): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, vehicle);
  }

  // Delete vehicle (admin only)
  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Upload vehicle images
  uploadVehicleImages(files: File[]): Observable<{ imageUrls: string[] }> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post<{ imageUrls: string[] }>(`${this.apiUrl}/upload-images`, formData);
  }

  // Get vehicles by category
  getVehiclesByCategory(category: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/category/${category}`);
  }

  // Get available vehicles
  getAvailableVehicles(startDate: Date, endDate: Date): Observable<Vehicle[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    
    return this.http.get<Vehicle[]>(`${this.apiUrl}/available`, { params });
  }

  // Get vehicle statistics (admin only)
  getVehicleStats(): Observable<{
    totalVehicles: number;
    availableVehicles: number;
    rentedVehicles: number;
    vehiclesByCategory: { [key: string]: number };
  }> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // Get featured vehicles
  getFeaturedVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/featured`);
  }
}