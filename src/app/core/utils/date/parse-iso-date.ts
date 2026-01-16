import { isValidDate } from './is-valid-date';

/**
 * Parse ISO date string
 */
export function parseISODate(dateString: string): Date | null {
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
}
