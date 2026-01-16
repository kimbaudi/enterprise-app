/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
}
