import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenKey = 'auth_token';

  constructor() {
    // Check if user is logged in on service initialization
    this.loadUserFromStorage();
  }

  /**
   * User login
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token && response.user) {
            this.setAuthData(response.token, response.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * User registration
   */
  register(userData: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/users`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * User logout
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Update user profile
   */
  updateProfile(userId: string, userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/users/${userId}`, userData)
      .pipe(
        tap(response => {
          if (response.data) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem('current_user', JSON.stringify(response.data));
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Reset password
   */
  resetPassword(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/users/reset-password`, { email })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Private helper methods
   */
  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem('current_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr && !this.isTokenExpired(token)) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private handleError = (error: any): Observable<never> => {
    console.error('Auth Service Error:', error);
    return throwError(() => ({
      message: error.error?.message || 'An error occurred during authentication',
      status: error.status || 500,
      error: error.error
    }));
  };
}
