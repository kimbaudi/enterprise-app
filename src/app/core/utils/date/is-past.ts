/**
 * Check if date is in the past
 */
export function isPast(date: Date | string | number): boolean {
  return new Date(date).getTime() < Date.now();
}
