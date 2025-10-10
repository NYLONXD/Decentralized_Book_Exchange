import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface Book {
  title: string;
  author: string;
  owner: string;
  location: string;
  image: string;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class BooksPage implements OnInit {
  userLocation = '';

  allBooks: Book[] = [
    // Delhi books
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      owner: 'Ravi Kumar',
      location: 'Delhi',
      image: 'assets/algorithms.jpg',
    },
    {
      title: 'Python Crash Course',
      author: 'Eric Matthes',
      owner: 'Himanshu Jha',
      location: 'Delhi',
      image: 'assets/python.jpg',
    },

    // Punjab books
    {
      title: 'Let Us C',
      author: 'Yashwant Kanetkar',
      owner: 'Harpreet Singh',
      location: 'Punjab',
      image: 'assets/letusc.jpg',
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      owner: 'Simran Kaur',
      location: 'Punjab',
      image: 'assets/pragmatic.jpg',
    },

    // Other cities
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      owner: 'Ananya Sharma',
      location: 'Mumbai',
      image: 'assets/cleancode.jpg',
    },
    {
      title: 'Data Structures in C',
      author: 'Reema Thareja',
      owner: 'Priya Singh',
      location: 'Bangalore',
      image: 'assets/datastructures.jpg',
    },
  ];

  filteredBooks: Book[] = [];

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userLocation = currentUser?.address || 'Other';
    this.filterBooksByLocation();
  }

  filterBooksByLocation() {
    this.filteredBooks = this.allBooks.filter(
      (book) =>
        book.location.toLowerCase() === this.userLocation.toLowerCase()
    );
  }
}
