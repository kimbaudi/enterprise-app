import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type RatingSize = 'sm' | 'md' | 'lg';
export type RatingColor = 'default' | 'primary' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  @Input() set value(val: number) {
    this.currentValue.set(val);
  }
  @Input() max = 5;
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() allowHalf = false;
  @Input() showCount = false;
  @Input() size: RatingSize = 'md';
  @Input() color: RatingColor = 'default';
  @Input() icon = '★';
  @Input() emptyIcon = '☆';

  @Output() valueChange = new EventEmitter<number>();
  @Output() hover = new EventEmitter<number>();

  currentValue = signal(0);
  hoverValue = signal(0);

  stars = computed(() => Array.from({ length: this.max }, (_, i) => i + 1));

  displayValue = computed(() => {
    return this.hoverValue() || this.currentValue();
  });

  onStarClick(star: number, event: MouseEvent): void {
    if (this.readonly || this.disabled) {
      return;
    }

    let value = star;

    if (this.allowHalf) {
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const isHalf = clickPosition < rect.width / 2;
      value = isHalf ? star - 0.5 : star;
    }

    this.currentValue.set(value);
    this.valueChange.emit(value);
  }

  onStarHover(star: number, event: MouseEvent): void {
    if (this.readonly || this.disabled) {
      return;
    }

    let value = star;

    if (this.allowHalf) {
      const target = event.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      const hoverPosition = event.clientX - rect.left;
      const isHalf = hoverPosition < rect.width / 2;
      value = isHalf ? star - 0.5 : star;
    }

    this.hoverValue.set(value);
    this.hover.emit(value);
  }

  onMouseLeave(): void {
    this.hoverValue.set(0);
  }

  getStarState(star: number): 'full' | 'half' | 'empty' {
    const value = this.displayValue();

    if (star <= value) {
      return 'full';
    }

    if (this.allowHalf && star - 0.5 <= value) {
      return 'half';
    }

    return 'empty';
  }

  get containerClasses(): string {
    const classes = ['rating', `rating-${this.size}`, `rating-${this.color}`];

    if (this.readonly) {
      classes.push('rating-readonly');
    }

    if (this.disabled) {
      classes.push('rating-disabled');
    }

    return classes.join(' ');
  }
}
