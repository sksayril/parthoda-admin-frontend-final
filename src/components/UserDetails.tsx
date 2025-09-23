import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Wallet,
  UserCheck,
  UserX,
  Edit,
  RefreshCw,
  Copy,
  Check,
  Network,
  Activity,
  Layers
} from 'lucide-react';
import { userService } from '../services/users';
import { User as UserType, UpdateUserStatusData, UpdateWalletData } from '../types';
import { useToast } from '../contexts/ToastContext';
import { formatDate, formatDateTime } from '../utils';

interface UserDetailsProps {
  userId: string;
  onBack: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId, onBack }) => {
  const { showSuccess, showError } = useToast();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingWallet, setUpdatingWallet] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletData, setWalletData] = useState<UpdateWalletData>({
    walletType: 'mainWallet',
    amount: 0,
    operation: 'add',
    description: ''
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const userData = await userService.getUserById(userId);
      setUser(userData);
    } catch (error: any) {
      showError('Error Loading User', error.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!user) return;
    
    setUpdatingStatus(true);
    try {
      const statusData: UpdateUserStatusData = { isActive: !user.isActive };
      const updatedUser = await userService.updateUserStatus(user._id, statusData);
      setUser(updatedUser);
      showSuccess('Status Updated', `User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      showError('Update Failed', error.message || 'Failed to update user status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleWalletUpdate = async () => {
    if (!user) return;

    // Validate input
    if (walletData.amount <= 0) {
      showError('Validation Error', 'Amount must be greater than 0');
      return;
    }

    if (!walletData.description.trim()) {
      showError('Validation Error', 'Description is required');
      return;
    }

    setUpdatingWallet(true);
    try {
      await userService.updateUserWallet(user._id, walletData);
      showSuccess('Wallet Updated', 'User wallet updated successfully');
      setShowWalletModal(false);
      setWalletData({
        walletType: 'mainWallet',
        amount: 0,
        operation: 'add',
        description: ''
      });
      loadUser();
    } catch (error: any) {
      showError('Update Failed', error.message || 'Failed to update wallet');
    } finally {
      setUpdatingWallet(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
      showSuccess('Copied', `${type} copied to clipboard`);
    } catch (error) {
      showError('Copy Failed', 'Failed to copy to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <button
            onClick={onBack}
            className="mt-4 text-sky-600 hover:text-sky-800"
          >
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 mt-1">User Details</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleStatusToggle}
            disabled={updatingStatus}
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              user.isActive
                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            } disabled:opacity-50`}
          >
            {updatingStatus ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : user.isActive ? (
              <UserX className="h-4 w-4 mr-2" />
            ) : (
              <UserCheck className="h-4 w-4 mr-2" />
            )}
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors duration-200">
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{user.fullName || `${user.firstName} ${user.lastName}`}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <button
                      onClick={() => copyToClipboard(user.email, 'Email')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copied === 'Email' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{user.phone}</p>
                    <button
                      onClick={() => copyToClipboard(user.phone, 'Phone')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copied === 'Phone' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium text-gray-900">{formatDateTime(user.joinDate || user.createdAt || '')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium text-gray-900">{formatDateTime(user.lastUpdated || user.updatedAt || '')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">#</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referral Code</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{user.referralCode}</p>
                    <button
                      onClick={() => copyToClipboard(user.referralCode, 'Referral Code')}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copied === 'Referral Code' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {user.originalPassword && (
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400">🔑</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Original Password</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-900">
                        {user.originalPassword}
                      </p>
                      <button
                        onClick={() => copyToClipboard(user.originalPassword || '', 'Password')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {copied === 'Password' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Referral Information */}
          {user.referredBy && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Referred By</h2>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.referredBy.firstName} {user.referredBy.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.referredBy.email}</p>
                  <p className="text-sm text-gray-500">Code: {user.referredBy.referralCode}</p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Information */}
          {user.adminId && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Admin</h2>
              <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.adminId.firstName} {user.adminId.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.adminId.email}</p>
                  <p className="text-sm text-gray-500">Admin ID: {user.adminId._id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Direct Referrals */}
          {user.directReferrals && user.directReferrals.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Direct Referrals ({user.directReferrals.length})
              </h2>
              <div className="space-y-3">
                {user.directReferrals.map((referral) => (
                  <div key={referral._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {referral.firstName} {referral.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{referral.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Code: {referral.referralCode}</p>
                      <p className="text-sm text-gray-500">{formatDate(referral.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Role */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status & Role</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  (user.status?.active ?? user.isActive) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status?.statusText || (user.isActive ? 'Active' : 'Inactive')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Verified</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  (user.status?.verified ?? user.isVerified) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status?.verificationText || (user.isVerified ? 'Verified' : 'Unverified')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Wallets */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Wallets</h2>
              <button
                onClick={() => setShowWalletModal(true)}
                className="text-sky-600 hover:text-sky-800 text-sm font-medium"
              >
                Update
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Main Wallet</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(user.wallets?.mainWallet?.amount || user.wallets?.mainWallet || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Benefit Wallet</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(user.wallets?.benefitWallet?.amount || user.wallets?.benefitWallet || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Withdrawal Wallet</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(user.wallets?.withdrawalWallet?.amount || user.wallets?.withdrawalWallet || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Total Earnings</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(user.totalEarnings || user.earnings?.total || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Total Withdrawals</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(user.totalWithdrawals || user.earnings?.withdrawn || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Total Referrals</span>
                </div>
                <span className="font-medium text-gray-900">
                  {user.totalReferrals || user.referrals?.total || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Total Commissions</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(user.totalCommissionsEarned || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm text-gray-600">Referral Level</span>
                </div>
                <span className="font-medium text-gray-900">
                  Level {(user.referralLevel || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Network Statistics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Network className="h-5 w-5 mr-2 text-blue-500" />
              Network Statistics
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Total Downline</span>
                </div>
                <span className="font-medium text-gray-900">
                  {user.networkStats?.totalDownline || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Active Downline</span>
                </div>
                <span className="font-medium text-gray-900">
                  {user.networkStats?.activeDownline || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-600">Total Deposits</span>
                </div>
                <span className="font-medium text-gray-900">
                  ${(user.networkStats?.totalDeposits || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Last Activity</span>
                </div>
                <span className="font-medium text-gray-900">
                  {user.networkStats?.lastActivity 
                    ? formatDateTime(user.networkStats.lastActivity)
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Commissions by Level */}
          {user.commissionsByLevel && user.commissionsByLevel.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-indigo-500" />
                Commissions by Level
              </h2>
              <div className="space-y-2">
                {user.commissionsByLevel.map((commission, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Level {commission.level || index + 1}</span>
                    <span className="font-medium text-gray-900">
                      ${(commission.amount || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Update Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Type
                </label>
                <select
                  value={walletData.walletType}
                  onChange={(e) => setWalletData({ ...walletData, walletType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="mainWallet">Main Wallet</option>
                  <option value="benefitWallet">Benefit Wallet</option>
                  <option value="withdrawalWallet">Withdrawal Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation
                </label>
                <select
                  value={walletData.operation}
                  onChange={(e) => setWalletData({ ...walletData, operation: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={walletData.amount}
                  onChange={(e) => setWalletData({ ...walletData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={walletData.description}
                  onChange={(e) => setWalletData({ ...walletData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={3}
                  placeholder="Reason for wallet update..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowWalletModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleWalletUpdate}
                disabled={updatingWallet}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {updatingWallet ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Wallet'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;

