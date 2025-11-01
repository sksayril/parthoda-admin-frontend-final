import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  RefreshCw,
  Network,
  ChevronLeft,
  ChevronRight,
  Wallet,
  User,
  Mail,
  Hash
} from 'lucide-react';
import { userService, UserFilters } from '../services/users';
import { User as UserType } from '../types';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency } from '../utils';
import MLMChainModal from './MLMChainModal';

const MLMNetwork: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showChainModal, setShowChainModal] = useState(false);

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: UserFilters = {
        page: currentPage,
        limit,
        search: searchTerm || undefined,
      };

      const response = await userService.getUsers(filters);
      
      // Ensure we have valid data
      const usersData = response.users || [];
      const paginationData = response.pagination || { pages: 1, total: 0, current: 1 };
      
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
  }, [currentPage]);

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

  const handleViewChain = (user: UserType) => {
    setSelectedUser(user);
    setShowChainModal(true);
  };

  const handleCloseChainModal = () => {
    setShowChainModal(false);
    setSelectedUser(null);
  };

  const getTotalWalletBalance = (user: UserType) => {
    const main = user.wallets?.mainWallet?.amount || 0;
    const benefit = user.wallets?.benefitWallet?.amount || 0;
    const withdrawal = user.wallets?.withdrawalWallet?.amount || 0;
    return main + benefit + withdrawal;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Network className="h-8 w-8 text-sky-500" />
            MLM Network
          </h1>
          <p className="text-gray-600 mt-1">View and manage user MLM chains</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or referral code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No users found</p>
            <p className="text-gray-500 text-sm mt-1">
              {searchTerm ? 'Try adjusting your search criteria' : 'No users available'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referral Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Wallet Balance
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-sky-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-sky-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.phone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <Hash className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="bg-gray-100 px-2 py-1 rounded font-mono">
                            {user.referralCode}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Wallet className="h-4 w-4 text-green-500 mr-2" />
                          <span className="font-semibold text-green-600">
                            {formatCurrency(getTotalWalletBalance(user))}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Main: {formatCurrency(user.wallets?.mainWallet?.amount || 0)} | 
                          Benefit: {formatCurrency(user.wallets?.benefitWallet?.amount || 0)} | 
                          Withdrawal: {formatCurrency(user.wallets?.withdrawalWallet?.amount || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewChain(user)}
                          className="inline-flex items-center px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Chain
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * limit, totalUsers)}
                  </span>{' '}
                  of <span className="font-medium">{totalUsers}</span> users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MLM Chain Modal */}
      {showChainModal && selectedUser && (
        <MLMChainModal
          user={selectedUser}
          isOpen={showChainModal}
          onClose={handleCloseChainModal}
        />
      )}
    </div>
  );
};

export default MLMNetwork;

