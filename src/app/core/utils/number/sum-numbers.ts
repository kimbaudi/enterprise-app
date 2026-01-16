/**
 * Sum array of numbers
 */
export function sumNumbers(...numbers: number[]): number {
    return numbers.reduce((acc, val) => acc + val, 0);
}
