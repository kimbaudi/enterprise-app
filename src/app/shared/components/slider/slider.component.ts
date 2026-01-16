import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SliderMark {
  value: number;
  label?: string;
}

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() disabled = false;
  @Input() vertical = false;
  @Input() showTooltip = true;
  @Input() tooltipFormat?: (value: number) => string;
  @Input() range = false;
  @Input() marks: SliderMark[] = [];
  @Input() color: 'primary' | 'success' | 'warning' | 'error' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showValue = false;

  @Output() valueChange = new EventEmitter<number | [number, number]>();
  @Output() slideStart = new EventEmitter<void>();
  @Output() slideEnd = new EventEmitter<void>();

  // Make Array available in template
  Array = Array;

  // Internal state
  value = signal<number | [number, number]>(0);
  isDragging = signal(false);
  activeHandle = signal<'start' | 'end' | null>(null);
  tooltipVisible = signal<{ start: boolean; end: boolean }>({ start: false, end: false });

  // Computed values
  startValue = computed(() => {
    const val = this.value();
    return this.range && Array.isArray(val) ? val[0] : typeof val === 'number' ? val : 0;
  });

  endValue = computed(() => {
    const val = this.value();
    return this.range && Array.isArray(val) ? val[1] : typeof val === 'number' ? val : 0;
  });

  startPosition = computed(() => {
    return this.calculatePosition(this.startValue());
  });

  endPosition = computed(() => {
    return this.calculatePosition(this.endValue());
  });

  fillWidth = computed(() => {
    if (this.range) {
      return this.endPosition() - this.startPosition();
    }
    return this.startPosition();
  });

  fillLeft = computed(() => {
    if (this.range) {
      return this.startPosition();
    }
    return 0;
  });

  // ControlValueAccessor
  private onChange: (value: number | [number, number]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | [number, number]): void {
    if (value !== null && value !== undefined) {
      this.value.set(value);
    } else {
      this.value.set(this.range ? [this.min, this.max] : this.min);
    }
  }

  registerOnChange(fn: (value: number | [number, number]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Calculate position as percentage
  private calculatePosition(value: number): number {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  // Calculate value from position
  private calculateValue(position: number): number {
    const value = (position / 100) * (this.max - this.min) + this.min;
    const steppedValue = Math.round(value / this.step) * this.step;
    return Math.max(this.min, Math.min(this.max, steppedValue));
  }

  // Handle track click
  onTrackClick(event: MouseEvent): void {
    if (this.disabled) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const position = this.vertical
      ? ((rect.bottom - event.clientY) / rect.height) * 100
      : ((event.clientX - rect.left) / rect.width) * 100;

    const newValue = this.calculateValue(position);

    if (this.range) {
      const currentValue = this.value() as [number, number];
      const startDiff = Math.abs(newValue - currentValue[0]);
      const endDiff = Math.abs(newValue - currentValue[1]);

      if (startDiff < endDiff) {
        this.updateValue([newValue, currentValue[1]]);
      } else {
        this.updateValue([currentValue[0], newValue]);
      }
    } else {
      this.updateValue(newValue);
    }

    this.onTouched();
  }

  // Handle drag start
  onHandleMouseDown(event: MouseEvent, handle: 'start' | 'end'): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(true);
    this.activeHandle.set(handle);
    this.showTooltipFor(handle);
    this.slideStart.emit();

    const onMouseMove = (e: MouseEvent) => this.onMouseMove(e);
    const onMouseUp = () => {
      this.isDragging.set(false);
      this.activeHandle.set(null);
      this.hideAllTooltips();
      this.slideEnd.emit();
      this.onTouched();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  // Handle drag move
  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging() || this.disabled) return;

    const track = document.querySelector('.slider-track') as HTMLElement;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const position = this.vertical
      ? ((rect.bottom - event.clientY) / rect.height) * 100
      : ((event.clientX - rect.left) / rect.width) * 100;

    const newValue = this.calculateValue(Math.max(0, Math.min(100, position)));
    const handle = this.activeHandle();

    if (this.range && Array.isArray(this.value())) {
      const currentValue = this.value() as [number, number];
      if (handle === 'start') {
        this.updateValue([Math.min(newValue, currentValue[1]), currentValue[1]]);
      } else {
        this.updateValue([currentValue[0], Math.max(newValue, currentValue[0])]);
      }
    } else {
      this.updateValue(newValue);
    }
  }

  // Update value
  private updateValue(newValue: number | [number, number]): void {
    this.value.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
  }

  // Tooltip helpers
  private showTooltipFor(handle: 'start' | 'end'): void {
    if (this.showTooltip) {
      const current = this.tooltipVisible();
      if (handle === 'start') {
        this.tooltipVisible.set({ ...current, start: true });
      } else {
        this.tooltipVisible.set({ ...current, end: true });
      }
    }
  }

  private hideAllTooltips(): void {
    if (this.showTooltip) {
      this.tooltipVisible.set({ start: false, end: false });
    }
  }

  // Show tooltip on hover
  onHandleMouseEnter(handle: 'start' | 'end'): void {
    if (!this.disabled && this.showTooltip && !this.isDragging()) {
      this.showTooltipFor(handle);
    }
  }

  onHandleMouseLeave(handle: 'start' | 'end'): void {
    if (!this.isDragging()) {
      const current = this.tooltipVisible();
      if (handle === 'start') {
        this.tooltipVisible.set({ ...current, start: false });
      } else {
        this.tooltipVisible.set({ ...current, end: false });
      }
    }
  }

  // Format tooltip value
  formatTooltip(value: number): string {
    if (this.tooltipFormat) {
      return this.tooltipFormat(value);
    }
    return value.toString();
  }

  // Get mark position
  getMarkPosition(mark: SliderMark): number {
    return this.calculatePosition(mark.value);
  }

  // Check if mark is in range
  isMarkInRange(mark: SliderMark): boolean {
    if (!this.range) {
      return mark.value <= this.startValue();
    }
    return mark.value >= this.startValue() && mark.value <= this.endValue();
  }

  // Keyboard support
  onKeyDown(event: KeyboardEvent, handle: 'start' | 'end'): void {
    if (this.disabled) return;

    let increment = 0;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        increment = -this.step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        increment = this.step;
        break;
      case 'Home':
        event.preventDefault();
        this.updateHandleValue(handle, this.min);
        return;
      case 'End':
        event.preventDefault();
        this.updateHandleValue(handle, this.max);
        return;
      case 'PageDown':
        event.preventDefault();
        increment = -this.step * 10;
        break;
      case 'PageUp':
        event.preventDefault();
        increment = this.step * 10;
        break;
      default:
        return;
    }

    const currentValue = handle === 'start' ? this.startValue() : this.endValue();
    const newValue = Math.max(this.min, Math.min(this.max, currentValue + increment));
    this.updateHandleValue(handle, newValue);
    this.onTouched();
  }

  private updateHandleValue(handle: 'start' | 'end', newValue: number): void {
    if (this.range && Array.isArray(this.value())) {
      const currentValue = this.value() as [number, number];
      if (handle === 'start') {
        this.updateValue([Math.min(newValue, currentValue[1]), currentValue[1]]);
      } else {
        this.updateValue([currentValue[0], Math.max(newValue, currentValue[0])]);
      }
    } else {
      this.updateValue(newValue);
    }
  }
}
