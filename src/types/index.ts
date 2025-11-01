// Global Type Definitions

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface WalletInfo {
  amount: number;
  formatted: string;
}

export interface UserWallets {
  mainWallet: WalletInfo;
  benefitWallet: WalletInfo;
  withdrawalWallet: WalletInfo;
}

export interface UserEarnings {
  total: number;
  withdrawn: number;
  formatted: {
    total: string;
    withdrawn: string;
  };
}

export interface UserReferrals {
  total: number;
  directReferrals: number;
}

export interface UserStatus {
  active: boolean;
  verified: boolean;
  statusText: string;
  verificationText: string;
}

export interface ReferredBy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
}

export interface DirectReferral {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  referralCode: string;
  createdAt: string;
}

export interface AdminInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface User {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  referralCode: string;
  originalPassword?: string; // Only available in admin context
  isActive: boolean;
  isVerified: boolean;
  status: UserStatus;
  wallets: UserWallets;
  earnings: UserEarnings;
  referrals: UserReferrals;
  referredBy?: ReferredBy | null;
  directReferrals?: DirectReferral[];
  adminId?: AdminInfo | null;
  joinDate: string;
  formattedJoinDate: string;
  lastUpdated: string;
  createdAt?: string; // Keep for backward compatibility
  updatedAt?: string; // Keep for backward compatibility
  
  // Additional fields from API response
  totalEarnings?: number;
  totalWithdrawals?: number;
  totalReferrals?: number;
  totalCommissionsEarned?: number;
  referralLevel?: number;
  networkStats?: {
    totalDownline: number;
    activeDownline: number;
    totalDeposits: number;
    lastActivity: string | null;
  };
  commissionsByLevel?: Array<{
    level: number;
    amount: number;
  }>;
}

export interface UserListResponse {
  users: User[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
  summary: {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    totalEarnings: number;
    totalWithdrawals: number;
  };
}

export interface UserDetailResponse {
  user: User;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export interface UpdateUserStatusData {
  isActive: boolean;
}

export interface UpdateWalletData {
  walletType: 'mainWallet' | 'benefitWallet' | 'withdrawalWallet';
  amount: number;
  operation: 'add' | 'subtract';
  description: string;
}

export interface WalletUpdateResponse {
  wallets: UserWallets;
}

export interface RechargeWalletData {
  userId: string;
  amount: number;
  walletType: 'mainWallet' | 'benefitWallet' | 'withdrawalWallet';
  description?: string;
}

export interface RechargeWalletResponse {
  user: {
    id: string;
    name: string;
    email: string;
    walletType: string;
    amountRecharged: number;
    balanceBefore: number;
    balanceAfter: number;
  };
  admin: {
    id: string;
    name: string;
    mainWalletBalance: number;
  };
}

export interface UserStatusUpdateResponse {
  user: User;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  growthRate: number;
}

export interface RevenueData {
  period: string;
  revenue: number;
  orders: number;
  users: number;
}

// Comprehensive Dashboard Types
export interface AdminWalletBalance {
  mainWallet: WalletInfo;
  benefitWallet: WalletInfo;
  withdrawalWallet: WalletInfo;
  total: WalletInfo;
}

export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  walletBalance: AdminWalletBalance;
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  growthRate: number;
}

export interface FinancialStatistics {
  totalEarnings: number;
  totalWithdrawals: number;
  netEarnings: number;
}

export interface WalletDistribution {
  totalMainWallet: number;
  totalBenefitWallet: number;
  totalWithdrawalWallet: number;
  averageMainWallet: number;
  averageBenefitWallet: number;
  averageWithdrawalWallet: number;
}

export interface DashboardStatistics {
  users: UserStatistics;
  financial: FinancialStatistics;
  walletDistribution: WalletDistribution;
}

export interface ChartDataPoint {
  month: string;
  count: number;
}

export interface WalletChartData {
  name: string;
  value: number;
  color: string;
}

export interface DashboardCharts {
  monthlyUserRegistrations: ChartDataPoint[];
  walletDistribution: WalletChartData[];
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  status: string;
  verified: string;
  joinDate: string;
  wallets: {
    mainWallet: number;
    benefitWallet: number;
    withdrawalWallet: number;
  };
}

export interface TopEarner {
  id: string;
  name: string;
  email: string;
  totalEarnings: number;
  formattedEarnings: string;
  wallets: {
    mainWallet: number;
    benefitWallet: number;
    withdrawalWallet: number;
  };
}

export interface RecentTransaction {
  id: string;
  user: {
    name: string;
    email: string;
  };
  type: 'credit' | 'debit';
  walletType: string;
  amount: number;
  formattedAmount: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface RecentActivity {
  users: RecentUser[];
  topEarners: TopEarner[];
  recentTransactions: RecentTransaction[];
}

export interface ComprehensiveDashboardData {
  admin: AdminInfo;
  statistics: DashboardStatistics;
  charts: DashboardCharts;
  recentActivity: RecentActivity;
}

export interface ComprehensiveDashboardResponse {
  success: boolean;
  message: string;
  data: ComprehensiveDashboardData;
}

// Toast Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: T) => void;
}

// Filter Types
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text';
  options?: FilterOption[];
  placeholder?: string;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

// Navigation Types
export interface NavItem {
  key: string;
  label: string;
  icon?: React.ComponentType<any>;
  path?: string;
  children?: NavItem[];
  permission?: string;
}

// Theme Types
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
}

