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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}
