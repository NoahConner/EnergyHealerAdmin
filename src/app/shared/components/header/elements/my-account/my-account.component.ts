import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  role: string | null;
  displayRole: string | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    this.role = localStorage.getItem('role');

    // Determine displayRole based on the fetched role
    this.displayRole = 'Admin';
  }

  logoutUser() {
    localStorage.clear();
    this.router.navigateByUrl('auth/login');
  }
}
