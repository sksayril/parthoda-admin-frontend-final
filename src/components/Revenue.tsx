import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Revenue: React.FC = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [viewType, setViewType] = useState('overview');

  const revenueStats = [
    {
      title: 'Total Revenue',
      value: '$125,430',
      change: '+12.5%',
      positive: true,
      period: 'vs last month'
    },
    {
      title: 'Monthly Recurring',
      value: '$45,230',
      change: '+8.2%',
      positive: true,
      period: 'vs last month'
    },
    {
      title: 'Average Order',
      value: '$89.50',
      change: '-2.1%',
      positive: false,
      period: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.4%',
      change: '+0.8%',
      positive: true,
      period: 'vs last month'
    }
  ];

  const revenueBreakdown = [
    { source: 'Subscriptions', amount: 45230, percentage: 68, color: 'bg-sky-500' },
    { source: 'One-time Sales', amount: 18540, percentage: 28, color: 'bg-green-500' },
    { source: 'Upgrades', amount: 2660, percentage: 4, color: 'bg-purple-500' }
  ];

  const recentTransactions = [
    {
      id: 'TXN-001',
      customer: 'John Doe',
      amount: 299.99,
      type: 'Subscription',
      status: 'Completed',
      date: '2024-02-15 10:30'
    },
    {
      id: 'TXN-002',
      customer: 'Jane Smith',
      amount: 89.50,
      type: 'Purchase',
      status: 'Completed',
      date: '2024-02-15 09:15'
    },
    {
      id: 'TXN-003',
      customer: 'Mike Johnson',
      amount: 149.99,
      type: 'Upgrade',
      status: 'Pending',
      date: '2024-02-15 08:45'
    },
    {
      id: 'TXN-004',
      customer: 'Sarah Williams',
      amount: 59.99,
      type: 'Purchase',
      status: 'Completed',
      date: '2024-02-14 16:20'
    },
    {
      id: 'TXN-005',
      customer: 'David Brown',
      amount: 199.99,
      type: 'Subscription',
      status: 'Failed',
      date: '2024-02-14 14:10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue</h1>
          <p className="text-gray-600 mt-1">Track your financial performance</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button className="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md transform hover:scale-105">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-sky-500">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.positive ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.period}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewType('overview')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewType === 'overview' ? 'bg-sky-100 text-sky-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewType('breakdown')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewType === 'breakdown' ? 'bg-sky-100 text-sky-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <PieChart className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="h-64 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-sky-400 mx-auto mb-3" />
              <p className="text-gray-600">Revenue chart visualization</p>
              <p className="text-sm text-gray-500 mt-1">Showing upward trend of 12.5%</p>
            </div>
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Sources</h3>
          
          <div className="space-y-4">
            {revenueBreakdown.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${source.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{source.source}</p>
                    <p className="text-sm text-gray-600">{source.percentage}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${source.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Revenue</span>
              <span className="font-bold text-xl text-gray-900">
                ${revenueBreakdown.reduce((sum, source) => sum + source.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Monthly Growth</h4>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">12.5%</div>
          <p className="text-sm text-gray-600">Compared to last month</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Active Subscriptions</h4>
            <Calendar className="h-5 w-5 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">1,234</div>
          <p className="text-sm text-gray-600">Monthly recurring users</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Churn Rate</h4>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">2.1%</div>
          <p className="text-sm text-gray-600">Below industry average</p>
        </div>
      </div>
    </div>
  );
};

export default Revenue;