/**
 * Pluralize word based on count
 */
export function pluralize(word: string, count: number, suffix = 's'): string {
    return count === 1 ? word : word + suffix;
}
