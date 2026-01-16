/**
 * Partition array by predicate
 */
export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  array.forEach((item) => (predicate(item) ? pass : fail).push(item));
  return [pass, fail];
}
