import { VALIDATION_PATTERNS } from '../../constants/validation.constants';

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
    return VALIDATION_PATTERNS.email.test(email);
}
