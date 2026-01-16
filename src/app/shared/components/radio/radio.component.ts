import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  hint?: string;
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true,
    },
  ],
})
export class RadioComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: RadioOption[] = [];
  @Input() disabled = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() inline = false;

  value = signal<string | number | null>(null);

  private onChange: (value: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | number | null): void {
    this.value.set(value);
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

  selectOption(option: RadioOption): void {
    if (this.disabled || option.disabled) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
  }

  isSelected(option: RadioOption): boolean {
    return this.value() === option.value;
  }
}
