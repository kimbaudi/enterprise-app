import { VALIDATION_PATTERNS } from '@core/constants/validation.constants';

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  return VALIDATION_PATTERNS.url.test(url);
}
