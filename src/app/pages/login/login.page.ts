// src/app/pages/login/login.page.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class LoginPage {
  // Admin credentials
  private readonly ADMIN_EMAIL = 'admin@gmail.com';
  private readonly ADMIN_PASSWORD = 'admin123'; // You can change this

  constructor(private router: Router) {}

  // Toast configuration
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
    color: '#e8e9ed',
    iconColor: '#00d9ff',
    customClass: {
      popup: 'modern-toast-popup',
      title: 'modern-toast-title',
      icon: 'modern-toast-icon'
    },
    didOpen: (toast) => {
      toast.style.border = '1px solid rgba(0, 217, 255, 0.3)';
      toast.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
      toast.style.borderRadius = '16px';
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  async onLogin(form: any) {
    if (!form.valid) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please fill all required fields',
      });
      return;
    }

    const { email, password } = form.value;

    // Check if admin login
    if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASSWORD) {
      const adminUser = {
        name: 'Admin',
        email: this.ADMIN_EMAIL,
        role: 'admin',
        address: 'All Locations',
      };

      localStorage.setItem('currentUser', JSON.stringify(adminUser));

      this.Toast.fire({
        icon: 'success',
        title: 'Admin logged in successfully',
      });

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
      return;
    }

    // Regular user login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // Add role to user
      user.role = 'user';
      localStorage.setItem('currentUser', JSON.stringify(user));

      this.Toast.fire({
        icon: 'success',
        title: 'Signed in successfully',
      });

      setTimeout(() => {
        this.router.navigate(['/books']);
      }, 1500);
    } else {
      this.Toast.fire({
        icon: 'error',
        title: 'Invalid email or password',
      });
    }
  }

  async onSocial(provider: string) {
    this.Toast.fire({
      icon: 'info',
      title: `${provider} login coming soon!`,
    });
  }
}