import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  successPopup = false;
  errorPopup = false;
  errorMessage = '';
  registeredUserName: string = '';
  registeredId: string = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,30}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(50)]],
      countryCode: ['+91'],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/), Validators.minLength(8), Validators.maxLength(30)]],
      confirmPassword: ['', Validators.required],
      notification: ['email']
    }, { validators: this.matchPasswords });
  }

  get fullName() { return this.registrationForm.get('fullName')!; }
  get email() { return this.registrationForm.get('email')!; }
  get phoneNumber() { return this.registrationForm.get('phoneNumber')!; }
  get address() { return this.registrationForm.get('address')!; }
  get password() { return this.registrationForm.get('password')!; }
  get confirmPassword() { return this.registrationForm.get('confirmPassword')!; }

  matchPasswords(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value ? null : { mismatch: true };
  }

  restrictInput(event: KeyboardEvent, type: 'text' | 'number') {
    const input = event.target as HTMLInputElement;
    const char = String.fromCharCode(event.keyCode);
    if (type === 'text' && !/^[a-zA-Z\s]*$/.test(char)) {
      event.preventDefault();
    } else if (type === 'number' && (!/^\d$/.test(char) || input.value.length >= 10)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.invalid) {
      return;
    }

    const formData = this.registrationForm.value;
    const requestBody = {
      name: formData.fullName,
      email: formData.email,
      mobileNumber: formData.countryCode + formData.phoneNumber,
      address: formData.address,
      password: formData.password
    };

    this.http.post<any>('http://localhost:8090/api/auth/register', requestBody)
      .subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          this.successPopup = true;
          this.registeredUserName = formData.fullName;
          this.registeredId = response.custId.toString();
        },
        error: (error) => {
          console.error('Error registering user', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please check your details and try again.';
          this.errorPopup = true;
          setTimeout(() => this.errorPopup = false, 5000);
        }
      });
  }

  closeErrorPopup() {
    this.errorPopup = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onReset() {
    this.registrationForm.reset({ countryCode: '+91', notification: 'email' });
  }
}