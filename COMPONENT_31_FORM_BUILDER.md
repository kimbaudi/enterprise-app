# Component #31: Form Builder

## Overview

Dynamic form generation component that creates forms from JSON schema with comprehensive validation, conditional fields, and flexible layouts.

## Features

### ✨ Core Capabilities

- **12 Field Types**: text, email, password, number, tel, url, textarea, select, checkbox, radio, date, time
- **Comprehensive Validation**: required, email, URL, min/max values, minLength/maxLength, pattern matching, custom validators
- **3 Layout Modes**: vertical (stacked), horizontal (side-by-side labels), inline (single row)
- **Field Widths**: full (100%), half (50%), third (33.333%) with flexible grid layout
- **Conditional Visibility**: Show/hide fields based on other field values using dependsOn
- **Real-time Validation**: Validate on change or blur with user-friendly error messages
- **Field States**: Support for disabled and readonly states on all field types
- **Hint Text**: Add helpful guidance below each field
- **Required Indicators**: Configurable required (*) and optional labels
- **Form Actions**: Customizable submit and reset buttons
- **Public API**: Methods to get/set values, reset form, and validate programmatically
- **Dark Mode**: Full dark mode support with theme-aware styling

### 📦 Component Files

- `form-builder.component.ts` (360 lines)
- `form-builder.component.html` (203 lines)
- `form-builder.component.css` (302 lines)

## Usage

### Basic Example

```typescript
import { FormBuilderComponent, FormSchema } from '@shared/components/form-builder/form-builder.component';

export class MyComponent {
  contactFormSchema: FormSchema = {
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'John Doe',
        validation: {
          minLength: 2,
          maxLength: 50
        }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        validation: {
          email: true
        }
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        validation: {
          minLength: 10,
          maxLength: 500
        }
      }
    ],
    submitLabel: 'Send Message',
    layout: 'vertical'
  };

  onFormSubmit(data: any) {
    console.log('Form submitted:', data);
  }
}
```

```html
<app-form-builder
  [schema]="contactFormSchema"
  (formSubmit)="onFormSubmit($event)"
/>
```

### Advanced Example with All Features

```typescript
registrationFormSchema: FormSchema = {
  fields: [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      width: 'half',
      validation: {
        minLength: 3,
        maxLength: 20,
        pattern: '^[a-zA-Z0-9_]+$'
      },
      hint: 'Alphanumeric and underscores only'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      width: 'half',
      validation: {
        email: true
      }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      width: 'half',
      validation: {
        minLength: 8,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
      },
      hint: 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number'
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      required: true,
      width: 'half'
    },
    {
      name: 'role',
      label: 'Role',
      type: 'radio',
      required: true,
      defaultValue: 'user',
      options: [
        { value: 'user', label: 'Regular User' },
        { value: 'admin', label: 'Administrator' }
      ]
    },
    {
      name: 'terms',
      label: 'I agree to the Terms and Conditions',
      type: 'checkbox',
      required: true
    }
  ],
  submitLabel: 'Create Account',
  layout: 'vertical'
};
```

## API Reference

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `schema` | `FormSchema` | required | Form schema defining fields and layout |
| `config` | `FormBuilderConfig` | `{}` | Configuration options |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `formSubmit` | `EventEmitter<any>` | Emitted when form is submitted with valid data |
| `formReset` | `EventEmitter<void>` | Emitted when form is reset |
| `valueChange` | `EventEmitter<any>` | Emitted when any field value changes |
| `validationChange` | `EventEmitter<boolean>` | Emitted when form validation state changes |

### Public Methods

```typescript
// Get current form values
getFormValue(): any

// Set form values programmatically
setFormValue(data: any): void

// Reset form to initial state
resetForm(): void

// Validate form and return validation result
validateForm(): boolean
```

### Interfaces

```typescript
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
```

## Validation

### Built-in Validators

```typescript
{
  required: true,                    // Field is required
  email: true,                       // Valid email format
  url: true,                         // Valid URL format
  min: 0,                           // Minimum number value
  max: 100,                         // Maximum number value
  minLength: 3,                     // Minimum string length
  maxLength: 50,                    // Maximum string length
  pattern: '^[A-Z0-9]+$'           // Regex pattern
}
```

### Custom Validators

```typescript
{
  name: 'customField',
  label: 'Custom Field',
  type: 'text',
  validation: {
    custom: (value: any) => {
      if (value && value.includes('invalid')) {
        return { custom: 'Value cannot contain "invalid"' };
      }
      return null;
    }
  }
}
```

