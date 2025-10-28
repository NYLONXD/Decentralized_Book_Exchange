// src/app/pages/signup/signup.page.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class SignupPage {
  showPassword = false;

  constructor(private router: Router) {}

  // Toast configuration
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

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

    // Get previous users or empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      // Show warning and ask to login
      const result = await Swal.fire({
        title: 'User Already Exists!',
        text: 'An account with this email already exists. Would you like to login instead?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, go to Login',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        this.router.navigate(['/login']);
      }
      return;
    }

    // Create new user and save
    const newUser = { name, email, password, address };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Show success message
    await Swal.fire({
      title: 'Success!',
      text: 'Your account has been created successfully',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continue',
      timer: 2000,
      timerProgressBar: true,
    });

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }

  async onSocial(platform: string) {
    this.Toast.fire({
      icon: 'info',
      title: `${platform} login coming soon!`,
    });
  }
}