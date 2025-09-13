import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Folder, 
  Clock, 
  Star, 
  Trash2, 
  Share2, 
  Settings,
  Bot
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Sidebar: React.FC = () => {
  const { state, dispatch } = useApp();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'My Files', href: '/files', icon: Folder },
    { name: 'Recent', href: '/recent', icon: Clock },
    { name: 'Starred', href: '/starred', icon: Star },
    { name: 'Trash', href: '/trash', icon: Trash2 },
    { name: 'Shared', href: '/shared', icon: Share2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const storagePercentage = (state.user.storageUsed / state.user.storageTotal) * 100;

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${
      state.sidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {state.sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900">
                File<span className="text-primary-600">Organizer</span>AI
              </h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${state.sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {state.sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Storage Info */}
        {state.sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Storage</h3>
                <span className="text-sm text-gray-500">
                  {Math.round(storagePercentage)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${storagePercentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{state.user.storageUsed} GB used</span>
                <span>{state.user.storageTotal} GB total</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
