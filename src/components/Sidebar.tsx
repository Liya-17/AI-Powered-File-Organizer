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
    <>
      {/* Mobile Overlay */}
      {state.sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}
      
      {/* Sidebar */}
      <div className={`bg-white shadow-xl transition-all duration-500 ease-in-out relative z-30 ${
        state.sidebarOpen ? 'w-64' : 'w-16'
      } ${state.sidebarOpen ? 'lg:relative' : 'lg:relative'} ${
        state.sidebarOpen ? 'fixed lg:static' : 'fixed lg:static'
      } h-full`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Bot className="w-6 h-6 text-white" />
              </div>
              {state.sidebarOpen && (
                <h1 className="text-xl font-bold text-gray-900 animate-fadeIn">
                  File<span className="text-primary-600">Organizer</span>AI
                </h1>
              )}
            </div>
          </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-4 border-primary-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${state.sidebarOpen ? 'mr-3' : 'mx-auto'} ${isActive ? 'text-primary-600' : ''}`} />
                {state.sidebarOpen && (
                  <span className="animate-fadeIn">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

          {/* Storage Info */}
          {state.sidebarOpen && (
            <div className="p-4 border-t border-gray-200 animate-fadeIn">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Storage</h3>
                  <span className="text-sm font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                    {Math.round(storagePercentage)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 h-3 rounded-full transition-all duration-2000 ease-out shadow-sm"
                    style={{ width: `${storagePercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span className="bg-white px-2 py-1 rounded-md shadow-sm">{state.user.storageUsed} GB used</span>
                  <span className="bg-white px-2 py-1 rounded-md shadow-sm">{state.user.storageTotal} GB total</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