### Error Messages

The component provides user-friendly error messages:

- "This field is required"
- "Please enter a valid email address"
- "Please enter a valid URL"
- "Value must be at least {min}"
- "Value must be at most {max}"
- "Must be at least {minLength} characters"
- "Must be at most {maxLength} characters"
- "Please match the required format"

## Layout Modes

### Vertical Layout (Default)

Fields are stacked vertically, one per row.

```typescript
{ layout: 'vertical' }
```

### Horizontal Layout

Labels are displayed side-by-side with inputs.

```typescript
{ layout: 'horizontal' }
```

### Inline Layout

All fields and buttons in a single row (useful for search forms).

```typescript
{ layout: 'inline' }
```

## Field Types

### Text Inputs

- `text` - Basic text input
- `email` - Email input with validation
- `password` - Password input (masked)
- `number` - Numeric input
- `tel` - Telephone number
- `url` - URL input with validation

### Date/Time

- `date` - Date picker
- `time` - Time picker

### Text Area

- `textarea` - Multi-line text input (4 rows default)

### Selection

- `select` - Dropdown selection with options
- `radio` - Radio button group
- `checkbox` - Single checkbox

## Use Cases

1. **Contact Forms** - Quick contact forms with validation
2. **User Registration** - Sign-up forms with complex validation
3. **Surveys & Questionnaires** - Dynamic survey forms with conditional fields
4. **Settings Pages** - Configuration forms for app settings
5. **Search Forms** - Inline search forms with filters
6. **Data Entry** - Forms for data collection and entry
7. **Admin Panels** - Configurable forms from backend schema
8. **Multi-step Forms** - Forms with conditional fields based on previous answers

## Demo Examples

### 1. Contact Form

Basic contact form with name, email, subject selection, and message.

### 2. User Registration

Registration form with username, email, password confirmation, role selection, and terms acceptance.

### 3. Customer Survey

Survey form with satisfaction rating, recommendation dropdown, and feedback text areas.

### 4. Job Application

Complex application form with personal details, position selection, experience, and cover letter.

### 5. Inline Search

Compact inline search form with search input and category filter.

### 6. Horizontal Layout

Form with side-by-side labels and inputs for compact display.

### 7. Field Types Showcase

Demonstration of all 12 field types in one form.

### 8. Field States

Examples of disabled and readonly field states.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

- Proper label associations with `for` attribute
- Semantic HTML elements
- Keyboard navigation support
- ARIA attributes for error messages
- Focus states for all interactive elements

## Performance

- Efficient ReactiveFormsModule usage
- Signal-based visibility updates
- Minimal re-renders with OnPush (if applicable)
- Native HTML controls for better performance

## Styling

- CSS custom properties for theming
- Responsive design (mobile-friendly)
- Dark mode support
- Consistent with design system
- Hover and focus states

## Testing

```typescript
// Test form submission
it('should emit formSubmit event with data', () => {
  const submitSpy = jest.spyOn(component.formSubmit, 'emit');
  component.schema = { fields: [...] };
  component.ngOnInit();
  component.form.patchValue({ name: 'John' });
  component.onSubmit();
  expect(submitSpy).toHaveBeenCalledWith({ name: 'John' });
});

// Test validation
it('should show error for required field', () => {
  component.schema = {
    fields: [{ name: 'email', label: 'Email', type: 'email', required: true }]
  };
  component.ngOnInit();
  component.form.get('email')?.markAsTouched();
  expect(component.hasError('email')).toBe(true);
});
```

## Integration with Dashboard

Component #31 is fully integrated into the dashboard with:

- 8 interactive demos showcasing different form types and configurations
- Use case examples explaining practical applications
- Feature grid highlighting 12 key capabilities
- Responsive layout with proper spacing

## Next Steps

Consider these enhancements for future versions:

- Field groups and sections
- Multi-step wizard support
- File upload field type
- Rich text editor field type
- Async validation support
- Form state persistence
- Field templates/presets
- Drag-and-drop field reordering
- Export/import form schemas
- Integration with backend validation

## Conclusion

The Form Builder component provides a powerful, flexible solution for dynamic form generation in Angular applications. It supports a wide range of field types, comprehensive validation, and flexible layouts, making it suitable for everything from simple contact forms to complex multi-field applications.

**Status**: ✅ Complete and fully functional
**Component Number**: #31
**Lines of Code**: 865 (TypeScript: 360, HTML: 203, CSS: 302)
**Dependencies**: @angular/forms (ReactiveFormsModule), ButtonComponent
