import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  LogOut, 
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Network
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen, 
  onLogout 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'mlm-network', label: 'MLM Network', icon: Network },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-30 h-full bg-white shadow-xl transition-all duration-300
        ${sidebarOpen ? 'w-64' : 'w-16'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900">Admin</span>
              </div>
            )}
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-sky-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600 hover:scale-105'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${!sidebarOpen ? 'mx-auto' : ''}`} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200
                text-red-600 hover:bg-red-50 hover:scale-105
              `}
            >
              <LogOut className={`h-5 w-5 ${!sidebarOpen ? 'mx-auto' : ''}`} />
              {sidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;