import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  RefreshCw,
  Users as UsersIcon,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Shield,
  Calendar,
  BarChart3,
  Network,
  Layers,
  Wallet
} from 'lucide-react';
import { userService, UserFilters } from '../services/users';
import { User } from '../types';
import { useToast } from '../contexts/ToastContext';
import { formatDate } from '../utils';
import UserDetails from './UserDetails';
import MLMStatisticsModal from './MLMStatisticsModal';
import UsersByLevelModal from './UsersByLevelModal';
import RechargeWalletModal from './RechargeWalletModal';

const Users: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedItems, setCopiedItems] = useState<{[key: string]: string}>({});
  
  // MLM Modal States
  const [showMLMStatisticsModal, setShowMLMStatisticsModal] = useState(false);
  const [showUsersByLevelModal, setShowUsersByLevelModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  
  // Recharge Wallet Modal States
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedUserForRecharge, setSelectedUserForRecharge] = useState<User | null>(null);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: UserFilters = {
        page: currentPage,
        limit,
        role: selectedRole === 'all' ? undefined : selectedRole,
        search: searchTerm || undefined,
      };

      const response = await userService.getUsers(filters);
      
      // Ensure we have valid data
      const usersData = response.users || [];
      const paginationData = response.pagination || { pages: 1, total: 0 };
      
      setUsers(usersData);
      setTotalPages(paginationData.pages);
      setTotalUsers(paginationData.total);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load users';
      setError(errorMessage);
      showError('Error Loading Users', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, selectedRole]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await userService.updateUserStatus(userId, { isActive: !currentStatus });
      showSuccess('Status Updated', `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (error: any) {
      showError('Update Failed', error.message || 'Failed to update user status');
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const copyToClipboard = async (text: string, type: string, userId: string) => {
    if (!text || text.trim() === '') {
      showError('Copy Failed', 'No data to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => ({ ...prev, [`${userId}-${type}`]: type }));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newItems = { ...prev };
          delete newItems[`${userId}-${type}`];
          return newItems;
        });
      }, 2000);
      showSuccess('Copied', `${type} copied to clipboard`);
    } catch (error) {
      showError('Copy Failed', 'Failed to copy to clipboard');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      showError('No Selection', 'Please select users first');
      return;
    }

    try {
      switch (action) {
        case 'activate':
          for (const userId of selectedUsers) {
            await userService.updateUserStatus(userId, { isActive: true });
          }
          showSuccess('Bulk Action', `${selectedUsers.length} users activated successfully`);
          break;
        case 'deactivate':
          for (const userId of selectedUsers) {
            await userService.updateUserStatus(userId, { isActive: false });
          }
          showSuccess('Bulk Action', `${selectedUsers.length} users deactivated successfully`);
          break;
        case 'export':
          exportUsersData();
          break;
      }
      setSelectedUsers([]);
      loadUsers();
    } catch (error: any) {
      showError('Bulk Action Failed', error.message || 'Failed to perform bulk action');
    }
  };

  const handleRechargeSuccess = () => {
    loadUsers(); // Refresh the users list to show updated wallet balances
  };

  const exportUsersData = () => {
    if (users.length === 0) {
      showError('Export Failed', 'No users to export');
      return;
    }
    
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Status', 'Referral Code', 'Main Wallet', 'Benefit Wallet', 'Withdrawal Wallet', 'Total Earnings', 'Total Referrals', 'Join Date'],
      ...users.map(user => [
        `${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`,
        user.email || 'N/A',
        user.phone || 'N/A',
        user.role || 'user',
        user.isActive ? 'Active' : 'Inactive',
        user.referralCode || 'N/A',
        user.wallets?.mainWallet?.amount?.toString() || '0',
        user.wallets?.benefitWallet?.amount?.toString() || '0',
        user.wallets?.withdrawalWallet?.amount?.toString() || '0',
        user.earnings?.total?.toString() || '0',
        user.referrals?.total?.toString() || '0',
        user.formattedJoinDate || formatDate(user.joinDate || user.createdAt || '')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showSuccess('Export Complete', 'Users data exported successfully');
  };

  const getStatusBadge = (isActive: boolean) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    return isActive 
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-red-100 text-red-800`;
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'user':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'super_admin':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
            i === currentPage
              ? 'bg-sky-500 text-white'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (selectedUserId) {
    return (
      <UserDetails 
        userId={selectedUserId} 
        onBack={() => setSelectedUserId(null)} 
      />
    );
  }

  if (loading && users.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage your platform users ({totalUsers} total)</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {/* MLM Buttons */}
          <div className="flex flex-wrap items-center gap-2 border-r border-gray-300 pr-3">
            <button
              onClick={() => setShowMLMStatisticsModal(true)}
              className="inline-flex items-center px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">MLM Stats</span>
              <span className="sm:hidden">Stats</span>
            </button>
            <button
              onClick={() => {
                setSelectedLevel(1);
                setShowUsersByLevelModal(true);
              }}
              className="inline-flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Layers className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Users by Level</span>
              <span className="sm:hidden">By Level</span>
            </button>
            <button
              onClick={() => {
                // TODO: Implement network view
                showSuccess('Coming Soon', 'Network view feature will be available soon');
              }}
              className="inline-flex items-center px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Network className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Network View</span>
              <span className="sm:hidden">Network</span>
            </button>
          </div>
          
          <button
            onClick={exportUsersData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              More Filters
            </button>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-sky-800 font-medium">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="text-xs text-sky-600 hover:text-sky-800 underline"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="inline-flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-800 font-medium bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(user => user._id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="h-3 w-3 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Earnings
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrals
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
                      <p className="text-gray-600">Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <AlertTriangle className="h-12 w-12 text-red-400" />
                      <div className="text-red-600">
                        <p className="text-lg font-medium">Error loading users</p>
                        <p className="text-sm">{error}</p>
                      </div>
                      <button
                        onClick={loadUsers}
                        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                        className="h-3 w-3 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 bg-sky-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="h-4 w-4 text-sky-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-xs font-medium text-gray-900">
                            {user.firstName || 'N/A'} {user.lastName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.referralCode || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="truncate max-w-[150px] text-xs">{user.email || 'N/A'}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(user.email || '', 'Email', user._id)}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors duration-200"
                            disabled={!user.email}
                          >
                            {copiedItems[`${user._id}-Email`] ? (
                              <Check className="h-2.5 w-2.5 text-green-600" />
                            ) : (
                              <Copy className="h-2.5 w-2.5 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-xs">{user.phone || 'N/A'}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(user.phone || '', 'Phone', user._id)}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors duration-200"
                            disabled={!user.phone}
                          >
                            {copiedItems[`${user._id}-Phone`] ? (
                              <Check className="h-2.5 w-2.5 text-green-600" />
                            ) : (
                              <Copy className="h-2.5 w-2.5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-600">
                          {user.originalPassword ? (
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                              {user.originalPassword}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                          )}
                        </div>
                        {user.originalPassword && (
                          <button
                            onClick={() => copyToClipboard(user.originalPassword || '', 'Password', user._id)}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors duration-200"
                            disabled={!user.originalPassword}
                          >
                            {copiedItems[`${user._id}-Password`] ? (
                              <Check className="h-2.5 w-2.5 text-green-600" />
                            ) : (
                              <Copy className="h-2.5 w-2.5 text-gray-400" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3 text-gray-400" />
                          <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${getRoleBadge(user.role || 'user')}`}>
                            {user.role || 'user'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(user.status?.active ?? user.isActive)}`}>
                            {user.status?.active ?? user.isActive ? (
                              <>
                                <UserCheck className="h-2.5 w-2.5 mr-1" />
                                {user.status?.statusText || 'Active'}
                              </>
                            ) : (
                              <>
                                <UserX className="h-2.5 w-2.5 mr-1" />
                                {user.status?.statusText || 'Inactive'}
                              </>
                            )}
                          </span>
                          {user.status?.verified ?? user.isVerified ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              <Check className="h-2.5 w-2.5 mr-1" />
                              {user.status?.verificationText || 'Verified'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                              {user.status?.verificationText || 'Unverified'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                            <span>Total</span>
                          </div>
                          <span className="font-medium text-gray-900 text-xs">{user.earnings?.formatted?.total || '$0.00'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-600">
                            <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                            <span>Withdrawn</span>
                          </div>
                          <span className="font-medium text-gray-900 text-xs">{user.earnings?.formatted?.withdrawn || '$0.00'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-600">
                            <UsersIcon className="h-3 w-3 mr-1 text-purple-500" />
                            <span>Referrals</span>
                          </div>
                          <span className="font-medium text-gray-900 text-xs">{user.referrals?.total || 0}</span>
                        </div>
                        {user.referredBy && (
                          <div className="text-xs text-gray-500 truncate max-w-[120px]">
                            By: {user.referredBy.firstName} {user.referredBy.lastName}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="text-xs">{user.formattedJoinDate || formatDate(user.joinDate || user.createdAt || '')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                      <div className="flex items-center justify-end space-x-0.5">
                        <button 
                          onClick={() => {
                            setSelectedUserForRecharge(user);
                            setShowRechargeModal(true);
                          }}
                          className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-all duration-200"
                          title="Recharge Wallet"
                        >
                          <Wallet className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => handleStatusToggle(user._id, user.isActive)}
                          className={`p-1 rounded transition-all duration-200 ${
                            user.isActive 
                              ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.isActive ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        </button>
                        <button 
                          onClick={() => setSelectedUserId(user._id)}
                          className="text-sky-600 hover:text-sky-800 p-1 hover:bg-sky-50 rounded transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-50 rounded transition-all duration-200"
                          title="Edit User"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-all duration-200"
                          title="Delete User"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <UsersIcon className="h-12 w-12 text-gray-400" />
                      <div className="text-gray-500">
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">
                          {searchTerm || selectedRole !== 'all' 
                            ? 'Try adjusting your search or filter criteria' 
                            : 'No users have been created yet'
                          }
                        </p>
                      </div>
                      {!searchTerm && selectedRole === 'all' && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
                        >
                          Create First User
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * limit, totalUsers)}</span> of{' '}
            <span className="font-medium">{totalUsers}</span> results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {renderPagination()}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MLM Modals */}
      <MLMStatisticsModal 
        isOpen={showMLMStatisticsModal}
        onClose={() => setShowMLMStatisticsModal(false)}
      />
      
      <UsersByLevelModal 
        isOpen={showUsersByLevelModal}
        onClose={() => setShowUsersByLevelModal(false)}
        selectedLevel={selectedLevel}
        onLevelChange={setSelectedLevel}
      />
      
      <RechargeWalletModal 
        isOpen={showRechargeModal}
        onClose={() => {
          setShowRechargeModal(false);
          setSelectedUserForRecharge(null);
        }}
        user={selectedUserForRecharge}
        onRechargeSuccess={handleRechargeSuccess}
      />
    </div>
  );
};

export default Users;