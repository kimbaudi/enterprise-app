/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
    const d = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
}
