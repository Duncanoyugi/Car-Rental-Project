import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { Vehicle, VehicleSearchDto, VEHICLE_CATEGORIES } from '../../core/models/vehicle';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class HomeComponent implements OnInit {
  @ViewChild('searchSection') searchSection!: ElementRef;

  searchForm: FormGroup;
  featuredVehicles: Vehicle[] = [];
  searchResults: Vehicle[] = [];
  vehicleCategories = VEHICLE_CATEGORIES;
  searching = false;
  loadingFeatured = true;
  loadingTestimonials = true;
  testimonials: { text: string; author: string }[] = [];
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.searchForm = this.createSearchForm();
  }

  ngOnInit(): void {
    this.loadFeaturedVehicles();
    this.setDefaultDates();
    this.loadTestimonials(); // Added to handle testimonials
  }

  private createSearchForm(): FormGroup {
    return this.fb.group({
      location: [''],
      category: [''],
      startDate: [''],
      endDate: [''],
      minPrice: [''],
      maxPrice: [''],
    });
  }

  private setDefaultDates(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    this.searchForm.patchValue({
      startDate: this.formatDateForInput(tomorrow),
      endDate: this.formatDateForInput(dayAfter),
    });
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  private loadFeaturedVehicles(): void {
    this.loadingFeatured = true;
    this.vehicleService.getFeaturedVehicles().subscribe({
      next: (vehicles) => {
        this.featuredVehicles = vehicles.slice(0, 6);
        this.loadingFeatured = false;
      },
      error: (error) => {
        console.error('Error loading featured vehicles:', error);
        this.loadingFeatured = false;
        this.loadAllVehicles();
      },
    });
  }

  private loadAllVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.featuredVehicles = vehicles.slice(0, 6);
        this.loadingFeatured = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.loadingFeatured = false;
      },
    });
  }

  private loadTestimonials(): void {
    // Placeholder: Replace with actual service call if available
    this.loadingTestimonials = true;
    setTimeout(() => {
      this.testimonials = [
        { text: 'Great service and easy booking!', author: 'John D.' },
        { text: 'Highly recommend this rental service!', author: 'Jane S.' },
      ];
      this.loadingTestimonials = false;
    }, 1000); // Simulate API delay
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      return;
    }

    this.searching = true;
    const formValue = this.searchForm.value;

    const searchDto: VehicleSearchDto = {
      location: formValue.location || undefined,
      category: formValue.category || undefined,
      startDate: formValue.startDate ? new Date(formValue.startDate) : undefined,
      endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
      minPrice: formValue.minPrice ? Number(formValue.minPrice) : undefined,
      maxPrice: formValue.maxPrice ? Number(formValue.maxPrice) : undefined,
    };

    this.vehicleService.searchVehicles(searchDto).subscribe({
      next: (vehicles) => {
        this.searchResults = vehicles;
        this.searching = false;
        if (vehicles.length > 0) {
          setTimeout(() => {
            const resultsSection = document.querySelector('.results-section');
            if (resultsSection) {
              resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error searching vehicles:', error);
        this.searching = false;
      },
    });
  }

  scrollToSearch(): void {
    if (this.searchSection) {
      this.searchSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  viewVehicle(vehicleId: string): void {
    this.router.navigate(['/vehicles', vehicleId]);
  }
}