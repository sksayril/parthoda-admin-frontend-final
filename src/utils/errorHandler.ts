import { ApiError } from '../services/api';

// Error types
export interface ErrorMessage {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Error handler utility
export class ErrorHandler {
  static getErrorMessage(error: unknown): ErrorMessage {
    if (error instanceof ApiError) {
      return this.handleApiError(error);
    }

    if (error instanceof Error) {
      return this.handleGenericError(error);
    }

    return {
      title: 'Error',
      message: ERROR_MESSAGES.UNKNOWN_ERROR,
      type: 'error',
    };
  }

  private static handleApiError(error: ApiError): ErrorMessage {
    switch (error.status) {
      case 400:
        return {
          title: 'Validation Error',
          message: error.message || ERROR_MESSAGES.VALIDATION_ERROR,
          type: 'error',
        };
      case 401:
        return {
          title: 'Unauthorized',
          message: error.message || ERROR_MESSAGES.UNAUTHORIZED,
          type: 'error',
        };
      case 403:
        return {
          title: 'Access Denied',
          message: error.message || ERROR_MESSAGES.FORBIDDEN,
          type: 'error',
        };
      case 404:
        return {
          title: 'Not Found',
          message: error.message || ERROR_MESSAGES.NOT_FOUND,
          type: 'error',
        };
      case 500:
        return {
          title: 'Server Error',
          message: error.message || ERROR_MESSAGES.SERVER_ERROR,
          type: 'error',
        };
      default:
        return {
          title: 'API Error',
          message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
          type: 'error',
        };
    }
  }

  private static handleGenericError(error: Error): ErrorMessage {
    if (error.name === 'AbortError') {
      return {
        title: 'Timeout',
        message: ERROR_MESSAGES.TIMEOUT_ERROR,
        type: 'error',
      };
    }

    if (error.message.includes('fetch')) {
      return {
        title: 'Network Error',
        message: ERROR_MESSAGES.NETWORK_ERROR,
        type: 'error',
      };
    }

    return {
      title: 'Error',
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      type: 'error',
    };
  }

  static logError(error: unknown, context?: string): void {
    const errorMessage = this.getErrorMessage(error);
    
    console.error(`[${context || 'ErrorHandler'}]`, {
      title: errorMessage.title,
      message: errorMessage.message,
      originalError: error,
    });
  }
}
