/**
 * Flatten nested arrays
 */
export function flatten<T>(array: any[]): T[] {
  return array.reduce(
    (acc, val) => (Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val)),
    [],
  );
}
