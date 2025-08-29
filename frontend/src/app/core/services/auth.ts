import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  type: 'user' | 'seller';
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your backend URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userData && token) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(email: string, password: string, type: 'user' | 'seller' = 'user'): Observable<AuthResponse> {
    const endpoint = type === 'seller' ? '/auth/seller-login' : '/auth/login';
    
    return this.http.post<AuthResponse>(`${this.apiUrl}${endpoint}`, { email, password })
      .pipe(
        map(response => {
          if (response.success && response.user && response.token) {
            // Store user data and token
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
          }
          return response;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  register(userData: any, type: 'user' | 'seller' = 'user'): Observable<AuthResponse> {
    const endpoint = type === 'seller' ? '/auth/seller-register' : '/auth/register';
    
    return this.http.post<AuthResponse>(`${this.apiUrl}${endpoint}`, userData)
      .pipe(
        map(response => {
          if (response.success && response.user && response.token) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            this.currentUserSubject.next(response.user);
          }
          return response;
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error(error.error?.message || 'Registration failed'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
