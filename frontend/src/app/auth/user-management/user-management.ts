import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth, AuthState } from '../../core/services/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
})
export class UserManagement implements OnInit {
  authState$!: Observable<AuthState>;
  showDeleteConfirmation = false;

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.authState$ = this.auth.authState$;
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToSignup() {
    this.router.navigate(['/auth/signup']);
  }

  logout() {
    this.auth.logout();
  }

  confirmDeleteAccount() {
    this.showDeleteConfirmation = true;
  }

  deleteAccount() {
    this.auth.deleteAccount().subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }
}
