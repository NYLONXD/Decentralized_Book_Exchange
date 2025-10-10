import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';

interface Book {
  title: string;
  author: string;
  owner: string;
  location: string;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class BooksPage implements OnInit {
  userLocation = 'Delhi'; // static for now
  allBooks: Book[] = [
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', owner: 'Ravi Kumar', location: 'Delhi' },
    { title: 'Clean Code', author: 'Robert C. Martin', owner: 'Ananya Sharma', location: 'Mumbai' },
    { title: 'Python Crash Course', author: 'Eric Matthes', owner: 'Saurabh Patel', location: 'Delhi' },
    { title: 'Data Structures in C', author: 'Reema Thareja', owner: 'Priya Singh', location: 'Bangalore' },
  ];

  filteredBooks: Book[] = [];

  ngOnInit() {
    this.filterBooksByLocation();
  }

  filterBooksByLocation() {
    this.filteredBooks = this.allBooks.filter(book => book.location === this.userLocation);
  }
}
