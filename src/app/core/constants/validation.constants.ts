/**
 * Validation rules and patterns
 */

export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phone: /^\+?[\d\s\-()]+$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^\d+$/,
  username: /^[a-zA-Z0-9_-]{3,16}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
} as const;

export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  password:
    'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must not exceed ${max} characters`,
  pattern: 'Invalid format',
  mismatch: 'Fields do not match',
  min: (min: number) => `Must be at least ${min}`,
  max: (max: number) => `Must not exceed ${max}`,
} as const;

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
  },
  username: {
    minLength: 3,
    maxLength: 16,
  },
  email: {
    maxLength: 255,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
  phone: {
    minLength: 10,
    maxLength: 15,
  },
} as const;
