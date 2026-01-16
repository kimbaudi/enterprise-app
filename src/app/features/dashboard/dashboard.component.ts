import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <app-button variant="secondary" (click)="logout()">Logout</app-button>
      </div>

      <div class="dashboard-content">
        <div class="stats-grid">
          <app-card title="Total Users" [hoverable]="true">
            <div class="stat-value">1,234</div>
            <div class="stat-label">Active Users</div>
          </app-card>

          <app-card title="Revenue" [hoverable]="true">
            <div class="stat-value">$45,231</div>
            <div class="stat-label">This Month</div>
          </app-card>

          <app-card title="Orders" [hoverable]="true">
            <div class="stat-value">892</div>
            <div class="stat-label">Pending Orders</div>
          </app-card>

          <app-card title="Performance" [hoverable]="true">
            <div class="stat-value">98.5%</div>
            <div class="stat-label">Uptime</div>
          </app-card>
        </div>

        <div class="welcome-section">
          <app-card title="Welcome to Enterprise App">
            <p>This is an enterprise-ready Angular application with best practices.</p>
            <ul>
              <li>Modular architecture with feature modules</li>
              <li>State management with NgRx</li>
              <li>Authentication and authorization</li>
              <li>Comprehensive testing setup</li>
              <li>CI/CD pipeline ready</li>
            </ul>
          </app-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #111827;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .welcome-section {
      margin-top: 2rem;
    }

    ul {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 0.5rem;
      color: #4b5563;
    }
  `],
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}
