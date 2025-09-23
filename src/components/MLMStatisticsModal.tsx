import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  RefreshCw,
  Download
} from 'lucide-react';
import { userService } from '../services/users';
import { MLMStatistics } from '../types';
import { useToast } from '../contexts/ToastContext';

interface MLMStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MLMStatisticsModal: React.FC<MLMStatisticsModalProps> = ({ isOpen, onClose }) => {
  const { showError } = useToast();
  const [statistics, setStatistics] = useState<MLMStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const response = await userService.getMLMStatistics(selectedPeriod);
      setStatistics(response.data);
    } catch (error: any) {
      showError('Error Loading Statistics', error.message || 'Failed to load MLM statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatistics();
    }
  }, [isOpen, selectedPeriod]);

  const exportStatistics = () => {
    if (!statistics) return;

    const csvContent = [
      ['Period', 'Total Commissions', 'Commission Count', 'Total Deposits', 'Deposit Count', 'Commission Levels'],
      [
        statistics.period || 'all',
        (statistics.totalCommissions?.total || 0).toString(),
        (statistics.totalCommissions?.count || 0).toString(),
        (statistics.totalDeposits?.total || 0).toString(),
        (statistics.totalDeposits?.count || 0).toString(),
        (statistics.commissionStructure?.length || 0).toString()
      ],
      [],
      ['Commission Structure'],
      ['Level', 'Percentage', 'Formatted Percentage'],
      ...(statistics.commissionStructure || []).map(structure => [
        structure.level.toString(),
        structure.percentage.toString(),
        structure.formattedPercentage || `${structure.percentage}%`
      ]),
      [],
      ['Users by Level'],
      ['Level', 'User Count'],
      ...(statistics.usersByLevel || []).map(levelData => [
        levelData._id.toString(),
        (levelData.count || 0).toString()
      ]),
      [],
      ['Commissions by Level'],
      ['Level', 'Total Amount', 'Transaction Count'],
      ...(statistics.commissionsByLevel || []).map(commissionData => [
        commissionData._id.toString(),
        (commissionData.total || 0).toString(),
        (commissionData.count || 0).toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mlm-statistics-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">MLM Statistics</h2>
              <p className="text-sm text-gray-600">Comprehensive MLM system analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
            
            <button
              onClick={exportStatistics}
              disabled={!statistics}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={loadStatistics}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            </div>
          ) : statistics ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Commissions</p>
                      <p className="text-2xl font-bold">${(statistics.totalCommissions?.total || 0).toLocaleString()}</p>
                      <p className="text-blue-100 text-xs">{statistics.totalCommissions?.count || 0} transactions</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Deposits</p>
                      <p className="text-2xl font-bold">${(statistics.totalDeposits?.total || 0).toLocaleString()}</p>
                      <p className="text-green-100 text-xs">{statistics.totalDeposits?.count || 0} deposits</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Users</p>
                      <p className="text-2xl font-bold">
                        {statistics.usersByLevel?.reduce((sum, level) => sum + (level.count || 0), 0).toLocaleString() || 0}
                      </p>
                      <p className="text-purple-100 text-xs">Across all levels</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Commission Levels</p>
                      <p className="text-2xl font-bold">{statistics.commissionStructure?.length || 0}</p>
                      <p className="text-orange-100 text-xs">Active levels</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Users by Level */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  Users by Level
                </h3>
                {statistics.usersByLevel && statistics.usersByLevel.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Level</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">User Count</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistics.usersByLevel.map((levelData) => {
                          const totalUsers = statistics.usersByLevel.reduce((sum, level) => sum + (level.count || 0), 0);
                          const percentage = totalUsers > 0 ? (((levelData.count || 0) / totalUsers) * 100).toFixed(1) : '0.0';
                          
                          return (
                            <tr key={levelData._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Level {levelData._id}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-medium text-gray-900">
                                {(levelData.count || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {percentage}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No users found in any level</p>
                    <p className="text-sm text-gray-500 mt-2">Users will appear here as they join the MLM system</p>
                  </div>
                )}
              </div>

              {/* Commissions by Level */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Commissions by Level
                </h3>
                {statistics.commissionsByLevel && statistics.commissionsByLevel.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Level</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Total Amount</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction Count</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statistics.commissionsByLevel.map((commissionData) => {
                          const average = (commissionData.count || 0) > 0 ? ((commissionData.total || 0) / (commissionData.count || 1)) : 0;
                          
                          return (
                            <tr key={commissionData._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Level {commissionData._id}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-medium text-gray-900">
                                ${(commissionData.total || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                {(commissionData.count || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-gray-600">
                                ${average.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No commission data available</p>
                    <p className="text-sm text-gray-500 mt-2">Commission data will appear here as transactions occur</p>
                  </div>
                )}
              </div>

              {/* Commission Structure */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                  Commission Structure
                </h3>
                {statistics.commissionStructure && statistics.commissionStructure.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {statistics.commissionStructure.map((structure) => (
                      <div key={structure.level} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Level {structure.level}</p>
                            <p className="text-2xl font-bold text-purple-600">{structure.formattedPercentage || `${structure.percentage}%`}</p>
                          </div>
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No commission structure available</p>
                    <p className="text-sm text-gray-500 mt-2">Commission structure will be configured by the system</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No statistics available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLMStatisticsModal;
