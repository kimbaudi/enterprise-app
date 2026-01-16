import { capitalize } from './capitalize';

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
    if (!str) return '';
    return str
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}
