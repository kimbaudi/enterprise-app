import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormsModule,
} from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' =
        'text';
    @Input() placeholder = '';
    @Input() error = '';
    @Input() hint = '';
    @Input() required = false;
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() icon = '';
    @Input() maxlength?: number;
    @Input() min?: number;
    @Input() max?: number;

    value = signal('');
    focused = signal(false);

    private onChange: (value: string) => void = () => { };
    private onTouched: () => void = () => { };

    writeValue(value: string): void {
        this.value.set(value || '');
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value.set(target.value);
        this.onChange(target.value);
    }

    onBlur(): void {
        this.focused.set(false);
        this.onTouched();
    }

    onFocus(): void {
        this.focused.set(true);
    }
}
