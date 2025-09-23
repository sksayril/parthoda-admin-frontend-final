import { httpClient } from './api';
import { API_CONFIG } from '../config/api';

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Auth Service Class
class AuthService {
  private readonly TOKEN_KEY = 'admin_token';
  private readonly USER_KEY = 'admin_user';

  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        this.setToken(response.data.token);
        this.setUser(response.data.user);
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if token exists
      const token = this.getToken();
      if (token) {
        await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      this.clearAuth();
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get auth state
  getAuthState(): AuthState {
    const user = this.getCurrentUser();
    const token = this.getToken();
    
    return {
      user,
      token,
      isAuthenticated: this.isAuthenticated(),
    };
  }

  // Set token
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Set user
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Clear authentication data
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Refresh token (if needed in future)
  async refreshToken(): Promise<string> {
    try {
      const response = await httpClient.post<{ token: string }>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH
      );

      if (response.success && response.data) {
        this.setToken(response.data.token);
        return response.data.token;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      throw error;
    }
  }

  // Validate token format (basic validation)
  isTokenValid(token: string): boolean {
    if (!token) return false;
    
    // Basic JWT format validation
    const parts = token.split('.');
    return parts.length === 3;
  }
}

// Create and export auth service instance
export const authService = new AuthService();
