/**
 * Check if array is empty
 */
export function isEmpty<T>(array: T[] | null | undefined): boolean {
  return !array || array.length === 0;
}
