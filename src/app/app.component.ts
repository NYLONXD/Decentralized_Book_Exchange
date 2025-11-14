// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.initializeApp();
  }

  async initializeApp() {
    // Wait for platform to be ready
    await this.platform.ready();

    // Only run on native platforms (not browser)
    if (this.platform.is('capacitor')) {
      this.setupStatusBar();
      this.setupKeyboard();
      this.setupBackButton();
    }
  }

  // Configure Status Bar
  async setupStatusBar() {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0a0e27' });
    } catch (error) {
      console.log('StatusBar not available:', error);
    }
  }

  // Configure Keyboard
  setupKeyboard() {
    try {
      Keyboard.setAccessoryBarVisible({ isVisible: true });
    } catch (error) {
      console.log('Keyboard not available:', error);
    }
  }

  // Handle Android back button
  setupBackButton() {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        // On root page, show exit confirmation
        this.showExitConfirmation();
      } else {
        // Navigate back
        window.history.back();
      }
    });
  }

  async showExitConfirmation() {
    const shouldExit = confirm('Do you want to exit the app?');
    if (shouldExit) {
      CapacitorApp.exitApp();
    }
  }
}
