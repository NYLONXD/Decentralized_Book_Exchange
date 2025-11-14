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

  // Toast configuration with high z-index
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
    color: '#e8e9ed',
    iconColor: '#00d9ff',
    customClass: {
      container: 'swal2-container-high-z',
      popup: 'modern-toast-popup',
      title: 'modern-toast-title',
      icon: 'modern-toast-icon',
    },
    heightAuto: false,
    didOpen: (toast) => {
      toast.style.border = '1px solid rgba(0, 217, 255, 0.3)';
      toast.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
      toast.style.borderRadius = '16px';
      toast.style.zIndex = '99999';
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
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 0.5rem 0; font-size: 1rem;"><strong style="color: #00d9ff;">Book:</strong> ${book.title}</p>
          <p style="margin: 0.5rem 0; font-size: 1rem;"><strong style="color: #00d9ff;">Owner:</strong> ${book.owner}</p>
          <p style="margin: 0.5rem 0; font-size: 1rem;"><strong style="color: #00d9ff;">Price:</strong> ${book.price}</p>
          <br>
          <p style="text-align: center; font-size: 1.05rem; color: #e8e9ed;">Send an exchange request to <strong>${book.owner}</strong>?</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00d9ff',
      cancelButtonColor: '#ff006e',
      confirmButtonText: 'Yes, Send Request',
      cancelButtonText: 'Cancel',
      background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
      color: '#e8e9ed',
      customClass: {
        container: 'swal2-container-high-z',
        popup: 'modern-swal-popup',
        title: 'modern-swal-title',
        htmlContainer: 'modern-swal-html',
        confirmButton: 'modern-swal-confirm',
        cancelButton: 'modern-swal-cancel',
      },
      backdrop: 'rgba(0, 0, 0, 0.8)',
      heightAuto: false,
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

      // Show success message with await
      await this.Toast.fire({
        icon: 'success',
        title: 'Book exchange request sent!',
      });
    }
  }

  async logout() {
    const result = await Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00d9ff',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
      color: '#e8e9ed',
      customClass: {
        container: 'swal2-container-high-z',
        popup: 'modern-swal-popup',
        title: 'modern-swal-title',
        confirmButton: 'modern-swal-confirm',
        cancelButton: 'modern-swal-cancel',
      },
      backdrop: 'rgba(0, 0, 0, 0.8)',
      heightAuto: false,
    });

    if (result.isConfirmed) {
      localStorage.removeItem('currentUser');

      await this.Toast.fire({
        icon: 'success',
        title: 'Logged out successfully',
      });

      this.router.navigate(['/get-started']);
    }
  }
}
