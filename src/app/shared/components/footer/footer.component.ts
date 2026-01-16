import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Footer component for application layout
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  @Input() copyright = `© ${new Date().getFullYear()} Enterprise App. All rights reserved.`;
}
