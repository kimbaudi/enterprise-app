import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface RadioOption {
  value: string | number;
  label: string;
}

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  options?: SelectOption[] | RadioOption[];
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    email?: boolean;
    url?: boolean;
    custom?: (value: any) => ValidationErrors | null;
  };
  hint?: string;
  width?: 'full' | 'half' | 'third';
  visible?: boolean;
  dependsOn?: {
    field: string;
    value: any;
  };
}

export interface FormSchema {
  fields: FormField[];
  submitLabel?: string;
  resetLabel?: string;
  layout?: 'vertical' | 'horizontal' | 'inline';
  showReset?: boolean;
  showSubmit?: boolean;
}

export interface FormBuilderConfig {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  showRequiredIndicator?: boolean;
  showOptionalIndicator?: boolean;
  requiredIndicator?: string;
  optionalIndicator?: string;
}

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css'],
})
export class FormBuilderComponent implements OnInit, OnChanges {
  @Input() schema!: FormSchema;
  @Input() formId?: string;
  @Input() config: FormBuilderConfig = {
    validateOnChange: true,
    validateOnBlur: true,
    showRequiredIndicator: true,
    showOptionalIndicator: false,
    requiredIndicator: '*',
    optionalIndicator: '(optional)',
  };

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<any>();
  @Output() validationChange = new EventEmitter<boolean>();

  form!: FormGroup;
  visibleFields = signal<FormField[]>([]);
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.updateVisibleFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && !changes['schema'].firstChange) {
      this.buildForm();
      this.updateVisibleFields();
    }
  }

  private buildForm(): void {
    const group: any = {};

    this.schema.fields.forEach((field) => {
      const validators = this.buildValidators(field);
      const value = field.defaultValue ?? this.getDefaultValue(field.type);

      group[field.name] = [{ value, disabled: field.disabled || field.readonly }, validators];
    });

    this.form = this.fb.group(group);

    // Subscribe to form value changes
    this.form.valueChanges.subscribe((value) => {
      this.updateVisibleFields();
      this.valueChange.emit(value);
      this.validationChange.emit(this.form.valid);
    });

    // Emit initial state
    this.valueChange.emit(this.form.value);
    this.validationChange.emit(this.form.valid);
  }

  private buildValidators(field: FormField): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validation) {
      const { validation } = field;

      if (validation.email) {
        validators.push(Validators.email);
      }

      if (validation.min !== undefined) {
        validators.push(Validators.min(validation.min));
      }

      if (validation.max !== undefined) {
        validators.push(Validators.max(validation.max));
      }

      if (validation.minLength !== undefined) {
        validators.push(Validators.minLength(validation.minLength));
      }

      if (validation.maxLength !== undefined) {
        validators.push(Validators.maxLength(validation.maxLength));
      }

      if (validation.pattern) {
        validators.push(Validators.pattern(validation.pattern));
      }

      if (validation.url) {
        validators.push(this.urlValidator);
      }

      if (validation.custom) {
        validators.push(validation.custom);
      }
    }

    return validators;
  }

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    try {
      new URL(control.value);
      return null;
    } catch {
      return { url: true };
    }
  }

  private getDefaultValue(type: FieldType): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'number':
        return null;
      default:
        return '';
    }
  }

  private updateVisibleFields(): void {
    const visible = this.schema.fields.filter((field) => {
      if (field.visible === false) return false;

      if (field.dependsOn) {
        const dependentValue = this.form.get(field.dependsOn.field)?.value;
        return dependentValue === field.dependsOn.value;
      }

      return true;
    });

    this.visibleFields.set(visible);
  }

  getFieldWidth(field: FormField): string {
    switch (field.width) {
      case 'half':
        return '50%';
      case 'third':
        return '33.333%';
      default:
        return '100%';
    }
  }

  getFieldId(fieldName: string): string {
    return this.formId ? `${this.formId}-${fieldName}` : fieldName;
  }

  getFieldLabel(field: FormField): string {
    let label = field.label;

    if (this.config.showRequiredIndicator && field.required) {
      label += ` ${this.config.requiredIndicator}`;
    }

    if (this.config.showOptionalIndicator && !field.required) {
      label += ` ${this.config.optionalIndicator}`;
    }

    return label;
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;

    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['url']) return 'Please enter a valid URL';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['minlength'])
      return `Minimum length is ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength'])
      return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Invalid format';

    return 'Invalid value';
  }

  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.errors && control.touched);
  }

  onFieldChange(fieldName: string, value: any): void {
    this.form.patchValue({ [fieldName]: value });

    if (this.config.validateOnChange) {
      this.form.get(fieldName)?.markAsTouched();
    }
  }

  onFieldBlur(fieldName: string): void {
    if (this.config.validateOnBlur) {
      this.form.get(fieldName)?.markAsTouched();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formSubmit.emit(this.form.value);

    // Reset submitting state after a short delay
    setTimeout(() => {
      this.isSubmitting.set(false);
    }, 500);
  }

  onReset(): void {
    this.form.reset();
    this.schema.fields.forEach((field) => {
      const defaultValue = field.defaultValue ?? this.getDefaultValue(field.type);
      this.form.get(field.name)?.setValue(defaultValue);
    });
    this.formReset.emit();
  }

  private markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });
  }

  // Public methods for external control
  getFormValue(): any {
    return this.form.value;
  }

  setFormValue(value: any): void {
    this.form.patchValue(value);
  }

  resetForm(): void {
    this.onReset();
  }

  validateForm(): boolean {
    this.markAllAsTouched();
    return this.form.valid;
  }
}
