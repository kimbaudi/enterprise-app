import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info';
  @Input() variant: 'filled' | 'outlined' | 'subtle' = 'subtle';
  @Input() title = '';
  @Input() dismissible = false;
  @Input() icon = '';
  @Input() showIcon = true;

  @Output() dismiss = new EventEmitter<void>();

  get defaultIcon(): string {
    if (this.icon) return this.icon;
    switch (this.type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
