import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css',
})
export class ProgressComponent {
  @Input() value = 0;
  @Input() max = 100;
  @Input() variant: 'solid' | 'striped' | 'gradient' = 'solid';
  @Input() color: 'primary' | 'success' | 'error' | 'warning' | 'info' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showLabel = false;
  @Input() showPercentage = false;
  @Input() indeterminate = false;
  @Input() animated = false;
  @Input() label = '';

  get percentage(): number {
    if (this.max === 0) return 0;
    return Math.min(Math.max((this.value / this.max) * 100, 0), 100);
  }

  get progressLabel(): string {
    if (this.label) return this.label;
    if (this.showPercentage) return `${Math.round(this.percentage)}%`;
    return '';
  }
}
