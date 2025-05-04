import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/service/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  loginType: 'user' | 'admin' = 'user';
  showSuccessPopup = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get userIdControl() { return this.loginForm.get('userId')!; }
  get passwordControl() { return this.loginForm.get('password')!; }

  selectLoginType(type: 'user' | 'admin'): void {
    this.loginType = type;
    this.loginForm.reset();
    this.loginError = '';
    
    const userIdControl = this.loginForm.get('userId');
    if (type === 'admin') {
      userIdControl?.setValidators([Validators.required, Validators.pattern(/^admin@abc\.com$/)]);
    } else {
      userIdControl?.setValidators([Validators.required, Validators.pattern(/^[1-9]\d{3,}$/)]);
    }
    userIdControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    
    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.value;

    if (this.loginType === 'admin') {
      this.handleAdminLogin(formValue.userId, formValue.password);
    } else {
      this.handleUserLogin(parseInt(formValue.userId), formValue.password);
    }
  }

  private handleAdminLogin(email: string, password: string): void {
    if (email === 'admin@abc.com' && password === 'Admin@123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      this.showSuccessPopup = true;
      this.successMessage = 'Admin login successful!';
      setTimeout(() => {
        this.router.navigate(['/admin-dashboard']);
      }, 1500);
    } else {
      this.loginError = 'Invalid Admin credentials';
    }
  }

  private handleUserLogin(customerId: number, password: string): void {
    this.http.post<any>('http://localhost:8090/api/auth/login', { customerId, password })
      .subscribe({
        next: (customer) => {
          UserService.setCurrentUser(customer);
          this.showSuccessPopup = true;
          this.successMessage = `Welcome back, ${customer.name}!`;
          setTimeout(() => {
            this.router.navigate(['/user-dashboard']);
          }, 1500);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.loginError = err.error?.message || 'Invalid Customer ID or password';
        }
      });
  }
}