// Language Types
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// MLM Types
export interface MLMUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  totalReferrals: number;
  totalCommissionsEarned: number;
  createdAt: string;
}

export interface UsersByLevelResponse {
  users: MLMUser[];
  level: number;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface MLMStatistics {
  period: string;
  usersByLevel: Array<{
    _id: number;
    count: number;
  }>;
  totalCommissions: {
    total: number;
    count: number;
  };
  commissionsByLevel: Array<{
    _id: number;
    total: number;
    count: number;
  }>;
  totalDeposits: {
    total: number;
    count: number;
  };
  commissionStructure: Array<{
    level: number;
    percentage: number;
    formattedPercentage: string;
  }>;
}

export interface MLMStatisticsResponse {
  data: MLMStatistics;
}

// MLM Chain Types
export interface MLMChainUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  referralCode: string;
  referralLevel?: number;
  level?: number;
  position?: string;
  totalReferrals: number;
  directReferralsCount?: number;
  totalCommissionsEarned: number;
  wallets?: {
    mainWallet: number;
    benefitWallet: number;
    withdrawalWallet: number;
  };
  joinedAt?: string;
  referredBy?: string;
  children?: MLMChainUser[];
  childrenCount?: number;
}

export interface MLMChainUpline {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  referralCode: string;
  level: number;
  position: string;
  totalReferrals: number;
  totalCommissionsEarned: number;
}

export interface MLMChainDownlineUser {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  referralCode: string;
  referralLevel?: number;
  level: number;
  totalReferrals: number;
  totalCommissionsEarned: number;
  joinedAt?: string;
  children?: MLMChainDownlineUser[];
  childrenCount?: number;
  directReferralsCount?: number;
  wallets?: {
    mainWallet: number;
    benefitWallet: number;
    withdrawalWallet: number;
  };
}

export interface MLMChainFlatUser {
  level: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  totalReferrals: number;
  totalCommissionsEarned: number;
  joinedAt: string;
}

export interface MLMChainUsersByLevel {
  [key: string]: {
    level: number;
    count: number;
    totalCommissions: number;
    totalReferrals: number;
  };
}

export interface MLMChainDownline {
  tree: MLMChainDownlineUser[];
  flatList: MLMChainFlatUser[];
  statistics: {
    totalDownlineUsers: number;
    directReferrals: number;
    totalDownlineCommissions: number;
    totalDownlineReferrals: number;
    usersByLevel: MLMChainUsersByLevel;
  };
}

export interface MLMChainInfo {
  maxLevel: number;
  totalLevels: number;
  hasUpline: boolean;
  hasDownline: boolean;
}

export interface MLMChainResponse {
  currentUser: MLMChainUser;
  upline: MLMChainUpline[];
  downline: MLMChainDownline;
  chainInfo: MLMChainInfo;
}

// Settings Types
export interface AppSettings {
  theme: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
  };
}
