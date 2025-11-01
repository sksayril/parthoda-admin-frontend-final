import { httpClient } from './api';
import { API_CONFIG } from '../config/api';
import { 
  ComprehensiveDashboardResponse,
  ComprehensiveDashboardData
} from '../types';

// Dashboard Service
class DashboardService {
  // Get comprehensive dashboard data
  async getComprehensiveDashboard(): Promise<ComprehensiveDashboardData> {
    try {
      const response = await httpClient.get<ComprehensiveDashboardResponse>(
        API_CONFIG.ENDPOINTS.DASHBOARD.COMPREHENSIVE
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch dashboard data');
    } catch (error) {
      console.error('Get comprehensive dashboard error:', error);
      throw error;
    }
  }
}

// Create and export dashboard service instance
export const dashboardService = new DashboardService();