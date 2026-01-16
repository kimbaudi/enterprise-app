import { VALIDATION_PATTERNS } from '../../constants/validation.constants';

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
    return VALIDATION_PATTERNS.password.test(password);
}
