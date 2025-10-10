import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class LoginPage {
  constructor(private router: Router) {}
  
  onLogin(form: any) {
    if (form.valid) {
      console.log('Login form data:', form.value);
      // TODO: Implement actual login logic here (e.g., API call)
      this.router.navigate(['/dashboard']);
    } else {
      console.warn('Invalid login form');
    }
  }

  onSocial(provider: string) {
    console.log('Social login with:', provider);
    // TODO: Implement social login flow (e.g., OAuth)
  }
}
