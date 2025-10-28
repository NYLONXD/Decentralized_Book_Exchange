// src/app/pages/books/books.page.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Book {
  title: string;
  author: string;
  owner: string;
  location: string;
  image: string;
  price: string;
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
  userName = '';

  allBooks: Book[] = [
    // Delhi books
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      owner: 'Ravi Kumar',
      location: 'Delhi',
      image: 'assets/algorithms.jpg',
      price: '$30',
    },
    {
      title: 'Python Crash Course',
      author: 'Eric Matthes',
      owner: 'Himanshu Jha',
      location: 'Delhi',
      image: 'assets/python.jpg',
      price: '$25',
    },

    // Punjab books
    {
      title: 'Let Us C',
      author: 'Yashwant Kanetkar',
      owner: 'Harpreet Singh',
      location: 'Punjab',
      image: 'assets/letusc.jpg',
      price: '$20',
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      owner: 'Simran Kaur',
      location: 'Punjab',
      image: 'assets/pragmatic.jpg',
      price: '$35',
    },

    // Mumbai books
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      owner: 'Ananya Sharma',
      location: 'Mumbai',
      image: 'assets/cleancode.jpg',
      price: '$28',
    },

    // Bangalore books
    {
      title: 'Data Structures in C',
      author: 'Reema Thareja',
      owner: 'Priya Singh',
      location: 'Bangalore',
      image: 'assets/datastructures.jpg',
      price: '$22',
    },
  ];

  filteredBooks: Book[] = [];
  otherBooks: Book[] = [];

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

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // If admin, redirect to dashboard
    if (currentUser.role === 'admin') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.userLocation = currentUser?.address || 'Other';
    this.userName = currentUser?.name || 'User';
    this.filterBooksByLocation();
  }

  filterBooksByLocation() {
    // Books in user's location
    this.filteredBooks = this.allBooks.filter(
      (book) => book.location.toLowerCase() === this.userLocation.toLowerCase()
    );

    // Books from other locations
    this.otherBooks = this.allBooks.filter(
      (book) => book.location.toLowerCase() !== this.userLocation.toLowerCase()
    );
  }

  canExchange(book: Book): boolean {
    return book.location.toLowerCase() === this.userLocation.toLowerCase();
  }

  async onExchangeBook(book: Book) {
    if (!this.canExchange(book)) {
      this.Toast.fire({
        icon: 'warning',
        title: `Not available in ${this.userLocation}`,
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Exchange Book?',
      html: `
        <p><strong>Book:</strong> ${book.title}</p>
        <p><strong>Owner:</strong> ${book.owner}</p>
        <p><strong>Price:</strong> ${book.price}</p>
        <br>
        <p>Send an exchange request to ${book.owner}?</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Send Request',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      // Store exchange request
      const exchanges = JSON.parse(localStorage.getItem('exchanges') || '[]');
      exchanges.push({
        book: book.title,
        owner: book.owner,
        requester: this.userName,
        location: book.location,
        date: new Date().toISOString(),
      });
      localStorage.setItem('exchanges', JSON.stringify(exchanges));

      // Show success message
      this.Toast.fire({
        icon: 'success',
        title: 'Book exchange request sent!',
      });
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/get-started']);
  }
}