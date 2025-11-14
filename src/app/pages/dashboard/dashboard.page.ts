import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Book {
  id?: string;
  title: string;
  author: string;
  owner: string;
  location: string;
  image: string;
  price: string;
  addedDate?: string;
}

interface User {
  name: string;
  email: string;
  address: string;
  role: string;
  joinedDate?: string;
}

interface Exchange {
  book: string;
  owner: string;
  requester: string;
  location: string;
  date: string;
  status?: string;
  id?: string;
}

interface Activity {
  type: 'signup' | 'exchange' | 'book_added';
  user: string;
  action: string;
  time: string;
  icon: string;
  color: string;
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

  // Active tab
  activeTab: 'overview' | 'users' | 'exchanges' | 'books' | 'analytics' =
    'overview';

  // Filter state
  selectedLocation = 'All';
  locations = [
    'All',
    'Delhi',
    'Punjab',
    'Mumbai',
    'Bangalore',
    'Kolkata',
    'Chennai',
  ];

  // All books
  allBooks: Book[] = [
    {
      id: '1',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      owner: 'Ravi Kumar',
      location: 'Delhi',
      image: 'assets/algorithms.jpg',
      price: '$30',
      addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Python Crash Course',
      author: 'Eric Matthes',
      owner: 'Himanshu Jha',
      location: 'Delhi',
      image: 'assets/python.jpg',
      price: '$25',
      addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Everyone Has a Story',
      author: 'Savi Sharma',
      location: 'Delhi',
      owner: 'Priya Sharma',
      price: '$10',
      image: 'assets/book1.jpg',
      addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      title: 'Let Us C',
      author: 'Yashwant Kanetkar',
      owner: 'Harpreet Singh',
      location: 'Punjab',
      image: 'assets/letusc.jpg',
      price: '$20',
      addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      owner: 'Simran Kaur',
      location: 'Punjab',
      image: 'assets/pragmatic.jpg',
      price: '$35',
      addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      title: 'Atomic Habits',
      author: 'James Clear',
      location: 'Punjab',
      owner: 'Gurpreet Singh',
      price: '$10',
      image: 'assets/book2.jpg',
      addedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '7',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      owner: 'Ananya Sharma',
      location: 'Mumbai',
      image: 'assets/cleancode.jpg',
      price: '$28',
      addedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '8',
      title: 'The Subtle Art of Not Giving a F*ck',
      author: 'Mark Manson',
      location: 'Mumbai',
      owner: 'Rahul Desai',
      price: '$5',
      image: 'assets/book3.jpg',
      addedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '9',
      title: 'Data Structures in C',
      author: 'Reema Thareja',
      owner: 'Priya Singh',
      location: 'Bangalore',
      image: 'assets/datastructures.jpg',
      price: '$22',
      addedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '10',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      location: 'Bangalore',
      owner: 'Karthik Reddy',
      price: '$15',
      image: 'assets/book4.png',
      addedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '11',
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      location: 'Kolkata',
      owner: 'Sumit Das',
      price: '$20',
      image: 'assets/book5.png',
      addedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '12',
      title: 'The Perfect Murder',
      author: 'Ruskin Bond',
      location: 'Chennai',
      owner: 'Lakshmi Iyer',
      price: '$6',
      image: 'assets/book6.jpg',
      addedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Featured books
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

  // Users data
  allUsers: User[] = [];

  // Exchanges data
  allExchanges: Exchange[] = [];
  pendingExchanges: Exchange[] = [];

  // Statistics
  totalUsers = 0;
  totalBooks = 0;
  totalExchanges = 0;
  activeExchanges = 0;
  booksByState: { [key: string]: number } = {};

  // Recent activity
  recentActivities: Activity[] = [];

  // Charts data
  userGrowthData: any[] = [];
  exchangeTrendData: any[] = [];

  // Toast configuration
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
    this.isAdmin = currentUser.role === 'admin';
    this.userName = currentUser.name || 'User';

    if (!this.isAdmin) {
      this.router.navigate(['/books']);
      return;
    }

    this.loadData();
  }

  loadData() {
    this.loadUsers();
    this.loadExchanges();
    this.calculateStatistics();
    this.generateRecentActivities();
    this.filterBooks();
  }

  loadUsers() {
    this.allUsers = JSON.parse(localStorage.getItem('users') || '[]').map(
      (user: any) => ({
        ...user,
        joinedDate:
          user.joinedDate ||
          new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
      })
    );
  }

  loadExchanges() {
    this.allExchanges = JSON.parse(
      localStorage.getItem('exchanges') || '[]'
    ).map((exchange: any, index: number) => ({
      ...exchange,
      status: exchange.status || 'pending',
      id: exchange.id || `ex-${index}`,
    }));

    this.pendingExchanges = this.allExchanges.filter(
      (ex) => ex.status === 'pending'
    );
    this.totalExchanges = this.allExchanges.length;
    this.activeExchanges = this.pendingExchanges.length;
  }

  calculateStatistics() {
    this.totalUsers = this.allUsers.length;
    this.totalBooks = this.allBooks.length;

    // Books by state
    this.booksByState = {};
    this.allBooks.forEach((book) => {
      if (!this.booksByState[book.location]) {
        this.booksByState[book.location] = 0;
      }
      this.booksByState[book.location]++;
    });
  }

  generateRecentActivities() {
    this.recentActivities = [];

    // Recent signups
    const recentUsers = [...this.allUsers]
      .sort(
        (a, b) =>
          new Date(b.joinedDate!).getTime() - new Date(a.joinedDate!).getTime()
      )
      .slice(0, 3);

    recentUsers.forEach((user) => {
      this.recentActivities.push({
        type: 'signup',
        user: user.name,
        action: `joined from ${user.address}`,
        time: this.getTimeAgo(user.joinedDate!),
        icon: 'person-add',
        color: '#00d9ff',
      });
    });

    // Recent exchanges
    const recentExchanges = [...this.allExchanges]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    recentExchanges.forEach((exchange) => {
      this.recentActivities.push({
        type: 'exchange',
        user: exchange.requester,
        action: `requested "${exchange.book}"`,
        time: this.getTimeAgo(exchange.date),
        icon: 'swap-horizontal',
        color: '#7b2ff7',
      });
    });

    // Sort by time
    this.recentActivities.sort((a, b) => {
      return this.getTimeValue(b.time) - this.getTimeValue(a.time);
    });
  }

  getTimeAgo(dateString: string): string {
    const now = new Date().getTime();
    const then = new Date(dateString).getTime();
    const diff = now - then;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  getTimeValue(timeString: string): number {
    const match = timeString.match(/(\d+)([mhd])/);
    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2];

    if (unit === 'm') return value;
    if (unit === 'h') return value * 60;
    if (unit === 'd') return value * 60 * 24;
    return 0;
  }

  filterBooks() {
    if (this.selectedLocation === 'All') {
      this.displayedBooks = [...this.allBooks];
    } else {
      this.displayedBooks = this.allBooks.filter(
        (book) => book.location === this.selectedLocation
      );
    }
  }

  onLocationChange() {
    this.filterBooks();
  }

  switchTab(tab: 'overview' | 'users' | 'exchanges' | 'books' | 'analytics') {
    this.activeTab = tab;
  }

  async approveExchange(exchange: Exchange) {
    const result = await Swal.fire({
      title: 'Approve Exchange?',
      html: `
        <div style="text-align: left; padding: 1rem;">
          <p style="margin: 0.5rem 0;"><strong style="color: #00d9ff;">Book:</strong> ${exchange.book}</p>
          <p style="margin: 0.5rem 0;"><strong style="color: #00d9ff;">Requester:</strong> ${exchange.requester}</p>
          <p style="margin: 0.5rem 0;"><strong style="color: #00d9ff;">Owner:</strong> ${exchange.owner}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
      color: '#e8e9ed',
      customClass: {
        container: 'swal2-container-high-z',
        popup: 'modern-swal-popup',
        confirmButton: 'modern-swal-confirm',
        cancelButton: 'modern-swal-cancel',
      },
      backdrop: 'rgba(0, 0, 0, 0.8)',
      heightAuto: false,
    });

    if (result.isConfirmed) {
      exchange.status = 'approved';
      this.saveExchanges();

      await this.Toast.fire({
        icon: 'success',
        title: 'Exchange approved!',
      });
    }
  }

  async rejectExchange(exchange: Exchange) {
    const result = await Swal.fire({
      title: 'Reject Exchange?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
      color: '#e8e9ed',
      customClass: {
        container: 'swal2-container-high-z',
        popup: 'modern-swal-popup',
        confirmButton: 'modern-swal-confirm',
        cancelButton: 'modern-swal-cancel',
      },
      backdrop: 'rgba(0, 0, 0, 0.8)',
      heightAuto: false,
    });

    if (result.isConfirmed) {
      exchange.status = 'rejected';
      this.saveExchanges();

      await this.Toast.fire({
        icon: 'success',
        title: 'Exchange rejected',
      });
    }
  }

  saveExchanges() {
    localStorage.setItem('exchanges', JSON.stringify(this.allExchanges));
    this.loadExchanges();
    this.generateRecentActivities();
  }

  async deleteBook(book: Book) {
    const result = await Swal.fire({
      title: 'Delete Book?',
      text: `Remove "${book.title}" from the platform?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: 'linear-gradient(135deg, #1a1c24 0%, #111216 100%)',
      color: '#e8e9ed',
      customClass: {
        container: 'swal2-container-high-z',
        popup: 'modern-swal-popup',
        confirmButton: 'modern-swal-confirm',
        cancelButton: 'modern-swal-cancel',
      },
      backdrop: 'rgba(0, 0, 0, 0.8)',
      heightAuto: false,
    });

    if (result.isConfirmed) {
      const index = this.allBooks.findIndex((b) => b.id === book.id);
      if (index > -1) {
        this.allBooks.splice(index, 1);
        this.filterBooks();
        this.calculateStatistics();
      }

      await this.Toast.fire({
        icon: 'success',
        title: 'Book deleted',
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'medium';
    }
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
    swiperCss.href =
      'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(swiperCss);

    const swiperScript = document.createElement('script');
    swiperScript.src =
      'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    swiperScript.onload = () => {
      setTimeout(() => this.initSwiper(), 100);
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
