import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormsModule,
} from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true,
        },
    ],
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() disabled = false;
    @Input() indeterminate = false;
    @Input() error = '';
    @Input() hint = '';

    checked = signal(false);

    private onChange: (value: boolean) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: boolean): void {
        this.checked.set(value || false);
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

    toggle(): void {
        if (this.disabled) return;
        this.checked.update((val) => !val);
        this.onChange(this.checked());
        this.onTouched();
    }
}
