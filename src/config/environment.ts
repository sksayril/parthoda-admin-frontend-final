// Environment Configuration
export const ENV_CONFIG = {
  // API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3100/api',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.utpfund.live/api',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

// Development helpers
export const isDevelopment = () => ENV_CONFIG.IS_DEVELOPMENT;
export const isProduction = () => ENV_CONFIG.IS_PRODUCTION;
