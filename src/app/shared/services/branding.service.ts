// src/app/shared/services/branding.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private logoSubject = new BehaviorSubject<string>(this.getStoredLogo());
  private faviconSubject = new BehaviorSubject<string>(this.getStoredFavicon());

  logo$ = this.logoSubject.asObservable();
  favicon$ = this.faviconSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.setupBroadcastListener();
      this.setupStorageListener();
    }
  }

  updateLogo(logoUrl: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('appLogo', logoUrl);
      this.logoSubject.next(logoUrl);
      this.broadcastChange('logo', logoUrl);
    }
  }

  updateFavicon(faviconUrl: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('appFavicon', faviconUrl);
      this.faviconSubject.next(faviconUrl);
      this.broadcastChange('favicon', faviconUrl);
    }
  }

  getLogo(): string {
    return this.getStoredLogo();
  }

  getFavicon(): string {
    return this.getStoredFavicon();
  }

  private getStoredLogo(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('appLogo') || 'assets/images/logo.png';
    }
    return 'assets/images/logo.png';
  }

  private getStoredFavicon(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('appFavicon') || 'assets/images/favicon.ico';
    }
    return 'assets/images/favicon.ico';
  }

  private setupBroadcastListener() {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('app_branding');
      channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === 'logo') {
          this.logoSubject.next(data);
        } else if (type === 'favicon') {
          this.faviconSubject.next(data);
        }
      };
    }
  }

  private setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'appLogo' && event.newValue) {
        this.logoSubject.next(event.newValue);
      } else if (event.key === 'appFavicon' && event.newValue) {
        this.faviconSubject.next(event.newValue);
      }
    });
  }

  private broadcastChange(type: 'logo' | 'favicon', data: string) {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('app_branding');
      channel.postMessage({ type, data });
    }
  }
}