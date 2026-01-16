import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getIcon(): string {
    return this.themeService.activeTheme() === 'dark' ? '☀️' : '🌙';
  }

  getLabel(): string {
    return this.themeService.activeTheme() === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
}
