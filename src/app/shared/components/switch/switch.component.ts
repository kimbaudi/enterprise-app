import { Component, Input, Output, EventEmitter, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() labelPosition: 'left' | 'right' = 'right';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'primary' | 'success' | 'warning' | 'error' = 'primary';
  @Input() checkedIcon?: string;
  @Input() uncheckedIcon?: string;
  @Input() checkedText?: string;
  @Input() uncheckedText?: string;
  @Input() showText = false;

  @Output() valueChange = new EventEmitter<boolean>();
  @Output() toggle = new EventEmitter<boolean>();

  checked = signal(false);
  focused = signal(false);

  // ControlValueAccessor
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onToggle(): void {
    if (this.disabled || this.loading) return;

    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.valueChange.emit(newValue);
    this.toggle.emit(newValue);
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onToggle();
    }
  }

  get displayText(): string {
    if (!this.showText) return '';
    return this.checked() ? this.checkedText || 'ON' : this.uncheckedText || 'OFF';
  }

  get displayIcon(): string {
    if (this.checked() && this.checkedIcon) return this.checkedIcon;
    if (!this.checked() && this.uncheckedIcon) return this.uncheckedIcon;
    return '';
  }
}
