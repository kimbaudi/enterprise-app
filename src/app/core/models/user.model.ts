/**
 * User model and related interfaces
 */

export interface User {
    id: string;
    email: string;
    name: string;
    roles: string[];
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserProfile extends User {
    phone?: string;
    address?: string;
    bio?: string;
    preferences?: UserPreferences;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
    emailUpdates: boolean;
}

export interface CreateUserDto {
    email: string;
    name: string;
    password: string;
    roles?: string[];
}

export interface UpdateUserDto {
    name?: string;
    phone?: string;
    address?: string;
    bio?: string;
    avatar?: string;
}
