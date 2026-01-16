/**
 * Sum array of numbers
 */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}
