/**
 * Format number with compact notation (1K, 1M, etc.)
 */
export function formatCompact(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}
