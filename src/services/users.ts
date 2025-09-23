import { httpClient } from './api';
import { API_CONFIG } from '../config/api';
import { 
  User, 
  UserListResponse, 
  UserDetailResponse,
  CreateUserData, 
  UpdateUserData, 
  UpdateUserStatusData,
  UpdateWalletData,
  WalletUpdateResponse,
  UserStatusUpdateResponse,
  UsersByLevelResponse,
  MLMStatisticsResponse
} from '../types';

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

// User Service
class UserService {
  // Get all users with pagination and filters
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.role) queryParams.append('role', filters.role);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await httpClient.get<UserListResponse>(
        `${API_CONFIG.ENDPOINTS.USERS.LIST}?${queryParams.toString()}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch users');
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await httpClient.get<UserDetailResponse>(
        `${API_CONFIG.ENDPOINTS.USERS.DETAIL}/${id}`
      );

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error(response.message || 'Failed to fetch user');
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await httpClient.post<User>(
        API_CONFIG.ENDPOINTS.USERS.CREATE,
        userData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to create user');
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await httpClient.put<User>(
        `${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${id}`,
        userData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to update user');
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await httpClient.delete(
        `${API_CONFIG.ENDPOINTS.USERS.DELETE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Update user status
  async updateUserStatus(id: string, statusData: UpdateUserStatusData): Promise<User> {
    try {
      const response = await httpClient.put<UserStatusUpdateResponse>(
        `${API_CONFIG.ENDPOINTS.USERS.STATUS}/${id}/status`,
        statusData
      );

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error(response.message || 'Failed to update user status');
    } catch (error) {
      console.error('Update user status error:', error);
      throw error;
    }
  }

  // Update user wallet
  async updateUserWallet(id: string, walletData: UpdateWalletData): Promise<WalletUpdateResponse> {
    try {
      const response = await httpClient.post<WalletUpdateResponse>(
        `${API_CONFIG.ENDPOINTS.USERS.WALLET}/${id}/wallet/update`,
        walletData
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to update user wallet');
    } catch (error) {
      console.error('Update user wallet error:', error);
      throw error;
    }
  }

  // MLM: Get users by level
  async getUsersByLevel(level: number, page: number = 1, limit: number = 50): Promise<UsersByLevelResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      const endpoint = `${API_CONFIG.ENDPOINTS.USERS.MLM.USERS_BY_LEVEL}/${level}?${queryParams.toString()}`;
      console.log('MLM API Call - Users by Level:', endpoint);

      const response = await httpClient.get<UsersByLevelResponse>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch users by level');
    } catch (error) {
      console.error('Get users by level error:', error);
      throw error;
    }
  }

  // MLM: Get MLM statistics
  async getMLMStatistics(period: string = 'all'): Promise<MLMStatisticsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (period !== 'all') {
        queryParams.append('period', period);
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.USERS.MLM.STATISTICS}?${queryParams.toString()}`;
      console.log('MLM API Call - Statistics:', endpoint);

      const response = await httpClient.get<MLMStatisticsResponse>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch MLM statistics');
    } catch (error) {
      console.error('Get MLM statistics error:', error);
      throw error;
    }
  }
}

// Create and export user service instance
export const userService = new UserService();
