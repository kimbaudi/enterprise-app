/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}
