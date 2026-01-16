import { sum } from './sum';

/**
 * Get average of array of numbers
 */
export function average(array: number[]): number {
    return array.length > 0 ? sum(array) / array.length : 0;
}
