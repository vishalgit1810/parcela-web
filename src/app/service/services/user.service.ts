import { Injectable } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static currentUser: Customer | null = null;

  static setCurrentUser(customer: Customer): void {
    this.currentUser = customer;
    localStorage.setItem('currentUser', JSON.stringify(customer));
  }

  static getCurrentUser(): Customer | null {
    if (!this.currentUser) {
      const user = localStorage.getItem('currentUser');
      this.currentUser = user ? JSON.parse(user) : null;
    }
    return this.currentUser;
  }

  static clearCurrentUser(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  static isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.email === 'admin@abc.com' : false;
  }
}