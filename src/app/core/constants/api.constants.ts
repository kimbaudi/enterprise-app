/**
 * API-related constants and endpoints
 */

export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    verifyEmail: '/auth/verify-email',
  },
  users: {
    base: '/users',
    profile: '/users/profile',
    byId: (id: string) => `/users/${id}`,
    updateProfile: '/users/profile',
    uploadAvatar: '/users/avatar',
  },
  dashboard: {
    stats: '/dashboard/stats',
    recentActivity: '/dashboard/activity',
    notifications: '/dashboard/notifications',
  },
} as const;

export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  unprocessableEntity: 422,
  tooManyRequests: 429,
  internalServerError: 500,
  serviceUnavailable: 503,
} as const;

export const REQUEST_HEADERS = {
  contentType: 'Content-Type',
  authorization: 'Authorization',
  accept: 'Accept',
  xRequestedWith: 'X-Requested-With',
  xCsrfToken: 'X-CSRF-Token',
} as const;

export const CONTENT_TYPES = {
  json: 'application/json',
  formData: 'multipart/form-data',
  urlEncoded: 'application/x-www-form-urlencoded',
  text: 'text/plain',
} as const;
