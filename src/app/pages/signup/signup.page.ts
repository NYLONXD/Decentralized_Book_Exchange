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
    if (form.valid) {
      const user = form.value;

      // Store user data locally
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Navigate to books page
      this.router.navigate(['/books']);
    } else {
      console.warn('Signup form is invalid');
    }
  }

  onSocial(platform: string) {
    console.log('Continue with', platform);
  }
}
