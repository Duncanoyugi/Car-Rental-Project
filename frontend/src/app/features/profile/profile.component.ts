import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../core/models/user';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  message = '';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  createProfileForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      dateOfBirth: [''],
      licenseNumber: [''],
      address: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      })
    });
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.populateForm(user);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.message = 'Error loading profile data';
        this.isLoading = false;
      }
    });
  }

  populateForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      licenseNumber: user.licenseNumber || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.populateForm(this.user);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formData = this.profileForm.value;
      
      this.userService.updateProfile(formData).subscribe({
        next: (user) => {
          this.user = user;
          this.isEditing = false;
          this.isLoading = false;
          this.message = 'Profile updated successfully';
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.message = 'Error updating profile';
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userService.uploadProfileImage(file).subscribe({
        next: (response) => {
          if (this.user) {
            this.user.profileImage = response.imageUrl;
          }
          this.message = 'Profile image updated successfully';
          setTimeout(() => this.message = '', 3000);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.message = 'Error uploading image';
        }
      });
    }
  }
}