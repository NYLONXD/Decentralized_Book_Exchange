import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DashboardPage implements AfterViewInit, OnDestroy {
  userProfileUrl = 'assets/Admin.jpg';
  private swiperInstance: any;
  
  books = [
    {
      title: 'Everyone Has a Story',
      author: 'Savi Sharma',
      price: '$10',
      image: 'assets/book1.jpg',
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      price: '$10',
      image: 'assets/book2.jpg',
    },
    {
      title: 'The Subtle Art of Not Giving a F*ck',
      author: 'Mark Manson',
      price: '$5',
      image: 'assets/book3.jpg',
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      price: '$15',
      image: 'assets/book4.png',
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      price: '$20',
      image: 'assets/book5.png',
    },
    {
      title: 'The Perfect Murder',
      author: 'Ruskin Bond',
      price: '$6',
      image: 'assets/book6.jpg',
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: 'J.K. Rowling',
      price: '$25',
      image: 'assets/harry_potter.jpg',
    },
    {
      title: 'You Can Do It',
      author: 'Dr. A.P.J. Abdul Kalam',
      price: '$15',
      image: 'assets/youcandoit.jpg',
    },
    {
      title: 'Dark Psychology',
      author: 'Dr. Shefali',
      price: '$22',
      image: 'assets/darkpsychology.jpg',
    },
  ];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.loadSwiperScript();
  }

  loadSwiperScript() {
    // Check if Swiper is already loaded
    if ((window as any).Swiper) {
      this.initSwiper();
      return;
    }

    // Load Swiper CSS
    const swiperCss = document.createElement('link');
    swiperCss.rel = 'stylesheet';
    swiperCss.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
    document.head.appendChild(swiperCss);

    // Load Swiper JS
    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
    swiperScript.onload = () => {
      // Wait a bit for Angular to render the slides
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
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        480: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 15,
        },
        1440: {
          slidesPerView: 5,
          spaceBetween: 15,
        },
      },
    });
  }

  ngOnDestroy() {
    // Destroy swiper instance to prevent memory leaks
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }

  logout() {
    this.router.navigate(['/get-started']);
  }
}