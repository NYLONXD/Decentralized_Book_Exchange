import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule  // ✅ Add IonicModule to support all Ionic components
  ]
})
export class DashboardPage {

  userProfileUrl = 'assets/Admin.jpg';

  books = [
    { title: 'Everyone Has a Story', author: 'Brandon Stanton', price: '$10', image: 'assets/book1.jpg' },
    { title: 'Atomic Habits', author: 'James Clear', price: '$12', image: 'assets/book2.jpg' },
    { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', price: '$8', image: 'assets/book3.jpg' },
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', price: '$15', image: 'assets/book4.jpg' },
    { title: 'Sapiens', author: 'Yuval Noah Harari', price: '$20', image: 'assets/book5.jpg' },
    { title: 'Educated', author: 'Tara Westover', price: '$18', image: 'assets/book6.jpg' },
    { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', price: '$25', image: 'assets/harry_potter.jpg' },
    { title: 'You Can Do It', author: 'Dr. A.P.J. Abdul Kalam', price: '$15', image: 'assets/youcandoit.jpg' },
    { title: 'Dark Psychology', author: 'Dr. Shefali', price: '$22', image: 'assets/darkpsychology.jpg' }
  ];

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/get-started']);
  }
}
