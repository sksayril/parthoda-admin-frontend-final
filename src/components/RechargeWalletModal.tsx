import React, { useState } from 'react';
import { X, Wallet, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { userService } from '../services/users';
import { useToast } from '../contexts/ToastContext';
import { User, RechargeWalletData } from '../types';

interface RechargeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onRechargeSuccess: () => void;
}

const RechargeWalletModal: React.FC<RechargeWalletModalProps> = ({
  isOpen,
  onClose,
  user,
  onRechargeSuccess
}) => {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    walletType: 'mainWallet' as 'mainWallet' | 'benefitWallet' | 'withdrawalWallet',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showError('Invalid Amount', 'Please enter a valid positive amount');
      return;
    }

    setLoading(true);
    try {
      const rechargeData: RechargeWalletData = {
        userId: user._id,
        amount,
        walletType: formData.walletType,
        description: formData.description || undefined
      };

      await userService.rechargeUserWallet(rechargeData);
      
      showSuccess(
        'Wallet Recharged Successfully', 
        `${user.firstName} ${user.lastName}'s ${formData.walletType} has been recharged with $${amount.toFixed(2)}`
      );
      
      // Reset form
      setFormData({
        amount: '',
        walletType: 'mainWallet',
        description: ''
      });
      
      onRechargeSuccess();
      onClose();
    } catch (error: any) {
      showError('Recharge Failed', error.message || 'Failed to recharge user wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        amount: '',
        walletType: 'mainWallet',
        description: ''
      });
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  const getWalletBalance = (walletType: string) => {
    switch (walletType) {
      case 'mainWallet':
        return user.wallets?.mainWallet?.formatted || '$0.00';
      case 'benefitWallet':
        return user.wallets?.benefitWallet?.formatted || '$0.00';
      case 'withdrawalWallet':
        return user.wallets?.withdrawalWallet?.formatted || '$0.00';
      default:
        return '$0.00';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recharge Wallet</h3>
              <p className="text-sm text-gray-500">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Current Balance Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Current Balances</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-500">Main</div>
              <div className="font-medium">{user.wallets?.mainWallet?.formatted || '$0.00'}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Benefit</div>
              <div className="font-medium">{user.wallets?.benefitWallet?.formatted || '$0.00'}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Withdrawal</div>
              <div className="font-medium">{user.wallets?.withdrawalWallet?.formatted || '$0.00'}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Wallet Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Type
            </label>
            <select
              name="walletType"
              value={formData.walletType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="mainWallet">Main Wallet</option>
              <option value="benefitWallet">Benefit Wallet</option>
              <option value="withdrawalWallet">Withdrawal Wallet</option>
            </select>
            <div className="mt-1 text-xs text-gray-500">
              Current balance: {getWalletBalance(formData.walletType)}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Recharge
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description for this recharge..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Important:</p>
              <p>The recharge amount will be deducted from your admin main wallet balance.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.amount}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Recharging...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Recharge Wallet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RechargeWalletModal;
