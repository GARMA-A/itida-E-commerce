import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs/operators';
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

export interface ApiResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:5000/api/auth';
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.loadAuthState();
  }

  private loadAuthState() {
    const authState = localStorage.getItem('authState');
    if (authState) {
      try {
        const state = JSON.parse(authState);

        if (state.token) {
          this.verifyToken(state.token).subscribe((isValid) => {
            if (!isValid) {
              this.clearAuthState();
            }
          });
        } else {
          this.clearAuthState();
        }
      } catch (error) {
        this.clearAuthState();
        console.error('Error parsing auth state from localStorage:', error);
      }
    }
  }

  private clearAuthState() {
    localStorage.removeItem('authState');
    localStorage.removeItem('currentUserName');
    this.authStateSubject.next({
      isAuthenticated: false,
      currentUser: null,
    });
  }

  private saveAuthState(state: AuthState) {
    localStorage.setItem('authState', JSON.stringify(state));
    if (state.currentUser) {
      localStorage.setItem('currentUserName', state.currentUser.firstName);
    }
  }

  private verifyToken(token: string): Observable<boolean> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/verify`, { token }).pipe(
      map((response) => response.success),
      catchError(() => of(false))
    );
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          const authState: AuthState = {
            isAuthenticated: true,
            currentUser: {
              id: response.user.id,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              password: '',
              createdAt: new Date(response.user.createdAt || Date.now()),
            },
            token: response.token,
          };

          this.authStateSubject.next(authState);
          this.saveAuthState(authState);
        }
      }),
      map((response) => response.success),
      catchError((error) => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  signup(userData: SignupData): Observable<boolean> {
    const { confirmPassword, ...signupData } = userData;

    return this.http.post<ApiResponse>(`${this.apiUrl}/signup`, signupData).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          const authState: AuthState = {
            isAuthenticated: true,
            currentUser: {
              id: response.user.id,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              password: '',
              createdAt: new Date(response.user.createdAt || Date.now()),
            },
            token: response.token,
          };

          this.authStateSubject.next(authState);
          this.saveAuthState(authState);
        }
      }),
      map((response) => response.success),
      catchError((error) => {
        console.error('Signup error:', error);
        return of(false);
      })
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      error: (error) => console.error('Logout API error:', error),
    });

    this.clearAuthState();
    this.router.navigate(['/auth']);
  }

  deleteAccount(): Observable<boolean> {
    const currentState = this.authStateSubject.value;
    if (!currentState.currentUser || !currentState.token) {
      return of(false);
    }

    return this.http
      .delete<ApiResponse>(`${this.apiUrl}/users/${currentState.currentUser.id}`, {
        headers: { Authorization: `Bearer ${currentState.token}` },
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.clearAuthState();
          }
        }),
        map((response) => response.success),
        catchError((error) => {
          console.error('Delete account error:', error);
          return of(false);
        })
      );
  }

  getCurrentAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  getToken(): string | null {
    const state = this.authStateSubject.value;
    return state.token || null;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }
}
