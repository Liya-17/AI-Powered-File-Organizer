import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useApp();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="relative z-30">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
        state.sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
        {/* Header */}
        <div className="relative z-20">
          <Header />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          {/* Content Container */}
          <div className="relative z-10 p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="max-w-7xl mx-auto">
              <div className="animate-fadeIn">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Chatbot */}
      <div className="relative z-40">
        <Chatbot />
      </div>
    </div>
  );
};

export default Layout;
