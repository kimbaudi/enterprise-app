/**
 * Check if date is in the future
 */
export function isFuture(date: Date | string | number): boolean {
  return new Date(date).getTime() > Date.now();
}
