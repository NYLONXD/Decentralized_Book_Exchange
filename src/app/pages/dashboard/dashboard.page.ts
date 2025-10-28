import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

interface Book {
  title: string;
  author: string;
  owner: string;
  location: string;
  image: string;
  price: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class DashboardPage implements AfterViewInit, OnDestroy, OnInit {
  userProfileUrl = 'assets/Admin.jpg';
  private swiperInstance: any;
  isAdmin = false;
  userName = '';
  
  // Filter state
  selectedLocation = 'All';
  locations = ['All', 'Delhi', 'Punjab', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai'];
  
  // All books from all states
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
    {
      title: 'Everyone Has a Story',
      author: 'Savi Sharma',
      location: 'Delhi',
      owner: 'Priya Sharma',
      price: '$10',
      image: 'assets/book1.jpg',
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
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      location: 'Punjab',
      owner: 'Gurpreet Singh',
      price: '$10',
      image: 'assets/book2.jpg',
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
    {
      title: 'The Subtle Art of Not Giving a F*ck',
      author: 'Mark Manson',
      location: 'Mumbai',
      owner: 'Rahul Desai',
      price: '$5',
      image: 'assets/book3.jpg',
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
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      location: 'Bangalore',
      owner: 'Karthik Reddy',
      price: '$15',
      image: 'assets/book4.png',
    },

    // Kolkata books
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      location: 'Kolkata',
      owner: 'Sumit Das',
      price: '$20',
      image: 'assets/book5.png',
    },

    // Chennai books
    {
      title: 'The Perfect Murder',
      author: 'Ruskin Bond',
      location: 'Chennai',
      owner: 'Lakshmi Iyer',
      price: '$6',
      image: 'assets/book6.jpg',
    },
  ];

  // Featured books for slider
  books: Book[] = [
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: 'J.K. Rowling',
      owner: 'Featured',
      location: 'All',
      price: '$25',
      image: 'assets/harry_potter.jpg',
    },
    {
      title: 'You Can Do It',
      author: 'Dr. A.P.J. Abdul Kalam',
      owner: 'Featured',
      location: 'All',
      price: '$15',
      image: 'assets/youcandoit.jpg',
    },
    {
      title: 'Dark Psychology',
      author: 'Dr. Shefali',
      owner: 'Featured',
      location: 'All',
      price: '$22',
      image: 'assets/darkpsychology.jpg',
    },
  ];

  displayedBooks: Book[] = [];
  
  // Statistics
  totalUsers = 0;
  totalBooks = 0;
  booksByState: { [key: string]: number } = {};

  constructor(private router: Router) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.isAdmin = currentUser.role === 'admin';
    this.userName = currentUser.name || 'User';
    
    if (!this.isAdmin) {
      // If not admin, redirect to books page
      this.router.navigate(['/books']);
    }

    this.calculateStatistics();
    this.filterBooks();
  }

  calculateStatistics() {
    // Get total users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    this.totalUsers = users.length;
    
    // Get total books
    this.totalBooks = this.allBooks.length;
    
    // Books by state
    this.booksByState = {};
    this.allBooks.forEach(book => {
      if (!this.booksByState[book.location]) {
        this.booksByState[book.location] = 0;
      }
      this.booksByState[book.location]++;
    });
  }

  filterBooks() {
    if (this.selectedLocation === 'All') {
      this.displayedBooks = [...this.allBooks];
    } else {
      this.displayedBooks = this.allBooks.filter(
        book => book.location === this.selectedLocation
      );
    }
  }

  onLocationChange() {
    this.filterBooks();
  }

  ngAfterViewInit() {
    this.loadSwiperScript();
  }

  loadSwiperScript() {
    if ((window as any).Swiper) {
      this.initSwiper();
      return;
    }

    const swiperCss = document.createElement('link');
    swiperCss.rel = 'stylesheet';
    swiperCss.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(swiperCss);

    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    swiperScript.onload = () => {
      setTimeout(() => {
        this.initSwiper();
      }, 100);
    };
    document.body.appendChild(swiperScript);
  }

  initSwiper() {
    this.swiperInstance = new (window as any).Swiper('.swiper', {
      slidesPerView: 5,
      spaceBetween: 15,
      loop: true,
      speed: 700,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        480: { slidesPerView: 2, spaceBetween: 10 },
        768: { slidesPerView: 3, spaceBetween: 15 },
        1024: { slidesPerView: 4, spaceBetween: 15 },
        1440: { slidesPerView: 5, spaceBetween: 15 },
      },
    });
  }

  ngOnDestroy() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/get-started']);
  }
}