import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SegmentedControlOption {
  value: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-segmented-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segmented-control.component.html',
  styleUrls: ['./segmented-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedControlComponent),
      multi: true,
    },
  ],
})
export class SegmentedControlComponent implements ControlValueAccessor {
  @Input() options: SegmentedControlOption[] = [];
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;
  @Input() color: 'primary' | 'secondary' = 'primary';

  @Output() valueChange = new EventEmitter<string | number>();
  @Output() segmentChange = new EventEmitter<SegmentedControlOption>();

  selectedValue = signal<string | number | null>(null);

  // ControlValueAccessor
  private onChange: (value: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | number | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  selectSegment(option: SegmentedControlOption): void {
    if (this.disabled || option.disabled) return;

    this.selectedValue.set(option.value);
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.segmentChange.emit(option);
    this.onTouched();
  }

  isSelected(option: SegmentedControlOption): boolean {
    return this.selectedValue() === option.value;
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const enabledOptions = this.options.filter((opt) => !opt.disabled);
    const currentIndex = enabledOptions.findIndex((opt) => opt.value === this.selectedValue());

    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = enabledOptions.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        const option = this.options[index];
        if (option && !option.disabled) {
          this.selectSegment(option);
        }
        return;
      default:
        return;
    }

    if (newIndex !== currentIndex && enabledOptions[newIndex]) {
      this.selectSegment(enabledOptions[newIndex]);
    }
  }
}
