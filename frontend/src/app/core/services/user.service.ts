import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UpdateProfileDto, ChangePasswordDto } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Get current user profile
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  // Update user profile
  updateProfile(profile: UpdateProfileDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/profile`, profile);
  }

  // Change password
  changePassword(passwordData: ChangePasswordDto): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/change-password`, passwordData);
  }

  // Upload profile image
  uploadProfileImage(file: File): Observable<{ profileImage: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ profileImage: string }>(`${this.apiUrl}/upload-image`, formData);
  }

  // Get all users (admin only)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get user by ID (admin only)
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Block/Unblock user (admin only)
  toggleUserBlock(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/toggle-block`, {});
  }

  // Delete user (admin only)
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get user statistics (admin only)
  getUserStats(): Observable<{
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    usersByRole: { [key: string]: number };
  }> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}