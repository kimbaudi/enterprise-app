/**
 * Validate file extension
 */
export function isValidFileExtension(fileName: string, allowedExtensions: string[]): boolean {
    const ext = '.' + fileName.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(ext);
}
