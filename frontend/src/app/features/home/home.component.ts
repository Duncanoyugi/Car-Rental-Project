import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vehicle } from '../../core/models/vehicle';
import { VehicleService } from '../../core/services/vehicle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredVehicles: Vehicle[] = [];
  isLoading = false;

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedVehicles();
  }

  loadFeaturedVehicles(): void {
    this.isLoading = true;
    this.vehicleService.getFeaturedVehicles().subscribe({
      next: (vehicles) => {
        this.featuredVehicles = vehicles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured vehicles:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchVehicles(searchData: any): void {
    this.router.navigate(['/vehicles'], { 
      queryParams: searchData 
    });
  }

  viewVehicleDetails(vehicleId: string): void {
    this.router.navigate(['/vehicles', vehicleId]);
  }
}