import { VALIDATION_PATTERNS } from '../../constants/validation.constants';

/**
 * Validate alphanumeric string
 */
export function isAlphanumeric(value: string): boolean {
    return VALIDATION_PATTERNS.alphanumeric.test(value);
}
