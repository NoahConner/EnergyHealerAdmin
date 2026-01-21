import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecureInnerPagesGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = localStorage.getItem('token');
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
