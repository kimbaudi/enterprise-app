import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, delay } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { StorageService } from '@core/services/storage.service';
import { STORAGE_KEYS } from '@core/constants/storage.constants';
import { AuthResponse, LoginCredentials, User } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageService = inject(StorageService);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public redirectUrl: string | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock authentication for development
    if (environment.useMockAuth) {
      // Create a mock JWT token with expiration
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(
        JSON.stringify({
          sub: '1',
          email: credentials.email,
          name: 'Demo User',
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours from now
        }),
      );
      const signature = 'mock-signature';
      const mockToken = `${header}.${payload}.${signature}`;

      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          name: 'Demo User',
          roles: ['user', 'admin'],
        },
        token: mockToken,
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
      return of(mockResponse).pipe(
        delay(500), // Simulate network delay
        tap((response) => {
          this.setSession(response);
        }),
      );
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response);
      }),
    );
  }

  logout(): void {
    this.storageService.remove(STORAGE_KEYS.authToken);
    this.storageService.remove(STORAGE_KEYS.refreshToken);
    this.storageService.remove(STORAGE_KEYS.currentUser);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.storageService.get<string>(STORAGE_KEYS.refreshToken);
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          this.setSession(response);
        }),
      );
  }

  getToken(): string | null {
    return this.storageService.get<string>(STORAGE_KEYS.authToken);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  private setSession(authResponse: AuthResponse): void {
    this.storageService.set(STORAGE_KEYS.authToken, authResponse.token);
    this.storageService.set(STORAGE_KEYS.refreshToken, authResponse.refreshToken);
    this.storageService.set(STORAGE_KEYS.currentUser, authResponse.user);
    this.currentUserSubject.next(authResponse.user);
  }

  private loadUserFromStorage(): void {
    const user = this.storageService.get<User>(STORAGE_KEYS.currentUser);
    if (user && this.isAuthenticated()) {
      this.currentUserSubject.next(user);
    }
  }
}
