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
      userId: ['', [Validators.required, Validators.pattern(/^[1-9]\d{3,}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,30}$/)]],
    });
  }

  get userIdControl() { return this.loginForm.get('userId')!; }
  get passwordControl() { return this.loginForm.get('password')!; }

  selectLoginType(type: 'user' | 'admin'): void {
    this.loginType = type;
    this.loginForm.reset();
    this.loginError = '';
    
    // Update validators based on login type
    if (type === 'admin') {
      this.loginForm.get('userId')?.setValidators([Validators.required, Validators.pattern(/^admin@abc\.com$/)]);
    } else {
      this.loginForm.get('userId')?.setValidators([Validators.required, Validators.pattern(/^[1-9]\d{3,}$/)]);
    }
    this.loginForm.get('userId')?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    
    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.value;
    const loginRequest = {
      customerId: this.loginType === 'user' ? parseInt(formValue.userId) : 0,
      email: this.loginType === 'admin' ? formValue.userId : '',
      password: formValue.password
    };

    if (this.loginType === 'admin') {
      this.handleAdminLogin(loginRequest);
    } else {
      this.handleUserLogin(loginRequest);
    }
  }

  private handleAdminLogin(loginRequest: any): void {
    if (loginRequest.email === 'admin@abc.com' && loginRequest.password === 'Admin@123') {
      this.showSuccessPopup = true;
      this.successMessage = 'Admin login successful!';
      setTimeout(() => {
        this.router.navigate(['/admin-dashboard']);
      }, 1500);
    } else {
      this.loginError = 'Invalid Admin ID or password';
    }
  }

  private handleUserLogin(loginRequest: any): void {
    this.http.post<any>('http://localhost:8090/api/auth/login', loginRequest)
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