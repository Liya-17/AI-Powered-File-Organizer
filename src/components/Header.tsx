import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Header: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 px-4 sm:px-6 py-4 animate-slideInDown">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 hover:scale-110 transition-all duration-200 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search files..."
              value={state.searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 sm:py-3 w-48 sm:w-64 lg:w-80 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm focus:shadow-md text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 hover:scale-110 transition-all duration-200 group">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer hover:bg-gray-50 rounded-xl p-1 sm:p-2 transition-all duration-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{state.user.name}</p>
              <p className="text-xs text-gray-500">{state.user.email}</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
