/**
 * Get start of day
 */
export function startOfDay(date: Date | string | number): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
