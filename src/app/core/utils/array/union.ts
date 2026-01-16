import { unique } from './unique';

/**
 * Find union of two arrays
 */
export function union<T>(array1: T[], array2: T[]): T[] {
    return unique([...array1, ...array2]);
}
