import { User } from './user.model';

/**
 * Authentication and authorization models
 */

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresIn?: number;
}

export interface TokenPayload {
    sub: string;
    email: string;
    name: string;
    roles: string[];
    exp: number;
    iat?: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ResetPasswordConfirm {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export enum AuthStatus {
    Authenticated = 'authenticated',
    Unauthenticated = 'unauthenticated',
    Pending = 'pending',
}
