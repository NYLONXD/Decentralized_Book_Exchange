// src/app/services/location.service.ts

import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';

export interface LocationResult {
  success: boolean;
  city?: string;
  state?: string;
  fullAddress?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  // Indian states and their major cities
  private readonly INDIAN_LOCATIONS = [
    'Delhi',
    'Punjab',
    'Mumbai',
    'Bangalore',
    'Kolkata',
    'Chennai',
    'Hyderabad',
    'Ahmedabad',
    'Pune',
    'Jaipur',
  ];

  constructor(private platform: Platform) {}

  /**
   * Check if geolocation permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const permission = await Geolocation.checkPermissions();
      return permission.location === 'granted';
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  /**
   * Request geolocation permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Get current location with city/state detection
   */
  async getCurrentLocation(): Promise<LocationResult> {
    try {
      // Check if we're on a native platform
      const isNative = this.platform.is('capacitor');

      if (!isNative) {
        // Browser fallback - use browser geolocation
        return await this.getBrowserLocation();
      }

      // Request permissions first
      const hasPermission = await this.checkPermissions();

      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          return {
            success: false,
            error: 'Location permission denied',
          };
        }
      }

      // Get coordinates
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get city/state
      const locationInfo = await this.reverseGeocode(latitude, longitude);

      return {
        success: true,
        city: locationInfo.city,
        state: locationInfo.state,
        fullAddress: locationInfo.fullAddress,
        coordinates: { latitude, longitude },
      };
    } catch (error: any) {
      console.error('Error getting location:', error);
      return {
        success: false,
        error: error.message || 'Failed to get location',
      };
    }
  }

  /**
   * Browser-based geolocation fallback
   */
  private getBrowserLocation(): Promise<LocationResult> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          success: false,
          error: 'Geolocation not supported in this browser',
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationInfo = await this.reverseGeocode(latitude, longitude);

          resolve({
            success: true,
            city: locationInfo.city,
            state: locationInfo.state,
            fullAddress: locationInfo.fullAddress,
            coordinates: { latitude, longitude },
          });
        },
        (error) => {
          resolve({
            success: false,
            error: error.message,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  /**
   * Reverse geocode coordinates to address
   * Uses OpenStreetMap Nominatim API (free, no API key needed)
   */
  private async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<{
    city: string;
    state: string;
    fullAddress: string;
  }> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'BookExchangeApp/1.0',
          },
        }
      );

      const data = await response.json();
      const address = data.address || {};

      // Extract city and state
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.county ||
        'Unknown';
      const state = address.state || 'Unknown';
      const country = address.country || 'Unknown';

      // Map to our known locations
      const matchedLocation = this.matchToKnownLocation(city, state);

      return {
        city: matchedLocation || city,
        state: state,
        fullAddress: `${city}, ${state}, ${country}`,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return {
        city: 'Unknown',
        state: 'Unknown',
        fullAddress: 'Unable to determine location',
      };
    }
  }

  /**
   * Match detected location to our predefined locations
   */
  private matchToKnownLocation(city: string, state: string): string | null {
    const searchText = `${city} ${state}`.toLowerCase();

    // Check for exact matches first
    for (const location of this.INDIAN_LOCATIONS) {
      if (searchText.includes(location.toLowerCase())) {
        return location;
      }
    }

    // Check for state-based matches
    const stateMap: { [key: string]: string } = {
      delhi: 'Delhi',
      punjab: 'Punjab',
      maharashtra: 'Mumbai',
      karnataka: 'Bangalore',
      'west bengal': 'Kolkata',
      'tamil nadu': 'Chennai',
      telangana: 'Hyderabad',
      gujarat: 'Ahmedabad',
      rajasthan: 'Jaipur',
    };

    const stateLower = state.toLowerCase();
    for (const [key, value] of Object.entries(stateMap)) {
      if (stateLower.includes(key)) {
        return value;
      }
    }

    return null;
  }

  /**
   * Get available locations for dropdown
   */
  getAvailableLocations(): string[] {
    return [...this.INDIAN_LOCATIONS].sort();
  }

  /**
   * Validate if location is in our supported list
   */
  isValidLocation(location: string): boolean {
    return this.INDIAN_LOCATIONS.some(
      (loc) => loc.toLowerCase() === location.toLowerCase()
    );
  }
}
