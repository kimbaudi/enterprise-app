import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent, CardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
