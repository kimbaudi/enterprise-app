/**
 * Storage keys for localStorage and sessionStorage
 */

export const STORAGE_KEYS = {
  // Authentication
  authToken: 'auth_token',
  refreshToken: 'refresh_token',
  currentUser: 'current_user',

  // User preferences
  theme: 'theme',
  language: 'language',
  sidebarState: 'sidebar_state',

  // Application state
  lastRoute: 'last_route',
  redirectUrl: 'redirect_url',

  // Cache
  cachePrefix: 'cache_',
  cacheExpiry: 'cache_expiry_',
} as const;

export const SESSION_KEYS = {
  formData: 'form_data',
  tempToken: 'temp_token',
  wizardStep: 'wizard_step',
} as const;

export const CACHE_DURATION = {
  short: 5 * 60 * 1000, // 5 minutes
  medium: 30 * 60 * 1000, // 30 minutes
  long: 60 * 60 * 1000, // 1 hour
  day: 24 * 60 * 60 * 1000, // 24 hours
} as const;
