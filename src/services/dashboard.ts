import { httpClient } from './api';
import { API_CONFIG, ApiResponse } from '../config/api';

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  growthRate: number;
}

export interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
  users: number;
}

export interface UserStats {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  totalSpent: number;
}

// Dashboard Service
class DashboardService {
  // Get dashboard statistics
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await httpClient.get<DashboardStats>(
        API_CONFIG.ENDPOINTS.DASHBOARD.STATS
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch dashboard stats');
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }

  // Get revenue data
  async getRevenueData(period: string = 'monthly'): Promise<RevenueData[]> {
    try {
      const response = await httpClient.get<RevenueData[]>(
        `${API_CONFIG.ENDPOINTS.DASHBOARD.REVENUE}?period=${period}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch revenue data');
    } catch (error) {
      console.error('Revenue data error:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(page: number = 1, limit: number = 10): Promise<{
    users: UserStats[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await httpClient.get<{
        users: UserStats[];
        total: number;
        page: number;
        limit: number;
      }>(`${API_CONFIG.ENDPOINTS.USERS.LIST}?page=${page}&limit=${limit}`);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch user stats');
    } catch (error) {
      console.error('User stats error:', error);
      throw error;
    }
  }
}

// Create and export dashboard service instance
export const dashboardService = new DashboardService();
