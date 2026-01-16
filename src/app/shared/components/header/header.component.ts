import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Header component for application layout
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Input() appTitle = 'Enterprise App';
  @Input() showMenuToggle = true;
  @Input() showNav = true;

  menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }
}
