import { VALIDATION_PATTERNS } from '../../constants/validation.constants';

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
    return VALIDATION_PATTERNS.username.test(username);
}
