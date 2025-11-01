import { ENV_CONFIG } from './environment';

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/admin/admin/login',
      LOGOUT: '/admin/admin/logout',
      REFRESH: '/admin/admin/refresh',
    },
    USERS: {
      LIST: '/admin/my-users',
      CREATE: '/admin/users',
      UPDATE: '/admin/users',
      DELETE: '/admin/users',
      DETAIL: '/admin/users',
      STATUS: '/admin/users',
      WALLET: '/admin/users',
      RECHARGE_WALLET: '/admin/recharge-user-wallet',
      MLM: {
        USERS_BY_LEVEL: '/users/mlm/users-by-level',
        STATISTICS: '/users/mlm/statistics',
      },
    },
    DASHBOARD: {
      STATS: '/admin/dashboard/stats',
      REVENUE: '/admin/dashboard/revenue',
      COMPREHENSIVE: '/admin/dashboard',
    },
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
