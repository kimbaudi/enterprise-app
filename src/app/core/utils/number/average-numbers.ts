import { sumNumbers } from '@core/utils/number/sum-numbers';

/**
 * Average of numbers
 */
export function averageNumbers(...numbers: number[]): number {
  return numbers.length > 0 ? sumNumbers(...numbers) / numbers.length : 0;
}
