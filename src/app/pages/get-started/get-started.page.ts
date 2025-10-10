import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonAvatar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonAvatar]
})
 

export class GetStartedPage {
  headingText: string;
  
  constructor(private router: Router) {
    this.headingText = 'NO MARKSSSSS';
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  
    changeON() {
    this.headingText = 'HELLO SIR FULL MARKS PLEASE';
    console.log('Button clicked, text changed.');
    // after clicking again on button 
  }
  changeOFF(){
    this.headingText = 'NO MARKSSSSS';
    console.log('Button clicked, text changed back.');
  }
}
 