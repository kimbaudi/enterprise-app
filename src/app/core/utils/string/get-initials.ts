/**
 * Get initials from name
 */
export function getInitials(name: string, maxLength = 2): string {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, maxLength)
        .join('');
}
