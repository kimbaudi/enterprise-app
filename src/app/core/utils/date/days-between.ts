/**
 * Get difference between two dates in days
 */
export function daysBetween(date1: Date | string | number, date2: Date | string | number): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
