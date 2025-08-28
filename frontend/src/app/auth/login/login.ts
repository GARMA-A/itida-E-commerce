import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;
  isSubmitting = false;
  showError = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      firstName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.showError = false;

      this.auth.login(this.loginForm.value).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/']);
          } else {
            this.showError = true;
            this.errorMessage = 'Invalid credentials';
          }
          this.isSubmitting = false;
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Login failed';
          this.isSubmitting = false;
        },
      });
    }
  }

  closeError() {
    this.showError = false;
  }
}
