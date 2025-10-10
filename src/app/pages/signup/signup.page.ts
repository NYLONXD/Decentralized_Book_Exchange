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
      console.log('Signup data:', form.value);
      // TODO: Implement actual signup logic (API)
      // Redirect to dashboard after successful signup
      this.router.navigate(['/dashboard']);
    } else {
      console.warn('Signup form is invalid');
    }
  }

  onSocial(provider: string) {
    console.log('Social signup with:', provider);
    // TODO: Implement social signup logic
    this.router.navigate(['/dashboard']);
  }
}
