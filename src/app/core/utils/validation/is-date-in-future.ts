/**
 * Validate date is in future
 */
export function isDateInFuture(date: Date): boolean {
    return date.getTime() > Date.now();
}
