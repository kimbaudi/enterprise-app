/**
 * Application-wide constants
 */

export const APP_CONFIG = {
  name: 'Enterprise App',
  version: '1.0.0',
  description: 'Enterprise Angular Application',
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr', 'de'],
} as const;

export const APP_ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  dashboard: '/dashboard',
  profile: '/profile',
  settings: '/settings',
  notFound: '/404',
} as const;

export const USER_ROLES = {
  admin: 'admin',
  user: 'user',
  moderator: 'moderator',
  guest: 'guest',
} as const;

export const DATE_FORMATS = {
  short: 'MM/dd/yyyy',
  medium: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  full: 'EEEE, MMMM dd, yyyy',
  time: 'hh:mm a',
  dateTime: 'MMM dd, yyyy hh:mm a',
  iso: 'yyyy-MM-dd',
} as const;

export const PAGINATION_DEFAULTS = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
  maxPages: 10,
} as const;

export const DEBOUNCE_TIME = {
  search: 300,
  input: 500,
  resize: 250,
  scroll: 100,
} as const;

export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
} as const;
