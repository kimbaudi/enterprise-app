import {
    Component,
    Input,
    forwardRef,
    signal,
    computed,
    HostListener,
    ElementRef,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    FormsModule,
} from '@angular/forms';

export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
})
export class SelectComponent implements ControlValueAccessor {
    private elementRef = inject(ElementRef);

    @Input() label = '';
    @Input() placeholder = 'Select an option';
    @Input() options: SelectOption[] = [];
    @Input() error = '';
    @Input() hint = '';
    @Input() required = false;
    @Input() disabled = false;
    @Input() searchable = false;
    @Input() multiple = false;

    value = signal<string | number | (string | number)[] | null>(null);
    isOpen = signal(false);
    searchQuery = signal('');
    focused = signal(false);

    private onChange: (value: string | number | (string | number)[] | null) => void = () => { };
    private onTouched: () => void = () => { };

    filteredOptions = computed(() => {
        const query = this.searchQuery().toLowerCase();
        if (!query) return this.options;
        return this.options.filter((opt) =>
            opt.label.toLowerCase().includes(query)
        );
    });

    selectedLabel = computed(() => {
        const val = this.value();
        if (val === null) return '';

        if (this.multiple && Array.isArray(val)) {
            if (val.length === 0) return '';
            const labels = val
                .map((v) => this.options.find((opt) => opt.value === v)?.label)
                .filter(Boolean);
            return labels.join(', ');
        }

        const option = this.options.find((opt) => opt.value === val);
        return option?.label || '';
    });

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    writeValue(value: string | number | (string | number)[] | null): void {
        this.value.set(value);
    }

    registerOnChange(fn: (value: string | number | (string | number)[] | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    toggleDropdown(): void {
        if (this.disabled) return;
        this.isOpen.update((open) => !open);
        if (this.isOpen()) {
            this.focused.set(true);
        } else {
            this.onTouched();
        }
    }

    selectOption(option: SelectOption): void {
        if (option.disabled) return;

        if (this.multiple) {
            const currentValue = Array.isArray(this.value()) ? this.value() as (string | number)[] : [];
            const index = currentValue.indexOf(option.value);

            if (index > -1) {
                const newValue = currentValue.filter((v) => v !== option.value);
                this.value.set(newValue);
                this.onChange(newValue);
            } else {
                const newValue = [...currentValue, option.value];
                this.value.set(newValue);
                this.onChange(newValue);
            }
        } else {
            this.value.set(option.value);
            this.onChange(option.value);
            this.isOpen.set(false);
        }
    }

    isSelected(option: SelectOption): boolean {
        const val = this.value();
        if (this.multiple && Array.isArray(val)) {
            return val.includes(option.value);
        }
        return val === option.value;
    }

    onSearchInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.searchQuery.set(target.value);
    }

    clearSearch(): void {
        this.searchQuery.set('');
    }
}
