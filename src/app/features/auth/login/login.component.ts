import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent, CardComponent],
    template: `
    <div class="login-container">
      <app-card title="Login" class="login-card">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-control"
              [class.error]="isFieldInvalid('email')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              <span *ngIf="loginForm.get('email')?.hasError('required')">Email is required</span>
              <span *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="form-control"
              [class.error]="isFieldInvalid('password')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              <span *ngIf="loginForm.get('password')?.hasError('required')">Password is required</span>
              <span *ngIf="loginForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </span>
            </div>
          </div>

          <div class="form-actions">
            <app-button type="submit" [disabled]="!loginForm.valid" [loading]="loading()">
              Login
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f3f4f6;
      padding: 1rem;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .form-control.error {
      border-color: #ef4444;
    }

    .error-message {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #ef4444;
    }

    .form-actions {
      margin-top: 2rem;
    }

    app-button {
      width: 100%;
    }
  `],
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    loginForm: FormGroup;
    loading = signal(false);

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.loading.set(true);
        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.loading.set(false);
                this.notificationService.showSuccess('Login successful!');
                const redirectUrl = this.authService.redirectUrl || '/dashboard';
                this.router.navigate([redirectUrl]);
            },
            error: (error) => {
                this.loading.set(false);
                this.notificationService.showError('Login failed. Please check your credentials.');
            },
            complete: () => {
                this.loading.set(false);
            }
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }
}
