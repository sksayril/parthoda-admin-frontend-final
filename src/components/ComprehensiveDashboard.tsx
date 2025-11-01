import React, { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { defaultChartOptions, doughnutChartOptions } from '../config/chart';
import {
  Users,
  DollarSign,
  TrendingUp,
  Wallet,
  UserCheck,
  UserX,
  AlertCircle,
  RefreshCw,
  Activity,
  Award,
  Clock
} from 'lucide-react';
import { dashboardService } from '../services/dashboard';
import { ComprehensiveDashboardData } from '../types';
import { useToast } from '../contexts/ToastContext';
import { formatDate } from '../utils';


const ComprehensiveDashboard: React.FC = () => {
  const { showError } = useToast();
  const [dashboardData, setDashboardData] = useState<ComprehensiveDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getComprehensiveDashboard();
      setDashboardData(data);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load dashboard data';
      setError(errorMessage);
      showError('Dashboard Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <div className="text-red-600">
              <p className="text-lg font-medium">Error loading dashboard</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { admin, statistics, charts, recentActivity } = dashboardData;

  // Chart configurations
  const userRegistrationsChart = {
    labels: charts.monthlyUserRegistrations.map(item => item.month),
    datasets: [
      {
        label: 'User Registrations',
        data: charts.monthlyUserRegistrations.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const walletDistributionChart = {
    labels: charts.walletDistribution.map(item => item.name),
    datasets: [
      {
        data: charts.walletDistribution.map(item => item.value),
        backgroundColor: charts.walletDistribution.map(item => item.color),
        borderWidth: 0,
      },
    ],
  };


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {admin.name}</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

       {/* Admin Wallet Balance */}
       <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
         <div className="flex items-center space-x-3 mb-4">
           <Wallet className="h-6 w-6 text-blue-600" />
           <h2 className="text-xl font-semibold text-gray-900">Your Wallet Balance</h2>
         </div>
         <div className="flex justify-center">
           <div className="bg-blue-50 p-8 rounded-lg w-full max-w-sm">
             <div className="text-center">
               <div className="text-lg text-blue-600 font-medium mb-2">Main Wallet</div>
               <div className="text-4xl font-bold text-blue-900">{admin.walletBalance.mainWallet.formatted}</div>
             </div>
           </div>
         </div>
       </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.users.total}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{statistics.users.growthRate}% growth
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.users.active}</p>
              <p className="text-sm text-gray-500 mt-1">
                {statistics.users.inactive} inactive
              </p>
            </div>
            <UserCheck className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Verified Users */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Users</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.users.verified}</p>
              <p className="text-sm text-gray-500 mt-1">
                {statistics.users.unverified} unverified
              </p>
            </div>
            <Award className="h-12 w-12 text-purple-500" />
          </div>
        </div>

        {/* Financial Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Earnings</p>
              <p className="text-3xl font-bold text-gray-900">${statistics.financial.netEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">
                ${statistics.financial.totalEarnings.toLocaleString()} total
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registrations Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly User Registrations</h3>
          <div className="h-64">
            <Bar data={userRegistrationsChart} options={defaultChartOptions} />
          </div>
        </div>

        {/* Wallet Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Distribution</h3>
          <div className="h-64">
            <Doughnut data={walletDistributionChart} options={doughnutChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(user.joinDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Top Earners</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.topEarners.map((earner) => (
              <div key={earner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{earner.name}</p>
                  <p className="text-sm text-gray-500">{earner.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{earner.formattedEarnings}</p>
                  <p className="text-xs text-gray-500">Total Earnings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{transaction.user.name}</p>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.formattedAmount}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDashboard;
