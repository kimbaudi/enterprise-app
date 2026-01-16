/**
 * Validate date is in past
 */
export function isDateInPast(date: Date): boolean {
  return date.getTime() < Date.now();
}
