/**
 * Linear interpolation between two numbers
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
