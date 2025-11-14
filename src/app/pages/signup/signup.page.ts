// src/app/pages/signup/signup.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class SignupPage implements OnInit {
  showPassword = false;
  isDetectingLocation = false;
  detectedLocation = '';
  availableLocations: string[] = [];

  // Form model
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  };

  constructor(
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    // Get available locations for dropdown
    this.availableLocations = this.locationService.getAvailableLocations();
  }

  // Toast configuration with high z-index
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
    color: '#e8e9ed',
    iconColor: '#00d9ff',
    customClass: {
      container: 'swal2-container-high-z',
      popup: 'modern-toast-popup',
      title: 'modern-toast-title',
      icon: 'modern-toast-icon',
    },
    heightAuto: false,
    didOpen: (toast) => {
      toast.style.border = '1px solid rgba(0, 217, 255, 0.3)';
      toast.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
      toast.style.borderRadius = '16px';
      toast.style.zIndex = '99999';
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  /**
   * Detect user's current location
   */
  async detectLocation() {
    this.isDetectingLocation = true;

    try {
      const result = await this.locationService.getCurrentLocation();

      if (result.success && result.city) {
        this.detectedLocation = result.city;
        this.formData.address = result.city;

        await this.Toast.fire({
          icon: 'success',
          title: `Location detected: ${result.city}`,
        });
      } else {
        await Swal.fire({
          title: 'Location Detection Failed',
          html: `
            <p style="margin: 1rem 0; color: #e8e9ed;">
              ${result.error || 'Unable to detect location'}
            </p>
            <p style="margin: 1rem 0; color: #b8bcc8;">
              Please select your location manually from the dropdown.
            </p>
          `,
          icon: 'warning',
          confirmButtonColor: '#00d9ff',
          confirmButtonText: 'OK',
          background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
          color: '#e8e9ed',
          customClass: {
            container: 'swal2-container-high-z',
            popup: 'modern-swal-popup',
            title: 'modern-swal-title',
            confirmButton: 'modern-swal-confirm',
          },
          backdrop: 'rgba(0, 0, 0, 0.8)',
          heightAuto: false,
        });
      }
    } catch (error: any) {
      console.error('Location detection error:', error);

      await this.Toast.fire({
        icon: 'error',
        title: 'Location detection failed',
      });
    } finally {
      this.isDetectingLocation = false;
    }
  }

  async onSignup(form: NgForm) {
    if (form.invalid) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please fill all required fields!',
      });
      return;
    }

    const { name, email, password, confirmPassword, address } = form.value;

    // Validate password match
    if (password !== confirmPassword) {
      this.Toast.fire({
        icon: 'error',
        title: 'Passwords do not match!',
      });
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Password must be at least 6 characters',
      });
      return;
    }

    // Validate location
    if (!address || address.trim() === '') {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please select or detect your location',
      });
      return;
    }

    // Get previous users or empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      // Show warning and ask to login
      const result = await Swal.fire({
        title: 'User Already Exists!',
        html: '<p style="font-size: 1.05rem; margin-top: 1rem;">An account with this email already exists. Would you like to login instead?</p>',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00d9ff',
        cancelButtonColor: '#ff006e',
        confirmButtonText: 'Yes, go to Login',
        cancelButtonText: 'Cancel',
        background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
        color: '#e8e9ed',
        customClass: {
          container: 'swal2-container-high-z',
          popup: 'modern-swal-popup',
          title: 'modern-swal-title',
          confirmButton: 'modern-swal-confirm',
          cancelButton: 'modern-swal-cancel',
        },
        backdrop: 'rgba(0, 0, 0, 0.8)',
        heightAuto: false,
      });

      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
      return;
    }

    // Create new user and save
    const newUser = { name, email, password, address, role: 'user' };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Show success message and navigate after it closes
    await Swal.fire({
      title: 'Success!',
      html: `
        <p style="font-size: 1.1rem; margin-top: 1rem;">
          Your account has been created successfully
        </p>
        <p style="font-size: 0.95rem; margin-top: 0.5rem; color: #b8bcc8;">
          📍 Location: <strong style="color: #00d9ff;">${address}</strong>
        </p>
      `,
      icon: 'success',
      confirmButtonColor: '#00d9ff',
      confirmButtonText: 'Continue',
      timer: 3000,
      timerProgressBar: true,
      background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
      color: '#e8e9ed',
      customClass: {
        container: 'swal2-container-high-z',
        popup: 'modern-swal-popup',
        title: 'modern-swal-title',
        confirmButton: 'modern-swal-confirm',
      },
      backdrop: 'rgba(0, 0, 0, 0.8)',
      allowOutsideClick: false,
      heightAuto: false,
    });

    // Navigate after the Swal is completely closed
    this.router.navigate(['/books']);
  }

  async onSocial(platform: string) {
    this.Toast.fire({
      icon: 'info',
      title: `${platform} login coming soon!`,
    });
  }
}
