import React, { useState, useEffect } from 'react';
import { X, Loader2, Network, TrendingUp, Users, DollarSign, ChevronRight, ChevronDown } from 'lucide-react';
import { userService } from '../services/users';
import { User, MLMChainResponse, MLMChainDownlineUser } from '../types';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency, formatDate } from '../utils';

interface MLMChainModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const MLMChainModal: React.FC<MLMChainModalProps> = ({ user, isOpen, onClose }) => {
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [chainData, setChainData] = useState<MLMChainResponse | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && user.referralCode) {
      loadChainData();
    }
  }, [isOpen, user.referralCode]);

  const loadChainData = async () => {
    setLoading(true);
    try {
      const data = await userService.getMLMChain(user.referralCode, 20);
      setChainData(data);
      // Expand first level by default
      if (data.downline.tree.length > 0) {
        setExpandedNodes(new Set([data.currentUser.id]));
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load MLM chain';
      showError('Error Loading Chain', errorMessage);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderDownlineTree = (nodes: MLMChainDownlineUser[], level: number = 0): React.ReactNode => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const indentLevel = level * 24;

      return (
        <div key={node.id} className="mb-2">
          <div
            className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200"
            style={{ marginLeft: `${indentLevel}px` }}
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            {hasChildren ? (
              <button className="mr-2 p-1 hover:bg-gray-200 rounded">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            ) : (
              <div className="w-6 mr-2" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{node.fullName}</span>
                    <span className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded">
                      Level {node.level}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                      {node.referralCode}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {node.email}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Referrals: {node.totalReferrals}</span>
                    <span>Direct: {node.directReferralsCount || 0}</span>
                    <span>Commissions: {formatCurrency(node.totalCommissionsEarned)}</span>
                  </div>
                </div>
                {node.wallets && (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(
                        (node.wallets.mainWallet || 0) +
                        (node.wallets.benefitWallet || 0) +
                        (node.wallets.withdrawalWallet || 0)
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Total Balance</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="mt-1">
              {renderDownlineTree(node.children || [], level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Network className="h-6 w-6 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">MLM Chain</h3>
                <p className="text-sm text-sky-100">
                  {user.fullName} - {user.referralCode}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 max-h-[80vh] overflow-y-auto">
            {loading ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading MLM chain data...</p>
              </div>
            ) : chainData ? (
              <div className="space-y-6">
                {/* Current User */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-4 border-2 border-sky-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">
                          {chainData.currentUser.fullName}
                        </h4>
                        <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded font-bold">
                          Current User
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <div className="text-gray-500">Email</div>
                          <div className="font-medium text-gray-900">{chainData.currentUser.email}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Referral Code</div>
                          <div className="font-medium text-gray-900 font-mono">{chainData.currentUser.referralCode}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Total Referrals</div>
                          <div className="font-medium text-gray-900">{chainData.currentUser.totalReferrals}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Total Commissions</div>
                          <div className="font-medium text-green-600">
                            {formatCurrency(chainData.currentUser.totalCommissionsEarned)}
                          </div>
                        </div>
                      </div>
                      {chainData.currentUser.wallets && (
                        <div className="mt-4 pt-4 border-t border-sky-200">
                          <div className="text-sm font-medium text-gray-700 mb-2">Wallet Balances:</div>
                          <div className="flex gap-4 text-sm">
                            <span>Main: {formatCurrency(chainData.currentUser.wallets.mainWallet || 0)}</span>
                            <span>Benefit: {formatCurrency(chainData.currentUser.wallets.benefitWallet || 0)}</span>
                            <span>Withdrawal: {formatCurrency(chainData.currentUser.wallets.withdrawalWallet || 0)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upline */}
                {chainData.upline.length > 0 && (
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      Upline ({chainData.upline.length})
                    </h5>
                    <div className="space-y-2">
                      {chainData.upline.map((uplineUser, index) => (
                        <div
                          key={uplineUser.id}
                          className="bg-purple-50 rounded-lg p-3 border border-purple-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{uplineUser.fullName}</span>
                                <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">
                                  Level {uplineUser.level}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                                  {uplineUser.referralCode}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">{uplineUser.email}</div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>Referrals: {uplineUser.totalReferrals}</span>
                                <span>Commissions: {formatCurrency(uplineUser.totalCommissionsEarned)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Downline */}
                {chainData.downline.tree.length > 0 && (
                  <div>
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Downline Tree
                    </h5>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {renderDownlineTree(chainData.downline.tree)}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Statistics
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-500">Total Downline Users</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {chainData.downline.statistics.totalDownlineUsers}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-500">Direct Referrals</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {chainData.downline.statistics.directReferrals}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-500">Total Commissions</div>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {formatCurrency(chainData.downline.statistics.totalDownlineCommissions)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="text-sm text-gray-500">Chain Levels</div>
                      <div className="text-2xl font-bold text-gray-900 mt-1">
                        {chainData.chainInfo.totalLevels}
                      </div>
                    </div>
                  </div>

                  {/* Users by Level */}
                  {Object.keys(chainData.downline.statistics.usersByLevel).length > 0 && (
                    <div className="mt-4">
                      <h6 className="text-sm font-semibold text-gray-700 mb-2">Users by Level:</h6>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {Object.entries(chainData.downline.statistics.usersByLevel).map(([level, data]) => (
                          <div key={level} className="bg-white rounded p-2 border border-gray-200 text-center">
                            <div className="text-xs text-gray-500">Level {level}</div>
                            <div className="text-lg font-bold text-gray-900">{data.count}</div>
                            <div className="text-xs text-green-600">
                              {formatCurrency(data.totalCommissions)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-600">No chain data available</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLMChainModal;

