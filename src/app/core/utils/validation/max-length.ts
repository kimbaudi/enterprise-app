/**
 * Validate max length
 */
export function maxLength(value: string, max: number): boolean {
    return value.length <= max;
}
