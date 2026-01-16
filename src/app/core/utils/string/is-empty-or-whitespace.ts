/**
 * Check if string is empty or whitespace
 */
export function isEmptyOrWhitespace(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}
