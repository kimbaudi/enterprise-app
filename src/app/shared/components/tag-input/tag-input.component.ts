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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent implements ControlValueAccessor {
  @Input() placeholder = 'Add tag...';
  @Input() maxTags?: number;
  @Input() maxLength?: number;
  @Input() allowDuplicates = false;
  @Input() suggestions: string[] = [];
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'outlined' | 'filled' = 'default';
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary';
  @Input() removable = true;
  @Input() clearable = true;

  @Output() tagAdd = new EventEmitter<string>();
  @Output() tagRemove = new EventEmitter<string>();
  @Output() tagsChange = new EventEmitter<string[]>();

  tags = signal<string[]>([]);
  inputValue = signal('');
  focused = signal(false);
  showSuggestions = signal(false);

  filteredSuggestions = computed(() => {
    const input = this.inputValue().toLowerCase().trim();
    if (!input || !this.suggestions.length) return [];

    const existingTags = this.tags().map((t) => t.toLowerCase());
    return this.suggestions
      .filter((s) => {
        const lowerS = s.toLowerCase();
        return lowerS.includes(input) && !existingTags.includes(lowerS);
      })
      .slice(0, 5);
  });

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string[]): void {
    if (value) {
      this.tags.set(Array.isArray(value) ? value : []);
    }
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(value: string): void {
    this.inputValue.set(value);
    this.showSuggestions.set(value.length > 0 && this.filteredSuggestions().length > 0);
  }

  onInputKeyDown(event: KeyboardEvent): void {
    const input = this.inputValue().trim();

    if (event.key === 'Enter' && input) {
      event.preventDefault();
      this.addTag(input);
    } else if (event.key === 'Backspace' && !input && this.tags().length > 0) {
      this.removeTag(this.tags()[this.tags().length - 1]);
    } else if (event.key === 'Escape') {
      this.showSuggestions.set(false);
    }
  }

  onFocus(): void {
    this.focused.set(true);
    if (this.inputValue().trim() && this.filteredSuggestions().length > 0) {
      this.showSuggestions.set(true);
    }
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
    // Delay to allow click on suggestions
    setTimeout(() => {
      this.showSuggestions.set(false);
    }, 200);
  }

  addTag(tag: string): void {
    if (this.disabled) return;

    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    // Check max length
    if (this.maxLength && trimmedTag.length > this.maxLength) return;

    // Check max tags
    if (this.maxTags && this.tags().length >= this.maxTags) return;

    // Check duplicates
    if (
      !this.allowDuplicates &&
      this.tags().some((t) => t.toLowerCase() === trimmedTag.toLowerCase())
    ) {
      return;
    }

    const newTags = [...this.tags(), trimmedTag];
    this.tags.set(newTags);
    this.inputValue.set('');
    this.showSuggestions.set(false);

    this.onChange(newTags);
    this.tagAdd.emit(trimmedTag);
    this.tagsChange.emit(newTags);
  }

  removeTag(tag: string): void {
    if (this.disabled || !this.removable) return;

    const newTags = this.tags().filter((t) => t !== tag);
    this.tags.set(newTags);

    this.onChange(newTags);
    this.tagRemove.emit(tag);
    this.tagsChange.emit(newTags);
  }

  selectSuggestion(suggestion: string): void {
    this.addTag(suggestion);
  }

  clearAll(): void {
    if (this.disabled || !this.clearable) return;

    this.tags.set([]);
    this.inputValue.set('');
    this.showSuggestions.set(false);

    this.onChange([]);
    this.tagsChange.emit([]);
  }

  get canAddMore(): boolean {
    return !this.maxTags || this.tags().length < this.maxTags;
  }

  get tagCountText(): string {
    if (!this.maxTags) return '';
    return `${this.tags().length}/${this.maxTags}`;
  }
}
