import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthState, User, LoginCredentials } from '../services/auth';
import { ErrorHandler } from '../utils/errorHandler';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => authService.getAuthState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const state = authService.getAuthState();
    setAuthState(state);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await authService.login(credentials);
      const newState = authService.getAuthState();
      setAuthState(newState);
      setError(null);
    } catch (err: any) {
      const errorInfo = ErrorHandler.getErrorMessage(err);
      setError(errorInfo.message);
      ErrorHandler.logError(err, 'AuthContext.login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await authService.logout();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (err: any) {
      ErrorHandler.logError(err, 'AuthContext.logout');
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
