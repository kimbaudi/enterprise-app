import { VALIDATION_PATTERNS } from '@core/constants/validation.constants';

/**
 * Validate zip code
 */
export function isValidZipCode(zipCode: string): boolean {
  return VALIDATION_PATTERNS.zipCode.test(zipCode);
}
