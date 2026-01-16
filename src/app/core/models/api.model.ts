/**
 * API response and request models
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: Date;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, any>;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}
