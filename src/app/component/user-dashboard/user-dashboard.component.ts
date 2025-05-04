// user-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/service/services/user.service';
import { ToastService } from 'src/app/service/services/toast.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  username: string = '';
  welcomeMessage: string = 'Welcome';
  currentUser: any;

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.checkUserLogin();
    this.loadDashboardData();
  }

  checkUserLogin() {
    this.currentUser = UserService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.username = this.currentUser.fullName || this.currentUser.name || 'User';
    this.welcomeMessage = `Welcome, ${this.username}`;
  }

  loadDashboardData() {
   
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      UserService.clearCurrentUser();
      this.toastService.show('Logged out successfully!', 'success');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
      this.router.navigate(['/login']);
    }
  }
}