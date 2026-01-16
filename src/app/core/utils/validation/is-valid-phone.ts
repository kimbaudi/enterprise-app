import { VALIDATION_PATTERNS } from '../../constants/validation.constants';

/**
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
    return VALIDATION_PATTERNS.phone.test(phone);
}
