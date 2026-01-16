/**
 * Add months to date
 */
export function addMonths(date: Date | string | number, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}
