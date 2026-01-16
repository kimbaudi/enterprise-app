/**
 * Convert object to query string
 */
export function toQueryString(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}
