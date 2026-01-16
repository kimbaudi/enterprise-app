import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;

  getButtonClasses(): string {
    const classes = [`btn-${this.variant}`];
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }
    return classes.join(' ');
  }

  handleClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
