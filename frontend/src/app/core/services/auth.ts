import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { User } from '../models/user';

export interface LoginCredentials {
  firstName: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private router: Router) {
    this.loadAuthState();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    const users = this.getStoredUsers();
    const user = users.find(
      (u) => u.firstName === credentials.firstName && u.password === credentials.password
    );

    if (user) {
      const authState: AuthState = {
        isAuthenticated: true,
        currentUser: user,
        token: this.generateToken(),
      };

      this.authStateSubject.next(authState);
      this.saveAuthState(authState);
      localStorage.setItem('currentUserName', user.firstName);

      return of(true).pipe(delay(500));
    } else {
      return of(false).pipe(delay(500));
    }
  }

  signup(userData: SignupData): Observable<boolean> {
    if (!this.validateSignupData(userData)) {
      return of(false).pipe(delay(500));
    }

    const users = this.getStoredUsers();

    const existingUser = users.find((u) => u.firstName === userData.firstName);
    if (existingUser) {
      return of(false).pipe(delay(500));
    }

    const newUser: User = {
      id: this.generateId(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      createdAt: new Date(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return of(true).pipe(delay(500));
  }

  logout() {
    const authState: AuthState = {
      isAuthenticated: false,
      currentUser: null,
    };

    this.authStateSubject.next(authState);
    localStorage.removeItem('authState');
    localStorage.removeItem('currentUserName');
    this.router.navigate(['/auth']);
  }

  deleteAccount(): Observable<boolean> {
    const currentState = this.authStateSubject.value;
    if (currentState.currentUser) {
      const users = this.getStoredUsers();
      const updatedUsers = users.filter((u) => u.id !== currentState.currentUser!.id);
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      this.logout();
      return of(true).pipe(delay(500));
    } else {
      return of(false).pipe(delay(500));
    }
  }

  private validateSignupData(data: SignupData): boolean {
    if (!data.firstName.trim() || !data.lastName.trim()) return false;
    if (!/^\d+$/.test(data.password)) return false;
    if (data.password !== data.confirmPassword) return false;
    return true;
  }

  private getStoredUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private generateToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadAuthState() {
    const authState = localStorage.getItem('authState');
    if (authState) {
      const state = JSON.parse(authState);
      this.authStateSubject.next(state);
    }
  }

  private saveAuthState(state: AuthState) {
    localStorage.setItem('authState', JSON.stringify(state));
  }
}
