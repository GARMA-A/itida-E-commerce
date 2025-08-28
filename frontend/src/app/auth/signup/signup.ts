import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  signupForm: FormGroup;
  isSubmitting = false;
  showError = false;
  showSuccess = false;
  errorMessages: string[] = [];

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.showError = false;
      this.errorMessages = [];

      if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
        this.errorMessages.push('Passwords must match');
        this.showError = true;
        this.isSubmitting = false;
        return;
      }

      this.auth.signup(this.signupForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.showSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          } else {
            this.errorMessages = [
              'First and second name required',
              'Password must consist of only numbers',
              'User already exists',
            ];
            this.showError = true;
          }
          this.isSubmitting = false;
        },
        error: () => {
          this.errorMessages = ['Signup failed'];
          this.showError = true;
          this.isSubmitting = false;
        },
      });
    }
  }

  closeError() {
    this.showError = false;
  }

  closeSuccess() {
    this.showSuccess = false;
    this.router.navigate(['/auth/login']);
  }
}
