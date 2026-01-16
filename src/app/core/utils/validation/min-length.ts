/**
 * Validate min length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}
