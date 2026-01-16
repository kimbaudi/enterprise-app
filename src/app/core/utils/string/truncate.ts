/**
 * Truncate string to specified length with ellipsis
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}
