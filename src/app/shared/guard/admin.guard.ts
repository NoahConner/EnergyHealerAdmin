import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAdmin = true; // Replace this with your admin check logic.
    const tokenExists = localStorage.getItem('token') !== null;

    if (tokenExists) {
      // If the user has a token, it means they are authenticated.
      // Redirect them to the dashboard instead of the login page.
      this.router.navigate(['/users']);
      return false;
    }

    if (isAdmin) {
      return true;
    } else {
      this.router.navigate(['/users']);
      return false;
    }
  }
}
