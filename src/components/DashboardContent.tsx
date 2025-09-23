import React from 'react';
import { Users, DollarSign, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12%',
      positive: true,
      icon: Users,
      color: 'bg-sky-500'
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+23%',
      positive: true,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Growth',
      value: '89.1%',
      change: '+5%',
      positive: true,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Activity',
      value: '1,234',
      change: '-2%',
      positive: false,
      icon: Activity,
      color: 'bg-orange-500'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Payment received', time: '5 minutes ago', type: 'payment' },
    { id: 3, action: 'New order placed', time: '10 minutes ago', type: 'order' },
    { id: 4, action: 'User profile updated', time: '15 minutes ago', type: 'user' },
    { id: 5, action: 'System backup completed', time: '1 hour ago', type: 'system' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-sky-400 mx-auto mb-3" />
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">Revenue trending upward by 23%</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'user' ? 'bg-sky-500' :
                  activity.type === 'payment' ? 'bg-green-500' :
                  activity.type === 'order' ? 'bg-purple-500' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 group">
            <Users className="h-8 w-8 text-sky-500 mb-2 group-hover:scale-110 transition-transform duration-200" />
            <h4 className="font-medium text-gray-900">Add New User</h4>
            <p className="text-sm text-gray-600">Create a new user account</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 group">
            <DollarSign className="h-8 w-8 text-green-500 mb-2 group-hover:scale-110 transition-transform duration-200" />
            <h4 className="font-medium text-gray-900">Generate Report</h4>
            <p className="text-sm text-gray-600">Create revenue report</p>
          </button>
          
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 group">
            <Activity className="h-8 w-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform duration-200" />
            <h4 className="font-medium text-gray-900">System Health</h4>
            <p className="text-sm text-gray-600">Check system status</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;