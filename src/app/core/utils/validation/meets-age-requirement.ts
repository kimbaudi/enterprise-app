/**
 * Validate age requirement
 */
export function meetsAgeRequirement(birthDate: Date, minAge: number): boolean {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= minAge;
    }

    return age >= minAge;
}
