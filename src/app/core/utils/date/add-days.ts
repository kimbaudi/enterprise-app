/**
 * Add days to date
 */
export function addDays(date: Date | string | number, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
