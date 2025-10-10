import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';

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

  onSignup(form: NgForm) {
    if (form.invalid) {
      alert('Please fill all required fields!');
      return;
    }

    const { name, email, password, confirmPassword, address } = form.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Get previous users or empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      alert('User already exists! Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    // Create new user and save
    const newUser = { name, email, password, address };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Signup successful!');
    this.router.navigate(['/books']); // redirect after signup
  }

  onSocial(platform: string) {
    alert(`Social login with ${platform} is disabled in demo mode.`);
  }
}
