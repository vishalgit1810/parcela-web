// admin-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  welcomeMessage: string = 'Admin Dashboard';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAdminLogin();
  }

  checkAdminLogin(): void {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdminLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { type: 'admin' } });
    } else {
      this.welcomeMessage = 'Welcome, Admin';
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAdminLoggedIn');
      this.router.navigate(['/login']);
    }
  }
}