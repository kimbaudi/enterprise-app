/**
 * Convert number to ordinal string (1st, 2nd, 3rd, etc.)
 */
export function toOrdinal(num: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = num % 100;
    return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}
