import { of } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class   AuthGuardService {
  isLogin = false;

  roleAs: any;

  constructor() { }

  login() {
    this.isLogin = true;
    return of({ success: this.isLogin});
  }

  isLoggedIn() {
    return localStorage.getItem('token')
  }

  getRole() {
    return localStorage.getItem('role');
  }

}
