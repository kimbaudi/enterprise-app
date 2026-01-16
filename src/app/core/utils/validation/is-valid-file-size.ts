/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}
