import { VALIDATION_PATTERNS } from '../../constants/validation.constants';

/**
 * Validate numeric string
 */
export function isNumeric(value: string): boolean {
    return VALIDATION_PATTERNS.numeric.test(value);
}
