/**
 * Get nested property value safely
 */
export function getNestedValue<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }

    return result;
}
