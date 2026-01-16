/**
 * Check if object is empty
 */
export function isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0;
}
